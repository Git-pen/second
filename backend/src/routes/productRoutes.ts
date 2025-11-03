import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    price: z.number().positive(),
    comparePrice: z.number().positive().optional(),
    stock: z.number().int().min(0),
    category: z.string().min(1),
    images: z.array(z.string().url()).optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    comparePrice: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    category: z.string().min(1).optional(),
    images: z.array(z.string().url()).optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

router.get('/', optionalAuth, productController.getProducts);
router.get('/search', optionalAuth, productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', optionalAuth, productController.getProduct);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete('/:id', authenticate, requireRole('ADMIN'), productController.deleteProduct);

export default router;
