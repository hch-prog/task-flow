import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ isValid: false }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { lastLoginAt: new Date() },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ isValid: false });
    }

    return NextResponse.json({
      isValid: true,
      user: {
        userId: user.userId,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (error) {
    console.error('Error validating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 