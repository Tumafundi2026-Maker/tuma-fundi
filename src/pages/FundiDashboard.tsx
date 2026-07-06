import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { MetaTags } from '../components/SEO';
import { 
  Wallet, ArrowUpRight, Briefcase, Star, CheckCircle2, MapPin, Clock,
  ShieldCheck, AlertCircle, TrendingUp, MoreVertical, Navigation, UserCircle,
  Check, Layers, BarChart3, Search, PlusSquare, MessageSquare, ChevronRight, Save, CreditCard, Upload, File as FileIcon, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FUNDI_SUBSCRIPTION_PLANS, KENYAN_LOCATIONS } from '../lib/mock-data';
import { toast } from 'sonner';

export const FundiDashboard = () => {
  const { currentUser, bookings, updateBookingStatus, withdrawFunds, updateSubscription, isGracePeriodActive, payRegistrationFee, updateProfile } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bio: (currentUser as any)?.bio || '',
    location: currentUser?.location || '',
    skills: (currentUser as any)?.skills?.join(', ') || '',
    serviceAreas: (currentUser as any)?.serviceAreas?.join(', ') || '',
  });
  
  // Document Upload State
  const [documents, setDocuments] = useState<File[]>([]);

  if (currentUser?.role !== 'fundi') return <div className="p-20 text-center font-black uppercase italic">Access Denied. Artisans Only.</div>;

  const fundiBookings = bookings.filter(b => b.fundiId === currentUser.id);
  const activeJobs = fundiBookings.filter(b => !['completed', 'cancelled'].includes(b.status));

  const handleWithdraw = () => {
    const amountStr = prompt('Enter withdrawal amount (KES):');
    if (amountStr) {
      const amount = Number(amountStr);
      if (amount > 0) withdrawFunds(amount);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGracePeriodActive(currentUser)) {
      toast.error('Subscription Required', {
        description: 'Your 3-month grace period has expired. Please pay the registration fee to continue editing your profile.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        name: profileForm.name,
        phone: profileForm.phone,
        bio: profileForm.bio,
        location: profileForm.location,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        serviceAreas: profileForm.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      };

      await updateProfile(currentUser.id, updates);
      
      toast.success('Profile Transformed', {
        description: 'Your artisan identity has been updated successfully.'
      });
      setActiveTab('overview');
    } catch (error) {
      toast.error('Transmission Error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40">
      <MetaTags title="Artisan Portal" description="Manage your service business, track leads, and handle payments." />
      
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Pro Header - Premium Bento Style */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 bg-white p-10 lg:p-16 rounded-[4rem] shadow-premium border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex flex-col sm:flex-row items-center gap-12 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] rotate-6 scale-105 -z-10 group-hover:rotate-12 transition-transform" />
              <img 
                src={(currentUser as any).image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'} 
                className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl relative z-10"
                alt=""
              />
              <div className="absolute -bottom-3 -right-3 bg-green-500 w-12 h-12 rounded-[1.2rem] border-4 border-white flex items-center justify-center text-white shadow-xl z-20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">{currentUser.name}</h1>
                <Badge className="bg-primary text-white border-none font-black uppercase tracking-[0.2em] text-[8px] px-5 py-2 rounded-full shadow-lg shadow-primary/20">
                  Certified Master Artisan
                </Badge>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-8">
                <div className="flex items-center gap-3 text-amber-500 bg-amber-50/50 px-6 py-3 rounded-2xl border border-amber-100">
                  <Star className="h-6 w-6 fill-amber-500" />
                  <span className="text-2xl font-black italic">{(currentUser as any).rating || 4.5}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <MapPin className="h-5 w-5 text-primary" /> {currentUser.location}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto relative z-10">
            <Button 
              onClick={() => setActiveTab('overview')}
              className={`h-20 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex-1 lg:flex-none transition-all ${
                activeTab === 'overview' ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary'
              }`}
            >
              <BarChart3 className={`mr-3 h-5 w-5 ${activeTab === 'overview' ? 'text-primary' : ''}`} /> Overview
            </Button>
            <Button 
              onClick={() => setActiveTab('profile')}
              variant="outline" 
              className={`h-20 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex-1 lg:flex-none transition-all ${
                activeTab === 'profile' ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary'
              }`}
            >
              <UserCircle className={`mr-3 h-5 w-5 ${activeTab === 'profile' ? 'text-primary' : ''}`} /> Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-12">
            {activeTab === 'overview' ? (
              <>
                {/* Quick Stats Bento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Market Rank', val: 'Top 5%', icon: TrendingUp, col: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Dispatch Priority', val: 'Instant', icon: ShieldCheck, col: 'text-primary', bg: 'bg-primary/5' },
                    { label: 'Successes', val: (currentUser as any).jobsCompleted || 0, icon: Briefcase, col: 'text-slate-950', bg: 'bg-slate-100' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 flex flex-col items-start hover:-translate-y-2 transition-all duration-300">
                      <div className={`w-14 h-14 ${s.bg} ${s.col} rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-current opacity-20`}>
                        <s.icon className="h-7 w-7 opacity-100" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 leading-none">{s.label}</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Active Queue */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Active Dispatch</h2>
                    <div className="flex items-center gap-3 px-5 py-2 bg-green-50 rounded-full border border-green-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-700">
                        {activeJobs.length} Live Operations
                      </span>
                    </div>
                  </div>

                  {activeJobs.length === 0 ? (
                    <div className="bg-white rounded-[4rem] py-32 shadow-premium border border-slate-50 flex flex-col items-center justify-center text-center px-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32" />
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 shadow-inner relative z-10">
                        <Briefcase className="h-12 w-12 text-slate-200" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter relative z-10">Engine Idle.</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest max-w-xs leading-relaxed relative z-10">New job assignments will appear here as the marketplace dispatches you.</p>
                      <Button className="mt-12 h-16 px-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 relative z-10 transition-all hover:scale-105">
                        Boost Visibility
                      </Button>
                    </div>
                  ) : (
                <div className="space-y-8">
                  {activeJobs.map((booking) => (
                    <Card key={booking.id} className="border-none bg-white rounded-[3rem] shadow-premium overflow-hidden group border border-slate-50">
                      <div className={`h-2.5 w-full ${booking.isEmergency ? 'bg-red-600 shadow-lg shadow-red-200 animate-pulse' : 'bg-primary'}`} />
                      <CardContent className="p-12">
                        <div className="flex flex-col xl:flex-row justify-between gap-12">
                          <div className="flex-grow space-y-10">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                              <div>
                                <div className="flex items-center gap-4 mb-4">
                                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">{booking.category}</h3>
                                  {booking.isEmergency && <Badge className="bg-red-600 text-white border-none rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-2xl animate-bounce">Emergency Dispatch</Badge>}
                                </div>
                                <p className="text-lg font-medium text-slate-500 italic leading-relaxed">"{booking.description}"</p>
                              </div>
                              <div className="sm:text-right bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Project Value (Net)</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">KES {(booking.price * 0.85).toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-slate-50">
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dispatch Zone</span>
                                <div className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-tighter">
                                  <MapPin className="h-4 w-4 text-primary" /> Distance 5km
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Request Time</span>
                                <div className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-tighter">
                                  <Clock className="h-4 w-4 text-primary" /> {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Trust Level</span>
                                <div className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-tighter">
                                  <ShieldCheck className="h-4 w-4 text-primary" /> Secured Job
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 min-w-[220px]">
                            {booking.status === 'pending' && (
                              <Button className="h-20 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30" onClick={() => updateBookingStatus(booking.id, 'accepted')}>
                                Accept Load
                              </Button>
                            )}
                            {booking.status === 'accepted' && (
                              <Button className="h-20 rounded-2xl bg-amber-500 hover:bg-amber-600 font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-2xl shadow-amber-200" onClick={() => updateBookingStatus(booking.id, 'on-the-way')}>
                                Initiate Travel <Navigation className="ml-3 h-5 w-5" />
                              </Button>
                            )}
                            {(booking.status === 'on-the-way' || booking.status === 'in-progress') && (
                              <Button className="h-20 rounded-2xl bg-green-600 hover:bg-green-700 font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-2xl shadow-green-200" onClick={() => updateBookingStatus(booking.id, 'completed')}>
                                Finalize Job
                              </Button>
                            )}
                                <Button variant="outline" className="h-20 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50">
                                  Reject Lead
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-[4rem] p-16 shadow-premium border border-slate-50 relative overflow-hidden">
                {!isGracePeriodActive(currentUser) && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-12">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-10 border border-red-100 shadow-xl">
                      <AlertCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">Subscription Locked</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest max-w-md leading-relaxed mb-12">
                      Your 3-month grace period has expired. To maintain your professional presence and edit your profile, a mandatory registration fee is required.
                    </p>
                    <Button 
                      onClick={payRegistrationFee}
                      className="h-20 px-12 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 transition-all hover:scale-105"
                    >
                      <CreditCard className="mr-3 h-5 w-5 text-primary" /> Pay Registration Fee
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between mb-16">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Artisan Profile</h2>
                  <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[8px] px-4 py-2 rounded-xl">
                    Public Visibility: High
                  </Badge>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Full Business Name</label>
                      <Input 
                        value={profileForm.name}
                        onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold" 
                        placeholder="e.g. Kamau Plumbing Services"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">M-Pesa Number</label>
                      <Input 
                        value={profileForm.phone}
                        onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                        className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold" 
                        placeholder="07XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Artisan Bio / Mission</label>
                    <Textarea 
                      value={profileForm.bio}
                      onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                      className="min-h-[150px] rounded-[2rem] border-slate-100 bg-slate-50/50 p-8 font-medium italic"
                      placeholder="Tell customers about your expertise and quality guarantee..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Primary Location</label>
                      <select 
                        value={profileForm.location}
                        onChange={e => setProfileForm({...profileForm, location: e.target.value})}
                        className="w-full h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {KENYAN_LOCATIONS.map((loc, i) => (
                          <option key={i} value={`${loc.town}, ${loc.county}`}>{loc.town}, {loc.county}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Service Areas (Estates/Towns)</label>
                      <Input 
                        value={profileForm.serviceAreas}
                        onChange={e => setProfileForm({...profileForm, serviceAreas: e.target.value})}
                        className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold" 
                        placeholder="e.g. Westlands, Parklands, Kilimani"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Core Skills (Comma separated)</label>
                    <Input 
                      value={profileForm.skills}
                      onChange={e => setProfileForm({...profileForm, skills: e.target.value})}
                      className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold" 
                      placeholder="e.g. Plumbing, Drainage, Tiling"
                    />
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Professional Documents (ID, Certificates, etc.)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files) {
                            setDocuments([...documents, ...Array.from(e.target.files)]);
                          }
                        }}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload" className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="h-8 w-8 text-slate-400 mb-3" />
                        <span className="text-sm font-bold text-slate-600">Click to upload documents</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PDF, JPG, PNG (Max 5MB each)</span>
                      </label>
                    </div>
                    {documents.length > 0 && (
                      <div className="space-y-2">
                        {documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <FileIcon className="h-5 w-5 text-primary" />
                              <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{doc.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-10 flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="h-20 px-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 group transition-all"
                    >
                      {isSaving ? 'Synchronizing...' : (
                        <>Save Profile <Save className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" /></>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            <Card className="border-none bg-slate-950 text-white overflow-hidden relative rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] p-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -mr-32 -mt-32" />
              <CardHeader className="p-12 pb-0">
                <div className="flex justify-between items-center mb-12">
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">Liquidity Pool</p>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-2xl">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12 pt-0">
                <div className="mb-16">
                  <span className="text-2xl font-black text-slate-600 mr-3 uppercase">KES</span>
                  <span className="text-7xl font-black tracking-tighter leading-none italic">{currentUser.walletBalance.toLocaleString()}</span>
                </div>
                
                <Button className="w-full h-20 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-primary/30 group transition-all" onClick={handleWithdraw}>
                  Direct Withdrawal <ArrowUpRight className="ml-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
                
                <div className="mt-10 flex items-center justify-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Payouts processed via M-Pesa Engine</p>
                </div>
              </CardContent>
            </Card>

            {/* Growth Packages */}
            <div className="bg-white rounded-[3.5rem] shadow-premium border border-slate-50 p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shadow-inner border border-slate-100">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black leading-none uppercase tracking-tighter italic">Scale Packages</h3>
              </div>
              
              <div className="space-y-4 mb-12">
                {FUNDI_SUBSCRIPTION_PLANS.map(plan => (
                  <div 
                    key={plan.id} 
                    onClick={() => updateSubscription(plan.id as any)}
                    className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer group ${
                      currentUser.subscriptionTier === plan.id 
                      ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' 
                      : 'border-slate-50 bg-slate-50/50 hover:border-primary/20 hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-black text-slate-900 text-lg tracking-tighter">{plan.name}</h4>
                      <Badge className={`border-none px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        currentUser.subscriptionTier === plan.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
                      }`}>
                        {currentUser.subscriptionTier === plan.id ? 'ACTIVE' : 'Contact Admin'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Leads: {plan.leadsAccess}</span>
                        <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full h-16 rounded-[1.2rem] border-slate-100 font-black uppercase tracking-widest text-[9px] text-slate-400">Advance Settings</Button>
            </div>

            {/* Professionalism Widget */}
            <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16" />
              <h3 className="text-3xl font-black tracking-tighter italic uppercase leading-none mb-4">Vetting Level</h3>
              <p className="text-sm text-slate-500 font-medium mb-10">Complete all tiers to unlock Corporate Tenders and high-value contracts.</p>
              
              <div className="space-y-4">
                {[
                  { l: 'Identity Mesh', s: true },
                  { l: 'Biometric Check', s: true },
                  { l: 'Business License', s: false },
                  { l: 'Portfolio Audit', s: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.l}</span>
                    {item.s ? <div className="bg-green-500 p-1 rounded-lg"><Check className="h-3 w-3 text-white" /></div> : <div className="w-5 h-5 rounded-lg border-2 border-white/10" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
