// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:"You the assistant for NOTE-HUB.As NOTE-HUB is an relatime interactive notes app.Help user to frame proper sentences,notes,math calculations and much more.maintain short responses ,only if user asks 'long/detailed' questions then provide detailed answers.'",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

let chatSession: any = null;

export async function POST(request: Request) {
  try {
    if (!chatSession) {
      chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Hello! How can I help you with NOTE-HUB today?" }],
          },
        ],
      });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await chatSession.sendMessage(message);
    const response = await result.response.text();

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error in chat handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}