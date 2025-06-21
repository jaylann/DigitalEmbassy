// src/components/add-landmark-form.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LandmarkCategory, Location } from "@/types/landmarks"; // Adjust path if your types are elsewhere

// Props that the form component will receive
interface AddLandmarkFormProps {
    isOpen: boolean; // To control if the dialog is open
    onOpenChange: (open: boolean) => void; // Callback to change the open state
    onSubmit: (data: NewLandmarkData) => void; // Callback when form is submitted
    clickedCoordinates: Location | null; // Coordinates where user clicked on map
}

// Shape of the data the form will submit
export interface NewLandmarkData {
    name: string;
    description?: string;
    category: LandmarkCategory;
    location: Location; // This will be the clickedCoordinates
}

// Define the available categories for the select dropdown
// These should match your LandmarkCategory type from landmark.ts
const landmarkCategories: LandmarkCategory[] = [
    'safe_space',
    'danger_zone',
    'satellite_phone',
    'trusted_contact',
    'medical',
    'checkpoint',
];

// Helper function to format category names for display
function formatCategoryName(category: LandmarkCategory): string {
    return category
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}

export function AddLandmarkForm({
                                    isOpen,
                                    onOpenChange,
                                    onSubmit,
                                    clickedCoordinates,
                                }: AddLandmarkFormProps) {
    // State for form fields
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState<LandmarkCategory | undefined>(undefined);
    const [error, setError] = React.useState<string | null>(null);

    // Effect to reset form fields when the dialog is opened or coordinates change
    React.useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setCategory(undefined);
            setError(null);
        }
    }, [isOpen, clickedCoordinates]); // Reset if dialog re-opens for new coordinates

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setError(null); // Clear previous errors

        // Basic validation
        if (!name.trim()) {
            setError("Title/Name is required.");
            return;
        }
        if (!category) {
            setError("Category is required.");
            return;
        }
        if (!clickedCoordinates) {
            // This should ideally not happen if the form is only shown when coordinates are set
            setError("Location not set. Please click on the map again.");
            return;
        }

        // Call the onSubmit prop with the collected data
        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined, // Send undefined if empty
            category,
            location: clickedCoordinates,
        });

        onOpenChange(false); // Signal to the parent to close the dialog
    };

    // Don't render the form content if there are no coordinates (dialog might still be managed by parent's isOpen)
    // Or, the parent should not set isOpen to true if clickedCoordinates is null.
    // For robustness, let's ensure dialog content makes sense only if coordinates exist.
    if (!isOpen) { // If parent controls isOpen, just return null if not open
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Report New Information</DialogTitle>
                    {clickedCoordinates && ( // Only show description if coordinates are available
                        <DialogDescription>
                            Provide details for the event or landmark at the selected location:
                            <br />
                            Lat: {clickedCoordinates.lat.toFixed(5)}, Lng: {clickedCoordinates.lng.toFixed(5)}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {clickedCoordinates ? ( // Only render form if coordinates are set
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Title/Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Roadblock, Aid Station"
                                required // HTML5 required attribute
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                onValueChange={(value) => setCategory(value as LandmarkCategory)}
                                value={category}
                                required // HTML5 required attribute
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {landmarkCategories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {formatCategoryName(cat)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                placeholder="Optional: Add more details about the event or place..."
                                rows={3}
                            />
                        </div>

                        {error && (
                            <p className="col-span-4 text-sm text-destructive text-center p-2 bg-destructive/10 rounded-md">
                                {error}
                            </p>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Add Information</Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="py-4 text-center text-muted-foreground">
                        Please select a location on the map first.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}