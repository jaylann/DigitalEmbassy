/**
 * @file Contains shared TypeScript type definitions used across the application.
 */

// --- API Response Types ---
export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export type GeminiResponse = ApiResponse<string>;


// --- Chat Component Types ---

/**
 * Defines the role of the message sender.
 * 'user' represents messages sent by the human user.
 * 'assistant' represents messages from the AI.
 */
export type MessageRole = "user" | "assistant";

/**
 * Represents a single message object in the chat interface.
 */
export interface Message {
    /** A unique identifier for the message, crucial for React keys. */
    id: string;
    /** The sender of the message. */
    role: MessageRole;
    /** The text content of the message. */
    content: string;
    /** An optional flag to indicate an error message from the assistant. */
    isError?: boolean;
}