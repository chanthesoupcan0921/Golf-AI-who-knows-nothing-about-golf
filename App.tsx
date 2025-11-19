import React, { useState } from 'react';
import { MessageSquare, Camera, ClipboardList, Flag } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import SwingAnalyzer from './components/SwingAnalyzer';
import Scorecard from './components/Scorecard';
import { AppView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.CHAT);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-black flex flex-col text-gray-100">
      {/* Sticky Header */}
      <header className="bg-gray-900 border-b border-emerald-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-club-gold p-2 rounded-full">
              <Flag className="w-6 h-6 text-gray-900 fill-current" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold leading-none text-club-gold">The Oblivious Caddie</h1>
              <p className="text-xs text-emerald-400 opacity-80">Confidently Incorrect since 2024</p>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            <NavButton 
              active={activeView === AppView.CHAT} 
              onClick={() => setActiveView(AppView.CHAT)}
              icon={<MessageSquare className="w-4 h-4" />}
              label="The Caddie Shack"
            />
            <NavButton 
              active={activeView === AppView.ANALYZER} 
              onClick={() => setActiveView(AppView.ANALYZER)}
              icon={<Camera className="w-4 h-4" />}
              label="Form Critique"
            />
            <NavButton 
              active={activeView === AppView.SCORECARD} 
              onClick={() => setActiveView(AppView.SCORECARD)}
              icon={<ClipboardList className="w-4 h-4" />}
              label="Scorecard"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6">
        <div className="h-[calc(100vh-140px)] w-full">
          {activeView === AppView.CHAT && <ChatInterface />}
          {activeView === AppView.ANALYZER && <SwingAnalyzer />}
          {activeView === AppView.SCORECARD && <Scorecard />}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-2 z-50 text-gray-400">
        <MobileNavButton 
          active={activeView === AppView.CHAT} 
          onClick={() => setActiveView(AppView.CHAT)}
          icon={<MessageSquare className="w-6 h-6" />}
          label="Chat"
        />
        <MobileNavButton 
          active={activeView === AppView.ANALYZER} 
          onClick={() => setActiveView(AppView.ANALYZER)}
          icon={<Camera className="w-6 h-6" />}
          label="Vision"
        />
        <MobileNavButton 
          active={activeView === AppView.SCORECARD} 
          onClick={() => setActiveView(AppView.SCORECARD)}
          icon={<ClipboardList className="w-6 h-6" />}
          label="Score"
        />
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
      active 
        ? 'bg-club-gold text-gray-900 shadow-sm transform scale-105' 
        : 'text-emerald-100 hover:bg-emerald-900/50'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-colors w-full ${
      active ? 'text-club-gold bg-gray-800' : 'text-gray-500'
    }`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export default App;