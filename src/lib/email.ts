import { Resend } from "resend";

// Lazy initialization to avoid build-time errors when RESEND_API_KEY is not set
function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_placeholder");
}

const FROM = process.env.FROM_EMAIL || "noreply@navkalacrochet.com";
const APP_NAME = "NavkalaCrochet 🧶";

export async function sendWelcomeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to ${APP_NAME}! 🎉`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#fff9f6;padding:40px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:28px;color:#8B4B5A;letter-spacing:2px;">NavkalaCrochet</h1>
          <p style="color:#c4a882;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Handmade with Love</p>
        </div>
        <h2 style="color:#5c3a2e;font-size:22px;">Welcome, ${name}! 🧶</h2>
        <p style="color:#7a6355;line-height:1.7;">
          Thank you for joining the NavkalaCrochet family. We're thrilled to have you here!
          Explore our collection of handmade crochet treasures.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop"
             style="background:#8B4B5A;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;">
            Start Shopping
          </a>
        </div>
        <p style="color:#c4a882;font-size:12px;text-align:center;">With love, the NavkalaCrochet team 🌸</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(
  email: string, name: string, orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f0e6df;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #f0e6df;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0e6df;text-align:right;">₹${item.price * item.quantity}</td>
    </tr>`).join("");

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Order Confirmed! #${orderNumber} - ${APP_NAME}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#fff9f6;padding:40px;border-radius:12px;">
        <h1 style="font-size:26px;color:#8B4B5A;text-align:center;">NavkalaCrochet 🧶</h1>
        <h2 style="color:#5c3a2e;">Order Confirmed! 🎉</h2>
        <p style="color:#7a6355;">Hi ${name}, your order <strong>#${orderNumber}</strong> has been confirmed.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          <thead>
            <tr style="background:#f5e6e0;">
              <th style="padding:10px;text-align:left;color:#8B4B5A;">Product</th>
              <th style="padding:10px;text-align:center;color:#8B4B5A;">Qty</th>
              <th style="padding:10px;text-align:right;color:#8B4B5A;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:bold;color:#5c3a2e;">Total</td>
              <td style="padding:12px;font-weight:bold;color:#8B4B5A;text-align:right;">₹${total}</td>
            </tr>
          </tfoot>
        </table>
        <div style="text-align:center;margin:24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background:#8B4B5A;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;">
            Track Order
          </a>
        </div>
        <p style="color:#c4a882;font-size:12px;text-align:center;">Thank you for shopping with us! 🌸</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Reset Your Password - ${APP_NAME}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#fff9f6;padding:40px;border-radius:12px;">
        <h1 style="font-size:26px;color:#8B4B5A;text-align:center;">NavkalaCrochet 🧶</h1>
        <h2 style="color:#5c3a2e;">Reset Your Password</h2>
        <p style="color:#7a6355;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}"
             style="background:#8B4B5A;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;">
            Reset Password
          </a>
        </div>
        <p style="color:#7a6355;font-size:13px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendShippingUpdateEmail(
  email: string, name: string, orderNumber: string, trackingId: string, status: string
) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Order Update: ${status} - #${orderNumber}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#fff9f6;padding:40px;border-radius:12px;">
        <h1 style="font-size:26px;color:#8B4B5A;text-align:center;">NavkalaCrochet 🧶</h1>
        <h2 style="color:#5c3a2e;">Your order is ${status}!</h2>
        <p style="color:#7a6355;">Hi ${name}, order <strong>#${orderNumber}</strong> is now <strong>${status}</strong>.</p>
        ${trackingId ? `<p style="color:#7a6355;">Tracking ID: <strong>${trackingId}</strong></p>` : ""}
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background:#8B4B5A;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;">
            View Order
          </a>
        </div>
      </div>
    `,
  });
}
