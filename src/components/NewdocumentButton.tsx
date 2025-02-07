"use client"

import { useRouter } from "next/navigation";
import { Button } from './ui/button';
import { useTransition } from 'react';
import { createNewDocument } from '../../actions/actions';

function NewdocumentButton() {
  const[ispending,startTransition]=useTransition();//using react transition as hook 
  const router=useRouter();
  //start transition means ? 
  //React transitions help create smooth visual changes when components mount, update, or unmount. There are several ways to handle transitions in React:
  const handleCreateNewDocument =() =>{
    startTransition(async()=>{
    const { docId }=await createNewDocument();
    router.push(`/doc/${docId}`);
  });
  }
  return (
    <Button onClick={handleCreateNewDocument} disabled={ispending}>
      {ispending? "Creating..":"New Document"}
    </Button>
  );
}

export default NewdocumentButton