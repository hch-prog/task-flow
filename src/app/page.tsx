'use client'

import { useEffect } from 'react';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

const KanbanBoard = dynamic(
  () => import('@/components/KanbanBoard').then((mod) => mod.KanbanBoard),
  { ssr: false }
);

export default function Home() {
  useEffect(() => {
   
    const testConnection = async () => {
      try {
        const tasks = await api.getTasks();
        console.log('Connected to MongoDB:', tasks);
      } catch (error) {
        console.error('MongoDB connection test failed:', error);
      }
    };

    testConnection();
  }, []);

  return <KanbanBoard />;
}
