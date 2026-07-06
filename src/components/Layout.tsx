import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { 
  Menu, X, User, LogOut, LayoutDashboard, 
  Search, Bell, Home, Settings, Wallet, Zap, 
  MessageSquare, PlusSquare, MapPin, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/attachments/ab1da22d-5cd6-4d1d-8bd6-481183c231d1/1779863487840_Tuma_Fundi_LOgo_new.jpeg";

export const Navbar = () => {
  const { currentUser, logout } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace', icon: Search },
    { name: 'Post a Job', path: '/post-job', icon: PlusSquare },
  ];

  if (currentUser) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
    
    if (currentUser.role === 'admin') {
      navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldCheck });
    }
  }

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome && !isOpen ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-4 group">
                <img 
                  src={LOGO_URL} 
                  alt="Tuma Fundi Logo" 
                  className="h-20 w-auto object-contain sm:h-28 transition-transform group-hover:scale-105"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none">Tuma Fundi</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dispatched. Verified. Delivered</span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
              
              <div className="h-8 w-px bg-slate-100 mx-4" />
              
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-2 pr-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-md shadow-primary/20">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-black text-slate-900 leading-none">{currentUser.name}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-black mt-1">{currentUser.role}</p>
                    </div>
                    <button onClick={handleLogout} className="ml-2 text-slate-300 hover:text-red-500 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 pl-2">
                  <Link to="/auth">
                    <Button variant="ghost" className="text-slate-600 font-black hover:bg-slate-50 rounded-2xl px-6">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl px-8 py-6 font-black uppercase tracking-widest text-xs">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-12 space-y-3">
                <div className="flex justify-center mb-8 pt-4">
                  <img src={LOGO_URL} alt="Tuma Fundi" className="h-20 w-auto" />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-5 px-6 py-5 rounded-2xl text-base font-black text-slate-600 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <link.icon className="h-6 w-6" />
                    {link.name}
                  </Link>
                ))}
                {!currentUser ? (
                  <div className="grid gap-4 pt-6 px-2">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full h-16 rounded-2xl font-black border-slate-200 uppercase tracking-widest text-xs">Sign In</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-16 rounded-2xl font-black bg-primary shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs">Sign Up</Button>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex w-full items-center gap-5 px-6 py-5 rounded-2xl text-base font-black text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-6 w-6" />
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Nav */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
          >
            <div className="bg-white/95 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.2)] rounded-[2.5rem] flex items-center justify-around p-4 border border-white/50">
              <Link to="/" className={`p-4 rounded-2xl transition-all ${location.pathname === '/' ? 'text-primary bg-primary/10' : 'text-slate-400'}`}>
                <Home className="h-6 w-6" />
              </Link>
              <Link to="/marketplace" className={`p-4 rounded-2xl transition-all ${location.pathname === '/marketplace' ? 'text-primary bg-primary/10' : 'text-slate-400'}`}>
                <Search className="h-6 w-6" />
              </Link>
              <Link to="/post-job" className="p-5 rounded-[1.5rem] bg-primary text-white shadow-2xl shadow-primary/40 -mt-12 transform active:scale-90 transition-transform">
                <PlusSquare className="h-8 w-8" />
              </Link>
              <Link to="/chat" className={`p-4 rounded-2xl transition-all ${location.pathname === '/chat' ? 'text-primary bg-primary/10' : 'text-slate-400'}`}>
                <MessageSquare className="h-6 w-6" />
              </Link>
              <Link to="/dashboard" className={`p-4 rounded-2xl transition-all ${location.pathname.startsWith('/dashboard') ? 'text-primary bg-primary/10' : 'text-slate-400'}`}>
                <User className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Footer = () => (
  <footer className="bg-slate-950 text-slate-300 pt-32 pb-12 px-6 overflow-hidden relative border-t border-white/5">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
    
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 relative z-10">
      <div className="col-span-1 md:col-span-1 lg:col-span-2">
        <Link to="/" className="inline-block mb-10 transition-transform hover:scale-105">
          <img src={LOGO_URL} alt="Tuma Fundi" className="h-24 w-auto brightness-0 invert" />
        </Link>
        <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10 font-medium italic">
          "The bridge between professional Kenyan artisans and households that demand quality, security and speed."
        </p>
        <div className="flex gap-5">
          {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map(social => (
            <button key={social} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
              <span className="sr-only">{social}</span>
              <div className="w-5 h-5 bg-current opacity-60 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Explore Platform</h3>
        <ul className="space-y-5 text-slate-400 font-bold text-sm">
          <li><Link to="/marketplace" className="hover:text-primary transition-all">Find Verified Fundi</Link></li>
          <li><Link to="/post-job" className="hover:text-primary transition-all">Post Service Request</Link></li>
          <li><Link to="/auth" className="hover:text-primary transition-all">Become a Partner</Link></li>
          <li><Link to="/" className="hover:text-primary transition-all">Trust & Safety</Link></li>
          <li><Link to="/" className="hover:text-primary transition-all">Help & Support</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Direct Connect</h3>
        <ul className="space-y-6 text-slate-400 font-bold text-sm">
          <li className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-white">Headquarters</p>
              <p className="text-xs font-medium text-slate-500 mt-1">View Park Towers, 17th Floor, Monrovia Street, Nairobi</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <Bell className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-white">Priority Dispatch</p>
              <p className="text-xs font-medium text-slate-500 mt-1">0735958052</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <Settings className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-white">Tech Support</p>
              <p className="text-xs font-medium text-slate-500 mt-1">info@tumafundi.ke</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto border-t border-white/5 mt-32 pt-12 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
      <div className="flex flex-col items-center md:items-start gap-2">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} TUMA FUNDI KENYA. Empowering Skilled Labor.
        </p>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest italic">Dispatched. Verified. Delivered.</p>
      </div>
      <div className="flex gap-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
        <button className="hover:text-slate-400 transition-colors tracking-tighter">Privacy Protocol</button>
        <button className="hover:text-slate-400 transition-colors tracking-tighter">Service Terms</button>
        <button className="hover:text-slate-400 transition-colors tracking-tighter">Security Stack</button>
      </div>
    </div>
  </footer>
);