import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, requireRole } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const checkoutSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().uuid().optional(),
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    trackingNumber: z.string().optional(),
  }),
});

router.use(authenticate);

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/checkout', validate(checkoutSchema), orderController.createCheckoutSession);
router.post('/webhook', orderController.handleWebhook);

router.put(
  '/:id/status',
  requireRole('ADMIN'),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;
