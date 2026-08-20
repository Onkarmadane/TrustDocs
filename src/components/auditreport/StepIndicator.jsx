import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { steps as auditSteps } from './steps';

const StepIndicator = ({ currentStep, steps = auditSteps, onStepClick }) => (
  <div className="w-full overflow-x-auto pb-4">
    <div className="flex items-start justify-between w-full relative min-w-full pt-2">
      {steps.map((step, index) => {
        const isClickable = !!onStepClick;
        return (
          <div
            key={step.id}
            onClick={() => isClickable && onStepClick(step.id)}
            className={cn(
              "flex flex-col items-center relative z-10 flex-1 min-w-[100px] shrink-0",
              isClickable && "cursor-pointer group select-none"
            )}
          >
            {index < steps.length - 1 && (
              <div className="absolute top-[18px] left-[50%] w-full h-[2px] bg-slate-200 z-0 pointer-events-none" />
            )}
            {index < steps.length - 1 && currentStep > step.id && (
              <div className="absolute top-[18px] left-[50%] w-full h-[2px] bg-blue-600 z-0 pointer-events-none" />
            )}

            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 relative z-10",
                currentStep === step.id
                  ? "gradient text-white shadow-lg shadow-blue-500/30 scale-105"
                  : currentStep > step.id
                  ? "bg-blue-600 text-white group-hover:bg-blue-700"
                  : "bg-white text-slate-400 border-2 border-slate-200 group-hover:border-blue-400 group-hover:text-blue-600"
              )}
            >
              {step.id}
            </div>

            <span
              className={cn(
                "mt-3 text-[10px] font-medium tracking-wider text-center whitespace-pre-line leading-tight transition-colors duration-300",
                currentStep === step.id
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 group-hover:text-blue-600"
              )}
            >
              {step.name || step.title}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default StepIndicator;
