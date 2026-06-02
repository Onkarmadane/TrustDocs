import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { steps } from './steps';

const StepIndicator = ({ currentStep }) => (
  <div className="w-full overflow-x-auto pb-4">
    <div className="flex items-start justify-between w-full relative min-w-full pt-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center relative z-10 flex-1 min-w-[100px] shrink-0">

          {index < steps.length - 1 && (
            <div className="absolute top-[18px] left-[50%] w-full h-[2px] bg-slate-200 z-0" />
          )}
          {index < steps.length - 1 && currentStep > step.id && (
            <div className="absolute top-[18px] left-[50%] w-full h-[2px] bg-blue-600 z-0" />
          )}

          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-500 relative z-10",
            currentStep === step.id ? "gradient text-white shadow-lg shadow-blue-500/30 scale-105" :
              currentStep > step.id ? "bg-blue-600 text-white" : "bg-white text-slate-300 border-2 border-slate-100"
          )}>
            {step.id}
          </div>

          <span className={cn(
            "mt-3 text-[10px] font-medium  tracking-wider text-center whitespace-pre-line leading-tight transition-colors duration-500",
            currentStep === step.id ? "text-blue-600" : "text-slate-400"
          )}>
            {step.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default StepIndicator;
