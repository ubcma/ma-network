import { type MARole, type NetworkProfile, type PastExperience } from './networkProfileUtils';

export interface GraphNode {
  id: string;
  name: string;
  type: 'person' | 'portfolio';
  profile?: NetworkProfile;
  company?: string;
  past_experience: PastExperience[];
  color?: string;
  val?: number;
  photo?: string;
  ma_role?: MARole;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const generateGraphData = (profiles: NetworkProfile[]): GraphData => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const portfolioNodes = new Set<string>();

  profiles.forEach(profile => {
    const id = new URLSearchParams(
      new URL(profile.profile_photo_url ?? "", window.location.href).search
    ).get("id");
    const photoUrl = `https://drive.google.com/thumbnail?id=${id}`;

    nodes.push({
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      type: 'person',
      profile: profile,
      company: profile.current_company,
      past_experience: profile.past_experience,
      color: profile.contact_type === 'alumni' ? '#e11d48' : '#51373b',
      val: 8,
      photo: photoUrl,
      ma_role: profile.ma_role
    });

    if (profile.ma_role?.portfolio) {
      portfolioNodes.add(profile.ma_role.portfolio);
    }
  });

  portfolioNodes.forEach(portfolio => {
    nodes.push({
      id: `portfolio-${portfolio}`,
      name: portfolio,
      type: 'portfolio',
      past_experience: [],
      color: '#f63b60',
      val: 12
    });
  });

  profiles.forEach(profile => {
    if (profile.ma_role?.portfolio) {
      edges.push({
        id: `${profile.id}-${profile.ma_role.portfolio}`,
        source: profile.id,
        target: `portfolio-${profile.ma_role.portfolio}`,
        type: 'current'
      });
    }
  });

  return { nodes, edges };
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
