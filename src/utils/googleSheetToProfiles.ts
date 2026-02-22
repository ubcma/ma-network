// src/utils/googleSheetToProfiles.ts
import type { NetworkProfile, PastExperience, MARole } from "@/utils/networkProfileUtils";

type RowObj = Record<string, string>;

const COL = {
  timestamp: "Timestamp",
  contactType: "Contact Type",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email Address",
  currentCompany: "Current Company (Optional)",
  currentRole: "Current Role (Optional)",
  roleDesc: "Brief Description of Current Role/Responsibilities (Optional)",
  exp1:
    'Past Professional Experience #1 (Optional)\n\nPlease provide in the following format: Company;Role;Description\n\nExample:\nMicrosoft;Marketing Intern;Assisted with brand management and graphic design',
  exp2:
    'Past Professional Experience #2 (Optional)\n\nPlease provide in the following format: Company;Role;Description\n\nExample:\nMicrosoft;Marketing Intern;Assisted with brand management and graphic design',
  bio: "Professional Bio (Summary of your academic background, experience and expertise)",
  expertise: "Areas of Expertise",
  hobbies: "Ask me about... (Interests / Hobbies)",
  linkedin: "LinkedIn Profile URL",
  openToContact: "Are you open to being contacted by other network members?",
  contactNotes:
    "Contact Notes (e.g., availability on campus, specific areas you're open to discussing)",
  photo: "Profile Photo Upload (URL or file upload)",
  maPosition: "What was/is your position within MA?\nPosition, Portfolio (e.g. Director, Events)",
  year: "What year were you a part of MA?\ni.e. the year of the position you typed above."
} as const;

function sheetToObjects(data: string[][]): RowObj[] {
  if (!data?.length) return [];
  const [headers, ...rows] = data;
  const cleanHeaders = headers.map((h) => (h ?? "").trim());

  return rows
    .filter((r) => r?.some((cell) => (cell ?? "").trim() !== ""))
    .map((r) => {
      const obj: RowObj = {};
      cleanHeaders.forEach((h, i) => {
        obj[h] = (r[i] ?? "").trim();
      });
      return obj;
    });
}

function normalizeContactType(v: string): "alumni" | "exec" {
  const s = (v ?? "").toLowerCase();
  return s.startsWith("exec") ? "exec" : "alumni";
}

function parseYesNo(v: string): boolean {
  const s = (v ?? "").trim().toLowerCase();
  return s === "yes" || s === "y" || s === "true" || s === "1";
}

function parseCommaList(v: string): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseExperience(exp: string): PastExperience | null {
  const s = (exp ?? "").trim();
  if (!s) return null;

  const [company, role, ...rest] = s.split(";").map((p) => p.trim());
  if (!company || !role) return null;

  return {
    company,
    role,
    desc: rest.join(";") || "",
  };
}

function parseMaRole(raw: string): MARole | undefined {
  const s = (raw ?? "").trim();
  if (!s) return undefined;

  const parenMatch = s.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (parenMatch) {
    const position = parenMatch[1]?.trim();
    const portfolio = parenMatch[2]?.trim();
    return {
      position: position || undefined,
      portfolio: portfolio || undefined,
    };
  }

  // 2) "Position, Portfolio"
  const commaParts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (commaParts.length >= 2) {
    return {
      position: commaParts[0] || undefined,
      portfolio: commaParts.slice(1).join(", ") || undefined,
    };
  }

  // 3) "Position - Portfolio" or "Position | Portfolio"
  const sepMatch = s.match(/^(.*?)\s*(?:|\|)\s*(.*?)$/);

  if (sepMatch) {
    const position = sepMatch[1]?.trim();
    const portfolio = sepMatch[2]?.trim();
    return {
      position: position || undefined,
      portfolio: portfolio || undefined,
    };
  }

  return { position: s };
}

function makeStableId(row: RowObj) {
  const email = (row[COL.email] ?? "").trim();
  if (email) return email.toLowerCase();

  return `${row[COL.firstName]}-${row[COL.lastName]}-${row[COL.currentCompany]}`
    .toLowerCase()
    .replace(/\s+/g, "-");
}

// Optional: your Drive "open?id=..." -> direct image URL
function normalizePhotoUrl(raw: string): string | undefined {
  const s = (raw ?? "").trim();
  if (!s) return undefined;

  // already a direct image url
  if (s.includes("usercontent.googleusercontent.com")) return s;

  // transform drive open?id=FILEID -> uc?export=view&id=FILEID
  const idMatch = s.match(/[?&]id=([^&]+)/);
  if (idMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }

  return s;
}

export function googleSheetToProfiles(data: string[][]): NetworkProfile[] {
  const objects = sheetToObjects(data);

  return objects.map((row) => {

      if (objects.indexOf(row) === 0) {
    console.log("All columns in first row:", Object.keys(row));
  }

    const past_experience: PastExperience[] = [
      parseExperience(row[COL.exp1]),
      parseExperience(row[COL.exp2]),
    ].filter(Boolean) as PastExperience[];

    const hobbies = [
      ...parseCommaList(row[COL.hobbies]),
      ...parseCommaList(row[COL.expertise]),
    ];

    const rawMaPosition = row[COL.maPosition];
    const parsedMaRole = parseMaRole(rawMaPosition);

    const object = {
      id: makeStableId(row),

      first_name: row[COL.firstName] || "",
      last_name: row[COL.lastName] || "",
      contact_type: normalizeContactType(row[COL.contactType]),

      current_company: row[COL.currentCompany] || "",
      current_role: row[COL.currentRole] || "",
      current_role_desc: row[COL.roleDesc] || "",

      past_experience,

      bio: row[COL.bio] || "",
      hobbies,

      linkedin_url: row[COL.linkedin] || "",
      email: row[COL.email] || "",

      open_to_contact: parseYesNo(row[COL.openToContact]),
      contact_notes: row[COL.contactNotes] || "",

      profile_photo_url: normalizePhotoUrl(row[COL.photo]),
      created_at: row[COL.timestamp] || new Date().toISOString(),

      ma_role: parsedMaRole,
      year: row[COL.year] || "",
    };

    return object;
  });
}
