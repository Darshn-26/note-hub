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

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
}

function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const userName = userInfo?.name! || 'Anonymous';
  
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
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
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

  const style = `hover:text-white${
    darkMode
      ? "test-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-black text-white hover:bg-gray-300 hover:text-gray-700"
  }`;

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
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/*Editor Note*/}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;