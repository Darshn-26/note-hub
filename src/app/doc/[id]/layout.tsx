import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import RoomProvider from '@/components/RoomProvider';

async function DocLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }> | { id: string }
}) {
    const { userId } = await auth();
    const resolvedParams = await params;

    if (!userId) {
        redirect('/sign-in');
    }

    return (
        <RoomProvider roomId={resolvedParams.id}>
            {children}
        </RoomProvider>
    );
}

export default DocLayout;