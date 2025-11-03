import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import stripe from '../config/stripe';
import { AuthRequest } from '../middleware/auth';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../utils/errors';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../utils/email';

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { page = '1', limit = '10', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { shippingAddressId } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${item.product.title}`);
      }
    }

    const shippingAddress = shippingAddressId
      ? await prisma.address.findFirst({
          where: {
            id: shippingAddressId,
            userId: req.user.userId,
          },
        })
      : null;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          images: item.product.images.slice(0, 1),
        },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.userId,
        shippingAddressId: shippingAddressId || '',
      },
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      throw new BadRequestError(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      const userId = session.metadata.userId;
      const shippingAddressId = session.metadata.shippingAddressId || null;

      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );

      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PROCESSING',
          paymentStatus: 'COMPLETED',
          paymentId: session.payment_intent,
          shippingAddressId,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        try {
          await sendOrderConfirmationEmail(user.email, {
            orderId: order.id,
            totalAmount: Number(totalAmount),
            items: order.items.map((item) => ({
              title: item.product.title,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          });
        } catch (emailError) {
          console.error('Failed to send order confirmation email:', emailError);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
      },
      include: {
        user: true,
      },
    });

    try {
      await sendOrderStatusEmail(order.user.email, order.id, status);
    } catch (emailError) {
      console.error('Failed to send order status email:', emailError);
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};
