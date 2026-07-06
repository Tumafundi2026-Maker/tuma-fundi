import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MetaTags } from '../components/SEO';
import { 
  Users, 
  HardHat, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Activity,
  ArrowRight,
  Filter,
  Download,
  Search,
  AlertTriangle,
  FileText,
  Settings,
  MoreVertical,
  MessageSquare,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Plus,
  Send,
  Smartphone
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const { allProfiles, fundis, bookings, currentUser, updateProfile, refreshData, smsLogs, sendSms } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [smsRecipient, setSmsRecipient] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [bulkRole, setBulkRole] = useState<'all' | 'customer' | 'fundi'>('all');
  const [isSendingSms, setIsSendingSms] = useState(false);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-40 text-center space-y-8 bg-slate-50 min-h-screen">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-100 shadow-xl">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Access Denied</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest">Unauthorized System Entry Detected.</p>
        <Button onClick={() => window.location.href = '/'} className="h-14 rounded-2xl bg-slate-950 text-white font-black px-10 uppercase tracking-widest text-[10px]">Return to Safety</Button>
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.phone.includes(searchTerm) ||
      p.role.includes(searchTerm.toLowerCase())
    );
  }, [allProfiles, searchTerm]);

  const stats = {
    totalUsers: allProfiles.length,
    activeFundis: fundis.filter(f => f.isVerified).length,
    pendingVerifications: allProfiles.filter(p => p.role === 'fundi' && p.verificationLevel < 3).length,
    totalRevenue: bookings.reduce((acc, curr) => acc + curr.price, 0),
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-40">
      <MetaTags title="Super Admin Control" description="Global platform oversight, user management, and artisan vetting." />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Admin Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4 border border-primary/20">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary text-center">Cloud Systems Core</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase italic">Super <span className="text-primary">Admin</span> Panel</h1>
            <p className="text-lg text-slate-500 font-medium">Platform-wide management for {stats.totalUsers} registered accounts.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline" 
              className="h-14 rounded-2xl border-slate-200 bg-white font-black uppercase tracking-widest text-[10px] flex-1 lg:flex-none hover:bg-slate-50"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Data
            </Button>
            <Button className="h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] flex-1 lg:flex-none shadow-xl shadow-slate-200">
              <Plus className="mr-2 h-4 w-4" /> Add Record
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-12" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-4">
            <TabsTrigger value="overview" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" /> User Control
            </TabsTrigger>
            <TabsTrigger value="artisans" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <HardHat className="h-4 w-4 mr-2" /> Artisans
            </TabsTrigger>
            <TabsTrigger value="sms" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" /> SMS Manager
            </TabsTrigger>
            <TabsTrigger value="system" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" /> System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12 m-0 outline-none">
            {/* Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none bg-primary text-white shadow-xl shadow-primary/20 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <CardContent className="p-10">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-10 border border-white/20">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Platform Revenue</p>
                  <h3 className="text-4xl font-black tracking-tighter leading-none">
                    <span className="text-lg font-bold mr-1">KES</span>
                    {stats.totalRevenue.toLocaleString()}
                  </h3>
                </CardContent>
              </Card>

              {[
                { label: 'Total Users', val: stats.totalUsers, icon: Users, col: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Verified Pros', val: stats.activeFundis, icon: CheckCircle2, col: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pending KYC', val: stats.pendingVerifications, icon: AlertTriangle, col: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((s, i) => (
                <Card key={i} className="border-none bg-white shadow-sm border border-slate-100 rounded-[2.5rem] hover:shadow-premium transition-all">
                  <CardContent className="p-10">
                    <div className={`w-12 h-12 ${s.bg} ${s.col} rounded-2xl flex items-center justify-center mb-10 shadow-inner`}>
                      <s.icon className="h-6 w-6" />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{s.label}</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{s.val}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-premium rounded-[3rem] bg-white overflow-hidden border border-slate-50 p-12">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Recent Activity</h3>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Global platform events</p>
                  </div>
                  <Button variant="outline" className="h-10 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest">Export Log</Button>
                </div>
                
                <div className="space-y-8">
                  {[
                    { t: '14:22', m: 'New Artisan Registration: Kamau Plumbing', c: 'text-slate-400', i: HardHat },
                    { t: '13:58', m: 'Subscription upgraded for user #U221', c: 'text-primary', i: TrendingUp },
                    { t: '13:45', m: 'KYC Verification approved for Sarah Njoki', c: 'text-green-500', i: ShieldCheck },
                    { t: '13:20', m: 'Dispute flagged: Booking #B992', c: 'text-red-400', i: AlertTriangle }
                  ].map((l, i) => (
                    <div key={i} className="flex gap-8 items-start group">
                      <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${l.c} border border-slate-100 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all`}>
                        <l.i className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{l.t}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">System Log</span>
                        </div>
                        <p className={`text-base font-bold text-slate-700 leading-tight`}>{l.m}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-8">
                <Card className="border-none bg-slate-950 text-white rounded-[3rem] overflow-hidden shadow-2xl relative p-12">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mr-24 -mt-24" />
                  <h3 className="text-2xl font-black mb-10 italic tracking-tighter uppercase leading-none">Security Status</h3>
                  <div className="space-y-10">
                    {[
                      { l: 'Server Node 1', v: '99.9%', s: 'text-green-500' },
                      { l: 'M-Pesa API', v: 'Active', s: 'text-primary' },
                      { l: 'KYC Engine', v: 'Live', s: 'text-blue-500' }
                    ].map((st, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{st.l}</span>
                        <span className={`text-xs font-black uppercase ${st.s}`}>{st.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Matching Latency</p>
                    <p className="text-4xl font-black text-primary italic leading-none">142ms</p>
                  </div>
                </Card>
                
                <Card className="border-none bg-white rounded-[3rem] shadow-premium p-12 text-center border border-slate-50">
                  <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertTriangle className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Fraud Engine</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">No critical anomalies detected in the last 24h.</p>
                  <Button variant="outline" className="w-full h-14 rounded-xl border-slate-100 font-black uppercase tracking-widest text-[9px]">Deep Scan System</Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="m-0 outline-none">
            <Card className="border-none shadow-premium rounded-[3rem] bg-white overflow-hidden border border-slate-50">
              <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div className="relative flex-grow max-w-md w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter by name, phone or role..." 
                    className="h-16 pl-16 rounded-2xl border-none bg-slate-50 text-base font-bold placeholder:text-slate-300" 
                  />
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <Button variant="outline" className="h-16 px-8 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] flex-1 sm:flex-none">
                    <Filter className="mr-3 h-4 w-4" /> Filter
                  </Button>
                  <Button className="h-16 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] flex-1 sm:flex-none">
                    <Download className="mr-3 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Role</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProfiles.map((user) => (
                      <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg leading-none mb-1 tracking-tight">{user.name}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <select 
                            value={user.role}
                            onChange={(e) => updateProfile(user.id, { role: e.target.value })}
                            className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-primary transition-all"
                          >
                            <option value="customer">Customer</option>
                            <option value="fundi">Artisan</option>
                            <option value="admin">System Admin</option>
                          </select>
                        </td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-600 uppercase tracking-widest">{user.location}</td>
                        <td className="px-10 py-8">
                          <Badge className={`border-none px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${
                            user.verificationLevel >= 3 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {user.verificationLevel >= 3 ? 'Verified' : 'Unverified'}
                          </Badge>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-300 hover:text-primary hover:bg-primary/5">
                              <MessageSquare className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="artisans" className="m-0 outline-none">
            <div className="grid grid-cols-1 gap-12">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Artisan Oversight</h2>
                  <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-widest">Verification and skill management</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-none rounded-2xl px-6 py-3 font-black uppercase tracking-[0.2em] text-[10px] shadow-sm">
                  {fundis.length} Active Pros
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {fundis.map((f) => (
                  <Card key={f.id} className="border-none shadow-premium rounded-[3rem] bg-white overflow-hidden border border-slate-50 group hover:-translate-y-2 transition-all duration-300">
                    <div className="relative h-48">
                      <img src={f.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-6 right-6">
                        <Badge className={`border-none px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[8px] ${
                          f.isVerified ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {f.isVerified ? 'SYSTEM VERIFIED' : 'PENDING VETTING'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-6 left-10">
                        <h4 className="text-2xl font-black text-white tracking-tight uppercase italic">{f.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{f.skills[0] || 'Artisan'}</p>
                      </div>
                    </div>
                    <CardContent className="p-10 space-y-10">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Jobs Completed</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter italic">{f.jobsCompleted}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Rating Score</p>
                          <div className="flex items-center gap-2 text-amber-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-2xl font-black italic">{f.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <Button 
                          onClick={() => updateProfile(f.id, { is_active: !f.isVerified })}
                          className={`h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                            f.isVerified ? 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500' : 'bg-primary text-white shadow-xl shadow-primary/20'
                          }`}
                        >
                          {f.isVerified ? 'Revoke Vetting' : 'Verify Artisan Now'}
                        </Button>
                        <Button variant="ghost" className="h-14 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                          View Documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sms" className="m-0 outline-none space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 border-none shadow-premium rounded-[3rem] bg-white border border-slate-50 p-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-8">Send SMS</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Recipient</label>
                    <select 
                      value={smsRecipient}
                      onChange={(e) => setSmsRecipient(e.target.value)}
                      className="w-full h-14 rounded-xl border-2 border-slate-50 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-primary focus:bg-white transition-all"
                    >
                      <option value="">Select User</option>
                      {allProfiles.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <div className="h-4 w-px bg-slate-200" />
                    </div>
                    <textarea 
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full min-h-[150px] rounded-xl border-2 border-slate-50 bg-slate-50 p-6 text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <Button 
                    onClick={async () => {
                      const user = allProfiles.find(p => p.id === smsRecipient);
                      if (user && smsMessage) {
                        setIsSendingSms(true);
                        await sendSms(user.phone, smsMessage, user.id);
                        setIsSendingSms(false);
                        setSmsMessage('');
                      }
                    }}
                    disabled={!smsRecipient || !smsMessage || isSendingSms}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20"
                  >
                    {isSendingSms ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Individual SMS
                  </Button>
                </div>
              </Card>

              <Card className="lg:col-span-1 border-none shadow-premium rounded-[3rem] bg-slate-950 text-white p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24" />
                <h3 className="text-xl font-black mb-8 italic tracking-tighter uppercase leading-none">Bulk Campaign</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Audience</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['all', 'customer', 'fundi'].map((role) => (
                        <button
                          key={role}
                          onClick={() => setBulkRole(role as any)}
                          className={`h-12 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            bulkRole === role 
                              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                    Sending to approx. {bulkRole === 'all' ? allProfiles.length : allProfiles.filter(p => p.role === bulkRole).length} verified contacts.
                  </p>

                  <Button 
                    disabled={!smsMessage || isSendingSms}
                    className="w-full h-16 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px]"
                    onClick={async () => {
                      const recipients = bulkRole === 'all' 
                        ? allProfiles 
                        : allProfiles.filter(p => p.role === bulkRole);
                      
                      if (recipients.length > 0 && smsMessage) {
                        setIsSendingSms(true);
                        toast.info(`Initiating bulk send to ${recipients.length} users...`);
                        for (const r of recipients) {
                          await sendSms(r.phone, smsMessage, r.id);
                        }
                        setIsSendingSms(false);
                        setSmsMessage('');
                      }
                    }}
                  >
                    <Smartphone className="mr-2 h-4 w-4" /> Execute Bulk Queue
                  </Button>
                </div>
              </Card>

              <Card className="lg:col-span-1 border-none shadow-premium rounded-[3rem] bg-white border border-slate-50 p-10 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6">
                  <Activity className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Delivery Health</h3>
                <div className="w-full space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Success Rate</span>
                    <span className="text-green-500">98.4%</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%]" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                    Celcom Gateway: <span className="text-primary">Active</span>
                  </p>
                </div>
              </Card>
            </div>

            <Card className="border-none shadow-premium rounded-[3rem] bg-white overflow-hidden border border-slate-50">
              <div className="p-10 border-b border-slate-50">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">SMS Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Content</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {smsLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleString()}</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="font-black text-slate-900 text-sm leading-none tracking-tight">{log.phone}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{allProfiles.find(p => p.id === log.userId)?.name || 'Unknown'}</p>
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-xs font-medium text-slate-600 line-clamp-1 max-w-xs">{log.message}</p>
                        </td>
                        <td className="px-10 py-6">
                          <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-400">
                            {log.gateway}
                          </Badge>
                        </td>
                        <td className="px-10 py-6">
                          <Badge className={`border-none px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${
                            log.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                            log.status === 'sent' ? 'bg-blue-50 text-blue-600' : 
                            log.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="m-0 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-none shadow-premium rounded-[3rem] bg-white border border-slate-50 p-12">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase mb-12">Configuration Matrix</h3>
                <div className="space-y-10">
                  {[
                    { label: 'Platform Commission', value: '15.0%', desc: 'Charged on all completed artisan jobs.' },
                    { label: 'Activation Fee (KES)', value: '300', desc: 'One-time fee for artisan marketplace access.' },
                    { label: 'Grace Period (Months)', value: '3', desc: 'Duration before mandatory activation.' },
                    { label: 'Emergency Premium', value: '10.0%', desc: 'Additional surcharge for instant dispatch.' }
                  ].map((conf, i) => (
                    <div key={i} className="flex justify-between items-start gap-10 group">
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 uppercase tracking-tight italic">{conf.label}</p>
                        <p className="text-xs font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">{conf.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-2xl font-black text-primary tracking-tighter italic">{conf.value}</span>
                        <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-none bg-slate-950 text-white rounded-[3rem] shadow-2xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-12">System Protocol</h3>
                <div className="space-y-8">
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Search Engine</span>
                      <Badge className="bg-green-500 text-white border-none text-[8px] font-black uppercase tracking-widest">Optimal</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed uppercase tracking-widest">The intelligent matching engine is currently processing 1.2k queries per hour with 142ms latency.</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">M-Pesa API Mesh</span>
                      <Badge className="bg-primary text-white border-none text-[8px] font-black uppercase tracking-widest">Connected</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed uppercase tracking-widest">Real-time payment bridge is active. Last successful transaction processed 4m ago.</p>
                  </div>
                </div>
                <div className="mt-16 text-center">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">TUMA FUNDI KENYA v2.4.1</p>
                  <Button className="w-full h-16 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-white/5 hover:bg-slate-50 transition-all">Download Debug Log</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};