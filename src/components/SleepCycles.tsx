
import React from 'react';
import { Moon, Brain, Activity, CloudMoon } from 'lucide-react';
import { cn } from '@/lib/utils';

const SleepCycles = () => {
  const cycles = [
    {
      stage: "Stage 1: Light Sleep",
      icon: <CloudMoon size={28} />,
      color: "from-blue-400/20 to-blue-500/10",
      description: "Your body begins to relax, and you may experience sudden muscle contractions. This stage typically lasts 5-10 minutes.",
      percentage: "5%"
    },
    {
      stage: "Stage 2: Deeper Sleep",
      icon: <Moon size={28} />,
      color: "from-indigo-400/20 to-indigo-500/10",
      description: "Your body temperature drops and heart rate slows. Brain waves show brief bursts of activity. This stage makes up about 50% of your total sleep time.",
      percentage: "45%"
    },
    {
      stage: "Stage 3: Deep Sleep",
      icon: <Brain size={28} />,
      color: "from-purple-400/20 to-purple-500/10",
      description: "This is restorative sleep that helps your body recover. It's difficult to wake someone during this stage. Blood flow is directed away from the brain and towards muscles.",
      percentage: "25%"
    },
    {
      stage: "REM Sleep",
      icon: <Activity size={28} />,
      color: "from-pink-400/20 to-pink-500/10",
      description: "Your brain is highly active during this stage, similar to when you're awake. This is when most dreaming occurs. REM sleep is essential for cognitive functions.",
      percentage: "25%"
    }
  ];

  return (
    <section id="cycles" className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Understanding Sleep Cycles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete sleep cycle takes about 90 minutes. During the night, you typically go through 4-6 complete sleep cycles. Understanding these stages can help you optimize your sleep.
          </p>
        </div>
        
        <div className="relative">
          {/* The connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5"></div>
          
          {/* Sleep cycles */}
          <div className="space-y-12 lg:space-y-0">
            {cycles.map((cycle, index) => (
              <div 
                key={index} 
                className={cn(
                  "lg:flex items-center",
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* Content */}
                <div className="lg:w-5/12 glass rounded-xl p-6 lg:p-8 mb-6 lg:mb-0 animate-fade-in opacity-0" style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cycle.color} flex items-center justify-center text-primary mr-4`}>
                      {cycle.icon}
                    </div>
                    <h3 className="text-xl font-medium">{cycle.stage}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">{cycle.description}</p>
                  <div className="bg-secondary rounded-full h-2 w-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: cycle.percentage }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cycle.percentage} of total sleep time
                  </p>
                </div>
                
                {/* Middle dot for timeline on large screens */}
                <div className="hidden lg:flex lg:w-2/12 justify-center">
                  <div className={`w-6 h-6 rounded-full bg-primary animate-pulse-slow`}></div>
                </div>
                
                {/* Empty space to balance the layout */}
                <div className="lg:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 glass p-8 rounded-xl animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <h3 className="text-xl font-medium mb-4">Why Sleep Cycles Matter</h3>
          <p className="text-muted-foreground mb-4">
            Waking up in the middle of a deep sleep cycle can leave you feeling groggy and tired, even if you've slept for a long time. Ideally, you should wake up during light sleep (Stage 1 or REM).
          </p>
          <p className="text-muted-foreground">
            Our calculator helps you determine the best times to fall asleep or wake up by ensuring you complete full sleep cycles, helping you wake up feeling refreshed and energized.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SleepCycles;
