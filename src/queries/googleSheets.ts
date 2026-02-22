import Papa from "papaparse";


export async function fetchPublicGoogleSheet(): Promise<string[][]> {
  const sheetUrl = 
  import.meta.env?.VITE_GOOGLE_SHEETS_URL;
  const response = await fetch(sheetUrl, {
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

    throw new Error(`CSV parse error: ${parsed.errors[0].message}`);
  }


  const rows = (parsed.data ?? []).map((row) => row.map((c) => (c ?? "").trim()));

  return rows;
}
