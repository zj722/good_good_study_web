import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomeView } from './components/HomeView';
import { ChapterView } from './components/ChapterView';
import { MapView } from './components/MapView';
import { ContentView } from './components/ContentView';
import { SUBJECTS, CHAPTERS } from './constants';
import { ViewState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
  };

  const goBackToChapters = () => {
    setCurrentView('CHAPTERS');
    setSelectedNodeId(null);
  };

  const goBackToMap = () => {
    setCurrentView('MAP');
  };

  // Data helpers
  const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);
  const subjectChapters = CHAPTERS.filter(c => c.subjectId === selectedSubjectId);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <AnimatePresence mode="wait">
        
        {currentView === 'HOME' && (
          <HomeView 
            key="home" 
            subjects={SUBJECTS} 
            onSelectSubject={handleSubjectSelect} 
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
          <ContentView 
            key="content"
            nodeId={selectedNodeId}
            onBackToMap={goBackToMap}
            onHome={goHome}
          />
        )}

      </AnimatePresence>
    </div>
  );
}