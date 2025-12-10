import React from 'react';
import { Gift } from 'lucide-react';

interface NavigationBarProps {
  onNavigate: (path: string) => void;
}

const links = [
  { label: '课程', path: '/courses' },
  { label: '介绍', path: '/about' },
  { label: '建议共建', path: '/suggestions' },
  { label: '加入我们', path: '/join' }
];

export const NavigationBar: React.FC<NavigationBarProps> = ({ onNavigate }) => {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="mx-auto flex max-w-6xl w-full items-center justify-between px-6 py-4">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-lg font-black tracking-tight text-indigo-600 hover:text-indigo-700 transition"
        >
          <Gift size={24} />
          Intuitivelab
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => onNavigate(link.path)}
              className="hover:text-slate-900 transition"
            >
              {link.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onNavigate('/donate')}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition"
        >
          捐赠
        </button>
      </div>
    </div>
  );
};
