import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// GET /api/users/profile
export async function GET(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      console.log('Unauthorized access attempt - No token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log('Fetching profile for user ID:', payload.userId);
    
    await dbConnect();
    const user = await User.findById(payload.userId)
      .select('-password')
      .lean();

    if (!user) {
      console.log('User not found:', payload.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert _id to string
    const userResponse = {
      ...user,
      _id: user._id.toString(),
    };

    console.log('Profile found:', userResponse);
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/users/profile
export async function PUT(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const data = await request.json();
    await dbConnect();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update only allowed fields
    const allowedUpdates = ['name', 'phone', 'address'];
    allowedUpdates.forEach((field) => {
      if (data[field]) {
        user[field] = data[field];
      }
    });

    await user.save();
    
    // Return updated user data
    const updatedUser = await User.findById(payload.userId)
      .select('-password')
      .lean();
      
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        ...updatedUser,
        _id: updatedUser._id.toString(),
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 