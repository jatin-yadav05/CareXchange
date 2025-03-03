import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medicine from '@/models/Medicine';

export async function GET(request) {
  console.log('GET /api/medicines - Fetching medicines');
  try {
    await dbConnect();
    console.log('Database connected successfully');

    // Find all available medicines that haven't expired
    const medicines = await Medicine.find({
      status: 'available', 
      expiryDate: { $gt: new Date() }
    })
    .sort({ createdAt: -1 })
    .populate('donor', 'name email')
    .lean();

    console.log(`Found ${medicines.length} available medicines`);

    // Format the response
    const formattedMedicines = medicines.map(medicine => {
      try {
        return {
          ...medicine,
          _id: medicine._id.toString(),
          donor: medicine.donor ? {
            ...medicine.donor,
            _id: medicine.donor._id.toString()
          } : null,
          recipient: medicine.recipient?.toString(),
          verifiedBy: medicine.verifiedBy?.toString(),
          createdAt: medicine.createdAt.toISOString(),
          updatedAt: medicine.updatedAt.toISOString(),
          expiryDate: medicine.expiryDate.toISOString(),
          ratings: medicine.ratings.map(rating => ({
            ...rating,
            _id: rating._id.toString(),
            userId: rating.userId.toString(),
            createdAt: rating.createdAt.toISOString()
          }))
        };
      } catch (err) {
        console.error('Error formatting medicine:', err);
        console.error('Problem medicine:', medicine);
        throw new Error('Failed to format medicine data');
      }
    });

    console.log('Successfully formatted medicines data');
    return NextResponse.json(formattedMedicines);

  } catch (error) {
    console.error('Error in GET /api/medicines:', error);
    console.error('Stack trace:', error.stack);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data format';
      statusCode = 400;
    } else if (error.name === 'MongoError') {
      errorMessage = 'Database error';
      statusCode = 503;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}