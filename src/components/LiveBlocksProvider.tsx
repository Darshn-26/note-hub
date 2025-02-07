"use client"

import React from 'react'
import { LiveblocksProvider } from '@liveblocks/react/suspense'
import { ClientOptions } from '@liveblocks/client'

function LiveBlocksProvider({children}:{children: React.ReactNode}) {
    if(!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY){
        throw new Error('NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not defined')
    }
    
    const options: ClientOptions = {
        publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
        throttle: 16,
    }
    
    return (
        <LiveblocksProvider {...options}>
            {children}
        </LiveblocksProvider>
    );
}

export default LiveBlocksProvider;