import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LESSON_CONTENT_MAP } from '../constants';
import { ChevronRight, Home, ArrowLeft, Layers, PlayCircle, BarChart2 } from 'lucide-react';

interface ContentViewProps {
  nodeId: string;
  onBackToMap: () => void;
  onHome: () => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ nodeId, onBackToMap, onHome }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'math'>('visual');
  
  // Lookup content, fallback to generic if not found (though all are mapped in constants)
  const content = LESSON_CONTENT_MAP[nodeId] || LESSON_CONTENT_MAP['fourier'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-screen bg-white flex flex-col"
    >
      {/* Navigation Bar */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={onHome} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <Home size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button onClick={onBackToMap} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={16} />
                Back to Map
            </button>
        </div>

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm">
            {content.path.map((step, i) => (
                <React.Fragment key={step}>
                    {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
                    <span className={i === content.path.length - 1 ? "font-semibold text-indigo-600" : "text-gray-400"}>
                        {step}
                    </span>
                </React.Fragment>
            ))}
        </div>
        
        <div className="w-20"></div> {/* Balance */}
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 p-6 lg:p-12">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-5 flex flex-col justify-start">
            <motion.div
                key={nodeId} // Triggers re-animation on ID change
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                    <Layers size={14} /> Core Concept
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    {content.title}
                </h1>
                
                <div 
                    className="prose prose-lg prose-gray prose-headings:font-bold prose-headings:text-gray-900 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: content.body }} 
                />
            </motion.div>
        </div>

        {/* Right Column: Interactive Widget Placeholder */}
        <div className="lg:col-span-7 flex flex-col">
            <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.4 }}
                 className="sticky top-24"
            >
                <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="bg-gray-50 border-b border-gray-100 p-4 flex gap-4">
                        <button 
                            onClick={() => setActiveTab('visual')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'visual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Visualization
                        </button>
                        <button 
                             onClick={() => setActiveTab('math')}
                             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'math' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Mathematical Proof
                        </button>
                    </div>

                    <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-8">
                        {/* Interactive Area Background */}
                         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        {activeTab === 'visual' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                                <div className="relative w-full h-64 flex items-center justify-center">
                                    {content.interactiveType === 'wave' ? (
                                        <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                            <motion.path 
                                                d="M0,100 Q50,0 100,100 T200,100 T300,100 T400,100" 
                                                fill="none" stroke="#818cf8" strokeWidth="4"
                                                animate={{ d: ["M0,100 Q50,0 100,100 T200,100 T300,100 T400,100", "M0,100 Q50,200 100,100 T200,100 T300,100 T400,100"] }}
                                                transition={{ repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" }}
                                            />
                                        </svg>
                                    ) : (
                                        <div className="text-indigo-400 font-mono text-xl border-2 border-dashed border-indigo-900/50 p-8 rounded-xl">
                                            [Interactive {content.interactiveType} Widget]
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                                        <PlayCircle size={18} /> Run Simulation
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-300 font-mono text-lg text-center">
                                <p className="mb-4">Mathematical derivation loading...</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
