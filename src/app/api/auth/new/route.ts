import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    await connectToDatabase();
    
    const userId = uuidv4();
    const user = await User.create({
      userId,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });

    return NextResponse.json({
      userId: user.userId,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    });
  } catch (error) {
    console.error('Error creating new user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 