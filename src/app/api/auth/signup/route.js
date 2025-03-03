import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Parse request body
    let name, email, password, role, phone, address;
    try {
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
      role = body.role;
      phone = body.phone;
      address = body.address;
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Enhanced debug logging
    console.log('Signup request:', {
      name,
      email,
      role,
      phone,
      address,
      roleType: typeof role
    });

    // Validate required fields
    if (!name || !email || !password || !role || !phone || !address) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Process and validate role
    const processedRole = (role || '').trim().toLowerCase();

    // Check if user already exists
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
    } catch (findError) {
      console.error('User find error:', findError);
      return NextResponse.json(
        { error: 'Error checking existing user' },
        { status: 500 }
      );
    }

    // Create user
    let user;
    try {
      user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: processedRole,
        phone: phone.trim(),
        address: address.trim(),
        isVerified: false
      });
    } catch (createError) {
      console.error('User creation error:', createError);
      // Handle mongoose validation errors
      if (createError.name === 'ValidationError') {
        const validationErrors = Object.values(createError.errors).map(err => err.message);
        return NextResponse.json(
          { error: validationErrors.join(', ') },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Error creating user' },
        { status: 500 }
      );
    }

    // Create token
    let token;
    try {
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
    } catch (jwtError) {
      console.error('Token creation error:', jwtError);
      return NextResponse.json(
        { error: 'Error creating authentication token' },
        { status: 500 }
      );
    }

    // Create response
    try {
      const response = NextResponse.json(
        { 
          message: 'User created successfully',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          }
        },
        { status: 201 }
      );

      // Set cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      return response;
    } catch (responseError) {
      console.error('Response creation error:', responseError);
      return NextResponse.json(
        { error: 'Error creating response' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}