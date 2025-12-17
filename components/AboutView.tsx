import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-3xl animate-fade-in px-2 sm:px-4">
        
      <div className="bg-[#0F172A]/80 backdrop-blur-md rounded-xl border border-white/5 shadow-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden tech-border">
         {/* Decorative Background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white tracking-tight">
                About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Project</span>
            </h2>
            
            <div className="space-y-4 sm:space-y-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-light">
                <p>
                The <strong className="text-white font-medium">Universal File Converter</strong> (UFC) defines a new standard for client-side utility applications. By hybridizing WebAssembly for speed and AI for intelligence, we eliminate the need for traditional server-side processing queues.
                </p>
                <p>
                Designed for ephemeral environments, UFC operates on a <span className="text-teal-400 font-medium">Zero-Retention Policy</span>. Files are processed in memory and discarded immediately after the session, guaranteeing absolute data sovereignty.
                </p>
                
                <div className="bg-[#020617] rounded-lg p-4 sm:p-6 border border-slate-700 mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <h3 className="text-xs sm:text-sm font-mono font-bold text-slate-500 uppercase mb-3 sm:mb-4 tracking-wider">Core Stack</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li className="flex items-center text-xs sm:text-sm"><span className="w-1.5 h-1.5 bg-teal-500 rounded-sm mr-2"></span> React 19 + TypeScript</li>
                            <li className="flex items-center text-xs sm:text-sm"><span className="w-1.5 h-1.5 bg-teal-500 rounded-sm mr-2"></span> Tailwind CSS (Utility)</li>
                            <li className="flex items-center text-xs sm:text-sm"><span className="w-1.5 h-1.5 bg-teal-500 rounded-sm mr-2"></span> AI Processing Engine</li>
                        </ul>
                    </div>
                    <div>
                         <h3 className="text-xs sm:text-sm font-mono font-bold text-slate-500 uppercase mb-3 sm:mb-4 tracking-wider">Libraries</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li className="flex items-center text-xs sm:text-sm"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-sm mr-2"></span> SheetJS (Data)</li>
                            <li className="flex items-center text-xs sm:text-sm"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-sm mr-2"></span> PptxGenJS (Slides)</li>
                            <li className="flex items-center text-xs sm:text-sm"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-sm mr-2"></span> PDF / Docx Generators</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;