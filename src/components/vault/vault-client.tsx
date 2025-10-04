"use client";

import { useState, useMemo } from "react";
import type { VaultItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { AddEditItemSheet } from "./add-edit-item-sheet";
import { DeleteItemDialog } from "./delete-item-dialog";
import { VaultTable } from "./vault-table";

export default function VaultClient({ initialItems }: { initialItems: VaultItem[] }) {
  const [items, setItems] = useState<VaultItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsSheetOpen(true);
  };

  const handleEditItem = (item: VaultItem) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  const handleDeleteItem = (item: VaultItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setItems(items.filter((i) => i.id !== selectedItem.id));
    }
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vault..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddItem} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <VaultTable
        items={filteredItems}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />

      <AddEditItemSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        item={selectedItem}
      />

      <DeleteItemDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmDelete}
        item={selectedItem}
      />
    </div>
  );
}
