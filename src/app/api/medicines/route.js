import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medicine from '@/models/Medicine';

export async function GET(request) {
  console.log('GET /api/medicines - Fetching medicines');
  
  try {
    // Connect to database with proper error handling
    try {
      await dbConnect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Find all available medicines that haven't expired
    let medicines;
    try {
      medicines = await Medicine.find({
        status: 'available', 
        expiryDate: { $gt: new Date() }
      })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email')
      .lean();

      console.log(`Found ${medicines.length} available medicines`);
    } catch (queryError) {
      console.error('Error querying medicines:', queryError);
      return NextResponse.json(
        { error: 'Failed to fetch medicines from database' },
        { status: 500 }
      );
    }

    // Format the response
    let formattedMedicines;
    try {
      formattedMedicines = medicines.map(medicine => ({
        ...medicine,
        _id: medicine._id?.toString(),
        donor: medicine.donor ? {
          ...medicine.donor,
          _id: medicine.donor._id?.toString()
        } : null,
        recipient: medicine.recipient?.toString(),
        verifiedBy: medicine.verifiedBy?.toString(),
        createdAt: medicine.createdAt?.toISOString(),
        updatedAt: medicine.updatedAt?.toISOString(),
        expiryDate: medicine.expiryDate?.toISOString(),
        ratings: (medicine.ratings || []).map(rating => ({
          ...rating,
          _id: rating._id?.toString(),
          userId: rating.userId?.toString(),
          createdAt: rating.createdAt?.toISOString()
        }))
      }));

      console.log('Successfully formatted medicines data');
    } catch (formatError) {
      console.error('Error formatting medicines:', formatError);
      return NextResponse.json(
        { error: 'Failed to format medicine data' },
        { status: 500 }
      );
    }

    return NextResponse.json(formattedMedicines);

  } catch (error) {
    console.error('Error in GET /api/medicines:', error);
    console.error('Stack trace:', error.stack);
    
    let errorMessage = 'Failed to fetch medicines';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data format';
      statusCode = 400;
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      errorMessage = 'Database error';
      statusCode = 503;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}