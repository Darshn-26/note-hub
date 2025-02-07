"use client";
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { usePathname,useRouter } from 'next/navigation';
import { deleteDocument } from '../../actions/actions';
import { toast } from 'sonner';

  

function DeleteDocument() {
    const [isopen, setIsopen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();
    const pathname = usePathname();
    const router=useRouter();

    const handleDelete = async() => {
        const roomid = pathname.split("/").pop();
        if(!roomid) return;

        startTransition(async() => {
            const sucess=await deleteDocument(roomid);
            if(sucess){
                setIsopen(false);
                router.replace("/");
                toast.success("Document deleted successfully");
            }else{
                toast.error("Error deleting document");
            }
        })
    }
  return (
    <Dialog open={isopen} onOpenChange={setIsopen}> 
    <Button asChild variant={"destructive"}>
  <DialogTrigger>Delete</DialogTrigger>
  </Button>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure u want to Delete ?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className='sm:justify-end gap-2'>
        <Button
           type="button"
           variant={"destructive"}
           onClick={handleDelete}
           disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete" }
        </Button>
        <DialogClose asChild>
            <Button type="button" variant={"secondary"}>Cancel</Button>
        </DialogClose>
    </DialogFooter>

  </DialogContent>
</Dialog>

  )
}

export default DeleteDocument