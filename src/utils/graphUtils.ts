import { type NetworkProfile } from './networkProfileUtils';

export interface GraphNode {
  id: string;
  name: string;
  type: 'person' | 'company';
  profile?: NetworkProfile;
  company?: string;
  color?: string;
  val?: number;
  photo?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'current' | 'past';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const generateGraphData = (profiles: NetworkProfile[]): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const companyNodes = new Set<string>();

  // Add person nodes
  profiles.forEach(profile => {
    const id = new URLSearchParams(new URL(profile.profile_photo_url ?? "", window.location.href).search).get("id");
    const photoUrl = `https://drive.google.com/thumbnail?id=${id}`;

    nodes.push({
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      type: 'person',
      profile: profile,
      company: profile.current_company,
      color: profile.contact_type === 'alumni' ? '#e11d48' : '#374151',
      val: 8,
      photo: photoUrl
    });

    // Track companies
    companyNodes.add(profile.current_company);
    profile.past_experience.forEach(exp => companyNodes.add(exp.company));
  });

  // Add links for current positions
  profiles.forEach(profile => {
    links.push({
      source: profile.id,
      target: `company-${profile.current_company}`,
      type: 'current'
    });

    // Add links for past experience
    profile.past_experience.forEach(exp => {
      links.push({
        source: profile.id,
        target: `company-${exp.company}`,
        type: 'past'
      });
    });
  });

  return { nodes, links };
};

// Search function
export const searchProfiles = (
  profiles: NetworkProfile[],
  searchTerm: string,
  filterCompany: string,
  filterRole: string,
  filterTopic: string,
  filterContactType: string
): NetworkProfile[] => {
  return profiles.filter(profile => {
    // Search term filter (name, company, role, bio)
    const matchesSearch = !searchTerm || 
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.current_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.past_experience.some(exp => 
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Company filter
    const matchesCompany = !filterCompany || 
      profile.current_company === filterCompany ||
      profile.past_experience.some(exp => exp.company === filterCompany);

    // Role filter
    const matchesRole = !filterRole ||
      profile.current_role === filterRole ||
      profile.past_experience.some(exp => exp.role === filterRole);

    // Topic filter (hobbies)
    const matchesTopic = !filterTopic ||
      profile.hobbies.includes(filterTopic);

    // Contact type filter
    const matchesContactType = !filterContactType ||
      profile.contact_type === filterContactType;

    return matchesSearch && matchesCompany && matchesRole && matchesTopic && matchesContactType;
  });
};
