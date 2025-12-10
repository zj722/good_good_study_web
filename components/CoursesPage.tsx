import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Subject } from '../types';
import { NavigationBar } from './NavigationBar';

interface CoursesPageProps {
  subjects: Subject[];
  onSelectSubject: (id: string) => void;
  onBackHome: () => void;
  onNavigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ subjects, onSelectSubject, onBackHome, onNavigate }) => {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <NavigationBar onNavigate={onNavigate} />

      <main className="flex flex-col items-center gap-8 px-6 py-12">
        <div className="flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">课程精选</p>
            <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">探索所有课程</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              每一门课程都附带概念地图与交互实验，先了解结构再进入内容，随时返回学习路径。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onBackHome}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              返回主页
            </button>
            <button
              onClick={() => onNavigate('/donate')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 transition"
            >
              支持项目
            </button>
          </div>
        </div>

        <div className="w-full max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {subjects.map(subject => (
              <motion.div
                key={subject.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 250 }}
                className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-left shadow-sm cursor-pointer"
                onClick={() => onSelectSubject(subject.id)}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">{subject.icon}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{subject.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{subject.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  进入图谱 <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
