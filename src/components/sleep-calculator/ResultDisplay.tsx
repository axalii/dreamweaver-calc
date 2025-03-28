
import React from 'react';
import { SleepTime, formatTime } from '@/utils/sleepUtils';

interface ResultDisplayProps {
  results: SleepTime[];
  calculationType: 'bedtime' | 'wakeup' | 'now';
  hasCalculated: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  results, 
  calculationType, 
  hasCalculated 
}) => {
  if (!hasCalculated) return null;

  // Create two rows of results for display
  const getDisplayResults = () => {
    let displayResults: Array<{ time: SleepTime, cycleNum: number }> = [];
    
    // All calculation types should show cycles from highest to lowest (7 to 2)
    // This ensures consistent display across all modes
    displayResults = results.map((time, index) => {
      if (calculationType === 'bedtime') {
        // For bedtime, index 0 is 7 cycles, index 5 is 2 cycles
        return {
          time,
          cycleNum: 7 - index // Start at 7 and go down
        };
      } else {
        // For wakeup and now, we need to invert the order
        // Index 0 is 2 cycles, index 5 is 7 cycles
        return {
          time,
          cycleNum: 7 - (5 - index) // This maps 0->2, 1->3, 2->4, 3->5, 4->6, 5->7
        };
      }
    });
    
    // Sort results by cycle number in decreasing order (7,6,5,4,3,2) for all calculation types
    displayResults.sort((a, b) => b.cycleNum - a.cycleNum);
    
    // Split into two rows (first half and second half)
    const halfLength = Math.ceil(displayResults.length / 2);
    const firstRow = displayResults.slice(0, halfLength);
    const secondRow = displayResults.slice(halfLength);
    
    return { firstRow, secondRow };
  };

  const { firstRow, secondRow } = getDisplayResults();

  return (
    <div className="p-3 sm:p-5 bg-secondary/30 animate-fade-in rounded-lg">
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 animate-slide-up">
        {calculationType === 'bedtime' 
          ? 'Recommended bedtimes:' 
          : 'Recommended wake-up times:'}
      </h3>
      
      {/* Display results in two rows */}
      <div className="space-y-2">
        {/* First row */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {firstRow.map((item, index) => (
            <div 
              key={`row1-${index}`} 
              className="glass p-2 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    {formatTime(item.time.hours, item.time.minutes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.cycleNum} cycles • {item.cycleNum * 1.5}h
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getQualityColor(item.cycleNum)} animate-pulse-slow`}>
                  {item.cycleNum}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {secondRow.map((item, index) => (
            <div 
              key={`row2-${index}`} 
              className="glass p-2 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${(index + firstRow.length) * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    {formatTime(item.time.hours, item.time.minutes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.cycleNum} cycles • {item.cycleNum * 1.5}h
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getQualityColor(item.cycleNum)} animate-pulse-slow`}>
                  {item.cycleNum}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <p className="mt-3 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '600ms' }}>
        For optimal sleep, aim for 5-6 complete sleep cycles (7.5-9 hours).
      </p>
    </div>
  );
};

// Helper function to get color based on sleep quality
function getQualityColor(cycles: number): string {
  if (cycles < 4) return 'bg-destructive/20 text-destructive';
  if (cycles < 5) return 'bg-primary/20 text-primary';
  if (cycles < 6) return 'bg-accent/20 text-accent';
  return 'bg-green-500/20 text-green-500';
}

export default ResultDisplay;
