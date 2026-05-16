import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Card = ({ className, children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'glass-card rounded-[27px] p-8 overflow-hidden relative group transition-all duration-500 ',
        className
      )}
      {...props}
    >
      {/* Premium Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Subtle Inner Glow */}
      <div className="absolute -inset-[5px] bg-gradient-to-br from-white/40 to-transparent rounded-[2.5rem] pointer-events-none opacity-50" />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};


export default Card;
