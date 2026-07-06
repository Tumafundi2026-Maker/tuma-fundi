import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { MetaTags } from '../components/SEO';
import { 
  Search, MapPin, Star, Zap, Hammer, Droplets, Lightbulb, Paintbrush,
  Drill, Trash2, ArrowRight, ChevronDown, Navigation, ShieldCheck,
  LayoutGrid, Map as MapIcon, Clock, ChevronRight, X, Filter, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KENYAN_LOCATIONS } from '../lib/mock-data';
import { Category, SubService } from '../lib/types';

export const Marketplace = () => {
  const { fundis, createBooking, currentUser, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const catId = searchParams.get('category');
    if (catId) {
      const cat = categories.find(c => c.id === catId);
      if (cat) setSelectedCategory(cat);
    }
  }, [searchParams, categories]);

  const filteredLocations = useMemo(() => {
    if (!locationSearch) return [];
    return KENYAN_LOCATIONS.filter(l => 
      l.town.toLowerCase().includes(locationSearch.toLowerCase()) || 
      l.county.toLowerCase().includes(locationSearch.toLowerCase()) ||
      l.estate?.toLowerCase().includes(locationSearch.toLowerCase())
    ).slice(0, 5);
  }, [locationSearch]);

  const filteredFundis = useMemo(() => {
    return fundis.filter(f => {
      const matchesSearch = !search || 
                           f.name.toLowerCase().includes(search.toLowerCase()) || 
                           f.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      
      const matchesLocation = !locationSearch || 
                             f.location.toLowerCase().includes(locationSearch.toLowerCase()) ||
                             (f.serviceAreas && f.serviceAreas.some(sa => sa.toLowerCase().includes(locationSearch.toLowerCase())));

      const matchesCategory = !selectedCategory || f.skills.some(s => 
        s.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
        selectedCategory.subServices.some(ss => s.toLowerCase().includes(ss.name.toLowerCase()))
      );

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [fundis, search, locationSearch, selectedCategory]);

  const handleBook = (fundi: any, subService?: SubService) => {
    const phone = fundi.phone ? (fundi.phone.startsWith('0') ? '254' + fundi.phone.slice(1) : fundi.phone.replace(/\D/g, '')) : '254735958052';
    const message = encodeURIComponent(`Hello ${fundi.name}, I found your profile on Tuma Fundi and I would like to book you for ${subService?.name || 'a professional service'}.`);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmergency = () => {
    if (!currentUser) {
      alert('Please login for emergency dispatch');
      return;
    }
    createBooking({
      customerId: currentUser.id,
      fundiId: fundis[0].id,
      category: 'Emergency Dispatch',
      price: 2500,
      date: new Date().toISOString(),
      timeSlot: 'ASAP',
      isEmergency: true,
      description: 'CRITICAL EMERGENCY REQUEST'
    });
    setShowEmergencyModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40">
      <MetaTags 
        title="Verified Marketplace" 
        description="Hire verified Kenyan artisans near you. Plumbers, electricians, cleaners and more in Nairobi, Mombasa and Kisumu." 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Advanced Search Header */}
        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-premium border border-slate-100 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full mb-8 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Real-time Dispatch Engine</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-10 max-w-4xl">
              Find Your <span className="text-primary italic">Local</span> Expert.
            </h1>

            <div className="grid lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-4 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary" />
                <Input 
                  placeholder="What service do you need?" 
                  className="h-20 pl-16 pr-8 rounded-[1.5rem] border-none bg-slate-50 shadow-inner text-lg font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="lg:col-span-4 relative group">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary" />
                <Input 
                  placeholder="Location (Town, Estate...)" 
                  className="h-20 pl-16 pr-8 rounded-[1.5rem] border-none bg-slate-50 shadow-inner text-lg font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 transition-all"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                />
                <AnimatePresence>
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[110%] left-0 right-0 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 overflow-hidden"
                    >
                      {filteredLocations.map((loc, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setLocationSearch(`${loc.town}, ${loc.county}`);
                            setShowLocationSuggestions(false);
                          }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <Navigation className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-900">{loc.estate ? `${loc.estate}, ` : ''}{loc.town}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{loc.county} County</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-4 flex gap-3">
                <Button 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                  variant="outline"
                  className="h-20 flex-1 rounded-[1.5rem] border-slate-100 bg-white font-black text-[10px] uppercase tracking-widest hover:border-primary group"
                >
                  {viewMode === 'grid' ? <MapIcon className="h-6 w-6 mr-3 text-primary" /> : <LayoutGrid className="h-6 w-6 mr-3 text-primary" />}
                  {viewMode === 'grid' ? 'Map View' : 'Grid View'}
                </Button>
                <Button 
                  className="h-20 flex-[1.5] rounded-[1.5rem] bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-200 font-black uppercase tracking-[0.2em] text-xs"
                >
                  Find Pro
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Categories / Sub-services Exploration */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-12 px-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Explore Expertise</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-3">Select a category to find specialized pros</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-3 space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedSubService(null);
                    setSearchParams(selectedCategory?.id === cat.id ? {} : { category: cat.id });
                  }}
                  className={`min-w-[200px] lg:w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all group ${
                    selectedCategory?.id === cat.id
                      ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20'
                      : 'bg-white border-white text-slate-600 hover:border-slate-100 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <span className="block font-black uppercase tracking-widest text-[10px] opacity-60 mb-1">Expertise</span>
                      <span className="block font-black text-lg tracking-tight italic">{cat.name}</span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${selectedCategory?.id === cat.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
              
              <div className="pt-6">
                <Button 
                  onClick={() => setShowEmergencyModal(true)}
                  className="w-full h-20 rounded-[2rem] bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-200 flex items-center justify-center gap-3"
                >
                  <Zap className="h-5 w-5 animate-pulse" />
                  Emergency Dispatch
                </Button>
              </div>
            </div>

            {/* Sub-services Grid */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-[3rem] p-10 lg:p-16 h-full min-h-[400px] shadow-premium relative border border-slate-50 flex flex-col justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedCategory ? (
                    <motion.div
                      key={selectedCategory.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid md:grid-cols-2 gap-8"
                    >
                      {selectedCategory.subServices.map((ss) => (
                        <motion.div
                          key={ss.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
                        >
                          <h4 className="text-xl font-black text-slate-900 mb-3">{ss.name}</h4>
                          <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">{ss.description}</p>
                          <Button 
                            onClick={() => {
                              setSelectedSubService(ss);
                              setSearch(ss.name);
                            }}
                            className="h-12 px-6 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] group-hover:bg-primary"
                          >
                            Explore Providers <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center flex flex-col items-center"
                    >
                      <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10">
                        <Hammer className="h-12 w-12" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4 italic">What can we help you with?</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest max-w-sm">Select a primary category to see specialized solutions and certified artisans.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 px-4 gap-6">
          <div className="flex items-center gap-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
              Available <span className="text-slate-900">{filteredFundis.length}</span> Artisans
            </p>
            <div className="h-1 w-1 rounded-full bg-slate-200" />
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {fundis.filter(f => f.isAvailable).length} Online Now
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer px-5 py-3 bg-white rounded-2xl border border-slate-100 hover:border-primary transition-all">
              Sort: Near Me <ChevronDown className="h-4 w-4" />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-100 bg-white"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Fundi Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredFundis.map((fundi) => (
                <motion.div
                  key={fundi.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="rounded-[2.5rem] border-none shadow-premium bg-white overflow-hidden group h-full flex flex-col hover:-translate-y-3 transition-all duration-500 relative">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={fundi.image} 
                        alt={fundi.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-5 left-5 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> 
                          {fundi.location}
                        </div>
                      </div>

                      <div className={`absolute top-5 right-5 w-5 h-5 rounded-2xl border-4 border-white shadow-2xl ${fundi.isAvailable ? 'bg-green-500' : 'bg-slate-400'}`} />
                    </div>
                    
                    <CardContent className="p-8 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{fundi.name}</h3>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                          <span className="text-[10px] font-black text-amber-700">{fundi.rating}</span>
                        </div>
                      </div>

                      {fundi.serviceAreas && fundi.serviceAreas.length > 0 && (
                        <div className="mb-6">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Areas</p>
                          <div className="flex flex-wrap gap-1.5">
                            {fundi.serviceAreas.slice(0, 3).map(area => (
                              <span key={area} className="px-2 py-0.5 bg-primary/5 text-primary rounded-lg text-[8px] font-black uppercase tracking-tighter">{area}</span>
                            ))}
                            {fundi.serviceAreas.length > 3 && <span className="text-[8px] font-black text-slate-300">+{fundi.serviceAreas.length - 3} more</span>}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-8">
                        {fundi.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-50 flex gap-3">
                        <Button 
                          onClick={() => handleBook(fundi, selectedSubService || undefined)} 
                          className="flex-1 h-14 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase tracking-widest text-[9px] shadow-xl shadow-green-100/50 border-none transition-all"
                        >
                          <MessageSquare className="mr-2 h-4 w-4 fill-current" />
                          WhatsApp
                        </Button>
                        <Button 
                          onClick={() => handleBook(fundi, selectedSubService || undefined)} 
                          className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[9px] shadow-xl shadow-slate-200"
                        >
                          Book Pro <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-[700px] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-premium bg-slate-100 relative">
            <div className="absolute inset-0 bg-cover bg-center grayscale opacity-50" style={{ backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/f19913a3-93e4-4646-be5d-c07b8fc64a35/map-view-mockup-b99c2b5e-1779862495858.webp')` }} />
            <div className="absolute inset-0 bg-primary/10" />
            
            {/* Mock Map Pins with Pro Tooltips */}
            {filteredFundis.slice(0, 6).map((f, i) => (
              <motion.div 
                key={f.id}
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                style={{ top: `${20 + (i % 3) * 20}%`, left: `${15 + (i * 12)}%` }}
                className="absolute w-16 h-16 rounded-[1.5rem] bg-white shadow-premium border-2 border-primary flex items-center justify-center p-1 group/pin cursor-pointer z-20 hover:scale-125 transition-all duration-300"
              >
                <img src={f.image} className="w-full h-full object-cover rounded-2xl" alt="" />
                <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-2xl opacity-0 group-hover/pin:opacity-100 transition-all scale-75 group-hover/pin:scale-100 whitespace-nowrap shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">{f.name}</p>
                  <p className="text-[8px] font-bold text-primary mb-1">{f.skills[0]}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black">{f.rating}★</span>
                    <span className="text-[8px] opacity-40">|</span>
                    <span className="text-[8px] font-bold uppercase">{f.location.split(',')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-white/50 shadow-premium flex items-center gap-10 z-30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Navigation className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Search</p>
                  <p className="text-lg font-black text-slate-900 leading-none">{locationSearch || 'Detecting Location...'}</p>
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <p className="text-xs font-black text-primary uppercase tracking-widest">{filteredFundis.length} Pros in Range</p>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Modal - Sky Blue & Red High Visibility */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] p-12 lg:p-20 max-w-2xl w-full shadow-2xl text-center relative overflow-hidden border border-white/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <button 
                onClick={() => setShowEmergencyModal(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-slate-50 transition-all text-slate-300"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="w-24 h-24 bg-red-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-red-200 animate-pulse">
                <Zap className="h-12 w-12 fill-current" />
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6 italic uppercase">Emergency Alert</h2>
              <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                Tuma Fundi will instantly dispatch the <span className="text-red-600 font-black">nearest 5-star professional</span>. 
                <br /><br />
                <span className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-black">ETA: Under 15 Minutes</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="h-20 flex-1 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-xs transition-all hover:bg-slate-50" onClick={() => setShowEmergencyModal(false)}>
                  Standard Booking
                </Button>
                <Button className="h-20 flex-1 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-red-200" onClick={handleEmergency}>
                  Dispatch Immediately
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};