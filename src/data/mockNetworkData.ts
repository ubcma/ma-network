export interface PastExperience {
  company: string;
  role: string;
  desc: string;
}


export interface NetworkProfile {
  id: string;
  first_name: string;
  last_name: string;
  contact_type: 'alumni' | 'exec';
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
}

export const mockProfiles: NetworkProfile[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Chen',
    contact_type: 'alumni',
    current_company: 'Google',
    current_role: 'Senior Product Manager',
    current_role_desc: 'Leading AI/ML products for Google Cloud',
    past_experience: [
      {
        company: 'Microsoft',
        role: 'Product Manager',
        desc: 'Worked on Azure ML services'
      },
      {
        company: 'Amazon',
        role: 'Associate PM',
        desc: 'Alexa product development'
      }
    ],
    bio: 'Passionate about AI/ML products and mentoring aspiring PMs',
    hobbies: ['hiking', 'photography', 'tech blogging'],
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    email: 'sarah.chen@gmail.com',
    open_to_contact: true,
    contact_notes: 'Happy to chat about PM career paths, AI/ML, or coffee chats. Prefer LinkedIn messages.',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    first_name: 'Marcus',
    last_name: 'Johnson',
    contact_type: 'exec',
    current_company: 'Meta',
    current_role: 'Engineering Manager',
    current_role_desc: 'Leading infrastructure team for Instagram',
    past_experience: [
      {
        company: 'Stripe',
        role: 'Senior Software Engineer',
        desc: 'Built payment processing systems'
      },
      {
        company: 'Uber',
        role: 'Software Engineer',
        desc: 'Real-time matching algorithms'
      }
    ],
    bio: 'Former club president, now leading engineering teams at scale',
    hobbies: ['basketball', 'mentorship', 'open source'],
    linkedin_url: 'https://linkedin.com/in/marcusjohnson',
    email: 'marcus.j@meta.com',
    open_to_contact: true,
    contact_notes: 'Open to discussing engineering leadership, technical interviews, and startup advice.',
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: '3',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    contact_type: 'alumni',
    current_company: 'McKinsey & Company',
    current_role: 'Management Consultant',
    current_role_desc: 'Strategy consulting for tech and healthcare clients',
    past_experience: [
      {
        company: 'Boston Consulting Group',
        role: 'Associate Consultant',
        desc: 'Digital transformation projects'
      }
    ],
    bio: 'Helping companies navigate digital transformation',
    hobbies: ['traveling', 'yoga', 'cooking'],
    linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
    email: 'emily.rodriguez@mckinsey.com',
    open_to_contact: true,
    contact_notes: 'Happy to discuss consulting careers, case prep, and work-life balance.',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '4',
    first_name: 'David',
    last_name: 'Kim',
    contact_type: 'exec',
    current_company: 'Tesla',
    current_role: 'Data Scientist',
    current_role_desc: 'Autonomous driving ML models',
    past_experience: [
      {
        company: 'Waymo',
        role: 'ML Engineer',
        desc: 'Computer vision for self-driving'
      }
    ],
    bio: 'Building the future of transportation with ML',
    hobbies: ['robotics', 'chess', 'cycling'],
    linkedin_url: 'https://linkedin.com/in/davidkim',
    email: 'david.kim@tesla.com',
    open_to_contact: true,
    contact_notes: 'Open to ML/AI discussions, autonomous vehicles, and grad school advice.',
    created_at: '2024-02-10T10:00:00Z'
  },
  {
    id: '5',
    first_name: 'Priya',
    last_name: 'Patel',
    contact_type: 'alumni',
    current_company: 'Goldman Sachs',
    current_role: 'Investment Banking Analyst',
    current_role_desc: 'Tech M&A advisory',
    past_experience: [
      {
        company: 'Morgan Stanley',
        role: 'Summer Analyst',
        desc: 'TMT investment banking'
      }
    ],
    bio: 'Navigating the intersection of tech and finance',
    hobbies: ['finance podcasts', 'running', 'networking'],
    linkedin_url: 'https://linkedin.com/in/priyapatel',
    email: 'priya.patel@gs.com',
    open_to_contact: true,
    contact_notes: 'Can help with IB recruiting, finance interviews, and career transitions.',
    created_at: '2024-01-25T10:00:00Z'
  },
  {
    id: '6',
    first_name: 'Alex',
    last_name: 'Thompson',
    contact_type: 'exec',
    current_company: 'Airbnb',
    current_role: 'UX Designer',
    current_role_desc: 'Designing host experience flows',
    past_experience: [
      {
        company: 'Figma',
        role: 'Product Designer',
        desc: 'Design tools and collaboration features'
      },
      {
        company: 'Adobe',
        role: 'Junior Designer',
        desc: 'Creative Cloud products'
      }
    ],
    bio: 'Crafting delightful user experiences',
    hobbies: ['illustration', 'typography', 'photography'],
    linkedin_url: 'https://linkedin.com/in/alexthompson',
    email: 'alex.t@airbnb.com',
    open_to_contact: true,
    contact_notes: 'Love talking about UX/UI, portfolio reviews, and design thinking.',
    created_at: '2024-02-05T10:00:00Z'
  },
  {
    id: '7',
    first_name: 'Jordan',
    last_name: 'Lee',
    contact_type: 'alumni',
    current_company: 'Apple',
    current_role: 'Marketing Manager',
    current_role_desc: 'Product marketing for Apple Watch',
    past_experience: [
      {
        company: 'Nike',
        role: 'Brand Manager',
        desc: 'Digital marketing campaigns'
      },
      {
        company: 'Procter & Gamble',
        role: 'Associate Brand Manager',
        desc: 'Consumer insights and strategy'
      }
    ],
    bio: 'Building brands that customers love',
    hobbies: ['marathons', 'content creation', 'fitness tech'],
    linkedin_url: 'https://linkedin.com/in/jordanlee',
    email: 'jordan.lee@apple.com',
    open_to_contact: true,
    contact_notes: 'Open to discussing marketing strategy, brand building, and consumer tech.',
    created_at: '2024-01-30T10:00:00Z'
  },
  {
    id: '8',
    first_name: 'Sophia',
    last_name: 'Martinez',
    contact_type: 'exec',
    current_company: 'Salesforce',
    current_role: 'Solutions Architect',
    current_role_desc: 'Enterprise cloud solutions',
    past_experience: [
      {
        company: 'Oracle',
        role: 'Technical Consultant',
        desc: 'Database and cloud migration'
      }
    ],
    bio: 'Helping enterprises modernize with cloud technology',
    hobbies: ['tech conferences', 'mentoring', 'salsa dancing'],
    linkedin_url: 'https://linkedin.com/in/sophiamartinez',
    email: 'sophia.m@salesforce.com',
    open_to_contact: true,
    contact_notes: 'Happy to discuss cloud architecture, enterprise sales, and tech career paths.',
    created_at: '2024-02-15T10:00:00Z'
  },
  {
    id: '9',
    first_name: 'Ryan',
    last_name: 'O\'Brien',
    contact_type: 'alumni',
    current_company: 'SpaceX',
    current_role: 'Aerospace Engineer',
    current_role_desc: 'Starship propulsion systems',
    past_experience: [
      {
        company: 'Blue Origin',
        role: 'Propulsion Engineer',
        desc: 'Rocket engine development'
      },
      {
        company: 'Boeing',
        role: 'Systems Engineer',
        desc: 'Aircraft systems integration'
      }
    ],
    bio: 'Making life multiplanetary, one rocket at a time',
    hobbies: ['astronomy', 'model rockets', 'sci-fi'],
    linkedin_url: 'https://linkedin.com/in/ryanobrien',
    email: 'ryan.obrien@spacex.com',
    open_to_contact: true,
    contact_notes: 'Open to aerospace engineering questions, working at SpaceX, and technical discussions.',
    created_at: '2024-01-18T10:00:00Z'
  },
  {
    id: '10',
    first_name: 'Maya',
    last_name: 'Williams',
    contact_type: 'exec',
    current_company: 'Netflix',
    current_role: 'Content Strategy Analyst',
    current_role_desc: 'Analyzing viewer data to guide content decisions',
    past_experience: [
      {
        company: 'Hulu',
        role: 'Data Analyst',
        desc: 'Streaming analytics'
      }
    ],
    bio: 'Using data to tell better stories',
    hobbies: ['film analysis', 'data viz', 'international cinema'],
    linkedin_url: 'https://linkedin.com/in/mayawilliams',
    email: 'maya.w@netflix.com',
    open_to_contact: true,
    contact_notes: 'Love chatting about media analytics, entertainment industry, and data storytelling.',
    created_at: '2024-02-08T10:00:00Z'
  },
  {
    id: '11',
    first_name: 'Kevin',
    last_name: 'Zhang',
    contact_type: 'alumni',
    current_company: 'Stripe',
    current_role: 'Staff Engineer',
    current_role_desc: 'Building global payment infrastructure',
    past_experience: [
      {
        company: 'Square',
        role: 'Senior Engineer',
        desc: 'Point-of-sale systems'
      },
      {
        company: 'PayPal',
        role: 'Software Engineer',
        desc: 'Fraud detection systems'
      }
    ],
    bio: 'Building the economic infrastructure of the internet',
    hobbies: ['distributed systems', 'piano', 'cooking'],
    linkedin_url: 'https://linkedin.com/in/kevinzhang',
    email: 'kevin.zhang@stripe.com',
    open_to_contact: true,
    contact_notes: 'Happy to discuss system design, fintech, and engineering career growth.',
    created_at: '2024-01-22T10:00:00Z'
  },
  {
    id: '12',
    first_name: 'Lisa',
    last_name: 'Nguyen',
    contact_type: 'exec',
    current_company: 'Amazon',
    current_role: 'Product Marketing Manager',
    current_role_desc: 'Go-to-market strategy for AWS',
    past_experience: [
      {
        company: 'Google Cloud',
        role: 'Marketing Manager',
        desc: 'Cloud product launches'
      }
    ],
    bio: 'Bringing cloud products to market',
    hobbies: ['travel blogging', 'photography', 'product launches'],
    linkedin_url: 'https://linkedin.com/in/lisanguyen',
    email: 'lisa.nguyen@amazon.com',
    open_to_contact: true,
    contact_notes: 'Open to discussing product marketing, AWS, and go-to-market strategies.',
    created_at: '2024-02-12T10:00:00Z'
  }
];

// Helper function to get all unique companies
export const getAllCompanies = (): string[] => {
  const companies = new Set<string>();
  mockProfiles.forEach(profile => {
    companies.add(profile.current_company);
    profile.past_experience.forEach(exp => companies.add(exp.company));
  });
  return Array.from(companies).sort();
};

// Helper function to get all unique roles
export const getAllRoles = (): string[] => {
  const roles = new Set<string>();
  mockProfiles.forEach(profile => {
    roles.add(profile.current_role);
    profile.past_experience.forEach(exp => roles.add(exp.role));
  });
  return Array.from(roles).sort();
};

// Helper function to get all unique hobbies/topics
export const getAllTopics = (): string[] => {
  const topics = new Set<string>();
  mockProfiles.forEach(profile => {
    profile.hobbies.forEach(hobby => topics.add(hobby));
  });
  return Array.from(topics).sort();
};
