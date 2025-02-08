// LiveCursorProvider.tsx
"use client";

import React from 'react';
import { useMyPresence, useOthers, useRoom } from "@liveblocks/react/suspense";
import { PointerEvent } from "react";
import FollowPointer from './FollowPointer';

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
    const room = useRoom();
    const [_myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();

    const handlePointerMove = React.useCallback((e: PointerEvent<HTMLDivElement>) => {
        const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
        updateMyPresence({ cursor });
    }, [updateMyPresence]);

    const handlePointerLeave = React.useCallback(() => {
        updateMyPresence({ cursor: null });
    }, [updateMyPresence]);

    // Log connection status
    React.useEffect(() => {
        console.log('Room connection status:', room.getStatus());
        
        return () => {
            updateMyPresence({ cursor: null });
        };
    }, [room, updateMyPresence]);

    return (
        <div 
            className="h-full w-full"
            onPointerMove={handlePointerMove} 
            onPointerLeave={handlePointerLeave}
        >
            {others
                .filter((other) => other.presence?.cursor !== null)
                .map(({ connectionId, presence, info }) => {
                    if (!presence?.cursor) return null;
                    
                    return (
                        <FollowPointer
                            key={connectionId}
                            info={info}
                            x={presence.cursor.x}
                            y={presence.cursor.y}
                        />
                    );
                })}
            {children}
        </div>
    );
}

export default LiveCursorProvider;