import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "test",
        temperature: 0.7,
      },
    });

    const stream = await chat.sendMessageStream({ message: "Hello" });
    for await (const chunk of stream) {
      console.log(chunk.text);
    }
    console.log("SUCCESS!");
  } catch (error) {
    console.error("ERROR CAUGHT:");
    console.error(error);
  }
}

test();
