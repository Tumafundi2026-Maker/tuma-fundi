import React from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MetaTags } from '../components/SEO';
import { 
  CreditCard, Calendar, Clock, CheckCircle2, ArrowUpRight, TrendingUp,
  MapPin, MessageSquare, Zap, ArrowRight, Plus, Star, PlusSquare,
  Search, Check, ShieldCheck, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const { currentUser, bookings } = useStore();
  const userBookings = bookings.filter(b => b.customerId === currentUser?.id);
  
  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40">
      <MetaTags title="Customer Portal" description="Track your service bookings, manage jobs, and contact fundis." />
      
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Header & Quick Actions - Premium Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-white p-10 lg:p-16 rounded-[4rem] shadow-premium border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] rotate-6 scale-105 -z-10" />
              <div className="w-32 h-32 rounded-[2.5rem] bg-primary text-white flex items-center justify-center text-4xl font-black shadow-2xl relative z-10 border-8 border-white">
                {currentUser?.name.charAt(0)}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Mambo, {currentUser?.name}!</h1>
              <p className="text-lg font-medium text-slate-400 mt-4 uppercase tracking-widest italic">Dispatched Services & Home Projects</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto relative z-10">
            <Link to="/post-job" className="flex-1 lg:flex-none">
              <Button className="w-full h-20 px-10 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 group">
                <PlusSquare className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" /> Post Request
              </Button>
            </Link>
            <Link to="/marketplace" className="flex-1 lg:flex-none">
              <Button className="w-full h-20 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 group">
                <Search className="mr-3 h-5 w-5 text-white group-hover:scale-110 transition-transform" /> Discover Pros
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Active Tasks', val: userBookings.filter(b => b.status === 'in-progress').length, icon: Zap, col: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Scheduled', val: userBookings.filter(b => b.status === 'pending').length, icon: Calendar, col: 'text-primary', bg: 'bg-primary/5' },
                { label: 'Wallet Spent', val: `KES ${userBookings.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}`, icon: CreditCard, col: 'text-indigo-600', bg: 'bg-indigo-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 flex flex-col items-start hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-14 h-14 ${stat.bg} ${stat.col} rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-current opacity-20`}>
                    <stat.icon className="h-7 w-7 opacity-100" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 leading-none">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{stat.val}</p>
                </div>
              ))}
            </div>

            <Card className="border-none shadow-premium rounded-[3.5rem] overflow-hidden bg-white border border-slate-50">
              <CardHeader className="p-12 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Deployment Logs</CardTitle>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3 opacity-60">Manage your live & previous requests</p>
                </div>
                <Button variant="outline" className="rounded-[1.2rem] border-slate-100 font-black text-[10px] uppercase tracking-widest px-8 h-14 hover:bg-slate-50 transition-all">View All History</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50 px-12 pb-12">
                  {userBookings.length === 0 ? (
                    <div className="py-32 text-center">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <Calendar className="h-12 w-12 text-slate-200" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">No Active Missions.</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest mb-12 max-w-xs mx-auto leading-relaxed">Ready to get your next project started with verified pros?</p>
                      <Link to="/marketplace">
                        <Button className="bg-primary rounded-2xl h-18 px-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 transition-all hover:scale-105">Dispatch Now</Button>
                      </Link>
                    </div>
                  ) : (
                    userBookings.map((booking) => (
                      <div key={booking.id} className="py-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10 group hover:translate-x-3 transition-all duration-500">
                        <div className="flex items-center gap-10">
                          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-xl border-4 border-white ${booking.isEmergency ? 'bg-red-600 text-white shadow-red-200' : 'bg-primary/5 text-primary'}`}>
                            {booking.isEmergency ? <Zap className="h-10 w-10 fill-current animate-pulse" /> : <Calendar className="h-10 w-10" />}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-4 mb-3">
                              <h4 className="font-black text-slate-900 text-2xl tracking-tighter uppercase italic">{booking.category}</h4>
                              <Badge className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm border-none ${
                                booking.status === 'completed' ? 'bg-green-500 text-white' : 'bg-primary text-white'
                              }`}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {new Date(booking.date).toLocaleDateString()}</span>
                              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Site: Nairobi HQ</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-10 justify-between xl:justify-end border-t xl:border-none pt-8 xl:pt-0">
                          <div className="text-right">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">KES {booking.price.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Slot: {booking.timeSlot}</p>
                          </div>
                          <Button variant="outline" size="icon" className="w-16 h-16 rounded-2xl border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            {/* Trust Center - Premium Dark Card */}
            <div className="bg-slate-950 text-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 shadow-2xl" />
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-[1.2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-black leading-none italic uppercase tracking-tighter">Trust Shield</h3>
              </div>
              <p className="text-slate-500 text-base font-medium mb-12 leading-relaxed italic">
                "Every interaction is protected by real-time vetting and our secure escrow engine."
              </p>
              <div className="space-y-6">
                {['Multi-Layer Verification', 'Automated Escrow', 'Satisfaction Guarantee'].map(f => (
                  <div key={f} className="flex items-center gap-4 text-[11px] font-black text-white uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-primary" /> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Concierge */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-50 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-primary mb-10 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-none mb-4 italic uppercase tracking-tighter">24/7 Concierge</h3>
              <p className="text-sm text-slate-400 font-medium mb-12 leading-relaxed uppercase tracking-widest">Need human intervention? Our VIP dispatch team is on standby.</p>
              <Button className="w-full h-18 rounded-[1.2rem] bg-slate-950 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-200 transition-all hover:bg-black">
                Open Live Link
              </Button>
            </div>

            {/* Referral Widget */}
            <div className="bg-primary p-12 rounded-[3.5rem] text-white shadow-[0_30px_70px_rgba(14,165,233,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Invite & Earn.</h3>
              <p className="text-base font-medium opacity-80 mb-12 leading-relaxed">Give KES 200 credit to a friend and receive KES 200 in your wallet.</p>
              <Button className="w-full h-18 rounded-[1.2rem] bg-white text-primary font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95">
                Generate Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};