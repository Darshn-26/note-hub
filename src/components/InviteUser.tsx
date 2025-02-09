"use client";

import React, { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { adduser } from "../../actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { useRoom } from "@liveblocks/react/suspense";

function InviteUser() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [email, setEmail] = React.useState("");
  const pathname = usePathname();
  const router = useRouter();
  const room = useRoom();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathname.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const success = await adduser(roomId, email);
      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User added to the room successfully.",{
          description: 'Document title has been updated successfully',
          position: 'top-center',
          duration: 3000,
          style: {
            background: 'linear-gradient(90deg, #FFC0CB, #C51077, #8B0A1A)',
            color: '#FFFFFF',
            border: '2px solid linear-gradient(90deg, #FFC0CB, #C51077, #8B0A1A)',
          },
                        
        });
        
        // Properly subscribe to presence updates
        room.subscribe("my-presence", (presence) => {
          console.log("Presence updated:", presence);
        });
        
        router.refresh();
      } else {
        toast.error("Failed to add user to the room.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"}>
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a User to Collaborate</DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="flex gap-4">
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUser;