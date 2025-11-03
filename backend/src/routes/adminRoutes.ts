import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

const updateUserSchema = z.object({
  body: z.object({
    role: z.enum(['USER', 'ADMIN']).optional(),
    emailVerified: z.boolean().optional(),
  }),
});

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', validate(updateUserSchema), adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/orders', adminController.getAllOrders);
router.get('/inventory', adminController.getInventory);

export default router;
