export type UserRole = 'customer' | 'fundi' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  location: string;
  registered: boolean;
  registrationFeePaid: boolean;
  registrationDate?: string;
  subscriptionTier: 'free' | 'basic' | 'standard' | 'premium';
  walletBalance: number;
  avatar?: string;
  language: 'en' | 'sw';
  verificationLevel: number; // 0: none, 1: phone, 2: ID, 3: business/portfolio
}

export interface Fundi extends User {
  skills: string[];
  rating: number;
  jobsCompleted: number;
  isVerified: boolean;
  isAvailable: boolean;
  idNumber?: string;
  badge?: 'verified' | 'top-rated' | 'trusted' | 'emergency';
  image: string;
  bio: string;
  portfolioItems: { id: string; title: string; imageUrl: string; }[];
  serviceRadius: number; // in km
  experienceYears: number;
  county?: string;
  town?: string;
  serviceAreas?: string[];
}

export interface SubService {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description: string;
  subServices: SubService[];
}

export interface LocationSuggestion {
  county: string;
  town: string;
  estate?: string;
}

export interface Job {
  id: string;
  customerId: string;
  category: string;
  title: string;
  description: string;
  budget: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  location: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  images: string[];
  bids: Bid[];
}

export interface Bid {
  id: string;
  fundiId: string;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  fundiId: string;
  jobId?: string;
  category: string;
  status: 'pending' | 'accepted' | 'on-the-way' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  date: string;
  timeSlot: string;
  isEmergency: boolean;
  description: string;
  rating?: number;
  review?: string;
  reviewImages?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  leadsAccess: string;
  visibility: string;
  bidsCount: number;
  verificationStatus: string;
  priorityRanking: string;
}

export interface SmsLog {
  id: string;
  userId: string | null;
  phone: string;
  message: string;
  status: 'queued' | 'sent' | 'failed' | 'delivered';
  gateway: string;
  createdAt: string;
}