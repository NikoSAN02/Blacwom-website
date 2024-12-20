import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export async function POST(request) {
  try {
    const { to, userType, salonName, phoneNumber, gst } = await request.json();

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.ADMIN_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    let userEmailContent;
    if (userType === 'salon') {
      userEmailContent = `
        Thank you for registering your salon "${salonName}" with Glam Glide!
        
        To complete your registration, please:
        1. Reply to this email with your GST number (optional)
        2. Attach at least 2 clear images of your salon
        
        Our team will review your information and activate your account within 24-48 hours.
        
        Best regards,
        The Glam Glide Team
      `;
    } else  if (userType === 'wholesale') {
      userEmailContent = `
        Thank you for registering as a wholesale dealer with Glam Glide!
        
        We have received your GST number: ${gst}
        
        To complete your registration, you MUST:
        1. Reply to this email with at least 2 clear images of your shop/warehouse
        
        Your account will remain pending until we receive and verify:
        - Your GST number (already provided)
        - Shop/warehouse images (pending)
        
        Our team will review your information and activate your account within 24-48 hours after receiving all required documents.
        
        Best regards,
        The Glam Glide Team
      `;
    }

    // Email to user
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: `Complete Your ${userType === 'salon' ? 'Salon' : 'Wholesale Dealer'} Registration`,
      text: userEmailContent
    });

    // Email to admin
    const adminEmailContent = `
      New registration details:
      Type: ${userType}
      ${userType === 'salon' ? 'Salon Name' : 'Business Name'}: ${salonName || 'N/A'}
      Email: ${to}
      Phone: ${phoneNumber || 'N/A'}
      GST: ${gst || 'Not provided yet'}
      
      ${userType === 'salon' ? 'Waiting for their reply with GST (optional) and images.' : 'Waiting for their reply with images.'}
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New ${userType === 'salon' ? 'Salon' : 'Wholesale Dealer'} Registration`,
      text: adminEmailContent
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}