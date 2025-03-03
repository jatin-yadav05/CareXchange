import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail';

// POST /api/auth/verify-email - Send verification email
export async function POST(req) {
  try {
    const { email } = await req.json();

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'No user found with this email' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    await user.save();

    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email/${verificationToken}`;

    // Send email
    const message = `
      Please verify your email address by clicking the link below:
      \n\n${verificationUrl}\n\n
      If you did not create an account, please ignore this email.
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Email Verification',
        text: message,
      });

      return NextResponse.json({
        message: 'Verification email sent'
      });
    } catch (error) {
      user.verificationToken = undefined;
      await user.save();

      return NextResponse.json(
        { error: 'Email could not be sent' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send verification email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/verify-email - Verify email with token
export async function PUT(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Hash token
    const verificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 