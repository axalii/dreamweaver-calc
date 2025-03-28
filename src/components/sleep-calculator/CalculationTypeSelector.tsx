
import React from 'react';
import { Moon, Sun, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalculationTypeSelectorProps {
  calculationType: 'bedtime' | 'wakeup' | 'now';
  onTypeChange: (type: 'bedtime' | 'wakeup' | 'now') => void;
}

const CalculationTypeSelector: React.FC<CalculationTypeSelectorProps> = ({ 
  calculationType, 
  onTypeChange 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between p-3 sm:p-4 glass border-b border-white/10">
      <button 
        className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all-200 m-1 ${
          calculationType === 'bedtime' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onTypeChange('bedtime')}
      >
        <Moon size={isMobile ? 14 : 16} className={calculationType === 'bedtime' ? 'text-primary' : 'text-muted-foreground'} />
        <span className="text-xs sm:text-sm">Wake up at...</span>
      </button>
      
      <button 
        className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all-200 m-1 ${
          calculationType === 'wakeup' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onTypeChange('wakeup')}
      >
        <Sun size={isMobile ? 14 : 16} className={calculationType === 'wakeup' ? 'text-primary' : 'text-muted-foreground'} />
        <span className="text-xs sm:text-sm">Go to bed at...</span>
      </button>

      <button 
        className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all-200 m-1 ${
          calculationType === 'now' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onTypeChange('now')}
      >
        <Clock size={isMobile ? 14 : 16} className={calculationType === 'now' ? 'text-primary' : 'text-muted-foreground'} />
        <span className="text-xs sm:text-sm">Sleep now</span>
      </button>
    </div>
  );
};

export default CalculationTypeSelector;
