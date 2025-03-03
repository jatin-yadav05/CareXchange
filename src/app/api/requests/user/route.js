import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/dbConnect';
import Request from '@/models/Request';

// GET /api/requests/user
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
    
    // Find requests for the user
    const requests = await Request.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .populate('medicineId', 'name quantity expiryDate')
      .lean();

    // Convert _id to string and format response
    const formattedRequests = requests.map(request => ({
      ...request,
      _id: request._id.toString(),
      userId: request.userId.toString(),
      medicineId: request.medicineId ? {
        ...request.medicineId,
        _id: request.medicineId._id.toString()
      } : null
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 