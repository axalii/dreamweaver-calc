
import React, { useState, useEffect } from 'react';
import { Moon, Sun, ArrowRight, Clock } from 'lucide-react';
import TimeInput from './TimeInput';
import { Slider } from './ui/slider';
import { 
  SleepTime,
  calculateBedTimes,
  calculateWakeUpTimes,
  formatTime,
  DEFAULT_SLEEP_DELAY_MINUTES
} from '@/utils/sleepUtils';

const SleepCalculator = () => {
  const [calculationType, setCalculationType] = useState<'bedtime' | 'wakeup' | 'now'>('now');
  const [wakeUpTime, setWakeUpTime] = useState<SleepTime>({ hours: 7, minutes: 0 });
  const [bedtime, setBedtime] = useState<SleepTime>({ hours: 22, minutes: 30 });
  const [currentTime, setCurrentTime] = useState<SleepTime>({ hours: 0, minutes: 0 });
  const [sleepDelay, setSleepDelay] = useState<number>(DEFAULT_SLEEP_DELAY_MINUTES);
  const [results, setResults] = useState<SleepTime[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Initialize and calculate on first render
  useEffect(() => {
    updateCurrentTime();
    calculateResults();
  }, []);

  // Re-calculate when calculation type or sleep delay changes
  useEffect(() => {
    if (calculationType === 'now') {
      updateCurrentTime();
    }
    calculateResults();
  }, [calculationType, sleepDelay]);

  // Auto calculate for bedtime when wakeup time changes
  useEffect(() => {
    if (calculationType === 'bedtime') {
      calculateResults();
    }
  }, [wakeUpTime, sleepDelay]);

  // Auto calculate for wakeup when bedtime changes
  useEffect(() => {
    if (calculationType === 'wakeup') {
      calculateResults();
    }
  }, [bedtime, sleepDelay]);

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime({
      hours: now.getHours(),
      minutes: now.getMinutes()
    });
  };

  const calculateResults = () => {
    if (calculationType === 'bedtime') {
      setResults(calculateBedTimes(wakeUpTime, sleepDelay));
    } else if (calculationType === 'wakeup') {
      setResults(calculateWakeUpTimes(bedtime, sleepDelay));
    } else if (calculationType === 'now') {
      // If "If I sleep now" is selected, calculate wake-up times using the current time
      updateCurrentTime(); // Refresh current time right before calculation
      setResults(calculateWakeUpTimes(currentTime, sleepDelay));
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
    <section id="calculator" className="py-10 px-6">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gradient">Sleep Cycle Calculator</h2>
          <p className="text-muted-foreground">
            Calculate optimal sleep times based on 90-minute sleep cycles.
          </p>
        </div>

        <div className="glass rounded-xl overflow-hidden shadow-xl">
          {/* Calculation Type Selection */}
          <div className="flex flex-wrap md:flex-nowrap justify-between p-4 glass border-b border-white/10">
            <button 
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all-200 m-1 ${
                calculationType === 'bedtime' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => toggleCalculationType('bedtime')}
            >
              <Moon size={16} className={calculationType === 'bedtime' ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm">Wake up at...</span>
            </button>
            
            <button 
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all-200 m-1 ${
                calculationType === 'wakeup' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => toggleCalculationType('wakeup')}
            >
              <Sun size={16} className={calculationType === 'wakeup' ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm">Go to bed at...</span>
            </button>

            <button 
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all-200 m-1 ${
                calculationType === 'now' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => toggleCalculationType('now')}
            >
              <Clock size={16} className={calculationType === 'now' ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm">Sleep now</span>
            </button>
          </div>
          
          <div className="p-5">
            {/* Time Input for Bedtime and Wakeup modes */}
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
              <div className="py-2">
                <p className="text-center">
                  Current time: <span className="font-medium">{formatTime(currentTime.hours, currentTime.minutes)}</span>
                </p>
              </div>
            )}

            {/* Sleep Delay Slider */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground/90">
                  Time to fall asleep: <span className="font-bold text-primary">{sleepDelay} minutes</span>
                </label>
              </div>
              <Slider
                defaultValue={[sleepDelay]}
                min={5}
                max={30}
                step={1}
                onValueChange={(value) => setSleepDelay(value[0])}
                className="my-4"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Average person takes about 15 minutes to fall asleep.
              </p>
            </div>
          </div>
          
          {hasCalculated && (
            <div className="p-5 bg-secondary/30 animate-fade-in">
              <h3 className="text-lg font-medium mb-3">
                {calculationType === 'bedtime' 
                  ? 'Recommended bedtimes:' 
                  : 'Recommended wake-up times:'}
              </h3>
              
              {/* Display results in two rows */}
              <div className="space-y-3">
                {/* First row - cycles 7, 6, 5 */}
                <div className="grid grid-cols-3 gap-2">
                  {getDisplayResults().firstRow.map((time, index) => {
                    // For first row, cycles are 7, 6, 5
                    const cycleNum = 7 - index;
                    
                    return (
                      <div 
                        key={`row1-${index}`} 
                        className="glass p-3 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium">
                              {formatTime(time.hours, time.minutes)}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {cycleNum} cycles • {cycleNum * 1.5}h
                            </p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getQualityColor(cycleNum)}`}>
                            {cycleNum}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Second row - cycles 4, 3, 2 */}
                <div className="grid grid-cols-3 gap-2">
                  {getDisplayResults().secondRow.map((time, index) => {
                    // For second row, cycles are 4, 3, 2
                    const cycleNum = 4 - index;
                    
                    return (
                      <div 
                        key={`row2-${index}`} 
                        className="glass p-3 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium">
                              {formatTime(time.hours, time.minutes)}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {cycleNum} cycles • {cycleNum * 1.5}h
                            </p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getQualityColor(cycleNum)}`}>
                            {cycleNum}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <p className="mt-4 text-muted-foreground text-xs">
                For optimal sleep, aim for 5-6 complete sleep cycles (7.5-9 hours).
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 glass rounded-lg">
          <h3 className="text-lg font-medium mb-2">Quick Facts</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
            <li>Each sleep cycle lasts approximately 90 minutes</li>
            <li>Most adults need 5-6 complete cycles (7.5-9 hours)</li>
            <li>Waking up between cycles helps you feel more refreshed</li>
            <li>The average person takes about 15 minutes to fall asleep</li>
          </ul>
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
