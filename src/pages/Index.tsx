
import React from 'react';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import SleepCalculator from '@/components/SleepCalculator';
import SleepCycles from '@/components/SleepCycles';
import SleepTracker from '@/components/SleepTracker';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavBar />
      <Hero />
      <SleepCalculator />
      <SleepCycles />
      <SleepTracker />
      <Footer />
    </main>
  );
};

export default Index;
