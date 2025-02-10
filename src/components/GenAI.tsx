import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Copy, CheckCircle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GenAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Received non-JSON response from server");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your message. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (message: string, index: number) => {
    navigator.clipboard.writeText(message);
    setCopiedMessageIndex(index);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedMessageIndex(null);
    }, 2000);
  };

  const renderMessageContent = (message: string) => {
    // Check if the message contains a markdown table or list
    const isTable = message.includes('|') && message.split('\n').some(line => line.includes('|'));
    const isList = message.split('\n').some(line => /^[\*\-\d\.]\s/.test(line.trim()));

    if (isTable) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            {message.split('\n').map((row, rowIndex) => {
              const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
              
              if (rowIndex === 1) return null; // Skip separator row

              return (
                <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100 font-bold' : ''}>
                  {cells.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="border border-gray-200 p-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </table>
        </div>
      );
    }

    if (isList) {
      const listType = message.split('\n')[0].trim().match(/^[\*\-\d\.]/)?.[0];
      
      return (
        <div>
          {listType === '*' || listType === '-' ? (
            <ul className="list-disc pl-5">
              {message.split('\n').map((item, index) => (
                item.trim() && (
                  <li key={index} className="mb-1">
                    {item.replace(/^[\*\-]\s*/, '')}
                  </li>
                )
              ))}
            </ul>
          ) : (
            <ol className="list-decimal pl-5">
              {message.split('\n').map((item, index) => (
                item.trim() && (
                  <li key={index} className="mb-1">
                    {item.replace(/^\d+\.\s*/, '')}
                  </li>
                )
              ))}
            </ol>
          )}
        </div>
      );
    }

    return message;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-4 h-14 w-14"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-xl">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">NOTE-HUB Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } relative`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  } relative pr-10`}
                >
                  {renderMessageContent(message.content)}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 hover:bg-transparent"
                    onClick={() => handleCopyMessage(message.content, index)}
                  >
                    {copiedMessageIndex === index ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 opacity-50 hover:opacity-100" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-3 border-t flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GenAI;