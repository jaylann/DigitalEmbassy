"use client";
import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface DebugAction {
  key: string;
  label: string;
  handler: () => void;
}

const actions: DebugAction[] = [
  {
    key: "1",
    label: "Action One",
    handler: () => console.log("Action one executed"),
  },
  {
    key: "2",
    label: "Action Two",
    handler: () => console.log("Action two executed"),
  },
  {
    key: "3",
    label: "Action Three",
    handler: () => console.log("Action three executed"),
  },
];

export default function DebugMenu() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && e.shiftKey) {
        e.preventDefault();
        toggle();
        return;
      }
      actions.forEach((action) => {
        if (e.key === action.key) {
          e.preventDefault();
          action.handler();
        }
      });
    },
    [toggle]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-popover text-popover-foreground border rounded shadow-lg p-4 space-y-2">
          {actions.map((action) => (
            <Button key={action.key} onClick={action.handler} className="w-full">
              {action.label} ({action.key})
            </Button>
          ))}
          <Button variant="secondary" onClick={toggle} className="w-full">
            Close (Shift+D)
          </Button>
        </div>
      ) : (
        <Button size="icon" onClick={toggle} aria-label="Open debug menu">
          D
        </Button>
      )}
    </div>
  );
}
