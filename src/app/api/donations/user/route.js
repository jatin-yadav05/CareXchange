import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/dbConnect';
import Donation from '@/models/Donation';

// GET /api/donations/user
export async function GET(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    await dbConnect();
    
    // Find donations for the user
    const donations = await Donation.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .populate('medicineId', 'name quantity expiryDate')
      .lean();

    // Convert _id to string and format response
    const formattedDonations = donations.map(donation => ({
      ...donation,
      _id: donation._id.toString(),
      userId: donation.userId.toString(),
      medicineId: donation.medicineId ? {
        ...donation.medicineId,
        _id: donation.medicineId._id.toString()
      } : null
    }));

    return NextResponse.json(formattedDonations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 