import React from 'react';
import { Lightbulb, ClipboardList, Send } from 'lucide-react';
import { PageLayout } from './PageLayout';

interface SuggestionsPageProps {
  onNavigate: (path: string) => void;
}

const ideaPrompts = [
  '你希望看到哪个原理的可视化演示？',
  '哪一步推导最让你卡住？是否有现实案例希望补充？',
  '如果让你把课程交付到团队，你需要哪些素材或格式？'
];

export const SuggestionsPage: React.FC<SuggestionsPageProps> = ({ onNavigate }) => {
  return (
    <PageLayout
      onNavigate={onNavigate}
      badge="建议共建"
      title="把你的需求告诉我们"
      description="无论是新的课程想法、需要补充的案例，还是你想要的交互形式，都可以在这里写下。没有后台逻辑，纯静态示意。"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Lightbulb size={16} />
            提案灵感
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {ideaPrompts.map(prompt => (
              <li key={prompt}>· {prompt}</li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-4 text-sm text-indigo-700">
            这里可以放置真实的提案表单。当前版本仅做占位，不会提交数据。
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-7 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <ClipboardList size={16} />
            快速草稿
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <input
              placeholder="主题（示例：想要可视化的傅里叶变换）"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              readOnly
            />
            <textarea
              rows={6}
              placeholder="在这里写下你的想法。本示例不会保存内容。"
              className="min-h-[160px] resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              readOnly
            />
            <button className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200">
              <Send size={14} />
              仅演示：提交
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-indigo-50 bg-gradient-to-br from-indigo-50 to-white p-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">我们如何回应</p>
            <p className="mt-2 text-sm text-slate-600">
              每月整理一次高频需求，并在路线图里标注跟进顺序。如果想更快交流，可以直接给我们写信。
            </p>
          </div>
          <button
            onClick={() => onNavigate('/join')}
            className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition"
          >
            联系我们
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
