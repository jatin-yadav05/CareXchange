import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Donation from '@/models/Donation';

export async function POST(req) {
  try {
    // Check authentication using cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    const userEmail = cookieStore.get('userEmail')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'You must be logged in to create a donation' },
        { status: 401 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const data = await req.json();
    console.log('Received donation data:', data);

    // Validate required fields
    const requiredFields = ['medicine', 'quantity', 'expiryDate', 'condition', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create donation object with donor email
    const donationData = {
      ...data,
      donorEmail: userEmail,
      status: 'active'
    };

    console.log('Creating donation with data:', donationData);

    // Create new donation
    const donation = await Donation.create(donationData);

    return NextResponse.json(
      { message: 'Donation created successfully', donation },
      { status: 201 }
    );

  } catch (error) {
    console.error('Detailed error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle other types of errors
    return NextResponse.json(
      { 
        error: 'Failed to create donation',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const donations = await Donation.find({ status: 'active' })
      .sort({ createdAt: -1 });

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
} 