import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-4xl mx-auto z-10 text-center py-4 sm:py-6 border-t border-white/5 mt-auto px-4">
      <p className="text-[10px] sm:text-xs text-slate-500 font-mono tracking-wider break-words">
        <span className="text-teal-500/50">root@ufc:~$</span> STATUS: OPERATIONAL &bull; POWERED BY GEMINI
      </p>
    </footer>
  );
};

export default Footer;