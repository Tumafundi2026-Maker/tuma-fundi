import { Fundi, SubscriptionPlan, Job, Category, LocationSuggestion } from './types';

export const FUNDI_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'basic', name: 'Starter', price: 300, leadsAccess: '5 leads/mo', visibility: 'Standard', bidsCount: 10, verificationStatus: 'Basic', priorityRanking: 'Standard' },
  { id: 'standard', name: 'Standard', price: 500, leadsAccess: '20 leads/mo', visibility: 'Enhanced', bidsCount: 50, verificationStatus: 'Verified', priorityRanking: 'High' },
  { id: 'premium', name: 'Premium', price: 1000, leadsAccess: 'Unlimited', visibility: 'Featured', bidsCount: 500, verificationStatus: 'Priority', priorityRanking: 'Top' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Expert water and drainage solutions for your home and office.',
    subServices: [
      { id: 'p1', name: 'Kitchen Leak Repair', description: 'Fixing faucets, pipes and under-sink leaks.' },
      { id: 'p2', name: 'Toilet Installation', description: 'New toilet setup or repair of existing ones.' },
      { id: 'p3', name: 'Borehole Maintenance', description: 'Deep well pump service and water quality checks.' },
      { id: 'p4', name: 'Drain Unblocking', description: 'Fast clearing of clogged sinks and sewer lines.' }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Certified electricians for safe wiring and appliance repairs.',
    subServices: [
      { id: 'e1', name: 'Full House Wiring', description: 'Complete electrical setup for new buildings.' },
      { id: 'e2', name: 'Appliance Repair', description: 'Fixing fridges, ovens, and washing machines.' },
      { id: 'e3', name: 'Solar Installation', description: 'Go green with solar panel and battery setup.' },
      { id: 'e4', name: 'CCTV Setup', description: 'Security camera installation and networking.' }
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Professional cleaning for a sparkling clean environment.',
    subServices: [
      { id: 'c1', name: 'Residential Cleaning', description: 'Deep clean for your apartment or house.' },
      { id: 'c2', name: 'Sofa & Carpet Cleaning', description: 'Steam cleaning for upholstery and rugs.' },
      { id: 'c3', name: 'Post-Construction', description: 'Cleaning up dust and debris after building.' },
      { id: 'c4', name: 'Office Maintenance', description: 'Regular janitorial services for businesses.' }
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Build your dream project with verified masonry and tiling.',
    subServices: [
      { id: 'con1', name: 'Masonry Work', description: 'Bricklaying, foundation and wall building.' },
      { id: 'con2', name: 'Tiling & Flooring', description: 'Precision ceramic, wood or marble tiling.' },
      { id: 'con3', name: 'Painting & Finishing', description: 'Interior and exterior premium wall coatings.' },
      { id: 'con4', name: 'Roofing Repairs', description: 'Fixing leaks or full roof replacement.' }
    ]
  },
  {
    id: 'automotive',
    name: 'Auto Mechanic',
    description: 'Trusted mechanics for vehicle repair and maintenance.',
    subServices: [
      { id: 'a1', name: 'Engine Diagnostics', description: 'Full computer scan and engine health check.' },
      { id: 'a2', name: 'Brake & Suspension', description: 'Safety checks and parts replacement.' },
      { id: 'a3', name: 'Car Towing', description: '24/7 breakdown recovery and towing.' },
      { id: 'a4', name: 'Routine Service', description: 'Oil change, filters and general checkup.' }
    ]
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'Garden maintenance, lawn care, and landscaping services.',
    subServices: [
      { id: 'l1', name: 'Lawn Mowing', description: 'Professional grass cutting and edging.' },
      { id: 'l2', name: 'Garden Design', description: 'Landscape planning and plant selection.' }
    ]
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services.',
    subServices: [
      { id: 'h1', name: 'AC Repair', description: 'Fixing air conditioning units.' },
      { id: 'h2', name: 'Ventilation', description: 'Installation and repair of vents.' }
    ]
  },
  {
    id: 'roofing',
    name: 'Roofing',
    description: 'Roof repairs, installations, and maintenance.',
    subServices: [
      { id: 'r1', name: 'Leak Repair', description: 'Finding and fixing roof leaks.' },
      { id: 'r2', name: 'Roof Installation', description: 'Complete new roof setup.' }
    ]
  },
];

export const KENYAN_LOCATIONS: LocationSuggestion[] = [
  { county: 'Nairobi', town: 'Westlands', estate: 'Parklands' },
  { county: 'Nairobi', town: 'Kilimani', estate: 'Hurlingham' },
  { county: 'Nairobi', town: 'Lavington', estate: 'Kileleshwa' },
  { county: 'Nairobi', town: 'Langata', estate: 'Karen' },
  { county: 'Nairobi', town: 'Embakasi', estate: 'South B' },
  { county: 'Mombasa', town: 'Nyali', estate: 'Cinemax' },
  { county: 'Mombasa', town: 'Bamburi', estate: 'Mtambo' },
  { county: 'Kisumu', town: 'Milimani', estate: 'Tom Mboya' },
  { county: 'Kiambu', town: 'Thika', estate: 'Section 9' },
  { county: 'Kiambu', town: 'Ruiru', estate: 'Membley' },
  { county: 'Nakuru', town: 'Milimani', estate: 'Naka' },
  { county: 'Uasin Gishu', town: 'Eldoret', estate: 'Elgon View' }
];

export const INITIAL_FUNDIS: Fundi[] = [
  {
    id: 'f1',
    name: 'John Kamau',
    phone: '0712345678',
    role: 'fundi',
    location: 'Westlands, Nairobi',
    registered: true,
    registrationFeePaid: true,
    registrationDate: '2023-01-15T00:00:00Z',
    subscriptionTier: 'premium',
    walletBalance: 12500,
    skills: ['Plumbing', 'Drainage'],
    rating: 4.8,
    jobsCompleted: 156,
    isVerified: true,
    isAvailable: true,
    badge: 'top-rated',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f19913a3-93e4-4646-be5d-c07b8fc64a35/professional-plumber-a93f45a7-1779455000892.webp',
    bio: 'Expert plumber with over 10 years experience in residential and commercial plumbing systems.',
    portfolioItems: [{ id: 'p1', title: 'Hotel Kitchen Fit-out', imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f19913a3-93e4-4646-be5d-c07b8fc64a35/professional-plumber-a93f45a7-1779455000892.webp' }],
    serviceRadius: 15,
    experienceYears: 12,
    language: 'en',
    verificationLevel: 3,
    county: 'Nairobi',
    town: 'Westlands',
    serviceAreas: ['Westlands', 'Parklands', 'Kilimani', 'Lavington'],
  },
  {
    id: 'f2',
    name: 'Sarah Otieno',
    phone: '0722345678',
    role: 'fundi',
    location: 'Nyali, Mombasa',
    registered: true,
    registrationFeePaid: true,
    registrationDate: '2023-06-20T00:00:00Z',
    subscriptionTier: 'standard',
    walletBalance: 8400,
    skills: ['Electrical', 'Appliance Repair'],
    rating: 4.9,
    jobsCompleted: 89,
    isVerified: true,
    isAvailable: true,
    badge: 'verified',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f19913a3-93e4-4646-be5d-c07b8fc64a35/expert-electrician-cb68a1bc-1779455000331.webp',
    bio: 'Certified electrician specializing in smart home installations and industrial electrical repairs.',
    portfolioItems: [],
    serviceRadius: 10,
    experienceYears: 7,
    language: 'en',
    verificationLevel: 3,
    county: 'Mombasa',
    town: 'Nyali',
    serviceAreas: ['Nyali', 'Bamburi', 'Mombasa Town'],
  },
  {
    id: 'f3',
    name: 'David Mwangi',
    phone: '0733345678',
    role: 'fundi',
    location: 'Karen, Nairobi',
    registered: true,
    registrationFeePaid: true,
    registrationDate: '2024-02-10T00:00:00Z',
    subscriptionTier: 'basic',
    walletBalance: 21000,
    skills: ['Carpentry', 'Furniture Repair'],
    rating: 4.7,
    jobsCompleted: 210,
    isVerified: true,
    isAvailable: false,
    badge: 'trusted',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f19913a3-93e4-4646-be5d-c07b8fc64a35/master-carpenter-d0eddcf5-1779455000376.webp',
    bio: 'Master carpenter passionate about custom furniture and interior woodwork.',
    portfolioItems: [],
    serviceRadius: 20,
    experienceYears: 15,
    language: 'en',
    verificationLevel: 2,
    county: 'Nairobi',
    town: 'Karen',
    serviceAreas: ['Karen', 'Langata', 'Kilimani'],
  },
  {
    id: 'f4',
    name: 'Alice Wambui',
    phone: '0744456789',
    role: 'fundi',
    location: 'Parklands, Nairobi',
    registered: true,
    registrationFeePaid: false,
    registrationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // ~3.3 months ago
    subscriptionTier: 'basic',
    walletBalance: 500,
    skills: ['Cleaning', 'Deep Cleaning'],
    rating: 4.5,
    jobsCompleted: 45,
    isVerified: true,
    isAvailable: true,
    badge: 'trusted',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=400',
    bio: 'Professional cleaner dedicated to providing the best home services.',
    portfolioItems: [],
    serviceRadius: 10,
    experienceYears: 4,
    language: 'en',
    verificationLevel: 2,
    county: 'Nairobi',
    town: 'Parklands',
    serviceAreas: ['Parklands', 'Westlands', 'Highridge'],
  },
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', customerId: 'c1', category: 'Plumbing', title: 'Burst Pipe in Kitchen', description: 'Emergency: The main pipe under the sink has burst. Need someone immediately.', budget: 3500, urgency: 'emergency', location: 'Lavington, Nairobi', status: 'open', createdAt: new Date().toISOString(), images: [], bids: [] },
  { id: 'j2', customerId: 'c1', category: 'Electrical', title: 'Install Outdoor Lighting', description: 'Looking to install 5 security lights around my perimeter wall.', budget: 8000, urgency: 'medium', location: 'Parklands, Nairobi', status: 'assigned', createdAt: new Date().toISOString(), images: [], bids: [] }
];