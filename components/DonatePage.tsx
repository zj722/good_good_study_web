import React from 'react';
import { HeartHandshake, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { PageLayout } from './PageLayout';

interface DonatePageProps {
  onNavigate: (path: string) => void;
}

const tiers = [
  {
    title: '一次性支持',
    note: '帮我们覆盖服务器与设计成本，感谢你愿意支持独立创作。',
    action: '示例：立即捐赠'
  },
  {
    title: '订阅支持',
    note: '按月支持可以提前获取新课程草稿与内部演示，保持同步。',
    action: '示例：成为订阅者'
  }
];

export const DonatePage: React.FC<DonatePageProps> = ({ onNavigate }) => {
  return (
    <PageLayout
      onNavigate={onNavigate}
      badge="捐赠支持"
      title="让项目走得更远"
      description="这是一个纯静态页面，用于展示可能的赞助入口。点击按钮不会发起支付，更多细节可以通过邮箱沟通。"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {tiers.map(tier => (
          <div
            key={tier.title}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <ShieldCheck size={16} />
              {tier.title}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{tier.note}</p>
            <button className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200">
              <ArrowUpRight size={14} />
              {tier.action}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-indigo-50 bg-gradient-to-br from-indigo-50 to-white p-7 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
          <HeartHandshake size={16} />
          感谢支持
        </div>
        <p className="text-sm text-slate-700">
          捐赠者将收到我们的感谢邮件，并优先体验新课程的测试版本。实际支付通道尚未接入，这里只是演示版。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('/about')}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
          >
            了解项目
          </button>
          <button
            onClick={() => onNavigate('/join')}
            className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            参与共建
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
