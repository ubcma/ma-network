export interface PastExperience {
  company: string;
  role: string;
  desc: string;
}

export interface NetworkProfile {
  id: string;
  firstName: string;
  lastName: string;
  contactType: "alumni" | "exec";

  currentCompany?: string;
  currentRole?: string;
  currentRoleDesc?: string;

  pastExperience: PastExperience[];

  bio?: string;
  hobbies: string[];

  linkedinUrl?: string;
  email?: string;
  openToContact: boolean;

  profilePhotoUrl?: string;
  createdAt: string;
}