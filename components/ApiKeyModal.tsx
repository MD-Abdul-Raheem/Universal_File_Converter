import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">API Key Required</h3>
        <p className="text-slate-400 text-sm mb-4">
          Enter your Google Gemini API key to enable conversions.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          className="w-full bg-[#020617] text-white border border-slate-700 rounded px-4 py-3 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white font-semibold text-sm"
          >
            Save & Continue
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Get your free API key at{' '}
          <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
            Google AI Studio
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
