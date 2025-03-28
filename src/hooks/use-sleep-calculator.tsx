
import { useState, useEffect } from 'react';
import { 
  SleepTime,
  calculateBedTimes,
  calculateWakeUpTimes,
  DEFAULT_SLEEP_DELAY_MINUTES
} from '@/utils/sleepUtils';

export function useSleepCalculator() {
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

  return {
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
  };
}
