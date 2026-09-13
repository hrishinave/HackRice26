import { readFile } from "node:fs/promises";
import path from "node:path";

/** Resolves a track's audio to a Buffer, whether it's a data: URL or a /public-relative path. */
export async function resolveTrackBuffer(dataUrl: string): Promise<Buffer> {
  if (dataUrl.startsWith("data:")) {
    const base64 = dataUrl.split(",")[1] ?? "";
    return Buffer.from(base64, "base64");
  }
  if (dataUrl.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", dataUrl));
  }
  throw new Error("Unsupported track audio reference");
}
