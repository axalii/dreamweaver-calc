
import React from 'react';

const QuickFacts: React.FC = () => {
  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 glass rounded-lg">
      <h3 className="text-base sm:text-lg font-medium mb-2">Quick Facts</h3>
      <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1 text-muted-foreground">
        <li>Each sleep cycle lasts approximately 90 minutes</li>
        <li>Most adults need 5-6 complete cycles (7.5-9 hours)</li>
        <li>Waking up between cycles helps you feel more refreshed</li>
        <li>The average person takes about 15 minutes to fall asleep</li>
      </ul>
    </div>
  );
};

export default QuickFacts;
