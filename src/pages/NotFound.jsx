import React from 'react';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 text-center relative overflow-hidden">
      {/* Decorative gradient blurs in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-brand-secondary/5 blur-[80px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full px-6 py-12 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto bg-gradient-to-tr from-indigo-900 to-blue-600 w-24 h-24 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-500/20"
        >
          <FileQuestion size={48} strokeWidth={1.5} />
        </motion.div>

        {/* Text content */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl font-extrabold text-indigo-950 tracking-tight mb-2"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold text-slate-800 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-slate-500 mb-10 leading-relaxed text-sm"
        >
          Oops! The page you are looking for doesn't exist, was moved, or has a typo in the URL.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold transition-all duration-300 shadow-sm active:scale-95"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-tr from-indigo-900 to-blue-600 text-white hover:opacity-95 font-semibold transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95"
          >
            <Home size={16} />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;