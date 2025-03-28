
import React from 'react';
import TimeInput from './TimeInput';
import { formatTime } from '@/utils/sleepUtils';
import { useSleepCalculator } from '@/hooks/use-sleep-calculator';
import CalculationTypeSelector from './sleep-calculator/CalculationTypeSelector';
import SleepDelaySlider from './sleep-calculator/SleepDelaySlider';
import ResultDisplay from './sleep-calculator/ResultDisplay';
import QuickFacts from './sleep-calculator/QuickFacts';

const SleepCalculator = () => {
  const {
    calculationType,
    wakeUpTime,
    bedtime,
    currentTime,
    sleepDelay,
    results,
    hasCalculated,
    setWakeUpTime,
    setBedtime,
    setSleepDelay,
    toggleCalculationType
  } = useSleepCalculator();

  return (
    <section id="calculator" className="py-6 px-4 sm:py-10 sm:px-6">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gradient">Sleep Cycle Calculator</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Calculate optimal sleep times based on 90-minute sleep cycles.
          </p>
        </div>

        <div className="glass rounded-xl overflow-hidden shadow-xl">
          {/* Calculation Type Selection */}
          <CalculationTypeSelector 
            calculationType={calculationType} 
            onTypeChange={toggleCalculationType}
          />
          
          <div className="p-4 sm:p-5">
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
            <SleepDelaySlider sleepDelay={sleepDelay} onChange={setSleepDelay} />
          </div>
          
          {hasCalculated && (
            <ResultDisplay 
              results={results} 
              calculationType={calculationType} 
              hasCalculated={hasCalculated}
            />
          )}
        </div>
        
        <QuickFacts />
      </div>
    </section>
  );
};

export default SleepCalculator;
