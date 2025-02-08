import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { NextResponse, NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
) {
  try {
    await connectToDatabase();


    const data = await request.json();

    // Update the task using taskId
    const task = await Task.findOneAndUpdate(
      { id: data.id }, // Use taskId here
      { ...data },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}