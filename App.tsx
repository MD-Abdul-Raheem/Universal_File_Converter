import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ConverterView from './components/ConverterView';
import InstructionsView from './components/InstructionsView';
import AboutView from './components/AboutView';
import ApiKeyModal from './components/ApiKeyModal';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.CONVERTER);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    const hasApiKey = import.meta.env.VITE_API_KEY || localStorage.getItem('gemini_api_key');
    if (!hasApiKey) {
      setShowApiKeyModal(true);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.INSTRUCTIONS:
        return <InstructionsView />;
      case Page.ABOUT:
        return <AboutView />;
      case Page.CONVERTER:
      default:
        return <ConverterView />;
    }
  };

  return (
    <>
      {showApiKeyModal && <ApiKeyModal onSave={() => setShowApiKeyModal(false)} />}
      <div className="min-h-screen font-sans text-slate-200 flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 relative overflow-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* Ambient Background - Aurora Borealis Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50rem] h-[50rem] bg-teal-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto z-10 flex flex-col flex-grow">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-grow flex items-center justify-center py-4 sm:py-6 md:py-8">
          {renderPage()}
        </main>
      </div>
      
      <Footer />
    </div>
    </>
  );
};

export default App;