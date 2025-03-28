
import React from 'react';
import SleepCalculator from '@/components/SleepCalculator';
import SleepCycles from '@/components/SleepCycles';
import FontSelector from '@/components/FontSelector';

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FontSelector />
      <SleepCalculator />
      <SleepCycles />
    </main>
  );
};

export default Index;
