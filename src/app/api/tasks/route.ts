import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await Task.find({});
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const task = await Task.create(data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 