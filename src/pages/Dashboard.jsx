import React from 'react';
import Navbar from '../components/layout/Navbar';
import StatCard from '../components/dashboard/StatCard';
import ReportChart from '../components/dashboard/ReportChart';
import { FileText, CheckCircle, Clock, Layout, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';
import Heading from '../components/ui/Heading';

const Dashboard = () => {
  return (
    <div className="min-h-screen text-slate-900 pb-20">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-8 pt-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Section - Heading & Illustration */}
          <div className="lg:col-span-5 flex flex-col justify-between min-h-[600px]">
            <div>
              <Heading
                title="Dashboard"
                subtitle="Welcome back. Pick a template to start a new report."
                className="mb-12"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group flex-1"
            >
              <div className="absolute inset-0 bg-brand-primary/10 blur-[120px] rounded-full group-hover:bg-brand-primary/20 transition-colors duration-700" />
              <div className="relative z-10 h-full flex items-center justify-center p-8">
                <Image src="/dashboard.png" alt="Dashboard Hero" className="w-full h-auto object-contain max-h-[500px]" />
              </div>
            </motion.div>
          </div>

          {/* Right Section - Stats & Charts */}
          <div className="lg:col-span-7 space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center lg:place-items-start">
              <StatCard title="Total Reports" count="01" variant="primary" icon={FileText} />
              <StatCard title="Templates" count="01" icon={Layout} />
              <StatCard title="Finalized" count="01" icon={CheckCircle} />
              <StatCard title="Drafts" count="01" icon={Clock} />
            </div>

            <ReportChart />
          </div>
        </div>
      </main>

      {/* Premium Circular Floating Button */}
      <div className="fixed bottom-12 right-12 z-50 group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-32 h-32 flex items-center justify-center"
        >
          {/* Rotating Text */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="circlePath"
                d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                fill="none"
              />
              <text className="text-[9px] font-bold fill-indigo-600/60 uppercase tracking-[0.25em]">
                <textPath href="#circlePath">
                  CREATE • CREATE • CREATE • CREATE •
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Central Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-900 to-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 relative z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <FileText size={28} className="group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <div className="absolute bottom-4 right-4 bg-white text-indigo-900 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-indigo-900">
              +
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
