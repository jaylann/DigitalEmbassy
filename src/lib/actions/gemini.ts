/**
 * @file Contains the server-side action for interacting with the Google Gemini API.
 * This module encapsulates the logic for context-aware question answering.
 */

"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiResponse } from "@/lib/types";

// --- Type Definitions ---
type ContextDocument = Record<string, unknown>;

// --- API Client Initialization & Validation ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables. Set it in .env.local");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * @constant {string} SYSTEM_PROMPT
 * The core instructions for the AI model. This defines its role, rules, and constraints.
 * It is encapsulated within the server action to ensure security and consistency.
 */
const SYSTEM_PROMPT = `
You are the official information assistant for the Euromesh application. Your purpose is to provide critical safety information to European citizens from their embassy during emergencies. Your responses must be precise, calm, and factual.

Strict Rules of Operation:
1.  **Information Source:** Your entire response MUST be derived from the information within the '--- CONTEXT ---' block. This context contains the latest data received by the app, either from a live server or through the P2P mesh network. No other sources are permitted.

2.  **Unavailable Information:** If the user's question cannot be answered from the provided context, you MUST clearly state that the information is not available in the current data update. Do not suggest where to find the information unless that suggestion is explicitly part of the provided context.

3.  **Knowledge Limitation:** This is a critical safety feature. You MUST NOT use any external knowledge, access the internet, or make assumptions. Your knowledge is strictly limited to the JSON data provided in this query. Do not hallucinate or create information.

4.  **Tone and Brevity:** Respond directly and factually. Avoid conversational filler (e.g., 'Of course,' 'I can help with that'). The user's situation may be critical, and clarity is paramount. Brevity is essential.

5.  **Formatting:** Present information for maximum readability. Use lists or short sentences. Do not start your answer with "According to the context..."—the user already understands this is how you operate.
`.trim();

/**
 * Sends a user query and JSON context to the Gemini API and returns a structured response.
 * The function internally combines the user inputs with a predefined system prompt
 * to ensure the AI behaves in a controlled and predictable manner.
 *
 * @param {ContextDocument[]} documents - An array of JSON objects to be used as context.
 * @param {string} userQuery - The user-provided question.
 * @returns {Promise<GeminiResponse>} A promise that resolves to a GeminiResponse object,
 *          containing either the successful data or a user-friendly error message.
 */
export async function getGeminiResponse(
    documents: ContextDocument[],
    userQuery: string
): Promise<GeminiResponse> {
  // --- Input Validation ---
  if (!Array.isArray(documents)) {
    return { success: false, error: "Invalid context: Documents must be an array." };
  }
  if (!userQuery.trim()) {
    return { success: false, error: "Invalid query: A non-empty string is required." };
  }

  // --- Prompt Construction ---
  const serializedContext = JSON.stringify(documents, null, 2);
  const fullPrompt = `
${SYSTEM_PROMPT}

--- CONTEXT ---
\`\`\`json
${serializedContext}
\`\`\`
--- END CONTEXT ---

--- USER QUESTION ---
${userQuery}
--- END USER QUESTION ---

Answer:
  `;

  try {
    console.log("Server Action 'getGeminiResponse': Calling Gemini API with structured prompt.");
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, data: text };

  } catch (error) {
    console.error("Server Action 'getGeminiResponse': API Error:", error);
    return {
      success: false,
      error: "An error occurred while communicating with the AI. Please check server logs for details.",
    };
  }
}