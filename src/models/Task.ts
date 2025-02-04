import mongoose from 'mongoose';


const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'],
    default: 'NOT_STARTED',
  },
  ticket: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  assignees: [{
    type: String,
  }],
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent mongoose error on hot reload in development
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema); 