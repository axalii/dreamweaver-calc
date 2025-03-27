
import React, { useState, useEffect } from 'react';
import { Moon, Sun, ArrowRight } from 'lucide-react';
import TimeInput from './TimeInput';
import { 
  SleepTime,
  calculateBedTimes,
  calculateWakeUpTimes,
  formatTime
} from '@/utils/sleepUtils';

const SleepCalculator = () => {
  const [calculationType, setCalculationType] = useState<'bedtime' | 'wakeup' | 'now'>('now');
  const [wakeUpTime, setWakeUpTime] = useState<SleepTime>({ hours: 7, minutes: 0 });
  const [bedtime, setBedtime] = useState<SleepTime>({ hours: 22, minutes: 30 });
  const [currentTime, setCurrentTime] = useState<SleepTime>({ hours: 0, minutes: 0 });
  const [results, setResults] = useState<SleepTime[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Initialize and calculate on first render
  useEffect(() => {
    updateCurrentTime();
    calculateResults();
  }, []);

  // Re-calculate when calculation type changes
  useEffect(() => {
    if (calculationType === 'now') {
      updateCurrentTime();
    }
    calculateResults();
  }, [calculationType]);

  // Auto calculate for bedtime when wakeup time changes
  useEffect(() => {
    if (calculationType === 'bedtime') {
      calculateResults();
    }
  }, [wakeUpTime]);

  // Auto calculate for wakeup when bedtime changes
  useEffect(() => {
    if (calculationType === 'wakeup') {
      calculateResults();
    }
  }, [bedtime]);

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime({
      hours: now.getHours(),
      minutes: now.getMinutes()
    });
  };

  const calculateResults = () => {
    if (calculationType === 'bedtime') {
      setResults(calculateBedTimes(wakeUpTime));
    } else if (calculationType === 'wakeup') {
      setResults(calculateWakeUpTimes(bedtime));
    } else if (calculationType === 'now') {
      // If "If I sleep now" is selected, calculate wake-up times using the current time
      updateCurrentTime(); // Refresh current time right before calculation
      setResults(calculateWakeUpTimes(currentTime));
    }
    setHasCalculated(true);
  };

  const toggleCalculationType = (type: 'bedtime' | 'wakeup' | 'now') => {
    setCalculationType(type);
  };

  // Create two rows of results for display
  const getDisplayResults = () => {
    let displayResults: SleepTime[] = [];
    
    if (calculationType === 'bedtime') {
      // For bedtime, we want to display cycles from 7 down to 2
      // First, add the required number of cycles if not enough
      if (results.length < 6) {
        const extended = [...results];
        const lastResult = extended[extended.length - 1];
        
        // Add cycles 7 and/or 2 if missing (original only shows 6-3 cycles)
        if (extended.length === 4) { // original shows 6,5,4,3
          const cycle7 = { ...lastResult }; // Use cycle 3 as base for calculation
          const cycle2 = { ...results[0] }; // Use cycle 6 as base for calculation
          extended.push(cycle7); // Add as cycle 7
          extended.unshift(cycle2); // Add as cycle 2
        }
        
        displayResults = extended;
      } else {
        displayResults = results;
      }
      
      // Ensure we have results in descending order (7,6,5,4,3,2)
      displayResults = displayResults.sort((a, b) => {
        // Sort logic based on time - later times first
        const aMinutes = a.hours * 60 + a.minutes;
        const bMinutes = b.hours * 60 + b.minutes;
        return bMinutes - aMinutes;
      });
    } else {
      // For wakeup and now calculations, sort in ascending order by time
      displayResults = [...results].sort((a, b) => {
        const aMinutes = a.hours * 60 + a.minutes;
        const bMinutes = b.hours * 60 + b.minutes;
        return aMinutes - bMinutes;
      });
      
      // Ensure we have 6 cycles (7,6,5,4,3,2)
      if (displayResults.length < 6) {
        while (displayResults.length < 6) {
          // Add placeholder cycles if needed
          const lastTime = displayResults[displayResults.length - 1];
          const newTime = { ...lastTime };
          displayResults.push(newTime);
        }
      }
    }
    
    // Split into two rows (7,6,5) and (4,3,2)
    const firstRow = displayResults.slice(0, 3);  // 7, 6, 5 cycles
    const secondRow = displayResults.slice(3, 6); // 4, 3, 2 cycles
    
    return { firstRow, secondRow };
  };

  return (
    <section id="calculator" className="min-h-screen py-24 px-6">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Sleep Calculator</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our sleep calculator helps you determine the optimal times to fall asleep or wake up based on sleep cycles.
            Each cycle lasts approximately 90 minutes.
          </p>
        </div>

        <div className="glass rounded-2xl overflow-hidden shadow-xl animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="flex flex-wrap justify-between p-5 glass border-b border-white/10">
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all-200 ${
                calculationType === 'bedtime' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => toggleCalculationType('bedtime')}
            >
              <Moon size={18} className={calculationType === 'bedtime' ? 'text-primary' : 'text-muted-foreground'} />
              <span>I want to wake up at...</span>
            </button>
            
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all-200 ${
                calculationType === 'wakeup' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => toggleCalculationType('wakeup')}
            >
              <Sun size={18} className={calculationType === 'wakeup' ? 'text-primary' : 'text-muted-foreground'} />
              <span>I want to go to bed at...</span>
            </button>

            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all-200 ${
                calculationType === 'now' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => toggleCalculationType('now')}
            >
              <Sun size={18} className={calculationType === 'now' ? 'text-primary' : 'text-muted-foreground'} />
              <span>If I sleep now...</span>
            </button>
          </div>
          
          <div className="p-6">
            {calculationType === 'bedtime' && (
              <TimeInput 
                id="wakeup-time"
                label="What time do you want to wake up?"
                value={wakeUpTime}
                onChange={setWakeUpTime}
              />
            )}
            
            {calculationType === 'wakeup' && (
              <TimeInput 
                id="bedtime"
                label="What time do you want to go to bed?"
                value={bedtime}
                onChange={setBedtime}
              />
            )}

            {calculationType === 'now' && (
              <div className="py-3">
                <p className="text-center text-lg">
                  Current time: <span className="font-medium">{formatTime(currentTime.hours, currentTime.minutes)}</span>
                </p>
                <p className="text-muted-foreground text-center text-sm mt-2">
                  We'll calculate the best times to wake up if you fall asleep now.
                </p>
              </div>
            )}
          </div>
          
          {hasCalculated && (
            <div className="p-6 bg-secondary/50 animate-fade-in">
              <h3 className="text-xl font-medium mb-4">
                {calculationType === 'bedtime' 
                  ? 'Recommended bedtimes:' 
                  : 'Recommended wake-up times:'}
              </h3>
              
              {/* Display results in two rows */}
              <div className="space-y-4">
                {/* First row - cycles 7, 6, 5 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getDisplayResults().firstRow.map((time, index) => {
                    // For first row, cycles are 7, 6, 5
                    const cycleNum = 7 - index;
                    
                    return (
                      <div 
                        key={`row1-${index}`} 
                        className="glass p-4 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-medium">
                              {formatTime(time.hours, time.minutes)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {cycleNum} sleep cycles • {cycleNum * 1.5} hours of sleep
                            </p>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getQualityColor(cycleNum)}`}>
                            {cycleNum}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Second row - cycles 4, 3, 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getDisplayResults().secondRow.map((time, index) => {
                    // For second row, cycles are 4, 3, 2
                    const cycleNum = 4 - index;
                    
                    return (
                      <div 
                        key={`row2-${index}`} 
                        className="glass p-4 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-medium">
                              {formatTime(time.hours, time.minutes)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {cycleNum} sleep cycles • {cycleNum * 1.5} hours of sleep
                            </p>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getQualityColor(cycleNum)}`}>
                            {cycleNum}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <p className="mt-6 text-muted-foreground text-sm">
                For optimal sleep, aim for 5-6 complete sleep cycles. Most adults need between 7.5-9 hours of sleep per night.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Helper function to get color based on sleep quality
function getQualityColor(cycles: number): string {
  if (cycles < 4) return 'bg-destructive/20 text-destructive';
  if (cycles < 5) return 'bg-primary/20 text-primary';
  return 'bg-accent/20 text-accent';
}

export default SleepCalculator;
