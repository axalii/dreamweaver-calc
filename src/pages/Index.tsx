
import React from 'react';
import SleepCalculator from '@/components/SleepCalculator';
import SleepCycles from '@/components/SleepCycles';

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SleepCalculator />
      <SleepCycles />
    </main>
  );
};

export default Index;
