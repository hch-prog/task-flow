import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    await connectToDatabase();

    const { taskId } = params;
    const data = await request.json();

    const task = await Task.findOneAndUpdate(
      { id: taskId },
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