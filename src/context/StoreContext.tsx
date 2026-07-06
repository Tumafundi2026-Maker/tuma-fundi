import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Fundi, Booking, Job, ChatMessage, Category, SmsLog } from '../lib/types';
import { FUNDI_SUBSCRIPTION_PLANS, INITIAL_FUNDIS, MOCK_JOBS, CATEGORIES } from '../lib/mock-data';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

interface StoreContextType {
  currentUser: User | null;
  fundis: Fundi[];
  bookings: Booking[];
  jobs: Job[];
  categories: Category[];
  allProfiles: User[];
  messages: ChatMessage[];
  login: (phone: string, role: string) => Promise<void>;
  logout: () => void;
  payRegistrationFee: () => void;
  updateSubscription: (tier: User['subscriptionTier']) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  withdrawFunds: (amount: number) => void;
  postJob: (job: Omit<Job, 'id' | 'status' | 'createdAt' | 'bids'>) => void;
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  isGracePeriodActive: (user: User) => boolean;
  refreshData: () => Promise<void>;
  updateProfile: (id: string, updates: any) => Promise<void>;
  smsLogs: SmsLog[];
  sendSms: (phone: string, message: string, userId?: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tima_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [fundis, setFundis] = useState<Fundi[]>(() => {
    const saved = localStorage.getItem('tima_fundis');
    return saved ? JSON.parse(saved) : INITIAL_FUNDIS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('tima_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('tima_jobs');
    return saved ? JSON.parse(saved) : MOCK_JOBS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tima_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    return CATEGORIES;
  });

  const [allProfiles, setAllProfiles] = useState<User[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);

  useEffect(() => {
    localStorage.setItem('tima_user', JSON.stringify(currentUser));
    if (currentUser?.role === 'admin') {
      refreshData();
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tima_fundis', JSON.stringify(fundis));
  }, [fundis]);

  useEffect(() => {
    localStorage.setItem('tima_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('tima_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('tima_messages', JSON.stringify(messages));
  }, [messages]);

  const login = async (phone: string, role: string) => {
    const existingFundi = fundis.find(f => f.phone === phone);
    
    if (existingFundi) {
      setCurrentUser(existingFundi);
      toast.success(`Welcome back, ${existingFundi.name}!`);
      return;
    }

    if (role === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        name: 'Admin Control',
        phone: phone || 'admin',
        role: 'admin',
        location: 'Nairobi HQ',
        registered: true,
        registrationFeePaid: true,
        subscriptionTier: 'premium',
        walletBalance: 250000,
        language: 'en',
        verificationLevel: 3,
      });
      toast.success('Admin authorized');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'fundi' ? 'Professional Artisan' : 'Valued Client',
      phone,
      role: role as any,
      location: 'Nairobi',
      registered: true,
      registrationFeePaid: role === 'customer' || role === 'admin', // Clients and Admins don't pay registration
      registrationDate: new Date().toISOString(),
      subscriptionTier: 'free',
      walletBalance: 0,
      language: 'en',
      verificationLevel: 1,
    };
    
    // Sync new user to Supabase
    try {
      const { data, error } = await supabase.from('profiles').upsert({
        id: newUser.id,
        full_name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        registration_fee_paid: newUser.registrationFeePaid,
        registration_date: newUser.registrationDate,
        subscription_tier: newUser.subscriptionTier,
      }).select().single();

      if (error) throw error;
      if (data) {
        newUser.id = data.id; // Use DB ID
        // Send registration SMS
        await sendSms(newUser.phone, `Welcome to Tuma Fundi, ${newUser.name}! Your account as a ${newUser.role} is now active. Explore the marketplace today!`, newUser.id);
      }
    } catch (err) {
      console.error('Supabase sync error:', err);
    }

    setCurrentUser(newUser);
    toast.success('Secure account created successfully.');
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info('Session ended safely.');
  };

  const payRegistrationFee = () => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, registrationFeePaid: true, verificationLevel: 2 });
    // Send payment confirmation SMS
    sendSms(currentUser.phone, `Payment confirmed! KES 300 received. Your Tuma Fundi account is now fully activated. Start receiving leads now!`, currentUser.id);
    toast.success('Registration fee of KES 300 paid! KYC Level 2 Unlocked.');
  };

  const isGracePeriodActive = (user: User) => {
    if (user.registrationFeePaid) return true;
    if (!user.registrationDate) return true;
    
    const regDate = new Date(user.registrationDate);
    const gracePeriodEnd = new Date(regDate);
    gracePeriodEnd.setMonth(regDate.getMonth() + 3);
    
    return new Date() < gracePeriodEnd;
  };

  const refreshData = async () => {
    try {
      // Fetch Categories and Services
      const { data: catData, error: catError } = await supabase.from('categories').select('*, services(*)');
      if (catError) throw catError;

      if (catData) {
        const formattedCats = catData.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '🛠️',
          description: cat.description || '',
          subServices: cat.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description || '',
            icon: '🔹'
          }))
        }));
        setCategories(formattedCats);
      }

      // If Admin, fetch all profiles and bookings
      if (currentUser?.role === 'admin') {
        const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
        if (pError) throw pError;

        if (profiles) {
          const formattedProfiles: User[] = profiles.map((p: any) => ({
            id: p.id,
            name: p.full_name || 'Anonymous',
            phone: p.phone || '',
            role: p.role as any,
            location: `${p.town || ''}, ${p.county || ''}`,
            registered: true,
            registrationFeePaid: p.registration_fee_paid,
            registrationDate: p.registration_date,
            subscriptionTier: p.subscription_tier as any,
            walletBalance: 0, // In real app, fetch from transactions/wallet table
            language: 'en' as const,
            verificationLevel: p.is_active ? 3 : 1,
          }));
          setAllProfiles(formattedProfiles);

          // Also update fundis list for marketplace
          const fundiProfiles = profiles.filter((p: any) => p.role === 'fundi').map((p: any) => ({
            id: p.id,
            name: p.full_name || 'Anonymous',
            phone: p.phone || '',
            role: 'fundi' as const,
            location: `${p.town || ''}, ${p.county || ''}`,
            registered: true,
            registrationFeePaid: p.registration_fee_paid,
            registrationDate: p.registration_date,
            subscriptionTier: p.subscription_tier as any,
            walletBalance: 0,
            language: 'en' as const,
            verificationLevel: p.is_active ? 3 : 1,
            skills: p.skills || (p.category ? [p.category] : []),
            serviceAreas: p.service_areas || [],
            rating: 4.5,
            jobsCompleted: 0,
            isVerified: p.is_active,
            isAvailable: p.availability === 'available',
            image: p.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            bio: p.bio || '',
            portfolioItems: [],
            serviceRadius: 10,
            experienceYears: 5,
          }));
          setFundis(fundiProfiles);
        }
      }

      // If Admin, fetch all bookings
      if (currentUser?.role === 'admin') {
        const { data: bData, error: bError } = await supabase.from('payments').select('*');
        if (bError) throw bError;
        
        if (bData) {
          const formattedBookings: Booking[] = bData.map((b: any) => ({
            id: b.id,
            customerId: b.user_id,
            fundiId: '', // Would need a join or another query
            category: b.type === 'registration' ? 'Activation' : 'Service',
            status: b.status === 'completed' ? 'completed' : 'pending',
            price: Number(b.amount),
            date: b.created_at,
            timeSlot: 'N/A',
            isEmergency: false,
            description: `${b.type} payment via ${b.transaction_id || 'M-Pesa'}`,
          }));
          setBookings(formattedBookings);
        }

        // Fetch SMS Logs
        const { data: logData, error: logError } = await supabase
          .from('sms_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (logError) throw logError;
        if (logData) {
          setSmsLogs(logData.map((l: any) => ({
            id: l.id,
            userId: l.user_id,
            phone: l.phone,
            message: l.message,
            status: l.status,
            gateway: l.gateway,
            createdAt: l.created_at
          })));
        }
      }

    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Could not sync with cloud engine');
    }
  };

  const updateSubscription = (tier: User['subscriptionTier']) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, subscriptionTier: tier });
    const plan = FUNDI_SUBSCRIPTION_PLANS.find(p => p.id === tier);
    // Send subscription SMS
    sendSms(currentUser.phone, `Subscription Success! You are now on the ${plan?.name} plan. Enjoy increased visibility and priority job matching.`, currentUser.id);
    toast.success(`Subscription upgraded to ${plan?.name}!`);
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
    };
    setBookings([newBooking, ...bookings]);
    
    // Automated SMS for bookings
    if (currentUser) {
      sendSms(currentUser.phone, `Booking Confirmed! We've matched you with a professional for ${bookingData.category}. They will contact you shortly.`, currentUser.id);
    }
    const fundi = fundis.find(f => f.id === bookingData.fundiId);
    if (fundi) {
      sendSms(fundi.phone, `New Job Alert! You have a new booking for ${bookingData.category}. Log in to view details.`, fundi.id);
    }

    toast.success('Matching success! Booking is being processed.');
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    const booking = bookings.find(b => b.id === id);
    if (booking && status === 'accepted') {
      const customer = allProfiles.find(p => p.id === booking.customerId);
      if (customer) {
        sendSms(customer.phone, `Good news! Your booking for ${booking.category} has been accepted by the artisan.`, customer.id);
      }
    }

    if (status === 'completed') {
      if (booking) {
        const commission = booking.price * 0.15;
        const netAmount = booking.price - commission;
        
        setFundis(prev => prev.map(f => {
          if (f.id === booking.fundiId) {
            return {
              ...f,
              walletBalance: f.walletBalance + netAmount,
              jobsCompleted: f.jobsCompleted + 1
            };
          }
          return f;
        }));
        
        if (currentUser && currentUser.id === booking.fundiId) {
          setCurrentUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance + netAmount } : null);
        }

        toast.success(`Job Success! KES ${netAmount.toLocaleString()} added to your wallet.`);
      }
    }
  };

  const withdrawFunds = (amount: number) => {
    if (!currentUser || currentUser.role !== 'fundi') return;
    if (currentUser.walletBalance < amount) {
      toast.error('Insufficient funds.');
      return;
    }
    setCurrentUser({ ...currentUser, walletBalance: currentUser.walletBalance - amount });
    toast.success(`KES ${amount.toLocaleString()} withdrawn to M-Pesa instantly.`);
  };

  const postJob = (jobData: Omit<Job, 'id' | 'status' | 'createdAt' | 'bids'>) => {
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'open',
      createdAt: new Date().toISOString(),
      bids: [],
    };
    setJobs([newJob, ...jobs]);
    toast.success('Job posted successfully! Nearby fundis notified.');
  };

  const sendMessage = (msgData: Omit<ChatMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages([...messages, newMsg]);
  };

  const updateProfile = async (id: string, updates: any) => {
    try {
      // Map frontend fields to DB columns
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.bio) dbUpdates.bio = updates.bio;
      if (updates.location) {
        const [town, county] = updates.location.split(',').map((s: string) => s.trim());
        dbUpdates.town = town;
        dbUpdates.county = county;
      }
      if (updates.skills) dbUpdates.skills = updates.skills;
      if (updates.serviceAreas) dbUpdates.service_areas = updates.serviceAreas;

      const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', id);
      if (error) throw error;
      
      toast.success('System record updated');
      
      // Update local state for immediate feedback
      if (currentUser && currentUser.id === id) {
        setCurrentUser({ ...currentUser, ...updates });
      }
      setFundis(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
      
      await refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    }
  };

  const sendSms = async (phone: string, message: string, userId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { phone, message, user_id: userId }
      });

      if (error) throw error;
      if (data?.success) {
        toast.success('SMS Sent Successfully');
        await refreshData();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('SMS send error:', error);
      toast.error(error.message || 'Failed to send SMS');
      return false;
    }
  };

  return (
    <StoreContext.Provider value={{ 
      currentUser, 
      fundis, 
      bookings, 
      jobs,
      categories,
      allProfiles,
      messages,
      login, 
      logout, 
      payRegistrationFee, 
      updateSubscription, 
      createBooking,
      updateBookingStatus,
      withdrawFunds,
      postJob,
      sendMessage,
      isGracePeriodActive, 
      updateProfile,
      refreshData,
      smsLogs,
      sendSms
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};