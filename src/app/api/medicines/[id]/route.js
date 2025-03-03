import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medicine from '@/models/Medicine';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const medicine = await Medicine.findById(params.id)
      .populate('ratings.userId', 'name email')
      .lean();

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Calculate trust score
    const trustScore = medicine.ratings.length > 0
      ? medicine.ratings.reduce((acc, curr) => acc + curr.rating, 0) / medicine.ratings.length
      : 0;

    return NextResponse.json({
      ...medicine,
      trustScore: parseFloat(trustScore.toFixed(1))
    });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 