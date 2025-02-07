"use client";

import React from 'react';
import Document from '@/components/Document';

function DocumentPage({
  params
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  // Unwrap the params using React.use()
  const resolvedParams = React.use(params as Promise<{ id: string }>);

  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <Document id={resolvedParams.id} />
    </div>
  );
}

export default DocumentPage;