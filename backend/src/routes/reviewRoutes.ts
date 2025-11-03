import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(1000).optional(),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).max(1000).optional(),
  }),
});

router.get('/product/:productId', reviewController.getProductReviews);

router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);

router.put('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview);

router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;
