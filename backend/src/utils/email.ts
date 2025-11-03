import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@novacart.com';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Welcome to NovaCart! 🎉</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining NovaCart. We're excited to have you as part of our community!</p>
      <p>Start exploring our amazing products and enjoy exclusive deals.</p>
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
        Start Shopping
      </a>
      <p style="margin-top: 24px; color: #666;">Best regards,<br>The NovaCart Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject: 'Welcome to NovaCart!', html });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderDetails: {
    orderId: string;
    totalAmount: number;
    items: Array<{ title: string; quantity: number; price: number }>;
  }
) => {
  const itemsHtml = orderDetails.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Order Confirmation 📦</h1>
      <p>Your order has been successfully placed!</p>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      
      <h2 style="margin-top: 24px;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: left;">Quantity</th>
            <th style="padding: 8px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <p style="margin-top: 24px; font-size: 18px;"><strong>Total: $${orderDetails.totalAmount.toFixed(2)}</strong></p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard/orders" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
        View Order
      </a>
      
      <p style="margin-top: 24px; color: #666;">Thank you for shopping with NovaCart!</p>
    </div>
  `;

  return sendEmail({ to: email, subject: `Order Confirmation - ${orderDetails.orderId}`, html });
};

export const sendOrderStatusEmail = async (
  email: string,
  orderId: string,
  status: string
) => {
  const statusMessages: Record<string, string> = {
    PROCESSING: 'is being processed',
    SHIPPED: 'has been shipped',
    DELIVERED: 'has been delivered',
    CANCELLED: 'has been cancelled',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">Order Update</h1>
      <p>Your order <strong>#${orderId}</strong> ${statusMessages[status] || 'has been updated'}.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard/orders/${orderId}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
        Track Order
      </a>
      <p style="margin-top: 24px; color: #666;">Best regards,<br>The NovaCart Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject: `Order Update - ${orderId}`, html });
};
