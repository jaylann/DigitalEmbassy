/**
 * @file Contains all shared TypeScript type definitions for the Euromesh application.
 * This file serves as the single source of truth for data structures used across
 * the client-server boundary.
 */

// Re-export core data models for easy access from other parts of the app.
export type { Landmark, Location, LandmarkCategory } from './landmarks';

// --- API Response Wrappers ---
export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export type GeminiApiResponse = ApiResponse<AssistantResponse>;


// --- Core Data & Domain Types ---

/**
 * **THE MISSING TYPE IS HERE.**
 * Represents a generic JSON document provided as context to the AI. This is used
 * in getGeminiResponse to allow for a flexible mix of structured and unstructured data.
 */
export type ContextDocument = Record<string, unknown>;

/**
 * Defines the role of the message sender in the chat.
 */
export type MessageRole = "user" | "assistant";

/**
 * Represents a single message object managed by the chat interface's state.
 */
export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    isError?: boolean;
}


// --- Structured LLM Response Payloads ---

/**
 * A discriminated union representing all possible structured responses from the LLM.
 * The 'type' field allows the client to route the response to the correct handler.
 */
export type AssistantResponse = MessageResponse | ReportResponse;

/**
 * The structure for a standard conversational message from the AI.
 */
export interface MessageResponse {
    type: "message";
    payload: {
        content: string;
    };
}

/**
 * The structure for a danger report payload, parsed by the AI.
 * Contains the text fields the LLM is responsible for extracting.
 */
export interface ReportPayload {
    name: string;
    description: string;
}

/**
 * The structure for a completed danger report from the AI.
 */
export interface ReportResponse {
    type: "report";
    payload: ReportPayload;
}