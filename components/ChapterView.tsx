import React from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '../types';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface ChapterViewProps {
  subjectTitle: string;
  chapters: Chapter[];
  onSelectChapter: (id: string) => void;
  onBack: () => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ 
  subjectTitle, 
  chapters, 
  onSelectChapter, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-20 px-6">
      
      {/* Header */}
      <div className="w-full max-w-4xl mb-12 flex flex-col gap-6">
        <motion.button 
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors self-start"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Domains</span>
        </motion.button>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-2">Selected Domain</h2>
            <h1 className="text-5xl font-bold text-gray-900">{subjectTitle}</h1>
        </motion.div>
      </div>

      {/* Chapter List */}
      <div className="w-full max-w-4xl space-y-4">
        {chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            onClick={() => onSelectChapter(chapter.id)}
            className="group relative bg-white border border-gray-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
                <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 text-gray-400 font-bold text-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        {chapter.number}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                            {chapter.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed max-w-xl">
                            {chapter.description}
                        </p>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <ArrowRight size={20} />
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};