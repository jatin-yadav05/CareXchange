import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/dbConnect';
import Medicine from '@/models/Medicine';

export async function POST(request, { params }) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const { rating } = await request.json();
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating value' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const medicine = await Medicine.findById(params.id);
    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Check if user has already rated
    const existingRating = medicine.ratings.find(
      r => r.userId.toString() === payload.userId
    );

    if (existingRating) {
      // Update existing rating
      existingRating.value = rating;
      existingRating.updatedAt = new Date();
    } else {
      // Add new rating
      medicine.ratings.push({
        userId: payload.userId,
        value: rating,
        createdAt: new Date()
      });
    }

    // Calculate average rating
    const totalRatings = medicine.ratings.reduce((sum, r) => sum + r.value, 0);
    medicine.averageRating = totalRatings / medicine.ratings.length;

    await medicine.save();

    return NextResponse.json({
      message: 'Rating updated successfully',
      averageRating: medicine.averageRating
    });
  } catch (error) {
    console.error('Rating error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 