"use client";

import { useOthers, useSelf } from '@liveblocks/react/suspense';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Avatars() {
  const others = useOthers();
  const self = useSelf();

  // Filter out any invalid users and combine self with others
  const allUsers = [self, ...others].filter(user => 
    user && user.info && user.id && user.info.name
  );

  return (
    <div className='flex items-center gap-2'>
      <p className='text-sm font-light'>Users currently online</p>
      <div className='flex -space-x-5'>
        {allUsers.map((user, index) => (
          <TooltipProvider key={`user-${user.id}-${index}`}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z-50">
                  <AvatarImage 
                    src={user.info?.avatar} 
                    alt={user.info?.name}
                  />
                  <AvatarFallback>
                    {user.info?.name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self.id === user.id ? "You" : user.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

export default Avatars;