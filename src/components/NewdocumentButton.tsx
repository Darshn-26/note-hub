"use client"

import { useRouter } from "next/navigation";
import { Button } from './ui/button';
import { useTransition } from 'react';
import { createNewDocument } from '../../actions/actions';
import { toast } from 'sonner';

function NewDocumentButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      try {
        const response = await createNewDocument();
        
        if (!response || !response.docId) {
          toast.error('Authentication Required', {
            description: 'Please sign in to create a new document',
            position: 'top-center',
            duration: 5000,
            style: {
              background: '#ffffff',
              color: '#FF0000',
              border: '2px solid #FF0000',
            },
          });
          return;
        }

        // Success toast when document is created
        toast.success('Document Created', {
          description: 'Redirecting to your new document...',
          position: 'top-center',
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#22c55e',
            border: '2px solid #22c55e',
          },
        });

        router.push(`/doc/${response.docId}`);
      } catch (error) {
        toast.error('Authentication Required', {
          description: 'Please sign in to create a new document',
          position: 'top-center',
          duration: 5000,
          style: {
            background: '#ffffff',
            color: '#FF0000',
            border: '2px solid #FF0000',
          },
        });
      }
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
}

export default NewDocumentButton;