
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  const handleScrollDown = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className={cn(
          "absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl transition-all duration-1000",
          loaded ? "top-1/4 left-1/4 opacity-40" : "top-1/3 left-1/3 opacity-0"
        )}/>
        <div className={cn(
          "absolute w-96 h-96 rounded-full bg-accent/10 blur-3xl transition-all duration-1000 delay-300",
          loaded ? "bottom-1/4 right-1/4 opacity-40" : "bottom-1/3 right-1/3 opacity-0"
        )}/>
      </div>
      
      <div className="container relative z-10 px-6 text-center">
        <div className={cn(
          "transition-all duration-1000 transform",
          loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <span className="inline-block glass-light px-4 py-2 rounded-full text-sm mb-6">
            Sleep Better, Live Better
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Optimize Your <span className="text-gradient">Sleep Cycles</span>
            <br />
            Wake Up Refreshed
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Calculate the perfect bedtime or wake-up time based on natural sleep cycles to improve your rest and energy.
          </p>
          
          <div>
            <button
              onClick={handleScrollDown}
              className="bg-primary hover:bg-primary/90 transition-all-200 text-primary-foreground px-8 py-4 rounded-lg font-medium"
            >
              Calculate Now
            </button>
          </div>
        </div>
        
        <div className={cn(
          "absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000",
          loaded ? "opacity-100" : "opacity-0"
        )}>
          <button
            onClick={handleScrollDown}
            className="animate-float glass-light w-12 h-12 rounded-full flex items-center justify-center"
            aria-label="Scroll down"
          >
            <ChevronDown size={20} className="text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
