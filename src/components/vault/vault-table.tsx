"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { VaultItem } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface VaultTableProps {
  items: VaultItem[];
  onEditItem: (item: VaultItem) => void;
  onDeleteItem: (item: VaultItem) => void;
}

export function VaultTable({
  items,
  onEditItem,
  onDeleteItem,
}: VaultTableProps) {
    const { toast } = useToast();

    const handleCopyPassword = (password: string) => {
        navigator.clipboard.writeText(password);
        toast({
            title: "Password Copied",
            description: "The password has been copied to your clipboard.",
        });
    }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="hidden lg:table-cell">Last Modified</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {item.title}
                    </div>
                </TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.url}</a>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{item.lastModified}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEditItem(item)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleCopyPassword(item.password)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Password
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onDeleteItem(item)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Your vault is empty. Add an item to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
