import { Search, User, FileText, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinks = ({ mobile = false }) => {
    const links = [
      { name: 'Home', path: '/' },
      { name: '+ Create Report', path: '/create-report' },
      { name: 'All Reports', path: '/all-reports' },
      { name: 'Templates', path: '/templates' },
    ];

    return (
      <div className={cn(
        "flex items-center gap-3",
        mobile ? "flex-col w-full" : ""
      )}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "rounded-full px-8 py-2.5 font-semibold text-xs transition-all duration-300 flex items-center justify-center whitespace-nowrap",
                isActive
                  ? "gradient text-white shadow-lg shadow-blue-500/40"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-50",
                mobile ? "w-full py-4 text-sm" : ""
              )}
              onClick={() => mobile && setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <nav className={cn(
      "sticky top-0 transition-all duration-300",
      isMenuOpen ? "z-[100]" : "z-50",
      scrolled ? "bg-white shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center justify-between px-6 lg:px-12 py-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 w-1/4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">TrustDOCS</span>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 p-1.5 rounded-full ">
          <NavLinks />
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          {/* <button className="w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm hidden sm:flex">
            <Search size={18} />
          </button> */}

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 hidden sm:flex hover:bg-slate-50 p-1.5 rounded-2xl transition-all"
            >
              <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm overflow-hidden">
                <User size={20} />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[12px] font-bold text-slate-800 leading-none">{user?.fullName || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{user?.email || 'admin@gmail.com'}</p>
              </div>
              <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden py-2"
                >
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800">{user?.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Fullscreen) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-[100] lg:hidden flex flex-col"
          >
            {/* Header inside menu */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-800">TrustDOCS</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="flex flex-col items-center justify-center flex-1">
                <NavLinks mobile />
              </div>

              {/* User info at bottom */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{user?.fullName || 'Admin'}</p>
                    <p className="text-sm text-slate-500">{user?.email || 'admin@gmail.com'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-600"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
