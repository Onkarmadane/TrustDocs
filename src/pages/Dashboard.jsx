import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import ReportChart from '../components/dashboard/ReportChart';
import { FileText, CheckCircle, Clock, Layout, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';
import Heading from '../components/ui/Heading';
import { useNavigate } from 'react-router-dom';
import dashboardImg from '../assets/dashboard.png';
import useDocumentTitle from '../utils/useDocumentTitle';
import { dashboardService } from '../services/dashboardService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  useDocumentTitle('Dashboard');
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReports: 0,
    templates: 4,
    finalized: 0,
    drafts: 0,
    chartData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await dashboardService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        } else {
          toast.error("Failed to load dashboard statistics");
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
        toast.error("Error connecting to server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const formatCount = (num) => {
    if (num === undefined || num === null) return '00';
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20">

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pt-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 flex flex-col justify-between lg:min-h-[600px]">
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
              <div className="absolute inset-0 bg-brand-primary/10 blur-[60px] rounded-full group-hover:bg-brand-primary/20 transition-colors duration-700 will-change-transform" />
              <div className="relative z-10 h-full flex items-center justify-center p-8">
                <img src={dashboardImg} alt="Dashboard Hero" className="w-full h-auto object-contain max-h-[500px]" />
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center lg:place-items-start">
              <StatCard title="Total Reports" count={isLoading ? "..." : formatCount(stats.totalReports)} variant="primary" icon={FileText} />
              <StatCard title="Templates" count={isLoading ? "..." : formatCount(stats.templates)} icon={Layout} />
              <StatCard title="Finalized" count={isLoading ? "..." : formatCount(stats.finalized)} icon={CheckCircle} />
              <StatCard title="Drafts" count={isLoading ? "..." : formatCount(stats.drafts)} icon={Clock} />
            </div>

            {isLoading ? (
              <div className="h-[400px] bg-white border border-slate-100 shadow-sm rounded-3xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <ReportChart data={stats.chartData} />
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-20 h-20 flex items-center justify-center"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="circlePath"
                d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                fill="none"
              />
              <text className="text-[10px] font-bold fill-indigo-600/60 uppercase tracking-[0.18em]">
                <textPath href="#circlePath">
                  CREATE • CREATE • CREATE • CREATE • CREATE • CREATE • CREATE • CREATE • CREATE •
                </textPath>
              </text>
            </svg>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gradient-to-tr from-indigo-900 to-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 relative z-10 overflow-hidden"
            onClick={() => navigate('/create-report')}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <FileText
              size={22}
              className="group-hover:scale-110 transition-transform"
              strokeWidth={1.5}
            />

            <div className="absolute bottom-1 right-1 bg-white text-indigo-900 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold border border-indigo-900">
              +
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
