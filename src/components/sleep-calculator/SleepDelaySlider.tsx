
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface SleepDelaySliderProps {
  sleepDelay: number;
  onChange: (value: number) => void;
}

const SleepDelaySlider: React.FC<SleepDelaySliderProps> = ({ sleepDelay, onChange }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs sm:text-sm font-medium text-foreground/90">
          Time to fall asleep: <span className="font-bold text-primary">{sleepDelay} minutes</span>
        </label>
      </div>
      <Slider
        defaultValue={[sleepDelay]}
        min={5}
        max={30}
        step={1}
        onValueChange={(value) => onChange(value[0])}
        className="my-3 sm:my-4"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Average person takes about 15 minutes to fall asleep.
      </p>
    </div>
  );
};

export default SleepDelaySlider;
