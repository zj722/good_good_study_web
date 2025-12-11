import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Home, BookOpen, AlertCircle, ArrowRight, MousePointer2, Play, AlertTriangle } from 'lucide-react';

interface LessonComplexNumbersProps {
    onBack: () => void;
    onHome: () => void;
}

export const LessonComplexNumbers: React.FC<LessonComplexNumbersProps> = ({ onBack, onHome }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Interactive Playground State
    const [activeTransform, setActiveTransform] = useState<'one' | 'two' | 'neg' | 'i'>('i');

    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

            {/* Navigation Bar */}
            <motion.nav
                initial={{ y: -100 }} animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-6"
            >
                <div className="flex items-center gap-4">
                    <button onClick={onHome} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <Home size={20} />
                    </button>
                    <div className="h-4 w-px bg-gray-200" />
                    <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} />
                        <span>Back to Map</span>
                    </button>
                </div>
                <div className="text-xs font-bold tracking-widest text-gray-400 uppercase hidden md:block">
                    Insight Lab Editorial
                </div>
            </motion.nav>

            {/* Progress Bar */}
            <motion.div style={{ scaleX: scrollYProgress }} className="fixed top-16 left-0 right-0 h-1 bg-indigo-600 origin-left z-50" />

            {/* Main Content Container */}
            <main className="max-w-3xl mx-auto px-6 py-32 md:py-40 flex flex-col gap-24">

                {/* 1. Hero Section */}
                <section className="relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 block">Core Concept</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight mb-6">
                            Complex Number:<br />
                            <span className="italic text-slate-600">理解虚数 i 的本质</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-serif italic mb-12">
                            从实数的局限到二维的自由
                        </p>
                    </motion.div>

                    {/* Goal Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="md:absolute md:top-0 md:-right-64 w-full md:w-56 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 border-l-4 border-l-indigo-500"
                    >
                        <div className="flex items-center gap-2 mb-4 text-indigo-900 font-bold text-sm uppercase tracking-wider">
                            <BookOpen size={16} /> 学习目标
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <li className="flex gap-2">
                                <span className="text-indigo-400 font-bold">01</span>
                                解释引入 i 的必要性
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-400 font-bold">02</span>
                                阐述复数域的二维变换能力
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-400 font-bold">03</span>
                                辨析复平面与向量平面
                            </li>
                        </ul>
                    </motion.div>
                </section>

                {/* 2. Section: 0. Hook */}
                <Section title="0. 序言">
                    <p className="text-lg leading-relaxed text-slate-700 mb-8">
                        为什么我们需要虚数 i？很多初学者在第一次遇到 i 时，内心不仅是困惑，甚至会有一种被欺骗的感觉。
                        <span className="font-serif italic text-slate-900 block my-4 pl-4 border-l-2 border-slate-300">
                            “凭什么？凭什么这就定义 i² = -1 了？”
                        </span>
                        如果你也有这种困惑，并不是因为你数学不好，而是因为你的直觉执着于认为数字是用来“数数”的工具。
                    </p>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xl font-serif text-slate-800 italic">
                            "请不要把数学看作一开始就存在的真理，请把它看作一个人类为了解决新问题而不断扩充的‘工具箱’。"
                        </p>
                    </div>
                </Section>

                {/* 3. Section: 0.1 Timeline - Improved Narrative */}
                <Section title="0.1 数学工具的演化史">
                    <div className="space-y-8 relative pl-8 border-l-2 border-indigo-50">
                        <TimelineStep
                            icon="🐑"
                            scenario="IMAGINE: I am a shepherd. I have sheep to manage. I need to know if the sheep that went out is the same amount as the sheep coming back."
                            conflict="My intuition isn't precise enough."
                            solution="I invent Natural Numbers (NK) to count exact quantities."
                        />
                        <TimelineStep
                            icon="🍞"
                            scenario="IMAGINE: I have 1 loaf of bread, but 2 people need to eat. I can't give them 0 bread, nor 1 bread."
                            conflict="Integer division fails here. 1 ÷ 2 has no answer in the world of integers."
                            solution="I invent Fractions/Decimals (Q) to describe precision and parts."
                        />
                        <TimelineStep
                            icon="🪙"
                            scenario="IMAGINE: I am doing business. I have 0 coins, but I owe you 5 coins."
                            conflict="Positive numbers can't describe 'less than nothing' or 'debt'."
                            solution="I invent Negative Numbers (Z) to describe status and direction."
                        />

                        {/* Warning Callout */}
                        <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-sm leading-relaxed">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p>
                                注意：每个数学工具都有它特定的“服务区”。你不能拿负数去买西瓜（数数），就像你不能用实数直觉去理解复数。
                            </p>
                        </div>
                    </div>
                </Section>

                {/* 4. Section: 1. Motivation - Detailed Logic Chain */}
                <Section title="1. 为什么我们需要 i">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">The Crisis</span>
                            <h3 className="font-bold text-xl text-slate-900">When Formulas Break</h3>
                        </div>

                        {/* Step 1 */}
                        <div className="pl-6 border-l-2 border-slate-100 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200"></div>
                            <h4 className="font-bold text-slate-800 mb-2">Step 1: The Obvious Truth</h4>
                            <p className="text-slate-600 text-sm mb-3">Look at this equation. If we plug in <span className="font-mono bg-slate-100 px-1 rounded">x = 4</span>:</p>
                            <div className="bg-slate-50 p-4 rounded-xl font-mono text-center text-slate-700 mb-2">
                                x³ = 15x + 4
                            </div>
                            <p className="text-slate-500 text-xs italic">
                                $4^3 = 64$ and $15(4) + 4 = 64$. <br />
                                So, <strong className="text-indigo-600">x = 4 is definitely a correct answer.</strong>
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="pl-6 border-l-2 border-slate-100 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200"></div>
                            <h4 className="font-bold text-slate-800 mb-2">Step 2: The Universal Tool</h4>
                            <p className="text-slate-600 text-sm">
                                Mathematicians found a 'Universal Formula' (Cardano's Formula) that *should* solve any cubic equation, just like the quadratic formula.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="pl-6 border-l-2 border-slate-100 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200"></div>
                            <h4 className="font-bold text-slate-800 mb-2">Step 3: The Glitch</h4>
                            <p className="text-slate-600 text-sm mb-3">Let's plug our numbers into the formula:</p>
                            <div className="bg-slate-50 p-4 rounded-xl font-mono text-center text-slate-700">
                                x = ∛(2 + √-121) + ∛(2 - √-121)
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="pl-6 border-l-2 border-red-200 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 shadow-red-200 shadow-lg animate-pulse"></div>
                            <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} /> Step 4: Logic Error
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                We hit a brick wall: <span className="font-mono font-bold text-red-600">√-121</span>.
                                In the real number world, this is impossible. The formula produces 'garbage', yet we KNOW the answer is 4. Is the formula broken? Or is our understanding of numbers too narrow?
                            </p>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-2xl relative mt-4">
                            <p className="font-serif italic text-indigo-900 leading-relaxed text-center">
                                "We must pass through the land of 'imaginary' numbers to reach the real solution."
                            </p>
                        </div>
                    </div>
                </Section>

                {/* 5. Section: 2. Space Expansion - Interactive Playground */}
                <Section title="2. 复平面 (Space Expansion)">
                    <p className="text-lg text-slate-700 mb-8">
                        引入 i 后，数本身从一维 (Line) 扩展到了二维 (Plane)。放弃“数即数量”的执念，接受<span className="font-bold text-indigo-600">“数即动作”</span>。
                    </p>

                    {/* Interactive Playground */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-12">
                        {/* Controls */}
                        <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50">
                            <PlaygroundControl
                                label="× 1" sub="Stay"
                                active={activeTransform === 'one'}
                                onClick={() => setActiveTransform('one')}
                            />
                            <PlaygroundControl
                                label="× 2" sub="Stretch"
                                active={activeTransform === 'two'}
                                onClick={() => setActiveTransform('two')}
                            />
                            <PlaygroundControl
                                label="× -1" sub="Rotate 180°"
                                active={activeTransform === 'neg'}
                                onClick={() => setActiveTransform('neg')}
                            />
                            <PlaygroundControl
                                label="× i" sub="Rotate 90°"
                                active={activeTransform === 'i'}
                                onClick={() => setActiveTransform('i')}
                                highlight
                            />
                        </div>

                        {/* Visualization Canvas */}
                        <div className="h-80 relative flex items-center justify-center bg-slate-900 overflow-hidden">
                            {/* Grid Background */}
                            <div className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
                                    backgroundSize: '40px 40px',
                                    backgroundPosition: 'center center'
                                }}
                            />

                            {/* Axes */}
                            <div className="absolute w-full h-px bg-slate-700 top-1/2"></div>
                            <div className="absolute h-full w-px bg-slate-700 left-1/2"></div>

                            {/* Vector */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 origin-left h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                                initial={{ width: 100, rotate: 0 }}
                                animate={{
                                    scaleX: activeTransform === 'two' ? 2 : 1,
                                    rotate: activeTransform === 'neg' ? 180 : (activeTransform === 'i' ? -90 : 0),
                                    // Note: CSS rotation is usually clockwise, but math is CCW. 
                                    // Standard position is +X axis (0 deg). 
                                    // i (90 deg CCW) = -90 deg in CSS usually if Y is down? 
                                    // Wait, HTML coords: Y is down. 
                                    // 0 deg = right. 90 deg = down. -90 deg = up.
                                    // Math 'i' is 'up' (90 deg CCW). So -90 deg CSS rotation is correct.
                                }}
                                style={{ width: 100 }} // Base unit length
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                {/* Arrow Head */}
                                <div className="absolute -right-2 -top-[6px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-indigo-500"></div>

                                {/* Label */}
                                <motion.span
                                    className="absolute right-0 -top-8 text-indigo-300 font-mono font-bold text-sm bg-slate-800 px-2 py-1 rounded"
                                    animate={{ rotate: activeTransform === 'neg' ? 180 : (activeTransform === 'i' ? 90 : 0) }} // Counter-rotate text
                                >
                                    {activeTransform === 'one' && '1'}
                                    {activeTransform === 'two' && '2'}
                                    {activeTransform === 'neg' && '-1'}
                                    {activeTransform === 'i' && 'i'}
                                </motion.span>
                            </motion.div>

                            {/* Ghost Vector (Reference) */}
                            <div className="absolute left-1/2 top-1/2 w-[100px] h-px bg-slate-600 border-t border-dashed opacity-50 pointer-events-none"></div>

                            {/* Unit Circle Hint */}
                            <div className="absolute left-1/2 top-1/2 -ml-[100px] -mt-[100px] w-[200px] h-[200px] border border-slate-700 rounded-full opacity-30 pointer-events-none"></div>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold">Real vs Complex</h4>
                            <p className="text-gray-400 text-sm max-w-xs">
                                实数只能在直线上进退或由负号翻转，而复数开启了旋转的能力。
                            </p>
                        </div>
                        <div className="flex gap-8 items-center text-sm font-mono">
                            <div className="text-center">
                                <div className="w-16 h-1 bg-white/20 rounded-full mb-2 mx-auto relative">
                                    <div className="absolute inset-0 bg-white w-1/2 rounded-full"></div>
                                </div>
                                <span>1D Line</span>
                            </div>
                            <ArrowRight className="text-gray-600" />
                            <div className="text-center">
                                <div className="w-16 h-16 border-2 border-white/20 rounded-full mb-2 mx-auto relative flex items-center justify-center">
                                    <div className="w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-full"></div>
                                </div>
                                <span>2D Plane</span>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* 6. Section: 3. Comparision */}
                <Section title="3. 复平面 vs 向量">
                    <div className="grid md:grid-cols-2 gap-0 border border-slate-200 rounded-3xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        <div className="p-8 bg-slate-50">
                            <h3 className="font-bold text-lg mb-4 text-slate-700">Vector Space (ℝ²)</h3>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">本质</span>
                                    <span>容器 (Container)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">用途</span>
                                    <span>描述状态 (力, 位移, 速度)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">计算</span>
                                    <span>维度之间通常是独立的</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <MousePointer2 size={120} />
                            </div>
                            <h3 className="font-bold text-lg mb-4 text-indigo-600">Complex Plane (ℂ)</h3>
                            <ul className="space-y-4 text-sm text-slate-600 relative z-10">
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">本质</span>
                                    <span>自洽的代数域 (Field)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">用途</span>
                                    <span>描述动作与变换 (Transformation)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">计算</span>
                                    <span className="font-medium text-slate-900 border-b-2 border-indigo-100 pb-1">加法=平移，乘法=旋转+缩放</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Section>

                {/* Footer */}
                <div className="h-32 flex items-center justify-center text-slate-300 pb-12">
                    <span className="italic font-serif">End of Lesson</span>
                </div>

            </main>
        </div>
    );
};

// Helper Components

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
    >
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
            {title}
        </h2>
        {children}
    </motion.section>
);

const TimelineStep: React.FC<{ icon: string; scenario: string; conflict: string; solution: string }> = ({ icon, scenario, conflict, solution }) => (
    <div className="relative pb-10 last:pb-0">
        <div className="absolute -left-[42px] top-0 w-8 h-8 bg-white border-2 border-indigo-100 rounded-full flex items-center justify-center shadow-sm text-lg">
            {icon}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider text-indigo-500">The Problem</h4>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{scenario} <span className="text-slate-400 block mt-1 italic">{conflict}</span></p>

            <div className="pt-4 border-t border-slate-50">
                <h4 className="font-bold text-slate-900 mb-1 uppercase text-xs tracking-wider text-emerald-600">The Solution</h4>
                <p className="text-slate-800 font-medium text-sm">{solution}</p>
            </div>
        </div>
    </div>
);

const PlaygroundControl: React.FC<{ label: string; sub: string; active?: boolean; onClick?: () => void; highlight?: boolean }> = ({ label, sub, active, onClick, highlight }) => (
    <button
        onClick={onClick}
        className={`p-4 transition-all flex flex-col items-center gap-1 hover:bg-slate-50
            ${active ? 'bg-indigo-50/50 border-b-2 border-indigo-500 text-indigo-700' : 'text-slate-500 border-b-2 border-transparent'}
        `}
    >
        <span className={`font-mono text-lg font-bold ${active ? 'text-indigo-600' : (highlight ? 'text-indigo-400' : 'text-slate-700')}`}>{label}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{sub}</span>
    </button>
);
