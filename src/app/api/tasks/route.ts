import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get userId from the URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If userId is provided, filter tasks by userId
    const query = userId ? { userId } : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
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
    const { title, status, ticket, tags, assignees, userId } = data;

    if (!title || !ticket || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await Task.create({
      title,
      status: status || 'NOT_STARTED',
      ticket,
      tags: tags || [],
      assignees: assignees || [],
      userId,
    });


    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 