import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user, logout, isMember } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.username || user?.email;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

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
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                >
                  <span className="truncate max-w-[120px]">{displayName}</span>
                  <span className="text-slate-400">▾</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 bg-white p-4 text-sm shadow-lg">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">账号</p>
                    <p className="mt-1 text-slate-700 truncate">{displayName}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      会员状态：{isMember ? '已开通' : '普通用户'}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            )}
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
