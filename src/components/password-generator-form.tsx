"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, RefreshCw } from "lucide-react";

export function PasswordGeneratorForm() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    if (!charset) {
      setPassword("");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [length, options, generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Password Copied!",
      description: "Copied to clipboard. It will be cleared in 20 seconds.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <Input
          type="text"
          value={password}
          readOnly
          className="h-14 pr-24 text-lg font-code bg-secondary"
          placeholder="Generate a password"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button variant="ghost" size="icon" onClick={generatePassword}>
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="length">Password Length</Label>
            <span className="font-bold text-lg text-primary">{length}</span>
          </div>
          <Slider
            id="length"
            min={8}
            max={64}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={options.uppercase}
              onCheckedChange={(checked) =>
                setOptions({ ...options, uppercase: !!checked })
              }
            />
            <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={options.lowercase}
              onCheckedChange={(checked) =>
                setOptions({ ...options, lowercase: !!checked })
              }
            />
            <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={options.numbers}
              onCheckedChange={(checked) =>
                setOptions({ ...options, numbers: !!checked })
              }
            />
            <Label htmlFor="numbers">Numbers (0-9)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={options.symbols}
              onCheckedChange={(checked) =>
                setOptions({ ...options, symbols: !!checked })
              }
            />
            <Label htmlFor="symbols">Symbols (!@#$%...)</Label>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="excludeSimilar">Exclude Similar Characters</Label>
                <p className="text-xs text-muted-foreground">e.g. i, l, 1, O, 0</p>
            </div>
            <Switch
              id="excludeSimilar"
              checked={options.excludeSimilar}
              onCheckedChange={(checked) =>
                setOptions({ ...options, excludeSimilar: checked })
              }
            />
        </div>
      </div>
    </div>
  );
}
