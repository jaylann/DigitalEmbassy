/**
 * @file Contains the core AI engine for the Euromesh application.
 * This version includes a more procedural system prompt with few-shot examples
 * to prevent premature report submission.
 */

"use server";

import fs from "fs/promises";
import path from "path";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import type {
  GeminiApiResponse,
  Message,
  Landmark,
  AssistantResponse,
} from "@/lib/types";

const dbPath = path.join(process.cwd(), "data", "landmarks.json");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("FATAL: GEMINI_API_KEY is not defined.");

const genAI = new GoogleGenerativeAI(apiKey);
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  safetySettings,
});

/**
 * @constant {string} SYSTEM_PROMPT
 * The master prompt, now with explicit rules and examples to guide the AI's
 * reporting flow and prevent premature completion.
 */
const SYSTEM_PROMPT = `
You are the AI engine for the Euromesh emergency app. You have two primary modes: ANSWER_MODE and REPORT_MODE. Your entire response MUST be ONLY a single, valid JSON object.

--- MODES ---

1.  **ANSWER_MODE:**
    *   **Trigger:** The user asks a question.
    *   **Action:** Answer based ONLY on the provided JSON '--- MESH CONTEXT ---'.
    *   **JSON Output:** \`{"type": "message", "payload": {"content": "Your answer here."}}\`

2.  **REPORT_MODE:**
    *   **Trigger:** The user wants to report a danger or disaster.
    *   **Action:** Collect a 'name', 'description', and a 'category'. Allowed categories are 'explosion', 'attack', or 'disaster'. Follow this procedure:
        1.  Analyze the user's message and the conversation history.
        2.  Check if you have extracted ALL THREE fields.
        3.  **If any field is missing**, return a \`message\` type JSON asking the user for the missing detail.
        4.  **When all fields are collected**, return a \`location_request\` JSON including the full report object in the payload. Example:
           \`{"type": "location_request", "payload": {"content": "Please share the location.", "report": {"name": "...", "description": "...", "category": "explosion"}}}\`

--- RULES & EXAMPLES ---
- Your output must start with \`{\` and end with \`}\`. No markdown fences.
- Use the conversation history for context.
- **CRITICAL RULE:** Do not request the user's location until you have collected name, description, and category. Always ask for missing details first.
- **Example 1: Incomplete Report (Vague Initial Request)**
  - User: "I would like to report something."
  - Your JSON Response: \`{"type": "message", "payload": {"content": "I can help with that. Please describe the danger."}}\`

- **Example 2: Incomplete Report (Description but no Name)**
  - User: "A bridge collapsed."
  - Your JSON Response: \`{"type": "message", "payload": {"content": "Thank you. Can you tell me the location or name of the collapsed bridge?"}}\`

- **Example 3: Requesting Location**
  - User: "A fire broke out near me."
  - Your JSON Response: \`{"type": "location_request", "payload": {"content": "Please share the location.", "report": {"name": "Unknown", "description": "A fire broke out", "category": "disaster"}}}\`

- **Example 4: Completed Report**
  - (After gathering name, description, and category)
  - User: "It's the Tabiat Bridge."
  - Your JSON Response: \`{"type": "location_request", "payload": {"content": "Please mark the location on the map.", "report": {"name": "Tabiat Bridge", "description": "A bridge collapsed", "category": "disaster"}}}\`
`.trim();

export async function getGeminiResponse(
  chatHistory: Message[],
): Promise<GeminiApiResponse> {
  let landmarks: Landmark[] = [];
  try {
    const fileContent = await fs.readFile(dbPath, "utf-8");
    landmarks = JSON.parse(fileContent);
    console.log(`Loaded ${landmarks.length} landmarks from mesh database.`);
  } catch (error) {
    console.log(
      "No mesh database found or it's empty. Starting with a clean context.",
      error,
    );
  }

  const historyForPrompt = chatHistory
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
    )
    .join("\n");

  const fullPrompt = `
${SYSTEM_PROMPT}
--- MESH CONTEXT ---
\`\`\`json
${JSON.stringify(landmarks, null, 2)}
\`\`\`
--- END MESH CONTEXT ---
--- CURRENT CONVERSATION HISTORY ---
${historyForPrompt}
--- END CONVERSATION HISTORY ---
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    console.log("RAW RESPONSE FROM GEMINI:", responseText);

    const jsonRegex = /```(json)?\s*([\s\S]*?)\s*```/;
    const match = responseText.match(jsonRegex);
    const sanitizedText = match ? match[2].trim() : responseText.trim();

    if (!sanitizedText) throw new Error("Sanitized response text is empty.");

    const parsedJson = JSON.parse(sanitizedText) as AssistantResponse;
    if (!parsedJson.type || !parsedJson.payload)
      throw new Error("Invalid JSON structure.");

    return { success: true, data: parsedJson };
  } catch (error) {
    console.error("FULL ERROR OBJECT:", error);
    const errorResponse: AssistantResponse = {
      type: "message",
      payload: {
        content:
          "I'm having trouble processing that request. Could you please try rephrasing?",
      },
    };
    return { success: true, data: errorResponse };
  }
}
