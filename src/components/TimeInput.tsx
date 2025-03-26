
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: { hours: number; minutes: number };
  onChange: (time: { hours: number; minutes: number }) => void;
  label: string;
  id: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, label, id }) => {
  const [hours, setHours] = useState<number>(value.hours || 0);
  const [minutes, setMinutes] = useState<number>(value.minutes || 0);
  const [period, setPeriod] = useState<'AM' | 'PM'>(value.hours >= 12 ? 'PM' : 'AM');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    // Update the time when props change
    if (value.hours !== undefined) {
      setHours(value.hours % 12 || 12); // Convert to 12-hour format
      setPeriod(value.hours >= 12 ? 'PM' : 'AM');
    }
    
    if (value.minutes !== undefined) {
      setMinutes(value.minutes);
    }
  }, [value.hours, value.minutes]);

  // Update parent component when time changes
  const updateTime = (h: number, m: number, p: 'AM' | 'PM') => {
    // Convert to 24-hour format for internal storage
    let newHours = h % 12;
    if (p === 'PM') newHours += 12;
    
    onChange({ hours: newHours, minutes: m });
  };

  // Handle hour changes
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = parseInt(e.target.value);
    setHours(newHours);
    updateTime(newHours, minutes, period);
  };

  // Handle minute changes
  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(e.target.value);
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  // Handle period changes (AM/PM)
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as 'AM' | 'PM';
    setPeriod(newPeriod);
    updateTime(hours, minutes, newPeriod);
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium mb-2 text-foreground/90"
      >
        {label}
      </label>
      
      <div 
        className={`relative flex items-center glass rounded-lg overflow-hidden transition-all-300 ${
          focused ? "ring-2 ring-primary/50" : ""
        }`}
      >
        <div className="p-3 flex items-center justify-center border-r border-white/10">
          <Clock size={18} className="text-primary" />
        </div>
        
        <div className="flex items-center w-full">
          {/* Hours */}
          <select
            id={`${id}-hours`}
            value={hours}
            onChange={handleHourChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="bg-transparent border-0 text-lg py-3 pl-3 pr-1 focus:ring-0 focus:outline-none w-1/4"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <option key={`hour-${h}`} value={h}>{h}</option>
            ))}
          </select>
          
          <span className="px-1 text-lg">:</span>
          
          {/* Minutes */}
          <select
            id={`${id}-minutes`}
            value={minutes}
            onChange={handleMinuteChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="bg-transparent border-0 text-lg py-3 pl-1 pr-1 focus:ring-0 focus:outline-none w-1/4"
          >
            {Array.from({ length: 60 }, (_, i) => i).map(m => (
              <option key={`minute-${m}`} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
          
          {/* AM/PM */}
          <select
            id={`${id}-period`}
            value={period}
            onChange={handlePeriodChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="bg-transparent border-0 text-lg py-3 pl-1 pr-3 focus:ring-0 focus:outline-none w-1/4"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
