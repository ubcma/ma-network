import Papa from "papaparse";

/**
 * Use the CSV export link (public sheet).
 * Prefer keeping this in an env var so you can swap sheets without code changes.
 */
const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/1Bk0d_WZjTZ2Oaw74lauO0WONHlH6Ya-O0g8NVetlp4Q/export?format=csv&gid=1346626676";

export async function fetchPublicGoogleSheet(): Promise<string[][]> {
  const response = await fetch(GOOGLE_SHEETS_URL, {
    // helps avoid stale caching during dev
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet CSV (${response.status})`);
  }

  const csvText = await response.text();

  const parsed = Papa.parse<string[]>(csvText, {
    skipEmptyLines: true,
  });

  if (parsed.errors?.length) {
    // surface first error for debugging
    throw new Error(`CSV parse error: ${parsed.errors[0].message}`);
  }

  // Papa returns (string | undefined) sometimes; normalize to string
  const rows = (parsed.data ?? []).map((row) => row.map((c) => (c ?? "").trim()));
  return rows;
}
