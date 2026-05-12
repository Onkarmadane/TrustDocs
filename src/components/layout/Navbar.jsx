import { Search, User, FileText, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
    <nav className="relative z-50">
      <div className="flex items-center justify-between px-6 lg:px-12 py-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 w-1/4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">TrustDOCS</span>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 p-1.5 rounded-full ">
          <NavLinks />
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          <button className="w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm hidden sm:flex">
            <Search size={18} />
          </button>
          
          <div className="flex items-center gap-3 pl-2 hidden sm:flex">
            <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm overflow-hidden">
              <User size={20} />
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-[12px] font-bold text-slate-800 leading-none">Admin</p>
              <p className="text-[10px] text-slate-400 mt-0.5">admin@gmail.com</p>
            </div>
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

      {/* Mobile Menu (Overlay) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-6 lg:hidden"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-2xl p-6 space-y-4">
              <NavLinks mobile />
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Admin</p>
                  <p className="text-sm text-slate-500">admin@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
