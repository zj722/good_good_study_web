import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCw, Eye } from 'lucide-react';

export const ComplexMotionVisualizer: React.FC = () => {
    // Animation State
    const [isPlaying, setIsPlaying] = useState(true);
    const [viewAngle, setViewAngle] = useState(0); // 0 = 1D (Side), 1 = 2D (Top)
    const [time, setTime] = useState(0);
    const [waitingForZero, setWaitingForZero] = useState(false);

    // Refs for Loop
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number | null>(null);
    const timeRef = useRef(0);
    const waitingRef = useRef(false);

    // Constants
    const SPEED = 1.5; // rad/s
    const AMP = 120; // Amplitude in px

    // Physics Loop
    const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const deltaTime = (timestamp - startTimeRef.current) / 1000;
        startTimeRef.current = timestamp;

        if (isPlaying || waitingRef.current) {
            // Update time
            timeRef.current += deltaTime * SPEED;

            // Check for "Stop at Zero" condition
            if (waitingRef.current) {
                // cos(t) is the position. We want cos(t) = 0.
                // This happens at t = PI/2, 3PI/2, etc.
                // Distance to next zero crossing:
                const phase = timeRef.current % (2 * Math.PI);
                // Targets: PI/2 (1.57) or 3PI/2 (4.71)
                let target = 0;
                let dist = 1000;

                const t1 = Math.PI / 2;
                const t2 = 3 * Math.PI / 2;
                const t3 = 5 * Math.PI / 2; // Wrap around case

                if (Math.abs(phase - t1) < 0.2) target = t1;
                else if (Math.abs(phase - t2) < 0.2) target = t2;
                else if (phase > 4.5 && Math.abs(phase - t2) < 0.4) target = t2; // approaching 3pi/2

                // Precision Snap
                const cosVal = Math.cos(timeRef.current);
                if (Math.abs(cosVal) < 0.05) {
                    // Snap to exact zero point
                    // Find nearest PI/2 multiple
                    const exact = Math.round(timeRef.current / (Math.PI / 2)) * (Math.PI / 2);
                    // Ensure it's an odd multiple (cos=0)
                    if (Math.round(exact / (Math.PI / 2)) % 2 !== 0) {
                        timeRef.current = exact;
                        waitingRef.current = false;
                        setIsPlaying(false);
                        setWaitingForZero(false);
                    }
                }
            }

            // Update Render State
            setTime(timeRef.current);
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying]);

    // Handlers
    const togglePlay = () => setIsPlaying(!isPlaying);

    const pauseAtZero = () => {
        setIsPlaying(true);
        setWaitingForZero(true);
        waitingRef.current = true;
    };

    // Derived Values for Rendering
    const x = Math.cos(time) * AMP;
    const y = Math.sin(time) * AMP * viewAngle; // Scale Y by view angle
    const isPausedAtZero = !isPlaying && Math.abs(x) < 0.1;
    const velocityDir = Math.sin(time) > 0 ? -1 : 1; // Deriv of cos is -sin. 

    // Determine "Hidden State" text
    const iComponent = Math.sin(time);
    let stateText = "";
    if (isPausedAtZero) {
        if (iComponent > 0.9) stateText = "Top of Circle (+i) → Moving LEFT";
        else if (iComponent < -0.9) stateText = "Bottom of Circle (-i) → Moving RIGHT";
    }

    return (
        <div className="w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">

            {/* Header / Controls */}
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    {!isPlaying && !waitingForZero && (
                        <button
                            onClick={pauseAtZero}
                            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm font-bold hover:bg-slate-600 transition-colors flex items-center gap-2"
                        >
                            <RotateCw size={14} /> Wait For 0
                        </button>
                    )}
                    {waitingForZero && (
                        <span className="text-amber-400 text-sm font-mono animate-pulse">Waiting for x=0...</span>
                    )}
                </div>

                <div className="flex items-center gap-4 flex-1 max-w-xs">
                    <Eye size={16} className="text-slate-400" />
                    <input
                        type="range"
                        min="0" max="1" step="0.01"
                        value={viewAngle}
                        onChange={(e) => setViewAngle(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400"
                    />
                    <span className="text-xs text-slate-400 w-12 text-right">
                        {viewAngle === 0 ? "1D" : (viewAngle === 1 ? "2D" : "Tilt")}
                    </span>
                </div>
            </div>

            {/* Visualization Canvas */}
            <div className="relative h-[450px] flex items-center justify-center bg-[#0B1120] overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Main Scene SVG - Extended ViewBox for Pendulum (Shifted down) */}
                <svg className="w-full h-full" viewBox="-200 -290 400 400">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                        <radialGradient id="bobGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                            <stop offset="0%" stopColor="#93c5fd" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </radialGradient>
                    </defs>

                    {/* --- PENDULUM SECTION --- */}
                    <g transform="translate(0, 0)">
                        {/* Pendulum Constants: L = 200, Pivot = (0, -220) */}
                        {/* Geometry: x is already known. y_pendulum = -220 + sqrt(L^2 - x^2) */}
                        {/* Note: This is an approximation of where a pendulum would be if its horizontal projection was exactly harmonic. 
                            For small angles, simple harmonic motion is a good approximation of pendulum motion.
                            We construct the y-position to ensure the X aligns perfectly with the blue dot.
                        */}

                        {/* String */}
                        <line
                            x1="0" y1="-220"
                            x2={x} y2={-220 + Math.sqrt(200 * 200 - x * x)}
                            stroke="#cbd5e1"
                            strokeWidth="2"
                        />

                        {/* Pivot Point */}
                        <circle cx="0" cy="-220" r="4" fill="#94a3b8" />

                        {/* Pendulum Bob */}
                        <circle
                            cx={x} cy={-220 + Math.sqrt(200 * 200 - x * x)}
                            r="12"
                            fill="url(#bobGradient)"
                            stroke="white"
                            strokeWidth="2"
                            className="drop-shadow-lg"
                        />

                        {/* Connection Line (Pendulum to Shadow) - Dashed */}
                        <line
                            x1={x} y1={-220 + Math.sqrt(200 * 200 - x * x) + 12}
                            x2={x} y2={0}
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            opacity="0.5"
                        />
                    </g>
                    {/* ------------------------- */}

                    {/* Axes */}
                    <line x1="-180" y1="0" x2="180" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="190" y="5" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Real</text>

                    <motion.g animate={{ opacity: viewAngle }}>
                        <line x1="0" y1="-130" x2="0" y2="130" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="5" y="-135" fill="#eab308" fontSize="10" fontFamily="monospace">Imaginary (i)</text>
                    </motion.g>

                    {/* Trajectory (Circle/Line) */}
                    <ellipse
                        cx="0" cy="0"
                        rx={AMP} ry={AMP * viewAngle}
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />

                    {/* Projection Line (Connecting Gold Ball to Shadow) */}
                    <motion.line
                        animate={{ opacity: viewAngle > 0.1 ? 0.5 : 0 }}
                        x1={x} y1={0}
                        x2={x} y2={-y}
                        stroke="#94a3b8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                    />

                    {/* The "Real" Shadow (Blue Bob) */}
                    <circle cx={x} cy="0" r="8" fill="#3b82f6" stroke="white" strokeWidth="2" />

                    {/* The "Complex" Source (Gold Ball) */}
                    <motion.circle
                        animate={{ opacity: viewAngle }}
                        cx={x} cy={-y} r="6"
                        fill="#eab308"
                    />

                    {/* 1D Ambiguity UI (Only when paused at 0 and viewAngle low) */}
                    {isPausedAtZero && viewAngle < 0.2 && (
                        <g>
                            <text x="0" y="-30" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">?</text>
                            <text x="0" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="10">Which way?</text>
                            {/* Ghost Arrows */}
                            <path d="M -20 0 L -40 0" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.5" />
                            <path d="M 20 0 L 40 0" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.5" />
                        </g>
                    )}

                    {/* Insight UI (When paused at 0 and viewAngle high) */}
                    {isPausedAtZero && viewAngle > 0.8 && (
                        <g>
                            <text x={0} y={-y - 15} textAnchor="middle" fill="#eab308" fontSize="12" fontWeight="bold">
                                {iComponent > 0 ? "+i (Top)" : "-i (Bottom)"}
                            </text>
                            {/* Velocity Arrow */}
                            <motion.path
                                d={`M ${x} 0 L ${x + (iComponent > 0 ? -40 : 40)} 0`}
                                stroke="#eab308"
                                strokeWidth="3"
                                markerEnd="url(#arrowhead)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                            />
                        </g>
                    )}

                </svg>

                {/* Dynamic State Overlay */}
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                    <AnimatePresence mode="wait">
                        {isPausedAtZero && (
                            <motion.div
                                key={viewAngle > 0.5 ? 'revealed' : 'hidden'}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                className="inline-block px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10"
                            >
                                <span className={`text-sm font-medium ${viewAngle > 0.5 ? 'text-amber-400' : 'text-blue-300'}`}>
                                    {viewAngle > 0.5 ? (
                                        stateText
                                    ) : (
                                        "Position = 0. Velocity = ???"
                                    )}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Explainer Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
                <span>
                    View: <strong className="text-indigo-400">{Math.round(viewAngle * 100)}% 2D</strong>
                </span>
                <span>
                    {isPausedAtZero ? (
                        viewAngle > 0.5 ?
                            "The Imaginary axis reveals the hidden state." :
                            "Real numbers alone cannot distinguish these states."
                    ) : (
                        "Oscillation x = cos(t)"
                    )}
                </span>
            </div>
        </div>
    );
};
