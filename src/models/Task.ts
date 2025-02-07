import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const TaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => uuidv4(),
    unique: true
  },
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
}, {
  timestamps: true,
});

// Add a pre-save middleware to ensure ID is set
TaskSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = uuidv4();
  }
  next();
});

// Prevent mongoose error on hot reload in development
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema); 