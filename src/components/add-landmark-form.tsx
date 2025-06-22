// src/components/add-landmark-form.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
// Adjust path to your Landmark types. Based on your page.tsx, it might be @/lib/types
import { LandmarkCategory, Location } from "@/lib/types";

interface AddLandmarkFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: NewLandmarkData) => void;
    // clickedCoordinates prop is removed as user will input lat/lng
}

export interface NewLandmarkData {
    name: string;
    description?: string;
    category: LandmarkCategory;
    location: Location; // User will input lat/lng for this
}

// Ensure LandmarkCategory includes all relevant types from your /lib/types/index.ts or /lib/types/landmarks.ts
const landmarkCategories: LandmarkCategory[] = [
    'safe_space', 'dangerous_spot', 'communication',
    'trusted_contact', 'medical', 'checkpoint',
    // Add other categories if they exist in your type, e.g., 'event', 'other'
];

function formatCategoryName(category: LandmarkCategory): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function AddLandmarkForm({
                                    isOpen,
                                    onOpenChange,
                                    onSubmit,
                                }: AddLandmarkFormProps) {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState<LandmarkCategory | undefined>(undefined);
    const [latitude, setLatitude] = React.useState<string>(""); // Store as string for input
    const [longitude, setLongitude] = React.useState<string>(""); // Store as string for input
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setCategory(undefined);
            setLatitude("");
            setLongitude("");
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const latNum = parseFloat(latitude);
        const lngNum = parseFloat(longitude);

        if (!name.trim()) { setError("Title/Name is required."); return; }
        if (!category) { setError("Category is required."); return; }
        if (latitude.trim() === "" || isNaN(latNum) || latNum < -90 || latNum > 90) { setError("Invalid Latitude (must be number -90 to 90)."); return; }
        if (longitude.trim() === "" || isNaN(lngNum) || lngNum < -180 || lngNum > 180) { setError("Invalid Longitude (must be number -180 to 180)."); return; }

        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
            category,
            location: { lat: latNum, lng: lngNum },
        });
        onOpenChange(false);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Report New Information</DialogTitle>
                    <DialogDescription>
                        Provide details and manually enter coordinates for the new landmark or event.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Title</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required placeholder="e.g., Roadblock, Aid Station"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select onValueChange={(value) => setCategory(value as LandmarkCategory)} value={category} required>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                                {landmarkCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{formatCategoryName(cat)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="latitude" className="text-right">Latitude</Label>
                        <Input id="latitude" type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="col-span-3" placeholder="e.g., 35.7219" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="longitude" className="text-right">Longitude</Label>
                        <Input id="longitude" type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="col-span-3" placeholder="e.g., 51.4215" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Optional details..." rows={3} />
                    </div>
                    {error && <p className="col-span-4 text-sm text-destructive text-center p-2 bg-destructive/10 rounded-md">{error}</p>}
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit">Add Information</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}