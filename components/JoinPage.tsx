import React from 'react';
import { Users, Mail, Briefcase } from 'lucide-react';
import { PageLayout } from './PageLayout';

interface JoinPageProps {
  onNavigate: (path: string) => void;
}

const roles = [
  {
    title: '内容共创',
    detail: '一起设计演示与练习，打磨知识图谱，适合学术背景或一线工程师。'
  },
  {
    title: '产品体验',
    detail: '帮我们验证交互、动效、信息架构，或者提出新的呈现方式。'
  },
  {
    title: '社区运营',
    detail: '组织小规模学习小组，收集反馈，维护高密度的讨论氛围。'
  }
];

export const JoinPage: React.FC<JoinPageProps> = ({ onNavigate }) => {
  return (
    <PageLayout
      onNavigate={onNavigate}
      badge="加入我们"
      title="和我们一起共建"
      description="这里是一份静态的页面原型，用于展示可能的共建入口和联系方式。"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {roles.map(role => (
          <div key={role.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Briefcase size={16} />
              {role.title}
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{role.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-indigo-50 bg-indigo-50 p-7 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
            <Users size={16} />
            与我们对齐需求
          </div>
          <p className="mt-3 text-sm text-slate-700">
            想快速判断是否合拍？可以预约一次 20 分钟的通话，简单介绍背景与期望。此处仅为占位按钮。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/about')}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
            >
              了解我们
            </button>
            <button
              onClick={() => onNavigate('/courses')}
              className="rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 transition"
            >
              查看课程
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Mail size={16} />
            联系方式
          </div>
          <p className="mt-3 text-sm text-slate-700">
            hello@intuitivelab.com <br />
            如果你有团队背景或具体需求，也可以直接留下介绍。此区域仅作静态展示。
          </p>
          <button
            onClick={() => onNavigate('/donate')}
            className="mt-5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            支持项目
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
