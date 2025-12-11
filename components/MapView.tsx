import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GRAPH_NODES, GRAPH_LINKS } from '../constants';
import { ArrowLeft, Play } from 'lucide-react';

interface MapViewProps {
  chapterId: string;
  onBack: () => void;
  onStartLesson: (nodeId: string) => void;
}

// Visual Constants
const CARD_WIDTH = 240;
const CARD_HEIGHT = 118;
const COLUMN_GAP = 350; // Horizontal space between ranks
const ROW_GAP = 60;     // Vertical space between cards in same rank
const PADDING = 300;    // Increased Canvas padding to fix left scroll

// Layout Configuration (Rank Logic)
const NODE_RANKS: Record<string, number> = {
  // Rank 0: Fundamentals (Inputs)
  'complex': 0,
  'e': 0,
  'trig': 0,

  // Rank 1: Core Concepts
  'euler': 1,

  // Rank 2: Advanced Applications (Output)
  'fourier': 2
};

const RANK_LABELS: Record<number, string> = {
  0: 'Basic',
  1: 'Core Concept',
  2: 'Final Goal'
};

interface NodeState {
  x: number;
  y: number;
}

export const MapView: React.FC<MapViewProps> = ({ chapterId, onBack, onStartLesson }) => {
  // State: Selection only (Drag removed)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());

  // Filter Data for this Chapter
  const chapterNodes = GRAPH_NODES.filter(n => n.chapterId === chapterId);
  const nodeIds = new Set(chapterNodes.map(n => n.id));
  const chapterLinks = GRAPH_LINKS.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

  const isMainPathNode = (nodeId: string) => {
    const node = chapterNodes.find(n => n.id === nodeId);
    // Explicitly check for 'core' or 'advanced' category as per requirement
    return node?.category === 'core' || node?.category === 'advanced';
  };

  // Determine Layout Positions using Rank System
  const nodePositions = useMemo(() => {
    const positions: Record<string, NodeState> = {};
    const rankGroups: Record<number, string[]> = { 0: [], 1: [], 2: [] };

    // Group nodes by rank
    chapterNodes.forEach(node => {
      const rank = NODE_RANKS[node.id] ?? 0;
      if (!rankGroups[rank]) rankGroups[rank] = [];
      rankGroups[rank].push(node.id);
    });

    // Calculate Grid Positions
    Object.entries(rankGroups).forEach(([rankStr, nodes]) => {
      const rank = parseInt(rankStr);
      const colX = PADDING + rank * (CARD_WIDTH + COLUMN_GAP);

      // Vertically center the group
      const totalHeight = nodes.length * CARD_HEIGHT + (nodes.length - 1) * ROW_GAP;
      // Assume a "Center Line" at Y=400 roughly, or just stack from top with offset
      // Let's vertically center everything around Y = 350
      const startY = 350 - totalHeight / 2;

      nodes.forEach((nodeId, index) => {
        positions[nodeId] = {
          x: colX,
          y: startY + index * (CARD_HEIGHT + ROW_GAP) + CARD_HEIGHT / 2 // Center anchor
        };
      });
    });

    return positions;
  }, [chapterNodes]);

  // Canvas size based on content
  const contentSize = useMemo(() => {
    const xs = Object.values(nodePositions).map((p: NodeState) => p.x);
    const ys = Object.values(nodePositions).map((p: NodeState) => p.y);

    if (xs.length === 0) return { width: '100%', height: '100%' };

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      // Ensure plenty of space on right for scroll
      width: Math.max(window.innerWidth, maxX + CARD_WIDTH + PADDING),
      height: Math.max(window.innerHeight, maxY + CARD_HEIGHT + PADDING)
    };
  }, [nodePositions]);

  // Selection Logic
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);

    // Highlight Logic: ANCESTORS ONLY (Prerequisites)
    const getAncestors = (targetId: string, visited = new Set<string>()): Set<string> => {
      visited.add(targetId);
      chapterLinks.filter(l => l.target === targetId).forEach(link => {
        if (!visited.has(link.source)) getAncestors(link.source, visited);
      });
      return visited;
    };

    const ancestors = getAncestors(nodeId);
    const activeLinks = new Set<string>();

    chapterLinks.forEach(link => {
      // Only show links that are part of the ancestor path
      if (ancestors.has(link.source) && ancestors.has(link.target)) {
        activeLinks.add(`${link.source}-${link.target}`);
      }
    });

    setHighlightedNodes(ancestors);
    setHighlightedLinks(activeLinks);
  };

  const handleBackgroundClick = () => {
    setSelectedNodeId(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
  };

  // Bezier Curve Path Generator
  const getBezierPath = (sourceId: string, targetId: string) => {
    const p1 = nodePositions[sourceId];
    const p2 = nodePositions[targetId];
    if (!p1 || !p2) return '';

    const sourceX = p1.x + CARD_WIDTH / 2;
    const sourceY = p1.y;
    const targetX = p2.x - CARD_WIDTH / 2;
    const targetY = p2.y;

    const midX = (sourceX + targetX) / 2;

    // Cubic Bezier: Control points at the midpoint X with same Y as source/target
    return `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
  };

  const selectedNodeData = chapterNodes.find(n => n.id === selectedNodeId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full bg-white relative flex flex-col"
    >
      {/* Header UI */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-30 pointer-events-none">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors bg-white/90 backdrop-blur-sm py-2 px-4 rounded-full border border-gray-100 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Chapters</span>
        </motion.button>

        <div className="bg-white/90 px-6 py-2 rounded-xl backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center">
          <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Knowledge Map</span>
          <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Explore connections
          </span>
        </div>

        <div className="w-32" />
      </div>

      {/* Scrollable Canvas Area */}
      <div className="flex-1 overflow-auto bg-[#FDFDFD] relative cursor-default">
        <div
          className="relative min-w-full min-h-full"
          style={{ width: contentSize.width, height: contentSize.height }}
          onPointerDown={handleBackgroundClick}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          {/* Rank Headers */}
          {[0, 1, 2].map(rank => (
            <div
              key={rank}
              className="absolute top-10 text-center pointer-events-none text-slate-400 font-bold tracking-widest uppercase text-sm"
              style={{
                left: PADDING + rank * (CARD_WIDTH + COLUMN_GAP),
                width: CARD_WIDTH,
                marginLeft: -CARD_WIDTH / 2 // Center align with column
              }}
            >
              {RANK_LABELS[rank]}
            </div>
          ))}

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <marker id="arrow-filled" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#1f2937" />
              </marker>
              <marker id="arrow-start" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <circle cx="2" cy="2" r="1.5" fill="#9ca3af" />
              </marker>
            </defs>
            {chapterLinks.map((link) => {
              const isStrong = link.strength === 'strong';
              const linkKey = `${link.source}-${link.target}`;
              // Show if:
              // 1. Nothing selected (everything visible)
              // 2. This link is part of the highlighted Ancestor path
              const isVisible = !selectedNodeId || highlightedLinks.has(linkKey);

              return (
                <motion.path
                  key={linkKey}
                  d={getBezierPath(link.source, link.target)}
                  stroke={isVisible ? (isStrong ? '#4b5563' : '#9ca3af') : '#e5e7eb'}
                  strokeWidth={isVisible ? (isStrong ? 2.5 : 1.5) : 1}
                  strokeDasharray={isStrong ? "none" : "5,5"}
                  fill="none"
                  markerStart={isVisible ? "url(#arrow-start)" : undefined}
                  markerEnd={isVisible ? "url(#arrow-filled)" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isVisible ? 1 : 0.1 }}
                  transition={{ duration: 0.8 }}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {chapterNodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            // Highlight Logic:
            // 1. If nothing selected -> All Normal
            // 2. If something selected -> Highlight self + Ancestors. Dim others.
            const isSelected = selectedNodeId === node.id;
            const isHighlighted = highlightedNodes.has(node.id) || !selectedNodeId;
            const isDimmed = selectedNodeId && !highlightedNodes.has(node.id);
            const isMainPath = isMainPathNode(node.id);

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isSelected ? 1.05 : 1, opacity: isDimmed ? 0.35 : 1 }}
                className="absolute z-20 flex flex-col items-center justify-center cursor-pointer"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  marginLeft: -CARD_WIDTH / 2,
                  marginTop: -CARD_HEIGHT / 2,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node.id);
                }}
              >
                {/* Restored Premium Card Style */}
                <motion.div
                  className={`
                          w-full h-full rounded-2xl border-2 flex items-start justify-between shadow-xl transition-all duration-200 relative overflow-hidden px-4 py-3
                          ${isMainPath ? 'bg-gradient-to-r from-indigo-600 via-purple-500 to-sky-500 border-indigo-600' : 'bg-white border-slate-200'}
                          ${isSelected ? 'ring-4 ring-indigo-100' : ''}
                      `}
                >
                  {isMainPath ? (
                    <div
                      className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_45%)]"
                      style={{ opacity: isSelected ? 0.3 : 0.18 }}
                    />
                  ) : null}
                  <div className="relative z-10 flex flex-col gap-2 text-left w-full">
                    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isMainPath ? 'text-white/80' : 'text-slate-400'}`}>
                      {isMainPath ? 'Main Quest' : 'Side Quest'}
                    </span>
                    <span className={`text-lg font-bold leading-snug ${isMainPath ? 'text-white' : 'text-slate-900'}`}>
                      {node.label}
                    </span>
                  </div>

                  {/* Optional Indicator/Badge */}
                  <div className="relative z-10">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${isMainPath ? 'bg-white/20 text-white border border-white/30' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                      {RANK_LABELS[NODE_RANKS[node.id] || 0]}
                    </span>
                  </div>

                  {highlightedNodes.has(node.id) && selectedNodeId && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-indigo-400/50"
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1.05, opacity: 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {selectedNodeId && selectedNodeData && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center z-40 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-md p-2 pl-6 rounded-2xl shadow-xl border border-gray-100 pointer-events-auto flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Start Lesson</span>
                <span className="text-gray-900 font-bold text-lg">{selectedNodeData.label}</span>
              </div>
              <button
                onClick={() => onStartLesson(selectedNodeData.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Play size={16} fill="currentColor" />
                Begin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
