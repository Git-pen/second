import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { UnauthorizedError, NotFoundError, BadRequestError, ConflictError } from '../utils/errors';

export const getProductReviews = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
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

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { productId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictError('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.userId,
        productId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const reviews = await prisma.review.findMany({
      where: { productId },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingReview) {
      throw new NotFoundError('Review not found');
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const reviews = await prisma.review.findMany({
      where: { productId: review.productId },
    });

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: averageRating,
      },
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = req.params;

    const review = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    await prisma.review.delete({
      where: { id },
    });

    const reviews = await prisma.review.findMany({
      where: { productId: review.productId },
    });

    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
