
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
    
    if (calculationType === 'bedtime') {
      // For bedtime calculations, cycle numbers should be from highest to lowest (from 7 to 2)
      displayResults = results.map((time, index) => ({
        time,
        cycleNum: 7 - index // Start at 7 and go down
      }));
    } else {
      // For wakeup and now calculations, cycle numbers should be from lowest to highest (from 2 to 7)
      displayResults = results.map((time, index) => ({
        time,
        cycleNum: index + 2 // Start at 2 and go up
      }));
    }
    
    // Sort results by cycle number appropriately
    if (calculationType === 'bedtime') {
      // For bedtime, display in decreasing order (7,6,5,4,3,2)
      displayResults.sort((a, b) => b.cycleNum - a.cycleNum);
    } else {
      // For wakeup/now, display in increasing order (2,3,4,5,6,7)
      displayResults.sort((a, b) => a.cycleNum - b.cycleNum);
    }
    
    // Split into two rows (first half and second half)
    const halfLength = Math.ceil(displayResults.length / 2);
    const firstRow = displayResults.slice(0, halfLength);
    const secondRow = displayResults.slice(halfLength);
    
    return { firstRow, secondRow };
  };

  const { firstRow, secondRow } = getDisplayResults();

  return (
    <div className="p-4 sm:p-5 bg-secondary/30 animate-fade-in">
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
        {calculationType === 'bedtime' 
          ? 'Recommended bedtimes:' 
          : 'Recommended wake-up times:'}
      </h3>
      
      {/* Display results in two rows */}
      <div className="space-y-2 sm:space-y-3">
        {/* First row */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {firstRow.map((item, index) => (
            <div 
              key={`row1-${index}`} 
              className="glass p-2 sm:p-3 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-lg font-medium">
                    {formatTime(item.time.hours, item.time.minutes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.cycleNum} cycles • {item.cycleNum * 1.5}h
                  </p>
                </div>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${getQualityColor(item.cycleNum)}`}>
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
              className="glass p-2 sm:p-3 rounded-lg border border-white/10 hover:border-primary/40 transition-all-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-lg font-medium">
                    {formatTime(item.time.hours, item.time.minutes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.cycleNum} cycles • {item.cycleNum * 1.5}h
                  </p>
                </div>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${getQualityColor(item.cycleNum)}`}>
                  {item.cycleNum}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <p className="mt-3 sm:mt-4 text-xs text-muted-foreground">
        For optimal sleep, aim for 5-6 complete sleep cycles (7.5-9 hours).
      </p>
    </div>
  );
};

// Helper function to get color based on sleep quality
function getQualityColor(cycles: number): string {
  if (cycles < 4) return 'bg-destructive/20 text-destructive';
  if (cycles < 5) return 'bg-primary/20 text-primary';
  return 'bg-accent/20 text-accent';
}

export default ResultDisplay;
