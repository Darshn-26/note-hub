"use client";
import { useOthers, useSelf } from '@liveblocks/react/suspense';
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

  

function Avatars() {
    const others = useOthers();
    const self = useSelf();

    const all=[self,...others];


  return (
    <div className='flex items-center gap-2'>
        <p className='text-sm font-light'>User's currently online</p>
        <div className='flex -space-x-5'>
            {all.map((others,i)=>
            <TooltipProvider key={others?.id + i }>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z-50">
                  <AvatarImage src={others?.info?.avatar} /> 
                  <AvatarFallback>{others?.info?.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id === others?.id ? "You" : others?.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          )}

        </div>
    </div>
  )
}

export default Avatars