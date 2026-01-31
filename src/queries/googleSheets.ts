const GOOGLE_SHEETS_URL = `https://docs.google.com/spreadsheets/d/1Bk0d_WZjTZ2Oaw74lauO0WONHlH6Ya-O0g8NVetlp4Q/export?format=csv&gid=1346626676#gid=1346626676`

export async function fetchPublicGoogleSheet() {
  
  const response = await fetch(GOOGLE_SHEETS_URL);
  const csvText = await response.text();
  
  const rows = csvText.split('\n').map(row => 
    row.split(',').map(cell => cell.trim())
  );
  
  return rows;
}

// spreadsheetId: string, gid: string = '0'