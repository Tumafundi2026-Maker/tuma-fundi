import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import { MetaTags } from '../components/SEO';
import { 
  ShieldCheck, ArrowRight, UserCheck, Building2, HardHat, MapPin, 
  ChevronRight, Search, Check, Smartphone, Shield, CreditCard, 
  MessageSquare, Zap, Star
} from 'lucide-react';
import { CATEGORIES, FUNDI_SUBSCRIPTION_PLANS } from '../lib/mock-data';

const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/attachments/ab1da22d-5cd6-4d1d-8bd6-481183c231d1/1779863487840_Tuma_Fundi_LOgo_new.jpeg";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <MetaTags 
        title="Home" 
        description="Kenya's premium service marketplace. Find trusted plumbers, electricians, mechanics and construction experts instantly." 
      />

      {/* Premium Hero Section */}
      <section className="relative min-h-[100vh] flex items-center pt-24 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[140px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64" />
        
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-full mb-10 shadow-sm border border-slate-100">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="" /></div>)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Joined by 12,000+ Pros</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
                Find <span className="text-primary italic">Trusted</span> <br />
                Fundis Instantly.
              </h1>
              
              <p className="text-xl text-slate-500 mb-12 max-w-xl font-medium leading-relaxed">
                Professionalizing the skilled labor marketplace in Kenya. High-speed dispatch, ID verification, and secure Escrow payments for every project.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/marketplace">
                  <Button className="h-20 px-12 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs group shadow-2xl shadow-primary/30">
                    Hire a Verified Fundi
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/post-job">
                  <Button variant="outline" className="h-20 px-12 rounded-[1.5rem] bg-white border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-slate-50">
                    Post a Job Request
                  </Button>
                </Link>
              </div>

              <div className="mt-20 grid grid-cols-3 gap-10 border-t border-slate-200 pt-10">
                <div>
                  <p className="text-3xl font-black text-slate-900 mb-1 leading-none tracking-tighter">4.9/5</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Average Rating</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 mb-1 leading-none tracking-tighter">15min</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Dispatch</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 mb-1 leading-none tracking-tighter">100%</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Escrow</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[12px] border-white animate-float bg-white">
                <img 
                  src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/f19913a3-93e4-4646-be5d-c07b8fc64a35/hero-fundi-trust-e7f3f851-1779862495835.webp" 
                  className="w-full h-auto object-cover aspect-[5/6]"
                  alt="Tuma Fundi Professional"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>
              
              {/* Trust badges floating */}
              <div className="absolute -top-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-premium z-20 w-72 border border-slate-100">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 leading-none">Certified Pro</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Security Vetted</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[98%]" />
                </div>
              </div>

              <div className="absolute -bottom-10 -left-10 bg-slate-900 p-8 rounded-[2.5rem] shadow-premium z-20 w-64 text-white">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Nearby Availability</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary animate-pulse">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-black leading-none">Parklands</p>
                    <p className="text-[10px] font-bold text-primary mt-1">4 Pro's Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Premium Grid */}
      <section className="py-40 bg-white">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 text-primary font-black px-6 py-2 rounded-full uppercase tracking-widest text-[9px]">Our Expertise</Badge>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-8 italic">Infinite Solutions.</h2>
            <p className="text-lg text-slate-400 font-medium uppercase tracking-widest leading-relaxed">Choose a category and discover specialized sub-services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {CATEGORIES.map((cat) => (
              <Link to={`/marketplace?category=${cat.id}`} key={cat.id}>
                <motion.div
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="p-10 rounded-[3rem] border border-slate-50 bg-slate-50/50 flex flex-col items-center text-center cursor-pointer transition-all hover:bg-white hover:shadow-premium group"
                >
                  <span className="text-5xl mb-8 group-hover:scale-125 transition-transform">{cat.icon}</span>
                  <h4 className="text-lg font-black text-slate-900 mb-3 italic">{cat.name}</h4>
                  <div className="mt-4 flex flex-col gap-1">
                    {cat.subServices.slice(0, 3).map(ss => (
                      <span key={ss.id} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{ss.name}</span>
                    ))}
                  </div>
                  <div className="mt-10 p-3 rounded-full bg-white shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-40 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div>
              <div className="w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center mb-10 shadow-2xl shadow-primary/20">
                <ShieldCheck className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight mb-10 uppercase italic">Vetted to a <span className="text-primary">Higher</span> Standard.</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-16">We handle the verification so you don't have to. Every artisan on Tuma Fundi undergoes a multi-layer security check.</p>
              
              <div className="space-y-10">
                {[
                  { t: 'Identity Authentication', d: 'National ID and criminal background checks verified via government APIs.', i: UserCheck },
                  { t: 'Skill Grading System', d: 'Physical trade tests and portfolio auditing by industry seniors.', i: HardHat },
                  { t: 'Secure Payment Mesh', d: 'Escrow-based releases ensure you only pay for quality results.', i: CreditCard }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                      <item.i className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">{item.t}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-6 scale-110 -z-10" />
              <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 lg:p-20 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <h3 className="text-4xl font-black mb-12 italic tracking-tighter leading-none">Real-time Security Dashboard</h3>
                
                <div className="space-y-8">
                  {[
                    { l: 'KYC Verification', v: '98.2%', c: 'bg-green-500' },
                    { l: 'Matching Speed', v: '142ms', c: 'bg-primary' },
                    { l: 'Active Escrow', v: 'KES 2.4M', c: 'bg-blue-500' }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        <span>{stat.l}</span>
                        <span className="text-white">{stat.v}</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className={`h-full ${stat.c}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-primary text-slate-900">
                  <p className="text-sm font-black uppercase tracking-widest mb-4">System Status</p>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-900 animate-pulse" />
                    <p className="text-xl font-black italic">All Systems Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom - Modern Clean */}
      <section className="py-40 bg-white">
        <div className="section-container text-center max-w-5xl">
          <img src={LOGO_URL} alt="" className="h-24 w-auto mx-auto mb-16 opacity-10 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer" />
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-12 uppercase italic">Ready for <span className="text-primary">Quality?</span></h2>
          <p className="text-2xl text-slate-400 font-medium mb-16 max-w-2xl mx-auto">The perfect match for your home maintenance is one click away.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth">
              <Button className="h-20 px-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30">Sign Up</Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" className="h-20 px-16 rounded-[1.5rem] bg-white border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs">Browse Marketplace</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};