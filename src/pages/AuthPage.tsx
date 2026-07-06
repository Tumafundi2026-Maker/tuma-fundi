import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { MetaTags } from '../components/SEO';
import { ShieldCheck, Phone, Lock, ArrowRight, Check, Smartphone, HardHat, User, Zap, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/attachments/ab1da22d-5cd6-4d1d-8bd6-481183c231d1/1779863487840_Tuma_Fundi_LOgo_new.jpeg";

export const AuthPage = () => {
  const { currentUser, login, payRegistrationFee } = useStore();
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'fundi' | 'admin'>('customer');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    await login(phone, role);
  };

  const handlePayFee = () => {
    payRegistrationFee();
    navigate('/dashboard');
  };

  if (currentUser && !currentUser.registrationFeePaid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <MetaTags title="Account Activation" description="Activate your Tuma Fundi profile." />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-2xl shadow-premium border-none rounded-[3.5rem] overflow-hidden bg-white">
            <div className="bg-primary h-2.5 w-full" />
            <div className="p-12 lg:p-20">
              <CardHeader className="text-center space-y-6 p-0 mb-12">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-primary/20">
                  <ShieldCheck className="h-12 w-12" />
                </div>
                <div>
                  <CardTitle className="text-5xl font-black text-slate-900 tracking-tighter">Activate Pro Profile</CardTitle>
                  <CardDescription className="text-lg font-medium text-slate-500 mt-4 leading-relaxed">
                    To unlock the dispatch engine and verified marketplace access, a one-time activation is required.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-12 p-0">
                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden text-center shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mr-24 -mt-24" />
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-3">Activation Fee</p>
                  <p className="text-7xl font-black tracking-tighter">KES 300</p>
                  <Badge className="mt-6 bg-white/10 text-white border-white/20 px-6 py-2 font-black uppercase tracking-widest text-[9px]">Lifetime Partner License</Badge>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  {['Real-time Leads', 'Verified Badge', 'Secure Wallet', 'Priority Listing'].map(f => (
                    <div key={f} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] flex gap-6 items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">M-Pesa Direct Checkout</p>
                    <p className="text-sm font-medium text-slate-400">A push request will be sent to {currentUser.phone}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-16">
                <div className="flex flex-col gap-6 w-full">
                  <div className="flex items-center justify-center gap-3 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">
                    <Zap className="h-4 w-4 text-primary" /> Secure Payment via M-Pesa API
                  </div>
                  <Button onClick={handlePayFee} className="w-full h-20 text-xs font-black uppercase tracking-[0.3em] bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 rounded-[1.5rem]">
                    Authorize KES 300 Activation
                  </Button>
                  <div className="flex justify-center gap-4">
                    <CreditCard className="h-5 w-5 text-slate-200" />
                  </div>
                </div>
              </CardFooter>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-5 bg-white">
      <MetaTags title="Sign In" description="Secure login to Tuma Fundi Kenya." />
      
      {/* Branding Side - Dark & Premium */}
      <div className="hidden lg:flex lg:col-span-2 bg-slate-950 relative items-center justify-center p-16 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-primary opacity-10" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-md w-full">
          <Link to="/" className="inline-block mb-24 transition-transform hover:scale-105">
            <img src={LOGO_URL} alt="" className="h-32 w-auto brightness-0 invert" />
          </Link>
          
          <h2 className="text-6xl font-black text-white leading-[0.95] tracking-tighter mb-12 uppercase italic">
            Empowering <br /><span className="text-primary">Kenyan</span> <br />Artisans.
          </h2>
          
          <div className="space-y-10">
            {[
              { t: 'Security Mesh', d: 'Every connection is protected by real-time vetting.', i: ShieldCheck },
              { t: 'Smart Matching', d: 'Our engine finds the best pro in your immediate radius.', i: Zap },
              { t: 'Economic Growth', d: 'Fair pricing and secure payments for all parties.', i: CreditCard }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                  <item.i className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">{item.t}</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Form Side - Light & Modern */}
      <div className="lg:col-span-3 flex items-center justify-center p-8 sm:p-20 bg-slate-50/50">
        <div className="w-full max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <img src={LOGO_URL} alt="" className="h-24 w-auto mx-auto mb-10 lg:hidden" />
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Join Tuma Fundi</h2>
            <p className="text-lg font-medium text-slate-400 leading-tight uppercase tracking-widest">Sign up or sign in to your portal.</p>
          </motion.div>

          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-10">
              <div className="space-y-4">
                <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Access Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger className="h-20 px-8 rounded-[1.5rem] border-none bg-white shadow-premium text-xl font-black tracking-tight focus:ring-8 focus:ring-primary/5">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[1.5rem] border-slate-100 shadow-2xl">
                    <SelectItem value="customer" className="h-16 rounded-xl font-bold">Client / Customer</SelectItem>
                    <SelectItem value="fundi" className="h-16 rounded-xl font-bold">Professional Artisan</SelectItem>
                    <SelectItem value="admin" className="h-16 rounded-xl font-bold">Platform Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Authorized Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-all" />
                  <Input 
                    id="phone" 
                    placeholder="07XX XXX XXX" 
                    className="h-20 pl-16 rounded-[1.5rem] border-none bg-white shadow-premium focus:ring-8 focus:ring-primary/5 transition-all text-xl font-black tracking-tight"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-20 rounded-[1.5rem] bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 group">
                Continue
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </form>
          </div>

          <div className="mt-20 pt-16 border-t border-slate-200 flex flex-col items-center gap-8">
            <div className="flex items-center gap-3 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">
              <Lock className="h-4 w-4" /> Verified via M-Pesa API Mesh
            </div>
            <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed max-w-xs uppercase tracking-widest">
              By accessing the portal, you consent to our security protocols and terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};