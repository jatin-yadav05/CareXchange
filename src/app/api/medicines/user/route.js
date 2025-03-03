import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import Medicine from '@/models/Medicine';
import dbConnect from '@/lib/dbConnect';

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

    console.log('Fetching medicines for user ID:', payload.userId);
    
    await dbConnect();

    // Find all medicines where the user is either the donor or recipient
    const medicines = await Medicine.find({
      $or: [
        { donor: payload.userId },
        { recipient: payload.userId }
      ]
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .populate('donor', 'name email')
    .lean();

    // Convert _id to string and format dates
    const formattedMedicines = medicines.map(medicine => ({
      ...medicine,
      _id: medicine._id.toString(),
      createdAt: medicine.createdAt.toISOString(),
      updatedAt: medicine.updatedAt.toISOString(),
      expiryDate: medicine.expiryDate.toISOString(),
      donor: medicine.donor ? {
        ...medicine.donor,
        _id: medicine.donor._id.toString()
      } : null,
      recipient: medicine.recipient?.toString(),
      verifiedBy: medicine.verifiedBy?.toString(),
      ratings: medicine.ratings.map(rating => ({
        ...rating,
        _id: rating._id.toString(),
        userId: rating.userId.toString(),
        createdAt: rating.createdAt.toISOString()
      }))
    }));

    console.log(`Found ${formattedMedicines.length} medicines for user`);
    return NextResponse.json(formattedMedicines);
  } catch (error) {
    console.error('Error fetching user medicines:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 