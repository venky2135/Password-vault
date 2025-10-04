"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { VaultItem } from "@/lib/data";
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

interface AddEditItemSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item?: VaultItem | null;
}

export function AddEditItemSheet({
  isOpen,
  onOpenChange,
  item,
}: AddEditItemSheetProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">
            {item ? "Edit Item" : "Add New Item"}
          </SheetTitle>
          <SheetDescription>
            {item ? "Update the details for this item." : "Add a new item to your vault. All data is encrypted."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue={item?.title} placeholder="e.g. Google Account" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username / Email</Label>
            <Input id="username" defaultValue={item?.username} placeholder="name@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                defaultValue={item?.password}
                placeholder="Enter a strong password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" defaultValue={item?.url} placeholder="https://website.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" defaultValue={item?.notes} placeholder="Any additional information..." />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
