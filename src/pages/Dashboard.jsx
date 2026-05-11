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

      <main className="max-w-[1600px] mx-auto px-8 pt-12">
        <Heading
          title="Dashboard"
          subtitle="Welcome back. Pick a template to start a new report."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Hero/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative group"
          >
            <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full group-hover:bg-brand-primary/30 transition-colors duration-700" />
            <div className="relative z-10 h-full flex items-center justify-center p-12 rounded-[3rem] overflow-hidden ">
              {/* Abstract 3D Paper Stack & Shield representation */}
              <Image src="/dashboard.png" alt="Dashboard Hero" className="w-full h-full object-contain" />
            </div>
          </motion.div>

          {/* Right Section - Stats & Charts */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard title="Total Reports" count="01" variant="primary" icon={FileText} />
              <StatCard title="Templates" count="01" icon={Layout} />
              <StatCard title="Finalized" count="01" icon={CheckCircle} />
              <StatCard title="Drafts" count="01" icon={Clock} />
            </div>

            <ReportChart />
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 z-50"
      >
        <button className="w-16 h-16 bg-brand-primary text-white rounded-full shadow-2xl shadow-brand-primary/50 flex items-center justify-center group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <MousePointer2 className="relative z-10 group-hover:rotate-12 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
