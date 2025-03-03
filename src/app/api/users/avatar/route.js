import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// POST /api/users/avatar
export async function POST(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const formData = await request.formData();
    const file = formData.get('avatar');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${uuidv4()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');
    const filePath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filePath, buffer);
    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user's avatar in database
    await dbConnect();
    const user = await User.findByIdAndUpdate(
      payload.userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 