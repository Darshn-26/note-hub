import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import RoomProvider from '@/components/RoomProvider';

async function DocLayout({ 
  children,
  params 
}: {
  children: React.ReactNode,
  params: { id: string }
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <RoomProvider roomId={params.id}>
      {children}
    </RoomProvider>
  );
}

export default DocLayout;