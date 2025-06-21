/**
 * @file A fully interactive, LLM-driven chat interface component for Euromesh.
 */

"use client";

import {
  useState,
  useTransition,
  useRef,
  useEffect,
  type FormEvent,
  memo,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ArrowUp, Bot, Loader2 } from "lucide-react";
import clsx from "clsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getGeminiResponse } from "@/lib/actions/gemini";
import { saveReportToMesh } from "@/lib/actions/mesh";
import type { Message, ReportPayload } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLocation } from "@/lib/state/location";
import { SelectMap } from "@/components/select-map";

const MemoizedMarkdown = memo(({ content }: { content: string }) => (
  <div className="prose prose-sm prose-invert break-words">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
));
MemoizedMarkdown.displayName = "MemoizedMarkdown";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "I am the Euromesh emergency assistant. You can ask for information or report a new danger.",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { lastKnownLocation } = useLocation();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [pendingReport, setPendingReport] = useState<ReportPayload | null>(
    null,
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      // --- SIMPLIFIED CALL: The function now loads its own context. ---
      const result = await getGeminiResponse(newMessages);

      if (result.success) {
        const assistantResponse = result.data;
        let finalAssistantMessage: Message;

        switch (assistantResponse.type) {
          case "message":
            let content = assistantResponse.payload.content;
            const locationRequestRegex = /(location|where|address|place|map)/i;
            if (locationRequestRegex.test(content)) {
              setShowLocationPicker(true);
              content = "Please select the location on the map.";
            }
            finalAssistantMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              content,
            };
            setMessages((prev) => [...prev, finalAssistantMessage]);
            break;

          case "report":
            {
              const result = await saveReportToMesh(
                assistantResponse.payload,
                lastKnownLocation,
              );
              if (result.success && result.landmark) {
                // Landmark saved successfully
              }

              finalAssistantMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                  "Thank you. Your report has been received and will be shared with the network.",
              };
              setMessages((prev) => [...prev, finalAssistantMessage]);
            }
            break;

          case "location_request":
            setPendingReport(assistantResponse.payload.report);
            setShowLocationPicker(true);
            finalAssistantMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              content: assistantResponse.payload.content,
            };
            setMessages((prev) => [...prev, finalAssistantMessage]);
            break;
        }
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl h-[85vh] flex flex-col bg-black border-zinc-800 shadow-2xl shadow-zinc-900/50">
      <CardHeader className="flex flex-row items-center border-b border-zinc-800 p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback className="bg-zinc-700 text-white">
              <Bot />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none text-white">
              Euromesh Assistant
            </p>
            <p className="text-sm text-zinc-400">Official Emergency Channel</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex flex-col",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={clsx(
                    "max-w-[80%] rounded-lg px-3 py-2",
                    message.role === "user"
                      ? "bg-zinc-200 text-zinc-900"
                      : "bg-zinc-800 text-zinc-50",
                    message.isError && "bg-red-900/50 border border-red-500/50",
                  )}
                >
                  <MemoizedMarkdown content={message.content} />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <SelectMap
          isOpen={showLocationPicker}
          onClose={() => {
            setShowLocationPicker(false);
            setPendingReport(null);
          }}
          onSave={async (loc) => {
            if (pendingReport) {
              const result = await saveReportToMesh(pendingReport, loc);
              if (result.success && result.landmark) {
                // Landmark saved successfully
              }
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: "Thank you. Your report has been saved and shared.",
                },
              ]);
            }
            setShowLocationPicker(false);
            setPendingReport(null);
          }}
          initialCenter={lastKnownLocation}
        />
      </CardContent>
      <CardFooter className="p-4 border-t border-zinc-800">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your question or report..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500 rounded-lg"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-zinc-800 hover:bg-zinc-700 rounded-full shrink-0"
            disabled={isPending || !input.trim()}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="h-4 w-4 text-white" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
