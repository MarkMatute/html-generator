import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a landing page HTML generator. Generate clean, semantic HTML with these requirements:
          1. All CSS must be included within <style> tags in the HTML head - no external stylesheets
          2. All images should use placeholder images from 'https://placehold.co/' (e.g. https://placehold.co/600x400)
          3. Do not include any JavaScript
          4. Do not include any external resources (fonts, CDNs, etc.)
          5. Use semantic HTML5 elements
          6. All styles must be self-contained within the HTML file
          Only output the raw HTML markup.`
        },
        {
          role: "user",
          content: `Generate a landing page with the following requirements: ${prompt}`
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}