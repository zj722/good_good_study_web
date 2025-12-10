import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GRAPH_NODES, GRAPH_LINKS } from '../constants';
import { ArrowLeft, Play } from 'lucide-react';

interface MapViewProps {
  chapterId: string;
  onBack: () => void;
  onStartLesson: (nodeId: string) => void;
}

// Visual Constants (horizontal card layout)
const CARD_WIDTH = 240;
const CARD_HEIGHT = 118;
const CARD_GAP = 220;
const PADDING_X = 180;
const PADDING_Y = 120;
const MAIN_LANE_Y = 210;
const SIDE_LANE_Y = 380;
const ARROW_HEAD_OFFSET = 10; // Distance from card edge for arrow tip
const STROKE_WIDTH_STRONG = 3;
const STROKE_WIDTH_WEAK = 1.5;

interface NodeState {
  x: number;
  y: number;
}

export const MapView: React.FC<MapViewProps> = ({ chapterId, onBack, onStartLesson }) => {
  // State: Selection
  const [nodePositions, setNodePositions] = useState<Record<string, NodeState>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<string>>(new Set());
  const [animationKey, setAnimationKey] = useState(0);
  const dragState = useRef<{ id: string; startX: number; startY: number; origin: NodeState } | null>(null);

  // Filter Data for this Chapter
  const chapterNodes = GRAPH_NODES.filter(n => n.chapterId === chapterId);
  const nodeIds = new Set(chapterNodes.map(n => n.id));
  const chapterLinks = GRAPH_LINKS.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

  const isMainPathNode = (nodeId: string) => {
    const node = chapterNodes.find(n => n.id === nodeId);
    return node?.category === 'core' || node?.category === 'advanced';
  };

  const nodeRadiusMap = useMemo(() => {
    const map: Record<string, number> = {};
    chapterNodes.forEach(node => {
      map[node.id] = CARD_HEIGHT / 2;
    });
    return map;
  }, [chapterNodes]);

  // Default layout positions for this chapter (used only as initial placement)
  const defaultPositions = useMemo(() => {
    const SIDE_SPACING_X = 320; // keep side nodes spread out horizontally (280–360 range)
    const SIDE_ROW_LIMIT = 4;   // wrap to a new row if many side nodes
    const SIDE_ROW_GAP = 170;   // vertical gap between side rows to avoid pressing the main lane

    const positions: Record<string, NodeState> = {};

    const mainNodes = chapterNodes.filter(node => isMainPathNode(node.id));
    const sideNodes = chapterNodes.filter(node => !isMainPathNode(node.id));

    mainNodes.forEach((node, idx) => {
      const x = PADDING_X + idx * CARD_GAP;
      const y = MAIN_LANE_Y;
      positions[node.id] = { x, y };
    });

    sideNodes.forEach((node, idx) => {
      const row = Math.floor(idx / SIDE_ROW_LIMIT);
      const col = idx % SIDE_ROW_LIMIT;
      const x = PADDING_X + 40 + col * SIDE_SPACING_X;
      const y = SIDE_LANE_Y + row * SIDE_ROW_GAP;
      positions[node.id] = { x, y };
    });

    return positions;
  }, [chapterNodes]);

  // Initialize positions when chapter changes (keeps user drag state until chapter switches)
  useEffect(() => {
    setNodePositions(defaultPositions);
  }, [chapterId, defaultPositions]);

  // Canvas size based on current positions to allow overflow scroll
  const contentSize = useMemo(() => {
    const xs = Object.values(nodePositions).map(p => p.x);
    const maxX = xs.length ? Math.max(...xs) : 0;
    const width = maxX + CARD_WIDTH / 2 + PADDING_X;
    const height = SIDE_LANE_Y + CARD_HEIGHT + PADDING_Y;
    return { width, height };
  }, [nodePositions]);

  // Selection & Highlight Logic
  const getAncestors = (targetId: string, visited = new Set<string>()): Set<string> => {
    visited.add(targetId);
    chapterLinks.filter(l => l.target === targetId).forEach(link => {
      if (!visited.has(link.source)) getAncestors(link.source, visited);
    });
    return visited;
  };

  const getDescendants = (sourceId: string, visited = new Set<string>()): Set<string> => {
    visited.add(sourceId);
    chapterLinks.filter(l => l.source === sourceId).forEach(link => {
      if (!visited.has(link.target)) getDescendants(link.target, visited);
    });
    return visited;
  };

  const collectNeighbors = (nodeId: string): Set<string> => {
    const related = new Set<string>([nodeId]);
    chapterLinks.forEach(link => {
      if (link.source === nodeId || link.target === nodeId) {
        related.add(link.source);
        related.add(link.target);
      }
    });
    return related;
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const combined = new Set<string>([
      ...getAncestors(nodeId),
      ...getDescendants(nodeId),
      ...collectNeighbors(nodeId)
    ]);
    setHighlightedNodes(combined);

    const activeLinks = new Set<string>();
    chapterLinks.forEach(link => {
      const isDirect = link.source === nodeId || link.target === nodeId;
      const isPath = combined.has(link.source) && combined.has(link.target);
      if (isDirect || isPath) {
        activeLinks.add(`${link.source}-${link.target}`);
      }
    });
    setHighlightedLinks(activeLinks);
    // Trigger line re-animation
    setAnimationKey(prev => prev + 1);
  };

  const handleBackgroundClick = () => {
    setSelectedNodeId(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
    setAnimationKey(prev => prev + 1);
  };

  // Drag logic using pointer events (free drag)
  const handlePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    handleNodeClick(nodeId);

    const origin = nodePositions[nodeId] || { x: 0, y: 0 };
    dragState.current = { id: nodeId, startX: e.clientX, startY: e.clientY, origin };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragState.current) return;
      const dx = moveEvent.clientX - dragState.current.startX;
      const dy = moveEvent.clientY - dragState.current.startY;

      setNodePositions(prev => ({
        ...prev,
        [nodeId]: {
          x: dragState.current!.origin.x + dx,
          y: dragState.current!.origin.y + dy
        }
      }));
    };

    const handlePointerUp = () => {
      dragState.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };


  // Path builder: horizontal + vertical (right-angled) connectors
  const getPathData = (sourceId: string, targetId: string) => {
      const p1 = nodePositions[sourceId];
      const p2 = nodePositions[targetId];
      if (!p1 || !p2) return '';

      const startRight = p1.x + CARD_WIDTH / 2;
      const startLeft = p1.x - CARD_WIDTH / 2;
      const endLeft = p2.x - CARD_WIDTH / 2;
      const endRight = p2.x + CARD_WIDTH / 2;

      const startX = p2.x > p1.x ? startRight : startLeft;
      const endX = p2.x > p1.x ? endLeft : endRight;
      const startY = p1.y;
      const endY = p2.y;
      const midX = (startX + endX) / 2;

      // Shorten for arrow head
      const adjustedEndX = endX + (p2.x > p1.x ? -ARROW_HEAD_OFFSET : ARROW_HEAD_OFFSET);

      return `M ${startX} ${startY} H ${midX} V ${endY} H ${adjustedEndX}`;
  };

  const selectedNodeData = chapterNodes.find(n => n.id === selectedNodeId);


  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="h-screen w-full bg-white relative flex flex-col overflow-hidden"
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
             <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Interactive Map</span>
             <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                Drag nodes to rearrange
             </span>
        </div>
        
        <div className="w-32" />
      </div>

      {/* Canvas Area */}
      <div 
        className="flex-1 relative bg-[#FDFDFD] cursor-default touch-none overflow-hidden"
      >
        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
          <div
            className="relative"
            style={{ width: contentSize.width, height: contentSize.height }}
            onPointerDown={handleBackgroundClick}
          >
        {/* Background Grid for Context */}
        <div className="absolute inset-0 opacity-[0.4]" 
             style={{ 
                 backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
             }} 
        />

            <>
                {/* Layer 1: Connections (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                    <defs>
                        <marker id="arrow-filled" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#1f2937" />
                        </marker>
                        <marker id="arrow-hollow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#FDFDFD" stroke="#9ca3af" strokeWidth="1" />
                        </marker>
                    </defs>

                    {chapterLinks.map((link, index) => {
                        const isStrong = link.strength === 'strong';
                        const isPathActive = highlightedNodes.has(link.source) && highlightedNodes.has(link.target);
                        const isAnySelected = selectedNodeId !== null;
                        const linkKey = `${link.source}-${link.target}`;
                        const isLinkEmphasized = highlightedLinks.has(linkKey);
                        
                        // Visibility Logic:
                        // Default: hide lines to keep layout clean
                        // On selection: only show related links
                        const opacity = isAnySelected ? (isPathActive || isLinkEmphasized ? 1 : 0) : 0;
                        
                        const strokeColor = isLinkEmphasized
                          ? (isStrong ? '#7c3aed' : '#a855f7')
                          : (isStrong ? '#cbd5e1' : '#e2e8f0');
                        const strokeWidth = isLinkEmphasized
                          ? (isStrong ? STROKE_WIDTH_STRONG + 1 : STROKE_WIDTH_STRONG)
                          : (isStrong ? STROKE_WIDTH_STRONG : STROKE_WIDTH_WEAK);

                        // Re-mount on click to replay animation
                        return (
                            <motion.path
                                key={`${link.source}-${link.target}-${animationKey}`}
                                d={getPathData(link.source, link.target)}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: 1, 
                                    opacity: opacity,
                                }}
                                transition={{ 
                                    pathLength: { duration: 0.8, ease: "easeOut" },
                                    opacity: { duration: 0.4 } 
                                }}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={isStrong ? "none" : "10,10"}
                                fill="none"
                                markerEnd={opacity > 0 ? (isStrong ? "url(#arrow-filled)" : "url(#arrow-hollow)") : undefined}
                            />
                        );
                    })}
                </svg>

                {/* Layer 2: Nodes (Interactive Divs) */}
                {chapterNodes.map((node) => {
                    const pos = nodePositions[node.id];
                    if (!pos) return null;

                    const isSelected = selectedNodeId === node.id;
                    const isHighlighted = highlightedNodes.has(node.id);
                    const isAnySelected = selectedNodeId !== null;
                    const isDimmed = isAnySelected && !isHighlighted;
                    const radius = nodeRadiusMap[node.id] ?? CARD_HEIGHT / 2;
                    const isMainPath = isMainPathNode(node.id);

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ 
                                scale: isSelected ? 1.1 : 1, 
                                opacity: isDimmed ? 0.35 : 1 
                            }}
                            whileHover={{ scale: isSelected ? 1.1 : 1.05, filter: 'brightness(1.05)' }}
                            className="absolute z-20 flex flex-col items-center justify-center cursor-pointer"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                width: CARD_WIDTH,
                                height: CARD_HEIGHT,
                                marginLeft: -CARD_WIDTH / 2, // Center anchor
                                marginTop: -CARD_HEIGHT / 2,  // Center anchor
                            }}
                            onPointerDown={(e) => handlePointerDown(node.id, e)}
                        >
                            {/* Card Node */}
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
                                <div className="relative z-10 flex flex-col gap-2 text-left">
                                  <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isMainPath ? 'text-white/80' : 'text-slate-400'}`}>
                                    {isMainPath ? 'Main Quest' : 'Side Quest'}
                                  </span>
                                  <span className={`text-lg font-bold leading-snug ${isMainPath ? 'text-white' : 'text-slate-900'}`}>
                                    {node.label}
                                  </span>
                                  <span className={`text-[11px] font-medium ${isMainPath ? 'text-white/80' : 'text-slate-500'}`}>
                                    点击以查看关联节点
                                  </span>
                                </div>
                                <div className="relative z-10">
                                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${isMainPath ? 'bg-white/20 text-white border border-white/30' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                    {isMainPath ? '主线' : '支线'}
                                  </span>
                                </div>
                                {isHighlighted && (
                                  <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-indigo-200/90"
                                    initial={{ scale: 0.92, opacity: 0 }}
                                    animate={{ scale: 1.03, opacity: 1 }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                  />
                                )}
                            </motion.div>

                            {/* Label floating below */}
                            <div className="absolute top-full mt-2 flex flex-col items-center pointer-events-none w-56">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                                {isMainPath ? '主线关卡' : '支线关卡'}
                              </span>
                            </div>
                        </motion.div>
                    );
                })}
            </>
          </div>
        </div>

        {/* Floating Action Button for Selected Node */}
        <AnimatePresence>
          {selectedNodeId && selectedNodeData && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onPointerDown={(e) => e.stopPropagation()} // FIX: Stop propagation so background click doesn't trigger
              className="absolute bottom-10 left-0 right-0 flex justify-center z-40 pointer-events-none"
            >
              <div className="bg-white/95 backdrop-blur-md p-2 pl-6 rounded-2xl shadow-2xl border border-gray-100 pointer-events-auto flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Start Lesson</span>
                  <span className="text-gray-900 font-bold text-lg">{selectedNodeData.label}</span>
                </div>
                <button
                  onClick={() => onStartLesson(selectedNodeData.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-indigo-200 shadow-lg"
                >
                  <Play size={16} fill="currentColor" />
                  Begin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
