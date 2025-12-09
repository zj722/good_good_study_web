import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GRAPH_NODES, GRAPH_LINKS } from '../constants';
import { ArrowLeft, Play, GripHorizontal } from 'lucide-react';

interface MapViewProps {
  chapterId: string;
  onBack: () => void;
  onStartLesson: (nodeId: string) => void;
}

// Visual Constants
const NODE_RADIUS = 32; // Radius of the circle node in pixels
const ARROW_HEAD_OFFSET = 8; // Distance from node border to ensure arrow tip touches precisely
const STROKE_WIDTH_STRONG = 2.5;
const STROKE_WIDTH_WEAK = 1.5;

interface NodeState {
  x: number;
  y: number;
}

export const MapView: React.FC<MapViewProps> = ({ chapterId, onBack, onStartLesson }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State: The Single Source of Truth for Positions
  const [nodePositions, setNodePositions] = useState<Record<string, NodeState>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  // Key to force re-render of lines on click
  const [animationKey, setAnimationKey] = useState(0);

  // Filter Data for this Chapter
  const chapterNodes = GRAPH_NODES.filter(n => n.chapterId === chapterId);
  const nodeIds = new Set(chapterNodes.map(n => n.id));
  const chapterLinks = GRAPH_LINKS.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

  // 1. Initialize Positions (Percent -> Pixels)
  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      setNodePositions(prev => {
        // If we already have positions, preserve them to avoid reset on minor resizing
        if (Object.keys(prev).length > 0) return prev;

        const newPositions: Record<string, NodeState> = {};
        chapterNodes.forEach(node => {
          newPositions[node.id] = {
            x: (node.x / 100) * width,
            y: (node.y / 100) * height
          };
        });
        return newPositions;
      });
      setIsInitialized(true);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [chapterId]); // Reset if chapter changes


  // 2. Drag Logic (Updates State in Real-Time)
  const handleDragStart = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent background click

    // Select the node immediately
    handleNodeClick(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = nodePositions[id];

    const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        setNodePositions(prev => ({
            ...prev,
            [id]: {
                x: initialPos.x + dx,
                y: initialPos.y + dy
            }
        }));
    };

    const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };


  // 3. Selection & Highlight Logic
  const getAncestors = (targetId: string, visited = new Set<string>()): Set<string> => {
    visited.add(targetId);
    chapterLinks.filter(l => l.target === targetId).forEach(link => {
      if (!visited.has(link.source)) getAncestors(link.source, visited);
    });
    return visited;
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setHighlightedNodes(getAncestors(nodeId));
    // Trigger line re-animation
    setAnimationKey(prev => prev + 1);
  };

  const handleBackgroundClick = () => {
    setSelectedNodeId(null);
    setHighlightedNodes(new Set());
    // Trigger line re-animation (optional, but feels responsive)
    setAnimationKey(prev => prev + 1);
  };


  // 4. Vector Math for Perfect Lines
  const getPathData = (sourceId: string, targetId: string) => {
      const p1 = nodePositions[sourceId];
      const p2 = nodePositions[targetId];
      if (!p1 || !p2) return '';

      // Angle from Source to Target
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      // Start: Center of Source
      // End: Border of Target (subtract Radius + Arrow Offset)
      const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const stopDist = Math.max(0, dist - NODE_RADIUS - ARROW_HEAD_OFFSET);

      const endX = p1.x + stopDist * Math.cos(angle);
      const endY = p1.y + stopDist * Math.sin(angle);

      return `M ${p1.x} ${p1.y} L ${endX} ${endY}`;
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
        ref={containerRef} 
        className="flex-1 relative bg-[#FDFDFD] cursor-default touch-none"
        onPointerDown={handleBackgroundClick}
      >
        {/* Background Grid for Context */}
        <div className="absolute inset-0 opacity-[0.4]" 
             style={{ 
                 backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
             }} 
        />

        {isInitialized && (
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
                        
                        // Visibility Logic:
                        // If nothing selected: Show all (opacity 1)
                        // If something selected: Show ONLY path (opacity 1), hide others (opacity 0)
                        const opacity = isAnySelected ? (isPathActive ? 1 : 0) : 1;
                        
                        // We use the animationKey to force a re-mount of the path on click, triggering the animation again.
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
                                stroke={isStrong ? '#1f2937' : '#9ca3af'}
                                strokeWidth={isStrong ? STROKE_WIDTH_STRONG : STROKE_WIDTH_WEAK}
                                strokeDasharray={isStrong ? "none" : "6,6"}
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

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ 
                                scale: isSelected ? 1.1 : 1, 
                                opacity: isDimmed ? 0.4 : 1 
                            }}
                            whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
                            className="absolute z-20 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                width: NODE_RADIUS * 2,
                                height: NODE_RADIUS * 2,
                                marginLeft: -NODE_RADIUS, // Center anchor
                                marginTop: -NODE_RADIUS,  // Center anchor
                            }}
                            onPointerDown={(e) => handleDragStart(node.id, e)}
                        >
                            {/* Circle Node */}
                            <motion.div 
                                className={`
                                    w-full h-full rounded-full border-2 bg-white flex items-center justify-center shadow-lg transition-colors duration-200
                                    ${isSelected ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-gray-200'}
                                `}
                            >
                                {isSelected ? (
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                                ) : (
                                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                )}
                            </motion.div>

                            {/* Label floating below */}
                            <div className="absolute top-full mt-3 flex flex-col items-center pointer-events-none w-48">
                                <span className={`
                                    text-sm font-semibold whitespace-normal text-center px-3 py-1 rounded-lg backdrop-blur-sm
                                    ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/80 text-gray-700 shadow-sm border border-gray-100'}
                                `}>
                                    {node.label}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </>
        )}

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