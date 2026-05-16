import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { steps } from './steps';

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-between w-full relative">
    {/* Background Line (Gray) - Starts at center of 1st, ends at center of last */}
    <div className="absolute top-[17px] left-[8.33%] right-[8.33%] h-[2px] bg-slate-50" />

    {/* Progress Line (Blue) */}
    <motion.div
      className="absolute top-[17px] left-[8.33%] h-[2px] bg-blue-600 z-0 origin-left"
      initial={{ width: 0 }}
      animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 83.33}%` }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />

    {steps.map((step) => (
      <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
        {/* Step Circle */}
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-500 relative",
          currentStep === step.id ? "gradient text-white shadow-lg shadow-blue-500/30 scale-105" :
            currentStep > step.id ? "bg-blue-600 text-white" : "bg-white text-slate-300 border-2 border-slate-100"
        )}>
          {step.id}
        </div>

        {/* Step Label */}
        <span className={cn(
          "mt-3 text-[10px] font-bold uppercase tracking-wider text-center whitespace-pre-line leading-tight transition-colors duration-500",
          currentStep === step.id ? "text-blue-600" : "text-slate-400"
        )}>
          {step.name}
        </span>
      </div>
    ))}
  </div>
);

export default StepIndicator;
