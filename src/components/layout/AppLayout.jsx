import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { cn } from '../../lib/utils';

const AppLayout = () => {
  const location = useLocation();
  const isTemplatesPage = location.pathname === '/templates';

  return (
    <div className={cn(
      "min-h-screen pb-5 relative",
      isTemplatesPage ? "bg-[#F8FAFF]" : "text-slate-900"
    )}>
      {/* Background Decorative Gradients for Templates page wrapped in a bounded absolute layer to prevent horizontal scroll */}
      {isTemplatesPage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-400/5 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform transform-gpu" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[60px] rounded-full translate-x-1/4 translate-y-1/4 will-change-transform transform-gpu" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-400/10 blur-[60px] rounded-full translate-x-1/3 will-change-transform transform-gpu" />
        </div>
      )}

      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
