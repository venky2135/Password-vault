"use client";

import { useState, useEffect, useMemo } from "react";
import type { VaultItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { AddEditItemSheet } from "./add-edit-item-sheet";
import { DeleteItemDialog } from "./delete-item-dialog";
import { VaultTable } from "./vault-table";
import { generateKey, encrypt, decrypt, exportKey, importKey } from "@/lib/cryptoUtils";

const LOCAL_STORAGE_KEY = "vault-items";
const LOCAL_STORAGE_KEY_ENCRYPTION = "vault-key";

export default function VaultClient({ initialItems }: { initialItems?: VaultItem[] }) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);

  // Initialize encryption key
  useEffect(() => {
    (async () => {
      const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY_ENCRYPTION);
      if (storedKey) {
        setKey(await importKey(storedKey));
      } else {
        const newKey = await generateKey();
        localStorage.setItem(LOCAL_STORAGE_KEY_ENCRYPTION, await exportKey(newKey));
        setKey(newKey);
      }
    })();
  }, []);

  // Load and decrypt vault items
  useEffect(() => {
    if (!key) return;

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      (async () => {
        const encryptedItems: VaultItem[] = JSON.parse(stored);
        const decryptedItems = await Promise.all(
          encryptedItems.map(async (item) => ({
            ...item,
            username: await decrypt(item.username, key),
            password: await decrypt(item.password, key),
            notes: await decrypt(item.notes || "", key),
          }))
        );
        setItems(decryptedItems);
      })();
    } else if (initialItems) {
      setItems(initialItems);
    }
  }, [key, initialItems]);

  // Save and encrypt vault items
  useEffect(() => {
    if (!key) return;

    (async () => {
      const encryptedItems = await Promise.all(
        items.map(async (item) => ({
          ...item,
          username: await encrypt(item.username, key),
          password: await encrypt(item.password, key),
          notes: await encrypt(item.notes || "", key),
        }))
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(encryptedItems));
    })();
  }, [items, key]);

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

  if (!key) return <div>Loading...</div>;

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
        onSave={(newItem) => {
          setItems((prev) => {
            const index = prev.findIndex((i) => i.id === newItem.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = newItem;
              return updated;
            }
            return [...prev, newItem];
          });
        }}
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
