import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import redis from '../config/redis';
import { AuthRequest } from '../middleware/auth';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../utils/errors';

const CART_CACHE_PREFIX = 'cart:';
const CART_CACHE_TTL = 3600;

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const cacheKey = `${CART_CACHE_PREFIX}${req.user.userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: { cart: JSON.parse(cached) },
      });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const cart = {
      items: cartItems,
      total: cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };

    await redis.setex(cacheKey, CART_CACHE_TTL, JSON.stringify(cart));

    res.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { productId, quantity = 1 } = req.body;

    if (quantity < 1) {
      throw new BadRequestError('Quantity must be at least 1');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestError('Insufficient stock');
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestError('Insufficient stock');
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.userId,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }

    await redis.del(`${CART_CACHE_PREFIX}${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: { cartItem },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      throw new BadRequestError('Quantity must be at least 1');
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestError('Insufficient stock');
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    await redis.del(`${CART_CACHE_PREFIX}${req.user.userId}`);

    res.json({
      success: true,
      message: 'Cart item updated',
      data: { cartItem: updatedItem },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    await redis.del(`${CART_CACHE_PREFIX}${req.user.userId}`);

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    await prisma.cartItem.deleteMany({
      where: { userId: req.user.userId },
    });

    await redis.del(`${CART_CACHE_PREFIX}${req.user.userId}`);

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
};
