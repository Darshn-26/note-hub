// ManageUsers.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { removeuser } from "../../actions/actions";
import { toast } from "sonner";
import { useRoom } from "@liveblocks/react/suspense";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import useOwner from "@/lib/useOwner";
import { useRouter } from "next/navigation";
import { useRoomAccess } from "./../lib/useRoomAccess"; // Add this import

function ManageUsers() {
  const { user } = useUser();
  const isOwner = useOwner();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const room = useRoom();
  
  // Add this line to continuously check access
  useRoomAccess(room.id);

  const [userInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      if (!userId) return;
      const success = await removeuser(room.id, userId);
      
      if (success) {
        toast.success("User deleted from the room successfully.");
        setIsOpen(false);
        
        // If the removed user is the current user, redirect immediately
        if (userId === user?.emailAddresses[0].toString()) {
          router.push("/");
        }
      } else {
        toast.error("Failed to delete user from the room.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"}>
        <DialogTrigger>Users ({userInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Active Users</DialogTitle>
        </DialogHeader>
        <hr className="my-2"></hr>
        <div className="flex flex-col gap-2 space-y-2">
          <div>
            {userInRoom?.docs.map((doc) => (
              <div
                key={doc.data().userId}
                className="flex justify-between items-center"
              >
                <p className="text-gray-500 font-light">
                  {doc.data().userId === user?.emailAddresses[0].toString()
                    ? `You (${doc.data().userId})`
                    : `${doc.data().userId}`}
                </p>
                <div className="flex items-center gap-2 my-1">
                  <Button variant={"outline"}>{doc.data().role}</Button>
                  {isOwner &&
                    doc.data().userId !== user?.emailAddresses[0].toString() && (
                      <Button
                        variant={"destructive"}
                        disabled={isPending}
                        onClick={() => handleDelete(doc.data().userId)}
                      >
                        Remove
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageUsers;