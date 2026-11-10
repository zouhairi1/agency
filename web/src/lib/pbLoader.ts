import type { Loader } from 'astro/loaders';
import PocketBase, { type RecordModel } from 'pocketbase';
import { PB_URL, pbFileUrl } from './pocketbase';

interface PbLoaderOptions {
  /** PocketBase collection name. */
  collection: string;
  /** PocketBase filter, e.g. `published = true`. Public API rules are applied as well. */
  filter?: string;
  sort?: string;
  expand?: string;
  /** Field used as the Astro entry id (defaults to `slug` when present, otherwise the record id). */
  idField?: string;
  /** File fields to convert from filenames to absolute URLs. */
  fileFields?: string[];
}

const SYSTEM_KEYS = ['collectionId', 'collectionName', 'expand'];

/**
 * Astro Content Layer loader that pulls a PocketBase collection at build time.
 *
 * - File fields become absolute URLs.
 * - The record's `updated` timestamp is used as the digest, so unchanged entries are skipped.
 * - If PocketBase is unreachable, the build fails in CI (so we never deploy an empty site)
 *   and only warns locally (so the site still runs with fallback content).
 */
export function pbLoader(options: PbLoaderOptions): Loader {
  const { collection, filter, sort = '-created', expand, fileFields = [] } = options;

  return {
    name: `pocketbase:${collection}`,
    load: async ({ store, logger, parseData, generateDigest }) => {
      const client = new PocketBase(PB_URL);
      client.autoCancellation(false);

      let records: RecordModel[];
      try {
        records = await client.collection(collection).getFullList({ filter, sort, expand, batch: 200 });
      } catch (error) {
        const message = `Could not load "${collection}" from PocketBase at ${PB_URL}: ${(error as Error).message}`;
        if (process.env.CI) throw new Error(message);
        logger.warn(`${message}. Using fallback content.`);
        return;
      }

      store.clear();

      for (const record of records) {
        const data: Record<string, unknown> = { ...record };
        for (const key of SYSTEM_KEYS) delete data[key];
        if (record.expand) data.expand = record.expand;

        for (const field of fileFields) {
          const value = record[field];
          if (Array.isArray(value)) {
            data[field] = value.map((file: string) => pbFileUrl(record.collectionId, record.id, file));
          } else if (typeof value === 'string' && value) {
            data[field] = pbFileUrl(record.collectionId, record.id, value);
          } else {
            data[field] = undefined;
          }
        }

        const idField = options.idField ?? (typeof record.slug === 'string' && record.slug ? 'slug' : 'id');
        const id = String(record[idField]);
        const parsed = await parseData({ id, data });
        store.set({ id, data: parsed, digest: generateDigest(String(record.updated ?? JSON.stringify(record))) });
      }

      logger.info(`Loaded ${records.length} ${collection}`);
    },
  };
}
