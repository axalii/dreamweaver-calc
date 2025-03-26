
import React, { useState } from 'react';
import { Moon, Sun, ArrowRight } from 'lucide-react';
import TimeInput from './TimeInput';
import { 
  SleepTime,
  calculateBedTimes,
  calculateWakeUpTimes,
  formatTime
} from '@/utils/sleepUtils';

const SleepCalculator = () => {
  const [calculationType, setCalculationType] = useState<'bedtime' | 'wakeup'>('bedtime');
  const [wakeUpTime, setWakeUpTime] = useState<SleepTime>({ hours: 7, minutes: 0 });
  const [bedtime, setBedtime] = useState<SleepTime>({ hours: 22, minutes: 30 });
  const [results, setResults] = useState<SleepTime[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    if (calculationType === 'bedtime') {
      setResults(calculateBedTimes(wakeUpTime));
    } else {
      setResults(calculateWakeUpTimes(bedtime));
    }
    setHasCalculated(true);
  };

  const toggleCalculationType = () => {
    setCalculationType(calculationType === 'bedtime' ? 'wakeup' : 'bedtime');
    setHasCalculated(false);
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
          <div className="flex justify-between p-5 glass border-b border-white/10">
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all-200 ${
                calculationType === 'bedtime' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                if (calculationType !== 'bedtime') toggleCalculationType();
              }}
            >
              <Moon size={18} className={calculationType === 'bedtime' ? 'text-primary' : 'text-muted-foreground'} />
              <span>I want to wake up at...</span>
            </button>
            
            <button 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all-200 ${
                calculationType === 'wakeup' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                if (calculationType !== 'wakeup') toggleCalculationType();
              }}
            >
              <Sun size={18} className={calculationType === 'wakeup' ? 'text-primary' : 'text-muted-foreground'} />
              <span>I want to go to bed at...</span>
            </button>
          </div>
          
          <div className="p-6">
            {calculationType === 'bedtime' ? (
              <TimeInput 
                id="wakeup-time"
                label="What time do you want to wake up?"
                value={wakeUpTime}
                onChange={setWakeUpTime}
              />
            ) : (
              <TimeInput 
                id="bedtime"
                label="What time do you want to go to bed?"
                value={bedtime}
                onChange={setBedtime}
              />
            )}
            
            <button 
              onClick={handleCalculate}
              className="mt-4 w-full py-3 bg-primary hover:bg-primary/90 transition-all-200 rounded-lg flex items-center justify-center space-x-2 text-primary-foreground"
            >
              <span>Calculate</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          {hasCalculated && (
            <div className="p-6 bg-secondary/50 animate-fade-in">
              <h3 className="text-xl font-medium mb-4">
                {calculationType === 'bedtime' 
                  ? 'Recommended bedtimes:' 
                  : 'Recommended wake-up times:'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((time, index) => (
                  <div 
                    key={index} 
                    className="glass p-4 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-medium">
                          {formatTime(time.hours, time.minutes)}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {6 - index} sleep cycles • {(6 - index) * 1.5} hours of sleep
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getQualityColor(6 - index)}`}>
                        {6 - index}
                      </div>
                    </div>
                  </div>
                ))}
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
