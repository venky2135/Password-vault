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
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AddEditItemSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item?: VaultItem | null;
  onSave?: (item: VaultItem) => void; // callback to save item
}

export function AddEditItemSheet({
  isOpen,
  onOpenChange,
  item,
  onSave,
}: AddEditItemSheetProps) {
  const [title, setTitle] = useState(item?.title || "");
  const [username, setUsername] = useState(item?.username || "");
  const [password, setPassword] = useState(item?.password || "");
  const [url, setUrl] = useState(item?.url || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setTitle(item?.title || "");
    setUsername(item?.username || "");
    setPassword(item?.password || "");
    setUrl(item?.url || "");
    setNotes(item?.notes || "");
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: VaultItem = {
      id: item?.id || crypto.randomUUID(),
      title,
      username,
      password,
      url,
      notes,
      lastModified: new Date().toLocaleString(),
    };

    if (onSave) onSave(newItem);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">
            {item ? "Edit Item" : "Add New Item"}
          </SheetTitle>
          <SheetDescription>
            {item
              ? "Update the details for this item."
              : "Add a new item to your vault. All data is encrypted."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Google Account"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://website.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Save
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
