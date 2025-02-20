import { useRoom } from '@liveblocks/react/suspense';
import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { MoonIcon, SunIcon, Share2Icon } from 'lucide-react';
import { Button } from './ui/button';
import { BlockNoteView } from '@blocknote/shadcn';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useSelf } from '@liveblocks/react';
import stringToColor from '@/lib/stringToColor';

// Temporary type for development
type LiveblocksProvider = {
  destroy: () => void;
  // Add other provider properties as needed
  [key: string]: any; // This is temporary for development
};

type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksProvider;
  darkMode: boolean;
}

function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  // Temporary development-only validation
  const getUserName = (info: typeof userInfo) => {
    if (process.env.NODE_ENV === 'development') {
      // Log the user info for debugging
      console.log('Current user info:', info);
    }
    return info?.name || 'Anonymous';
  };
  
  const userName = getUserName(userInfo);
  
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userName,
        color: stringToColor(userName)
      },
    },
  });

  return (
    <div className='relative max-w-6xl mx-auto'>
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksProvider>();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [documentUrl, setDocumentUrl] = useState<string>('');

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    // Set the document URL using the room ID
    setDocumentUrl(`${window.location.origin}/documents/${room.id}`);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  const handlePublish = async () => {
    try {
      await navigator.clipboard.writeText(documentUrl);
      // You might want to add a toast notification here
      alert('Document URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL. Please try again.');
    }
  };

  if (!doc || !provider) return null;

  const style = darkMode
    ? "text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white"
    : "text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex items-center gap-2 justify-end mb-10'>
        {/*Translate document */}
        {/*Chat box AI*/}
        {/*Publish Button*/}
        <Button 
          className={style}
          onClick={handlePublish}
          title="Copy document URL"
        >
          <Share2Icon className="w-4 h-4" />
        </Button>
        {/*Dark Mode*/}
        <Button 
          className={style} 
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
        </Button>
      </div>
      {/*Editor Note*/}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;