import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import RoomProvider from '@/components/RoomProvider';

const DocLayout = async ({ 
  children, 
  id 
}: any) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <RoomProvider roomId={id}>
      {children}
    </RoomProvider>
  );
}

export default DocLayout;