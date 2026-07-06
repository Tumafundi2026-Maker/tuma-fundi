import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MetaTags } from '../components/SEO';
import { 
  ArrowLeft, Send, Image as ImageIcon, Mic, MoreVertical, Phone, Video, 
  CheckCheck, MapPin, ShieldCheck, Search, MessageSquare
} from 'lucide-react';

export const ChatPage = () => {
  const navigate = useNavigate();
  const { currentUser, messages, sendMessage, fundis } = useStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock a conversation with the first fundi
  const activeChatPartner = fundis[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;
    
    sendMessage({
      senderId: currentUser.id,
      receiverId: activeChatPartner.id,
      text: inputText
    });
    setInputText('');
  };

  if (!currentUser) return <div className="p-20 text-center font-black uppercase italic">Access Denied. Please Login.</div>;

  return (
    <div className="bg-slate-50 h-screen flex flex-col pt-24">
      <MetaTags title="Secure Messaging" description="Direct and secure communication between clients and fundis." />
      
      <div className="max-w-7xl mx-auto w-full flex-grow flex overflow-hidden lg:px-6 lg:pb-12 lg:gap-8">
        
        {/* Chat List Sidebar (Desktop) */}
        <div className="hidden lg:flex w-96 flex-col gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 flex-grow overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-10 uppercase italic">Messages.</h2>
            <div className="relative mb-10 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-all" />
              <Input placeholder="Search chats..." className="h-14 pl-12 rounded-2xl bg-slate-50 border-none text-sm font-bold" />
            </div>
            <div className="space-y-4">
              {fundis.slice(0, 5).map((f, i) => (
                <div key={f.id} className={`p-6 rounded-[2rem] flex items-center gap-6 cursor-pointer transition-all ${i === 0 ? 'bg-primary shadow-xl shadow-primary/20 text-white' : 'hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-100'}`}>
                  <div className="relative">
                    <img src={f.image} className="w-16 h-16 rounded-[1.2rem] object-cover shadow-md" alt="" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-${i === 0 ? 'primary' : 'white'} bg-green-500 rounded-xl shadow-lg`} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`font-black text-base truncate leading-none mb-2 ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{f.name}</h4>
                    <p className={`text-[10px] font-black uppercase truncate tracking-widest ${i === 0 ? 'text-white/60' : 'text-slate-400'}`}>Typing...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <ShieldCheck className="h-12 w-12 mb-8 text-primary" />
            <h3 className="text-2xl font-black leading-none mb-4 italic uppercase tracking-tighter">SafeChat Engine</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">All communications are logged for dispute resolution. Never pay outside the platform.</p>
          </div>
        </div>

        {/* Main Chat Window */}
        <Card className="flex-grow flex flex-col border-none shadow-premium rounded-[3rem] overflow-hidden bg-white">
          {/* Chat Header */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white relative z-20">
            <div className="flex items-center gap-8">
              <button onClick={() => navigate(-1)} className="lg:hidden p-3 rounded-2xl bg-slate-50 text-slate-400">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="relative">
                <img src={activeChatPartner.image} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-2xl border-4 border-white" alt="" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-xl shadow-lg" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2 italic uppercase">{activeChatPartner.name}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Dispatch Active</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{activeChatPartner.skills[0]}</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-slate-300 hover:text-primary hover:bg-primary/5 transition-all border border-slate-50"><Phone className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-slate-300 hover:text-primary hover:bg-primary/5 transition-all border border-slate-50"><Video className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-slate-300 hover:text-primary hover:bg-primary/5 transition-all border border-slate-50"><MoreVertical className="h-5 w-5" /></Button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-12 bg-slate-50/20 no-scrollbar">
            <div className="flex justify-center mb-16">
              <Badge variant="outline" className="bg-white border-slate-100 text-slate-300 font-black uppercase tracking-[0.3em] text-[8px] py-2 px-6 rounded-full shadow-sm">Encryption Handshake Success: Secure</Badge>
            </div>

            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10">
                    <MessageSquare className="h-12 w-12 text-slate-200" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Start the Talk.</h3>
                  <p className="max-w-xs font-medium text-slate-400 text-sm leading-relaxed uppercase tracking-widest">Send a message to discuss your job details with {activeChatPartner.name}.</p>
                </motion.div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-lg ${msg.senderId === currentUser.id ? 'order-2' : ''}`}>
                    <div className={`p-8 rounded-[2.5rem] shadow-premium text-base font-medium leading-relaxed ${
                      msg.senderId === currentUser.id 
                      ? 'bg-slate-950 text-white rounded-tr-none shadow-slate-900/10 border border-slate-900' 
                      : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-3 mt-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === currentUser.id && <CheckCheck className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-10 bg-white border-t border-slate-50 relative z-20">
            <form onSubmit={handleSend} className="flex items-center gap-6">
              <div className="hidden sm:flex gap-3">
                <Button type="button" variant="ghost" size="icon" className="w-16 h-16 rounded-[1.2rem] text-slate-300 bg-slate-50 hover:text-primary transition-all border border-slate-100"><ImageIcon className="h-6 w-6" /></Button>
                <Button type="button" variant="ghost" size="icon" className="w-16 h-16 rounded-[1.2rem] text-slate-300 bg-slate-50 hover:text-primary transition-all border border-slate-100"><Mic className="h-6 w-6" /></Button>
              </div>
              <div className="flex-grow relative">
                <Input 
                  placeholder="Message dispatched expert..." 
                  className="h-20 pl-8 pr-20 rounded-[1.5rem] bg-slate-50 border-none text-lg font-bold focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </form>
            <div className="mt-8 flex justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 italic opacity-60">
                <ShieldCheck className="h-4 w-4 text-primary" /> Protected by Tuma SafeChat Engine
              </p>
            </div>
          </div>
        </Card>

        {/* Job Summary Sidebar (Desktop) */}
        <div className="hidden xl:flex w-96 flex-col gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
            <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-10 uppercase italic">Active Project.</h3>
            <div className="bg-slate-50 p-8 rounded-[2rem] mb-10 border border-slate-100">
              <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full shadow-sm">In Negotiation</Badge>
              <h4 className="font-black text-slate-900 text-2xl tracking-tighter leading-none mb-3">Fix Kitchen Pipe Leak</h4>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-10">Lavington Estate, Nairobi</p>
              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <p className="text-2xl font-black text-slate-900 tracking-tighter italic">KES 2,500</p>
              </div>
            </div>
            <div className="space-y-4">
              <Button className="w-full h-16 rounded-[1.2rem] bg-slate-950 text-white font-black uppercase tracking-widest text-[9px] shadow-2xl shadow-slate-200 transition-all hover:bg-black">Confirm Booking</Button>
              <Button variant="outline" className="w-full h-16 rounded-[1.2rem] border-slate-100 font-black uppercase tracking-widest text-[9px] text-slate-400 hover:text-red-500 hover:border-red-100 transition-all">Cancel Request</Button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Artisan Proximity</h3>
            <div className="h-48 rounded-[2rem] bg-white relative overflow-hidden flex items-center justify-center shadow-inner border border-slate-50">
              <div className="absolute inset-0 bg-slate-50 opacity-50" />
              <div className="relative z-10">
                <MapPin className="h-12 w-12 text-primary animate-bounce shadow-xl" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            </div>
            <p className="text-[10px] font-black mt-8 text-slate-900 uppercase tracking-widest italic">Expert is 2.4km from you</p>
          </div>
        </div>
      </div>
    </div>
  );
};