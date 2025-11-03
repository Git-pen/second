import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { UnauthorizedError, NotFoundError, ConflictError } from '../utils/errors';

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { wishlist },
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { productId } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new ConflictError('Product already in wishlist');
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: req.user.userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlistItem },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundError('Wishlist item not found');
    }

    await prisma.wishlist.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    next(error);
  }
};
