import React from 'react';

const InstructionsView: React.FC = () => {
  const tableData = [
    { from: 'PDF', to: ['DOCX', 'TXT', 'JPG', 'PNG', 'HTML', 'CSV', 'XLSX'] },
    { from: 'DOCX', to: ['PDF', 'TXT', 'PPT', 'HTML', 'CSV', 'XLSX'] },
    { from: 'PPT', to: ['PDF', 'DOCX', 'TXT'] },
    { from: 'TXT', to: ['PDF', 'DOCX', 'CSV', 'HTML', 'PPT'] },
    { from: 'CSV', to: ['XLSX', 'PDF', 'JSON', 'XML'] },
    { from: 'XLSX', to: ['CSV', 'PDF', 'HTML'] },
    { from: 'JPG / PNG', to: ['PDF', 'DOCX', 'TXT', 'HTML'] },
    { from: 'WEBP', to: ['JPG', 'PNG'] },
    { from: 'JSON', to: ['CSV', 'XLSX'] },
    { from: 'XML', to: ['JSON', 'CSV', 'XLSX'] },
    { from: 'HTML', to: ['PDF', 'DOCX'] },
    { from: 'Markdown', to: ['HTML', 'TXT', 'PDF', 'DOCX'] },
  ];

  return (
    <div className="w-full max-w-5xl p-2 sm:p-4 animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-8 border-b border-white/5 pb-4 gap-3">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 font-mono">Conversion_Matrix</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Active engine capabilities and routing map.</p>
        </div>
        <div>
            <span className="px-2 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono rounded">
                v2.4.0-STABLE
            </span>
        </div>
      </div>
      
      <div className="bg-[#0F172A]/40 border border-slate-700/50 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#020617] text-slate-400 border-b border-slate-700">
                <th className="py-2 px-3 sm:py-3 sm:px-6 font-mono text-[10px] sm:text-xs uppercase tracking-wider w-1/3 sm:w-1/4">Input Source</th>
                <th className="py-2 px-3 sm:py-3 sm:px-6 font-mono text-[10px] sm:text-xs uppercase tracking-wider">Output Targets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-teal-500/5 transition-colors group">
                  <td className="py-2 px-3 sm:py-3 sm:px-6 font-medium text-slate-200 border-r border-slate-800">
                      <div className="flex items-center">
                        <span className="text-teal-500 mr-1 sm:mr-2 opacity-50 group-hover:opacity-100">›</span>
                        <span>{row.from}</span>
                      </div>
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-6 text-slate-400">
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {row.to.map((fmt) => (
                            <span key={fmt} className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-teal-500/30 group-hover:text-teal-200 transition-colors">
                                {fmt}
                            </span>
                        ))}
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex items-start p-3 sm:p-4 rounded-lg bg-teal-900/10 border border-teal-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 text-teal-400 mr-2 sm:mr-3 shrink-0"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
        <div>
            <h4 className="font-mono font-bold text-teal-300 text-[10px] sm:text-xs uppercase mb-1">Engine Protocol</h4>
            <p className="text-teal-200/60 text-[10px] sm:text-xs leading-relaxed">
            Binary reconstruction is prioritized over surface-level conversion. AI models are employed for semantic extraction in unstructured documents (PDF), while deterministic algorithms execute precision transfers for structured data (XLSX/JSON).
            </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsView;