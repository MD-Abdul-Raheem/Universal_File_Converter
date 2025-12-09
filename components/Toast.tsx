import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-8 sm:right-8 p-4 rounded-lg shadow-2xl text-white max-w-md z-50 transition-all duration-500 transform animate-fade-in border-l-4 backdrop-blur-xl bg-[#0F172A]/90";
  
  const typeClasses = {
    success: 'border-l-teal-400 shadow-[0_5px_30px_-10px_rgba(45,212,191,0.3)]',
    error: 'border-l-rose-500 shadow-[0_5px_30px_-10px_rgba(244,63,94,0.3)]',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center">
        <div className={`mr-3 ${type === 'success' ? 'text-teal-400' : 'text-rose-400'}`}>
            {type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            )}
        </div>
        <div className="flex-grow">
            <h5 className={`font-mono font-bold text-xs uppercase tracking-wider mb-0.5 ${type === 'success' ? 'text-teal-400' : 'text-rose-400'}`}>
                {type === 'success' ? 'Task Complete' : 'System Alert'}
            </h5>
            <p className="text-slate-300 text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;