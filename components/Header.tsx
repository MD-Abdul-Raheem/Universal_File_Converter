import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [Page.CONVERTER, Page.INSTRUCTIONS, Page.ABOUT];

  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 px-2 sm:px-4 md:px-0 mb-4 border-b border-white/5 gap-4">
      <div className="flex items-center space-x-3 cursor-default group">
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Logo Glow */}
            <div className="absolute inset-0 bg-teal-500/20 rounded-lg blur-md group-hover:bg-teal-400/30 transition-all"></div>
            <div className="relative w-10 h-10 bg-[#0F172A] border border-teal-500/30 rounded-lg flex items-center justify-center shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="M9 15l3 3 3-3" />
                </svg>
            </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-slate-100 leading-none font-mono">
            UFC<span className="text-teal-400">_TERMINAL</span>
          </h1>
          <span className="text-[10px] text-teal-500/70 font-medium tracking-[0.2em] uppercase mt-1">
            System v2.0
          </span>
        </div>
      </div>
      
      <nav className="bg-[#0F172A]/50 backdrop-blur-md border border-white/5 rounded-lg p-1 w-full sm:w-auto">
        <ul className="flex space-x-1 justify-center">
          {navItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => setCurrentPage(item)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 
                  ${currentPage === item 
                    ? 'bg-teal-500/10 text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.2)] border border-teal-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;