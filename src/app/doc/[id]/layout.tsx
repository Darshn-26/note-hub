import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import RoomProvider from '@/components/RoomProvider';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

async function DocLayout({ children, params }: LayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const resolvedParams = await params; // Await params if it's a Promise

  return (
    <RoomProvider roomId={resolvedParams.id}>
      {children}
    </RoomProvider>
  );
}

export default DocLayout;
