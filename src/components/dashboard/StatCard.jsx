import React from 'react';
import { FileText } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';

const StatCard = ({ title, count, icon: Icon, variant = 'default' }) => {
  const variants = {
    default: 'bg-white border-slate-100 shadow-sm',
    primary: 'gradient shadow-blue-500/20 text-white',
  };

  return (
    <Card className={cn("p-8 group relative overflow-hidden w-[350px] h-[130px] justify-center", variants[variant])}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className={cn(
            "text-xs font-bold uppercase tracking-wider mb-4",
            variant === 'primary' ? "text-blue-100" : "text-slate-400"
          )}>{title}</h3>
          <p className={cn(
            "text-5xl font-bold transition-transform duration-500 origin-left group-hover:scale-105",
            variant === 'primary' ? "text-white" : "text-slate-900"
          )}>
            {count}
          </p>
        </div>
        <div className={cn(
          "p-4 rounded-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg",
          variant === 'primary' ? "bg-indigo-900/50 text-white" : "bg-blue-600 text-white shadow-blue-500/30"
        )}>
          {Icon ? <Icon size={24} /> : <FileText size={24} />}
        </div>
      </div>

      {/* Dotted Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>
      {variant === 'primary' && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
      )}
    </Card>
  );
};

export default StatCard;
