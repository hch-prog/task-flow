import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userId, isNewUser } = await request.json();

    if (isNewUser) {
    
      const existingUser = await User.findOne({ userId });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

    
      const user = await User.create({
        userId,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
      return NextResponse.json({ user });
    } else {
     
      const user = await User.findOneAndUpdate(
        { userId },
        { lastLoginAt: new Date() },
        { new: true }
      );

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    }
  } catch (error) {
    console.error('Error handling auth:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 