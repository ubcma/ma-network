export interface PastExperience {
  company: string;
  role: string;
  desc: string;
}

export interface MARole {
  position?: string;     
  portfolio?: string;
}

export interface NetworkProfile {
  id: string;
  first_name: string;
  last_name: string;
  contact_type: "alumni" | "exec";

  current_company: string;
  current_role: string;
  current_role_desc: string;

  past_experience: PastExperience[];

  bio: string;
  hobbies: string[];

  linkedin_url: string;
  email: string;

  open_to_contact: boolean;
  contact_notes: string;
  profile_photo_url?: string;

  created_at: string;

  ma_role?: MARole; 
  year: string;
}
