import PocketBase from 'pocketbase';

export const PB_URL: string = (import.meta.env.PUBLIC_PB_URL || 'http://127.0.0.1:8090').replace(/\/$/, '');

let client: PocketBase | undefined;

/** Shared PocketBase client (browser islands and build-time loaders). */
export function pb(): PocketBase {
  client ??= new PocketBase(PB_URL);
  client.autoCancellation(false);
  return client;
}

/** Public URL of a file stored on a PocketBase record. Optional `thumb` like "800x0". */
export function pbFileUrl(collectionId: string, recordId: string, filename: string, thumb?: string): string {
  const base = `${PB_URL}/api/files/${collectionId}/${recordId}/${encodeURIComponent(filename)}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
}
