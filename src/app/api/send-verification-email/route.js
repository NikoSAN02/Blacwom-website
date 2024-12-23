import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { to, userType, salonName, phoneNumber, orderNumber, isDeliveryNotification } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Handle delivery notification
    if (isDeliveryNotification) {
      const deliveryEmailContent = `
        Dear Customer,

        Great news! Your order #${orderNumber} has been delivered.

        If you haven't received your order or have any questions, please don't hesitate to contact us.

        Thank you for shopping with Glam Glide!

        Best regards,
        The Glam Glide Team
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: `Your Glam Glide Order #${orderNumber} has been Delivered!`,
        text: deliveryEmailContent
      });

      return NextResponse.json({ success: true });
    }

    // Original registration email logic
    const userEmailContent = userType === 'salon'
      ? `
        Thank you for registering your salon "${salonName}" with Glam Glide!
        
        To complete your registration, please:
        1. Reply to this email with your GST number (optional)
        2. Attach at least 2 clear images of your salon
        
        Our team will review your information and activate your account within 24-48 hours.
        
        Best regards,
        The Glam Glide Team
      `
      : `
        Thank you for registering as a wholesale dealer with Glam Glide!
        
        To complete your registration, please:
        1. Reply to this email with your GST number (required)
        2. Attach at least 2 clear images of your shop/warehouse
        
        Our team will review your information and activate your account within 24-48 hours.
        
        Best regards,
        The Glam Glide Team
      `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: `Complete Your ${userType === 'salon' ? 'Salon' : 'Wholesale Dealer'} Registration`,
      text: userEmailContent
    });

    // Email to admin (only for registrations)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New ${userType === 'salon' ? 'Salon' : 'Wholesale Dealer'} Registration`,
      text: `
        New registration details:
        Type: ${userType}
        ${userType === 'salon' ? 'Salon Name' : 'Business Name'}: ${salonName}
        Email: ${to}
        Phone: ${phoneNumber}
        
        Waiting for their reply with GST and images.
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}