import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const addToWishlistSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
  }),
});

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', validate(addToWishlistSchema), wishlistController.addToWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);

export default router;
