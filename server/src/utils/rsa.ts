import forge from "node-forge";

let cachedPublicKey: string | null = null;

async function fetchPublicKey(): Promise<string> {
  if (cachedPublicKey) return cachedPublicKey;
  const res = await fetch("/api/auth/public-key");
  const data = await res.json();
  cachedPublicKey = data.publicKey;
  return cachedPublicKey!;
}

export async function encryptRSA(plaintext: string): Promise<string> {
  const pem = await fetchPublicKey();
  const publicKey = forge.pki.publicKeyFromPem(pem);
  const encrypted = publicKey.encrypt(
    forge.util.encodeUtf8(plaintext),
    "RSA-OAEP",
    { md: forge.md.sha256.create() }
  );
  return forge.util.encode64(encrypted);
}