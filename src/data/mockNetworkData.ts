import type { NetworkProfile } from "@/utils/networkProfileUtils";

// Helper function to get all unique companies
export const getAllCompanies = (data: NetworkProfile[]): string[] => {
  const companies = new Set<string>();
  data.forEach(profile => {
    companies.add(profile.current_company);
    profile.past_experience.forEach(exp => companies.add(exp.company));
  });
  return Array.from(companies).sort();
};

// Helper function to get all unique roles
export const getAllRoles = (data: NetworkProfile[]): string[] => {
  const roles = new Set<string>();
  data.forEach(profile => {
    roles.add(profile.current_role);
    profile.past_experience.forEach(exp => roles.add(exp.role));
  });
  return Array.from(roles).sort();
};

// Helper function to get all unique hobbies/topics
export const getAllTopics = (data: NetworkProfile[]): string[] => {
  const topics = new Set<string>();
  data.forEach(profile => {
    profile.hobbies.forEach(hobby => topics.add(hobby));
  });
  return Array.from(topics).sort();
};
