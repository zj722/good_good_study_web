import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NavigationBar } from './NavigationBar';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface HomeViewProps {
  subjects: Subject[];
  onSelectSubject: (id: string) => void;
  onNavigate: (path: string) => void;
}

const suggestionHighlights = [
  '每月梳理社区灵感，记录并优先实现高频反馈，为下一轮更新提供方向。',
  '在提案里排序出高频需求，确保更新验证真实的使用场景。',
  '提交时直接说明想跟进的原理、呈现形式或潜在问题，反馈直达团队。'
];

const subjectOptions = [
  '信号与系统',
  '线性代数',
  '电路设计',
  '机器学习基础',
  '其他'
];

const contentOptions = [
  '新实验项目',
  '交互式笔记',
  '可视化演示',
  '测试题与练习',
  '其他'
];

export const HomeView: React.FC<HomeViewProps> = ({ subjects, onSelectSubject, onNavigate }) => {
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [suggestionNotes, setSuggestionNotes] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleSelection = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]));
  };

  const isOtherSelected = (list: string[]) => list.includes('其他');

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <NavigationBar onNavigate={onNavigate} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-12 items-start">
        <motion.section
          id="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex w-full flex-col gap-12 items-start"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">独立开发者</p>
            <h1 className="text-4xl font-black text-slate-900 md:text-6xl">
              让抽象的理论，变得触手可及。
            </h1>
            <p className="max-w-3xl text-lg text-slate-600">
              告别晦涩的课本，我们用动态交互演示，带你完成一场知识体系的重构。
              从最底层的基本原理出发，层层向上推演。
              你将亲眼见证那些抽象的数学定义，如何严丝合缝地逻辑咬合，最终支撑起现代工程的宏大顶层。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                if (user) {
                  onNavigate('/courses');
                } else {
                  setShowAuthModal(true);
                }
              }}
              className="rounded-full border border-slate-200 bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition"
            >
              {user ? '进入课程' : '注册 / 登录'}
            </button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm md:grid-cols-3">
            {[
              '原理的直观呈现，让你看见每个定义背后的样子',
              '清晰的知识链接，呈现从数学到工程的依赖路径',
              '可复用的笔记，把体验转成真实交付'
            ].map((item, index) => (
              <div key={item} className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">亮点 {index + 1}</span>
                <p className="font-semibold text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section id="self" className="w-full border-t border-slate-100 pt-16">
          <div className="flex flex-col gap-6 text-left">
            <h2 className="text-3xl font-bold text-slate-900">自我介绍</h2>
            <p className="text-slate-600 max-w-4xl">
              我是 Intuitivelab 的创始人，致力于教授 Web 与 AI 的系统思维。我的目标是减少压迫感，同时
              增加理解深度——你会在这里看到周到的示例、可复用的范式，以及我与你一起把作品推向完成的态度。
            </p>
          </div>
        </section>

        <section id="courses" className="w-full border-t border-slate-100 pt-16">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900">课程</h2>
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">实时更新</span>
              </div>
              <p className="text-slate-600 max-w-3xl">
                每门课程都链接到精心策划的知识图谱与交互课件。点击卡片即可进入概念地图的深度漫游。
              </p>
            </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {subjects.map(subject => (
              <motion.div
                key={subject.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200 }}
                onClick={() => onSelectSubject(subject.id)}
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">{subject.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900">{subject.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{subject.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  进入图谱 <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="suggestions" className="w-full border-t border-slate-100 pt-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Sparkles size={16} />
              建议共建
            </div>
            <h2 className="text-3xl font-bold text-slate-900">欢迎一切建议！</h2>
            <p className="text-slate-600 max-w-3xl">
              每月梳理社区灵感，你的声音会被记录、优先实现，成为下一轮更新的核心。
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-500 pl-1">
              {suggestionHighlights.map((text, idx) => (
                <p key={idx} className="leading-relaxed">
                  · {text}
                </p>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-600">希望更新的科目（可多选）</p>
                <div className="flex flex-col gap-2">
                  {subjectOptions.map(option => (
                    <label key={option} className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedSubjects.includes(option)}
                        onChange={() => toggleSelection(option, setSelectedSubjects)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {isOtherSelected(selectedSubjects) && (
                  <input
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    placeholder="请描述其他希望更新的科目"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-600">更新内容方向（可多选）</p>
                <div className="flex flex-col gap-2">
                  {contentOptions.map(option => (
                    <label key={option} className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedContents.includes(option)}
                        onChange={() => toggleSelection(option, setSelectedContents)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {isOtherSelected(selectedContents) && (
                  <input
                    value={customContent}
                    onChange={e => setCustomContent(e.target.value)}
                    placeholder="描述你想要的特别呈现"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-slate-600">还有其他建议？</p>
                <textarea
                  value={suggestionNotes}
                  onChange={e => setSuggestionNotes(e.target.value)}
                  rows={6}
                  placeholder="补充任何想法、痛点或希望我们深入的方向"
                  className="min-h-[150px] resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
                <button className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 transition">
                  提交对话 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full max-w-6xl border-t border-slate-100 pt-16">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">加入我们</h2>
            <p className="text-slate-600">
              有问题？想了解下一期？发送邮件或关注我们的社群，保持与学习路径同步。
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-indigo-600">
              <span>hello@intuitivelab.com</span>
              <span className="text-slate-400">•</span>
              <span>安排通话</span>
            </div>
          </div>
        </section>
      </main>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
