// Utilities for encrypting/decrypting strings with AES-GCM
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Generate a random AES-GCM key
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Export key as base64
export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

// Import key from base64
export async function importKey(base64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
}

// Encrypt string
export async function encrypt(text: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );
  const buffer = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + buffer.length);
  combined.set(iv, 0);
  combined.set(buffer, iv.length);
  return btoa(String.fromCharCode(...combined));
}

// Decrypt string
export async function decrypt(data: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  return decoder.decode(decrypted);
}
