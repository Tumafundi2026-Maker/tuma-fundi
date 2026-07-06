import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion } from 'framer-motion';
import { MetaTags } from '../components/SEO';
import { ArrowLeft, PlusSquare, Upload, MapPin, Zap, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../lib/mock-data';

export const JobPostPage = () => {
  const navigate = useNavigate();
  const { postJob, currentUser } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    urgency: 'medium',
    location: 'Westlands, Nairobi'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    postJob({
      customerId: currentUser.id,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      budget: Number(formData.budget),
      urgency: formData.urgency as any,
      location: formData.location,
      images: []
    });
    navigate('/dashboard');
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40">
      <MetaTags title="Post a Job" description="Broadcast your service request to verified Kenyan artisans." />
      
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-12 hover:text-primary transition-all">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Return to Portal
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-none shadow-premium rounded-[3.5rem] overflow-hidden bg-white">
            <div className="bg-slate-950 p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="w-20 h-20 rounded-[1.5rem] bg-primary flex items-center justify-center mb-10 shadow-2xl shadow-primary/20">
                <PlusSquare className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-6 uppercase italic">Deploy Request.</h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">Nearby verified fundis will be notified via push and SMS to bid on your project instantly.</p>
            </div>

            <CardContent className="p-16">
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Project Identity</Label>
                    <Input 
                      placeholder="e.g. Master Suite Tiling" 
                      className="h-20 px-8 rounded-[1.2rem] border-none bg-slate-50 shadow-inner text-lg font-bold placeholder:text-slate-300 focus:ring-8 focus:ring-primary/5 transition-all"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Service Domain</Label>
                    <Select onValueChange={v => setFormData({...formData, category: v})} required>
                      <SelectTrigger className="h-20 px-8 rounded-[1.2rem] border-none bg-slate-50 shadow-inner text-lg font-bold">
                        <SelectValue placeholder="Select Domain" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-4">
                        {CATEGORIES.map(c => <SelectItem key={c.id} value={c.name} className="h-14 rounded-xl font-bold px-6">{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Technical Scope</Label>
                  <Textarea 
                    placeholder="Provide clear specifications to receive accurate bids..." 
                    className="min-h-[220px] p-8 rounded-[1.5rem] border-none bg-slate-50 shadow-inner text-lg font-bold placeholder:text-slate-300 focus:ring-8 focus:ring-primary/5 transition-all leading-relaxed"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Estimated Budget (KES)</Label>
                    <Input 
                      type="number"
                      placeholder="e.g. 15000" 
                      className="h-20 px-8 rounded-[1.2rem] border-none bg-slate-50 shadow-inner text-lg font-bold placeholder:text-slate-300 focus:ring-8 focus:ring-primary/5 transition-all"
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Dispatch Urgency</Label>
                    <Select defaultValue="medium" onValueChange={v => setFormData({...formData, urgency: v})}>
                      <SelectTrigger className="h-20 px-8 rounded-[1.2rem] border-none bg-slate-50 shadow-inner text-lg font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-4">
                        <SelectItem value="low" className="h-14 rounded-xl font-bold px-6">Normal Schedule (3+ Days)</SelectItem>
                        <SelectItem value="medium" className="h-14 rounded-xl font-bold px-6">Priority (Next 24h)</SelectItem>
                        <SelectItem value="high" className="h-14 rounded-xl font-bold px-6">High Alert (Immediate)</SelectItem>
                        <SelectItem value="emergency" className="h-14 rounded-xl font-bold px-6 text-red-600 font-black">CRITICAL (ASAP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-12 border-4 border-dashed border-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-all cursor-pointer bg-slate-50/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Upload className="h-12 w-12 text-slate-200 mb-6 group-hover:text-primary transition-all group-hover:scale-110" />
                  <p className="text-base font-black text-slate-900 uppercase tracking-widest">Technical Attachments</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Upload images or plans to assist expert appraisal.</p>
                </div>

                <div className="pt-10">
                  <Button type="submit" className="w-full h-24 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 group transition-all">
                    Authorize Deployment
                    <ChevronRight className="ml-4 h-6 w-6 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};