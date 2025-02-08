import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import RoomProvider from '@/components/RoomProvider';

// Update the type to match Next.js layout props structure
type LayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

const DocLayout = async ({
  children,
  params,
}: LayoutProps) => {
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