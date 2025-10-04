import VaultClient from "@/components/vault/vault-client";
import { getVaultItems } from "@/lib/data";

export default function VaultPage() {
  const vaultItems = getVaultItems();

  return <VaultClient initialItems={vaultItems} />;
}
