
// A sleep cycle typically lasts about 90 minutes
export const SLEEP_CYCLE_MINUTES = 90;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const DEFAULT_SLEEP_DELAY_MINUTES = 15;

export interface SleepTime {
  hours: number;
  minutes: number;
}

/**
 * Format time in 12-hour format with AM/PM
 */
export function formatTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Add minutes to a time
 */
export function addMinutesToTime(time: SleepTime, minutesToAdd: number): SleepTime {
  let totalMinutes = time.hours * MINUTES_IN_HOUR + time.minutes + minutesToAdd;
  
  // Handle day overflow
  totalMinutes = totalMinutes % (HOURS_IN_DAY * MINUTES_IN_HOUR);
  
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;
  
  return { hours, minutes };
}

/**
 * Calculate optimal wake-up times based on bedtime
 */
export function calculateWakeUpTimes(bedtime: SleepTime, sleepDelayMinutes: number = DEFAULT_SLEEP_DELAY_MINUTES): SleepTime[] {
  // Add sleep delay to bedtime
  const adjustedBedtime = addMinutesToTime(bedtime, sleepDelayMinutes);
  
  // Calculate wake-up times for 2 through 7 sleep cycles
  const wakeUpTimes: SleepTime[] = [];
  
  // Most adults need between 4-6 cycles (6-9 hours)
  // But we'll calculate 2-7 cycles for the calculator
  for (let cycles = 2; cycles <= 7; cycles++) {
    const totalMinutes = cycles * SLEEP_CYCLE_MINUTES;
    const totalSleepMinutes = adjustedBedtime.hours * MINUTES_IN_HOUR + adjustedBedtime.minutes + totalMinutes;
    
    let wakeHours = Math.floor(totalSleepMinutes / MINUTES_IN_HOUR) % HOURS_IN_DAY;
    const wakeMinutes = totalSleepMinutes % MINUTES_IN_HOUR;
    
    wakeUpTimes.push({ hours: wakeHours, minutes: wakeMinutes });
  }
  
  return wakeUpTimes;
}

/**
 * Calculate optimal bedtimes based on wake-up time
 */
export function calculateBedTimes(wakeUpTime: SleepTime, sleepDelayMinutes: number = DEFAULT_SLEEP_DELAY_MINUTES): SleepTime[] {
  // Calculate bedtimes for 2 through 7 sleep cycles
  const bedTimes: SleepTime[] = [];
  
  // Most adults need between 4-6 cycles (6-9 hours)
  // But we'll calculate 2-7 cycles for the calculator
  for (let cycles = 2; cycles <= 7; cycles++) {
    const totalMinutes = cycles * SLEEP_CYCLE_MINUTES + sleepDelayMinutes;
    
    // Convert wake-up time to minutes
    const wakeUpTotalMinutes = wakeUpTime.hours * MINUTES_IN_HOUR + wakeUpTime.minutes;
    
    // Subtract sleep cycles from wake-up time
    let bedTimeTotalMinutes = wakeUpTotalMinutes - totalMinutes;
    
    // Handle negative time (previous day)
    if (bedTimeTotalMinutes < 0) {
      bedTimeTotalMinutes += HOURS_IN_DAY * MINUTES_IN_HOUR;
    }
    
    const bedHours = Math.floor(bedTimeTotalMinutes / MINUTES_IN_HOUR);
    const bedMinutes = bedTimeTotalMinutes % MINUTES_IN_HOUR;
    
    bedTimes.push({ hours: bedHours, minutes: bedMinutes });
  }
  
  // We want results in order of cycle count (7 to 2)
  return bedTimes.reverse();
}

/**
 * Get the duration of sleep in hours and minutes
 */
export function getSleepDuration(bedtime: SleepTime, wakeUpTime: SleepTime): { hours: number, minutes: number } {
  // Convert both times to minutes
  let bedtimeMinutes = bedtime.hours * MINUTES_IN_HOUR + bedtime.minutes;
  let wakeUpMinutes = wakeUpTime.hours * MINUTES_IN_HOUR + wakeUpTime.minutes;
  
  // If wake-up time is earlier than bedtime, add 24 hours
  if (wakeUpMinutes < bedtimeMinutes) {
    wakeUpMinutes += HOURS_IN_DAY * MINUTES_IN_HOUR;
  }
  
  // Calculate total minutes of sleep
  const totalMinutes = wakeUpMinutes - bedtimeMinutes;
  
  // Convert to hours and minutes
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;
  
  return { hours, minutes };
}

/**
 * Get the number of completed sleep cycles
 */
export function getSleepCycles(bedtime: SleepTime, wakeUpTime: SleepTime): number {
  const { hours, minutes } = getSleepDuration(bedtime, wakeUpTime);
  const totalMinutes = hours * MINUTES_IN_HOUR + minutes;
  
  return Math.floor(totalMinutes / SLEEP_CYCLE_MINUTES);
}

/**
 * Get quality rating based on sleep cycles
 */
export function getSleepQuality(cycles: number): { rating: string; description: string } {
  if (cycles < 3) {
    return { 
      rating: "Poor", 
      description: "Less than 4.5 hours of sleep is insufficient for most adults." 
    };
  } else if (cycles < 4) {
    return { 
      rating: "Fair", 
      description: "This amount may help you get through the day, but isn't optimal long-term." 
    };
  } else if (cycles < 5) {
    return { 
      rating: "Good", 
      description: "A good amount of sleep that works well for some adults." 
    };
  } else if (cycles < 6) {
    return { 
      rating: "Very Good", 
      description: "This is the ideal amount of sleep for most adults." 
    };
  } else {
    return { 
      rating: "Excellent", 
      description: "This provides ample rest for most adults." 
    };
  }
}
