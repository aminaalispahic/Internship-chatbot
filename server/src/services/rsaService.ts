import crypto from "crypto";
import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(path.join(process.cwd(), "keys/private.pem"), "utf8");
const publicKey = fs.readFileSync(path.join(process.cwd(), "keys/public.pem"), "utf8");

export function getPublicKey(): string {
  return publicKey;
}

export function decryptRSA(encryptedBase64: string): string {
  const buffer = Buffer.from(encryptedBase64, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );
  return decrypted.toString("utf8");
}