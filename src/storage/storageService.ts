import {
  writeTextFile,
  readTextFile,
  readDir,
  remove,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";
import { documentDir, join } from "@tauri-apps/api/path";
import { serializeDocument, deserializeDocument } from "./bloomFile";
import type { BloomDocument } from "./bloomFile";

const STORAGE_FOLDER = "Bloom";

async function storagePath(): Promise<string> {
  const docDir = await documentDir();
  return join(docDir, STORAGE_FOLDER);
}

async function ensureStorageDir(): Promise<void> {
  const dir = await storagePath();
  const dirExists = await exists(dir);
  if (!dirExists) {
    await mkdir(dir, { recursive: true });
  }
}

export async function saveDocument(
  id: string,
  doc: BloomDocument,
): Promise<void> {
  await ensureStorageDir();
  const dir = await storagePath();
  const filePath = await join(dir, `${id}.bloom`);
  const contents = serializeDocument(doc);
  await writeTextFile(filePath, contents);
}

export async function loadDocument(filePath: string): Promise<BloomDocument> {
  const contents = await readTextFile(filePath);
  return deserializeDocument(contents);
}

export interface DocumentMeta {
  id: string;
  fileName: string;
  path: string;
}

export async function deleteDocument(id: string): Promise<void> {
  const dir = await storagePath();
  const filePath = await join(dir, `${id}.bloom`);
  await remove(filePath);
}

export async function listDocuments(): Promise<DocumentMeta[]> {
  const dir = await storagePath();
  const dirExists = await exists(dir);
  if (!dirExists) {
    return [];
  }
  const entries = await readDir(dir);
  const bloomFiles = entries.filter((entry) => entry.name?.endsWith(".bloom"));
  const results: DocumentMeta[] = [];
  for (const entry of bloomFiles) {
    results.push({
      id: entry.name!.replace(".bloom", ""),
      fileName: entry.name!,
      path: await join(dir, entry.name!),
    });
  }
  return results;
}
