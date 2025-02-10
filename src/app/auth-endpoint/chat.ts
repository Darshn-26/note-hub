// pages/api/chat.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

// Type for the response
type ChatResponse = {
  response?: string;
  error?: string;
};

// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

let chatSession: any = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  // Ensure only POST requests are accepted
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize chat session if it doesn't exist
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

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await chatSession.sendMessage(message);
    const response = await result.response.text();

    // Set proper headers
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ response });

  } catch (error) {
    console.error('Error in chat handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}