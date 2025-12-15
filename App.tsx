import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomeView } from './components/HomeView';
import { ChapterView } from './components/ChapterView';
import { MapView } from './components/MapView';
import { ContentView } from './components/ContentView';
import { CoursesPage } from './components/CoursesPage';
import { AboutPage } from './components/AboutPage';
import { SuggestionsPage } from './components/SuggestionsPage';
import { JoinPage } from './components/JoinPage';
import { DonatePage } from './components/DonatePage';
import { LessonComplexNumbers } from './components/LessonComplexNumbers';
import { SUBJECTS, CHAPTERS } from './constants';
import { ViewState } from './types';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [route, setRoute] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'));

  // 1. Home -> Chapter List
  const handleSubjectSelect = (id: string) => {
    setSelectedSubjectId(id);
    setCurrentView('CHAPTERS');
  };

  // 2. Chapter List -> Map
  const handleChapterSelect = (id: string) => {
    setSelectedChapterId(id);
    setCurrentView('MAP');
  };

  // 3. Map -> Content
  const handleStartLesson = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setCurrentView('CONTENT');
  };

  // Navigation Logic
  const goHome = () => {
    setCurrentView('HOME');
    setSelectedSubjectId(null);
    setSelectedChapterId(null);
    setSelectedNodeId(null);
  };

  const goBackToChapters = () => {
    setCurrentView('CHAPTERS');
    setSelectedNodeId(null);
  };

  const goBackToMap = () => {
    setCurrentView('MAP');
  };

  const handleCourseCardSelect = (id: string) => {
    navigateTo('/');
    handleSubjectSelect(id);
  };

  const navigateTo = (path: string, scrollTarget?: string) => {
    if (path === '/') {
      goHome();
    }

    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
    setRoute(path);

    if (scrollTarget && typeof document !== 'undefined') {
      setTimeout(() => {
        const element = document.querySelector(scrollTarget);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleNavigateLink = (target: string) => {
    navigateTo(target);
  };

  // Data helpers
  const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);
  const subjectChapters = CHAPTERS.filter(c => c.subjectId === selectedSubjectId);

  useEffect(() => {
    const handlePopstate = () => {
      if (typeof window !== 'undefined') {
        const newPath = window.location.pathname;
        setRoute(newPath);
        if (newPath === '/') {
          goHome();
        }
      }
    };
    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, []);

  let page: React.ReactNode = null;

  if (route === '/courses') {
    page = (
      <CoursesPage
        subjects={SUBJECTS}
        onSelectSubject={handleCourseCardSelect}
        onBackHome={() => navigateTo('/')}
        onNavigate={navigateTo}
      />
    );
  } else if (route === '/about') {
    page = <AboutPage onNavigate={navigateTo} />;
  } else if (route === '/suggestions') {
    page = <SuggestionsPage onNavigate={navigateTo} />;
  } else if (route === '/join') {
    page = <JoinPage onNavigate={navigateTo} />;
  } else if (route === '/donate') {
    page = <DonatePage onNavigate={navigateTo} />;
  } else {
    page = (
      <div className="bg-white min-h-screen font-sans text-slate-900">
        <AnimatePresence mode="wait">
          {currentView === 'HOME' && (
            <HomeView
              key="home"
              subjects={SUBJECTS}
              onSelectSubject={handleSubjectSelect}
              onNavigate={handleNavigateLink}
            />
          )}

          {currentView === 'CHAPTERS' && currentSubject && (
            <ChapterView
              key="chapters"
              subjectTitle={currentSubject.title}
              chapters={subjectChapters}
              onSelectChapter={handleChapterSelect}
              onBack={goHome}
            />
          )}

          {currentView === 'MAP' && selectedChapterId && (
            <MapView
              key="map"
              chapterId={selectedChapterId}
              onBack={goBackToChapters}
              onStartLesson={handleStartLesson}
            />
          )}

          {currentView === 'CONTENT' && selectedNodeId && (
            selectedNodeId === 'complex' ? (
              <LessonComplexNumbers
                key="lesson-complex"
                onBack={goBackToMap}
                onHome={goHome}
              />
            ) : (
              <ContentView
                key="content"
                nodeId={selectedNodeId}
                onBackToMap={goBackToMap}
                onHome={goHome}
              />
            )
          )}
        </AnimatePresence>
      </div>
    );
  }

  return <AuthProvider>{page}</AuthProvider>;
}
