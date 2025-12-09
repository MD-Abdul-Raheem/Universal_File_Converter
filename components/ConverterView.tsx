import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { CONVERSION_MAP, MAX_FILE_SIZE, MIME_TYPE_NAMES, FILE_EXTENSIONS } from '../constants';
import { MimeType } from '../types';
import Toast from './Toast';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ConverterView: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState<MimeType | ''>('');
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [conversionStatus, setConversionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [downloadName, setDownloadName] = useState('');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        return () => {
            if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        };
    }, [downloadUrl]);

    const handleFile = (selectedFile: File) => {
        if (selectedFile.size > MAX_FILE_SIZE) {
            setToast({ message: 'File exceeded 100MB limit.', type: 'error' });
            return;
        }
        
        const supportedTypes = Object.keys(CONVERSION_MAP);
        const isSupported = supportedTypes.includes(selectedFile.type) || 
                            selectedFile.name.endsWith('.docx') || 
                            selectedFile.name.endsWith('.xlsx');

        if (!isSupported) {
            setToast({ message: 'Input format not supported by engine.', type: 'error' });
            return;
        }

        setFile(selectedFile);
        setTargetFormat('');
        setConversionStatus('idle');
        setDownloadUrl(null);
        setProgress(0);
    };

    const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
        e.target.value = '';
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const resetConverter = () => {
        setFile(null);
        setTargetFormat('');
        setConversionStatus('idle');
        setDownloadUrl(null);
        setProgress(0);
    };

    const handleConvert = async () => {
        if (!file || !targetFormat) return;

        setIsConverting(true);
        setConversionStatus('idle');
        setProgress(0);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return prev;
                return prev + (Math.random() * 8); // Faster simulation
            });
        }, 300);

        try {
            const module = await import('../services/conversionService');
            const convertFile = module.convertFile;

            const blob = await convertFile(file, targetFormat);
            
            const url = URL.createObjectURL(blob);
            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
            const newExtension = FILE_EXTENSIONS[targetFormat as MimeType] || '';
            
            setDownloadName(`${originalName}${newExtension}`);
            setDownloadUrl(url);
            setConversionStatus('success');
            setToast({ message: 'Processing complete. File ready.', type: 'success' });
            
            clearInterval(progressInterval);
            setProgress(100);

        } catch (error) {
            clearInterval(progressInterval);
            setProgress(0);
            setConversionStatus('error');
            const msg = error instanceof Error ? error.message : 'System Failure';
            setToast({ message: msg, type: 'error' });
        } finally {
            setIsConverting(false);
            if (progressInterval) clearInterval(progressInterval);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="glass-panel rounded-lg overflow-hidden shadow-2xl transition-all duration-500 animate-fade-up border border-slate-700">
                
                {!file ? (
                    // Upload State
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`min-h-[320px] sm:min-h-[380px] flex flex-col items-center justify-center text-center transition-all duration-300 relative group p-4
                        ${isDragOver ? 'bg-teal-900/10' : 'bg-[#0F172A]/50'}`}
                    >
                        {/* Technical Corners */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-600 group-hover:border-teal-400 transition-colors"></div>
                        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-600 group-hover:border-teal-400 transition-colors"></div>
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-600 group-hover:border-teal-400 transition-colors"></div>
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-600 group-hover:border-teal-400 transition-colors"></div>

                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-teal-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-9 sm:h-9 text-slate-400 group-hover:text-teal-400 transition-colors">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-wide">INITIATE UPLOAD</h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xs leading-relaxed px-4">Drag files into the sector or browse local drive.<br/><span className="text-slate-600 text-xs mt-2 block">Max Capacity: 100MB</span></p>
                        
                        <label className="relative inline-flex group/btn cursor-pointer">
                            <span className="px-5 py-2.5 sm:px-6 sm:py-3 bg-teal-600 hover:bg-teal-500 text-white rounded font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-teal-500/20 active:translate-y-0.5">
                                Browse Files
                            </span>
                            <input type="file" className="hidden" onChange={onFileSelect} />
                        </label>
                    </div>
                ) : (
                    // Processing / Success State
                    <div className="p-4 sm:p-6 md:p-8 bg-[#0F172A]">
                        {/* Header: File Info */}
                        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-800">
                            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-slate-800 flex items-center justify-center border border-slate-700 text-[10px] sm:text-xs font-bold text-teal-500 font-mono flex-shrink-0">
                                    {file.name.split('.').pop()?.toUpperCase().substring(0, 3)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-white font-medium truncate text-xs sm:text-sm" title={file.name}>
                                        {file.name}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-mono">
                                        SIZE: {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            
                            {!isConverting && conversionStatus !== 'success' && (
                                <button 
                                    onClick={resetConverter}
                                    className="p-1.5 sm:p-2 text-slate-500 hover:text-rose-400 transition-colors bg-slate-900 rounded hover:bg-slate-800 flex-shrink-0"
                                    title="Abort"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            )}
                        </div>

                        {/* Middle: Controls or Progress */}
                        <div className="space-y-6">
                            
                            {/* State: Selection */}
                            {conversionStatus === 'idle' && !isConverting && (
                                <div className="space-y-4 animate-fade-up">
                                    <div>
                                        <label className="block text-xs font-bold text-teal-500 uppercase tracking-widest mb-2 font-mono">Select Output Protocol</label>
                                        <div className="relative">
                                            <select
                                                value={targetFormat}
                                                onChange={(e) => setTargetFormat(e.target.value as MimeType)}
                                                className="w-full bg-[#020617] text-white border border-slate-700 rounded px-4 py-3.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all appearance-none cursor-pointer font-medium"
                                            >
                                                <option value="" disabled>--- SELECT FORMAT ---</option>
                                                {(CONVERSION_MAP[file.type as MimeType] || []).map(fmt => (
                                                    <option key={fmt} value={fmt}>{MIME_TYPE_NAMES[fmt]}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleConvert}
                                        disabled={!targetFormat}
                                        className="w-full py-3 sm:py-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 rounded text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-teal-900/20 active:translate-y-0.5 mt-4 flex items-center justify-center uppercase"
                                    >
                                        EXECUTE CONVERSION
                                    </button>
                                </div>
                            )}

                            {/* State: Processing / Success */}
                            {(isConverting || conversionStatus === 'success') && (
                                <div className="space-y-4 animate-fade-up">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className={`${conversionStatus === 'success' ? 'text-teal-400' : 'text-slate-300'}`}>
                                            {isConverting ? '>> PROCESSING DATA...' : '>> OPERATION SUCCESSFUL'}
                                        </span>
                                        <span className="text-teal-500">{Math.round(progress)}%</span>
                                    </div>
                                    
                                    <div className="h-2 w-full bg-slate-900 rounded overflow-hidden border border-slate-800">
                                        <div 
                                            className={`h-full transition-all duration-300 ease-out relative ${conversionStatus === 'success' ? 'bg-teal-500' : 'bg-cyan-500'}`}
                                            style={{ width: `${progress}%` }}
                                        >
                                            {isConverting && (
                                                 <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* State: Download */}
                            {conversionStatus === 'success' && downloadUrl && (
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 animate-fade-up">
                                    <a
                                        href={downloadUrl}
                                        download={downloadName}
                                        className="col-span-2 py-3 sm:py-3.5 bg-slate-100 hover:bg-white text-slate-900 text-center rounded font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        <span>RETRIEVE FILE</span>
                                    </a>
                                    <button
                                        onClick={resetConverter}
                                        className="col-span-2 py-2.5 sm:py-3 text-slate-500 hover:text-teal-400 text-xs sm:text-sm font-medium transition-colors border border-transparent hover:border-slate-800 rounded"
                                    >
                                        [ Process New File ]
                                    </button>
                                </div>
                            )}
                            
                            {/* State: Error */}
                            {conversionStatus === 'error' && !isConverting && (
                                 <button
                                    onClick={() => setConversionStatus('idle')}
                                    className="w-full py-2.5 sm:py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded text-xs sm:text-sm font-bold transition-colors uppercase"
                                >
                                    System Error - Retry
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
                <p className="text-[9px] sm:text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                    Secure Enclave // Local Processing
                </p>
            </div>
        </div>
    );
};

export default ConverterView;