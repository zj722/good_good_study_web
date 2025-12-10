import React from 'react';
import { Sparkles, Layers, Compass } from 'lucide-react';
import { PageLayout } from './PageLayout';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

const pillars = [
  {
    title: '学习哲学',
    description: '先理解底层原理，再把抽象概念装回工程上下文，用直觉串起数学与实现。'
  },
  {
    title: '表达方式',
    description: '交互式演示、概念地图与可复用的模板，帮助你在实践里反复调用。'
  },
  {
    title: '同行氛围',
    description: '小而高密度的社群，定期共创，保持反馈回路，打磨每一次更新。'
  }
];

const workflow = [
  '用短篇 demo 对齐需求与难点，快速暴露知识盲区。',
  '在概念地图里标注依赖关系，安排学习顺序与练习切入点。',
  '交付前后都留出讨论时间，把心得沉淀成笔记或下一轮需求。'
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <PageLayout
      onNavigate={onNavigate}
      badge="关于我们"
      title="Intuitivelab 是什么？"
      description="一个专注把抽象理论讲清楚的独立工作室。我们偏爱可视化、交互式的方式，让你不再只读书本，而是看见知识的真实动作。"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map(pillar => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Sparkles size={16} />
              {pillar.title}
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-indigo-50 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Layers size={16} />
            我们怎么做
          </div>
          <p className="mt-3 text-base text-slate-700">
            每一门课程都被拆解成可复用的模型，先交付概念地图，再进入实验与练习。
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {workflow.map(step => (
              <li key={step}>· {step}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Compass size={16} />
            下一步
          </div>
          <p className="mt-3 text-base text-slate-700">
            想更快了解适合你的路径？先浏览课程概览，或者预约一次 15 分钟的需求梳理。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/courses')}
              className="rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 transition"
            >
              查看课程
            </button>
            <button
              onClick={() => onNavigate('/donate')}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
            >
              支持项目
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
