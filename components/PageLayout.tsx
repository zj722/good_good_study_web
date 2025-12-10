import React from 'react';
import { NavigationBar } from './NavigationBar';

interface PageLayoutProps {
  onNavigate: (path: string) => void;
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ onNavigate, title, description, badge, children }) => {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <NavigationBar onNavigate={onNavigate} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-12">
        <div className="flex flex-col gap-3">
          {badge ? <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{badge}</p> : null}
          <h1 className="text-4xl font-black text-slate-900 md:text-5xl">{title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
};
