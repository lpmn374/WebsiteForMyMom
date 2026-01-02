import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { SavingsCalculator } from './components/SavingsCalculator';
import { GoldCalculator } from './components/GoldCalculator';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'savings' | 'gold'>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'home' | 'savings' | 'gold');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      
      {currentPage === 'savings' && (
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
              <SavingsCalculator />
            </div>
          </div>
        </div>
      )}
      
      {currentPage === 'gold' && (
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
              <GoldCalculator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
