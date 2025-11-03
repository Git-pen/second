import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive().optional(),
  }),
});

const updateCartSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive(),
  }),
});

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.put('/:id', validate(updateCartSchema), cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
