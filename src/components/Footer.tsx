
import React from 'react';
import { Moon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <Moon size={24} className="text-primary mr-2" />
            <span className="text-xl font-medium text-gradient">SleepCycle</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <a 
              href="#calculator" 
              className="mb-4 md:mb-0 text-muted-foreground hover:text-foreground transition-all-200"
            >
              Calculator
            </a>
            <a 
              href="#cycles" 
              className="mb-4 md:mb-0 text-muted-foreground hover:text-foreground transition-all-200"
            >
              Sleep Cycles
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-all-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {currentYear} SleepCycle. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with sleep science in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
