"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Landmark, LandmarkCategory } from "@/lib/types";

interface LandmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: { lat: number; lng: number };
  onSubmit: (lm: Landmark) => void;
}

const categories: LandmarkCategory[] = [
  "safe_space",
  "dangerous_spot",
  "communication",
  "trusted_contact",
  "medical",
  "checkpoint",
];

export function LandmarkDialog({ open, onOpenChange, location, onSubmit }: LandmarkDialogProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<LandmarkCategory>("safe_space");
  const [radius, setRadius] = React.useState("");

  const handleSubmit = () => {
    const landmark: Landmark = {
      id: crypto.randomUUID(),
      name,
      description: description || undefined,
      category,
      location,
      radius: radius ? parseFloat(radius) : undefined,
    };
    onSubmit(landmark);
    onOpenChange(false);
    setName("");
    setDescription("");
    setRadius("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Landmark</DialogTitle>
          <DialogDescription>Provide details for the new landmark.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="min-h-[60px] w-full rounded-md border border-neutral-700 bg-black/50 p-2 text-white"
          />
          <Select value={category} onValueChange={(v) => setCategory(v as LandmarkCategory)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Radius (meters)"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
