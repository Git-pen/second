import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import meiliClient from '../config/meilisearch';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '12',
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      featured,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy as string]: order },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
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

export const getProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
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
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
      },
      take: 4,
    });

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      price,
      comparePrice,
      stock,
      category,
      images,
      featured,
      tags,
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        comparePrice,
        stock,
        category,
        images: images || [],
        featured: featured || false,
        tags: tags || [],
      },
    });

    try {
      const index = meiliClient.index('products');
      await index.addDocuments([product]);
    } catch (searchError) {
      console.error('Failed to index product:', searchError);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    try {
      const index = meiliClient.index('products');
      await index.updateDocuments([product]);
    } catch (searchError) {
      console.error('Failed to update product in search:', searchError);
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    try {
      const index = meiliClient.index('products');
      await index.deleteDocument(id);
    } catch (searchError) {
      console.error('Failed to delete product from search:', searchError);
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { q, limit = '20' } = req.query;

    if (!q) {
      throw new BadRequestError('Search query is required');
    }

    const index = meiliClient.index('products');
    const searchResults = await index.search(q as string, {
      limit: parseInt(limit as string),
    });

    res.json({
      success: true,
      data: {
        results: searchResults.hits,
        total: searchResults.estimatedTotalHits,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    const categoryCounts = await Promise.all(
      categories.map(async ({ category }) => {
        const count = await prisma.product.count({
          where: { category },
        });
        return { category, count };
      })
    );

    res.json({
      success: true,
      data: { categories: categoryCounts },
    });
  } catch (error) {
    next(error);
  }
};
