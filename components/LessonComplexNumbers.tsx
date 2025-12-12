import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Home, BookOpen, AlertCircle } from 'lucide-react';
import { ComplexMotionVisualizer } from './ComplexMotionVisualizer';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';


interface LessonComplexNumbersProps {
    onBack: () => void;
    onHome: () => void;
}


export const DividerLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center my-8">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="mx-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {children}
        </span>
        <div className="flex-grow h-px bg-gray-200" />
    </div>
);

export const LessonComplexNumbers: React.FC<LessonComplexNumbersProps> = ({ onBack, onHome }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900"
        >
            {/* Navigation Bar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-6"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={onHome}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <Home size={20} />
                    </button>
                    <div className="h-4 w-px bg-gray-200" />
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Map</span>
                    </button>
                </div>
                <div className="text-xs font-bold tracking-widest text-gray-400 uppercase hidden md:block">
                    Insight Lab Editorial
                </div>
            </motion.nav>

            {/* Progress Bar */}
            <motion.div
                style={{ scaleX: scrollYProgress }}
                className="fixed top-16 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
            />

            {/* Main Content Container */}
            <main className="max-w-3xl mx-auto px-6 py-32 md:py-40 flex flex-col gap-24">
                {/* 1. Hero Section */}
                <section className="relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 block">
                            Core Concept
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight mb-6">
                            Complex Number:<br />
                            <span className="italic text-slate-600">理解虚数 i 的本质</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-serif italic mb-12">从实数的局限到二维的自由</p>
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
                                理解复数能做到哪些实数做不到的事情
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

                {/* 3. Section: 0.1 Evolution of Tools */}
                <Section title="0.1 数学工具的演化史">
                    <p className="text-lg leading-relaxed text-slate-700 mb-8">
                        数学工具的演进，本质上是人类不断修补“现有表示体系的缺陷”。最初我们用自然数（ℕ）（0, 1, 2, 3, ...）来计数；
                        当出现“两人分一个面包”时，自然数表达失败，于是有理数（ℚ）（1，2，3, ...无法描述半个面包，需要0.5，1/2）出现；
                        当我们需要表达亏欠、损失、方向时，只有正数也不够了，于是包含负数的整数体系（ℤ）（借用符号的意义来表明方向的正负，金钱的盈利亏损等等）被引入。
                    </p>

                    <Callout type="warn" title="注意">
                        每个数学工具都有自己的“服务区”。我们不应该用低维直觉去否定高维工具，而应该先问：
                        <span className="font-semibold text-slate-900">现在的问题，是否已经超出了旧工具的表达能力？</span>
                    </Callout>
                </Section>

                {/* 4. Section: 1. Why we need i */}
                <Section title="1. 为什么我们需要 i">
                    <AnswerBox>
                        <p className="text-sm leading-relaxed text-slate-700">
                            <span className="font-semibold text-slate-900">结论先行：</span> i 不是为了让数学更抽象，而是为了在处理特定问题时
                            <span className="font-semibold text-slate-900">不丢信息</span>。
                            当我们坚持只使用实数时，某些问题的推理会中途断裂，某些过程中的关键状态会被压扁成同一个点。
                        </p>
                    </AnswerBox>




                    {/* A: Algebra */}
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-serif">
                                A
                            </span>
                            代数视角：我们明明知道答案，却被“负数开方”卡住
                        </h3>

                        <QuestionBox>
                            <div className="text-sm text-slate-800 leading-relaxed">
                                我们要解这个方程：<InlineMath math="x^3 = 15x + 4" />。
                                <div className="mt-2">
                                    这不是“为了装复杂”，而是为了观察一件事：<span className="font-semibold text-slate-900">只用实数，会不会让推理走不下去？</span>
                                </div>
                            </div>
                        </QuestionBox>

                        <ReasoningBox>
                            <div className="text-sm text-slate-700 leading-relaxed">
                                <ol className="list-decimal pl-5 space-y-3">
                                    <li>
                                        <span className="font-semibold text-slate-900">先用直觉验证一个答案</span>：把 <InlineMath math="x=4" /> 代回去。
                                        <div className="mt-2">
                                            <InlineMath math="4^3=64" />，右边是 <InlineMath math="15\cdot 4 + 4 = 60+4=64" />，完全相等。
                                            所以我们非常确定：<span className="font-semibold text-slate-900">这个方程至少有一个实数解，就是 4</span>。
                                        </div>
                                    </li>
                                    <li>
                                        <span className="font-semibold text-slate-900">再看“通用公式”会发生什么</span>：
                                        把方程写成 <InlineMath math="x^3-15x-4=0" />（这叫“降到标准形式”）。
                                        使用卡尔丹公式（当时的通用解法）会得到：
                                        <div className="mt-3">
                                            <BlockMath math="x = \sqrt[3]{\,2 + \sqrt{-121}\,} + \sqrt[3]{\,2 - \sqrt{-121}\,}." />
                                        </div>
                                        你看到了：中间出现了 <InlineMath math="\sqrt{-121}" />。
                                    </li>
                                    <li>
                                        <span className="font-semibold text-slate-900">如果我们拒绝 i，会立刻矛盾</span>：
                                        因为我们已经确认 <InlineMath math="x=4" /> 是真答案；但公式里却出现“实数里不存在”的东西。
                                        这会造成一个很怪的结论：
                                        <div className="mt-2 font-semibold text-slate-900">
                                            明明有实数答案，但我们的推理工具却因为“缺了一个数”而走不下去。
                                        </div>
                                    </li>
                                </ol>

                                <DividerLabel>那我们硬着头皮算下去会怎样？</DividerLabel>

                                <ol className="list-decimal pl-5 space-y-3" start={4}>
                                    <li>
                                        先把 <InlineMath math="\sqrt{-121}" /> 写成 <InlineMath math="11i" />（因为 <InlineMath math="i^2=-1" />）。
                                        于是公式变成：
                                        <div className="mt-3">
                                            <BlockMath math="x = \sqrt[3]{\,2 + 11i\,} + \sqrt[3]{\,2 - 11i\,}." />
                                        </div>
                                    </li>
                                    <li>
                                        现在我们要找一个复数 <InlineMath math="a+bi" />，让它的立方等于 <InlineMath math="2+11i" />。
                                        这里有一个“中学生也能跟”的试探：
                                        我们试 <InlineMath math="(2+i)^3" />。
                                        <div className="mt-3">
                                            <BlockMath math="(2+i)^2=4+4i+i^2=3+4i" />
                                            <BlockMath math="(2+i)^3=(2+i)(3+4i)=6+8i+3i+4i^2=2+11i" />
                                        </div>
                                        bingo：<InlineMath math="\sqrt[3]{2+11i}=2+i" />。
                                    </li>
                                    <li>
                                        同理你也可以验证：<InlineMath math="(2-i)^3=2-11i" />，所以 <InlineMath math="\sqrt[3]{2-11i}=2-i" />。
                                        那么：
                                        <div className="mt-3">
                                            <BlockMath math="x=(2+i)+(2-i)=4" />
                                        </div>
                                        这就把“公式给出的复杂表达”算回了我们一开始就确认的实数答案 4。
                                    </li>
                                </ol>
                            </div>
                        </ReasoningBox>

                        <SolutionBox>
                            <p className="text-sm leading-relaxed">
                                现在逻辑闭环了：
                                <span className="font-semibold text-indigo-900">为了让“已经存在的实数答案”能够被通用公式推出来，我们不得不允许 i 的存在。</span>
                                i 不是随便定义的，它是把断裂推理接起来的最小补丁。
                            </p>
                        </SolutionBox>
                    </div>

                    {/* B: Geometry/Physics */}
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-serif">B</span>
                            几何 / 物理视角：实数轴只能存“位置”，存不下“下一步往哪走”
                        </h3>


                        <QuestionBox>
                            <div className="text-sm text-slate-800 leading-relaxed">
                                想象一个钟摆在左右摆动。
                                <div className="mt-2">
                                    我们用<span className="font-semibold text-slate-900">实数轴</span>来表示它的位移：
                                    右边是正数，左边是负数。
                                </div>
                                <div className="mt-2">
                                    现在问一个非常具体的问题：当某一刻位移是 <InlineMath math="x=0" />（钟摆刚好经过中间），
                                    <span className="font-semibold text-slate-900">你能只靠这个数字，判断它下一瞬间会向左还是向右吗？</span>
                                </div>
                            </div>
                        </QuestionBox>


                        <ReasoningBox>
                            <div className="text-sm text-slate-700 leading-relaxed">
                                <ol className="list-decimal pl-5 space-y-3">
                                    <li>
                                        在实数轴里，我们只记录一个数 <InlineMath math="x" />，它只代表“位置”。
                                        比如：<InlineMath math="x=+2" /> 在右边，<InlineMath math="x=-2" /> 在左边。
                                    </li>
                                    <li>
                                        但钟摆的真实状态至少有两条信息：
                                        <div className="mt-2">（1）它现在在哪（位置）；（2）它正往哪边动（方向）。</div>
                                        你可以把“方向”理解成：下一秒 <InlineMath math="x" /> 会变大还是变小。
                                    </li>
                                    <li>
                                        当 <InlineMath math="x=0" /> 时，会出现两种完全不同的真实情况：
                                        <div className="mt-2">
                                            情况 A：从左边过来，正在向右穿过 0；
                                            <br />
                                            情况 B：从右边过来，正在向左穿过 0。
                                        </div>
                                    </li>
                                    <li>
                                        但是在实数轴里，这两种情况都会被记录成同一个数字：<InlineMath math="0" />。
                                        <div className="mt-2 font-semibold text-slate-900">也就是说：我们把“不同状态”压成了“同一个点”。</div>
                                    </li>
                                </ol>
                            </div>
                        </ReasoningBox>


                        <SolutionBox>
                            <p className="text-sm leading-relaxed">
                                所以我们需要升维：让一个状态同时携带两份信息。
                                复数 <InlineMath math="a+bi" /> 正是“两个数一起描述一个状态”的方式：
                                <span className="font-semibold text-indigo-900">实部一份信息，虚部一份信息</span>。
                            </p>
                        </SolutionBox>


                        {/* 你说目前先不做可视化：如果你想临时隐藏，就把下面这一段删掉或注释掉 */}
                        <div className="my-12">
                            <ComplexMotionVisualizer />
                        </div>
                    </div>
                </Section>


                {/* 5. Section: 2. How to extend */}
                <Section title="2. 既然需要二维，那怎么拓展？">
                    <AnswerBox>
                        <p className="text-sm leading-relaxed text-slate-700">
                            <span className="font-semibold text-slate-900">结论先行：</span> 我们把二维点写成 <InlineMath math="a+bi" />，并加上一条最小但决定性的规则：
                            <InlineMath math="i^2=-1" />。在分配律之下，这会自动推出：
                            <span className="font-semibold text-slate-900">乘以 i 等价于旋转 90°</span>。
                        </p>
                    </AnswerBox>

                    <ReasoningBox>
                        <ol className="list-decimal pl-5 space-y-3">
                            <li>
                                我们先把二维状态写成“数”的形式：<InlineMath math="z=a+bi" />，其中 <InlineMath math="a,b" /> 都是实数。
                            </li>
                            <li>
                                要让它像“数”一样可计算，我们保留实数的代数规则（尤其是分配律），并要求 <InlineMath math="i^2=-1" />。
                            </li>
                            <li>
                                现在推导“乘 i 的几何意义”。
                            </li>
                        </ol>

                        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4 text-sm text-slate-800 leading-relaxed">
                            令 <InlineMath math="z=a+bi" />：
                            <div className="mt-2"><InlineMath math="z = a + bi" /></div>
                            <div className="mt-2"><InlineMath math="iz = i(a + bi)" /></div>
                            <div className="mt-2"><InlineMath math="= ia + i\cdot b\cdot i" /></div>
                            <div className="mt-2"><InlineMath math="= ai + b\cdot i^2" /></div>
                            <div className="mt-2"><InlineMath math="= ai - b" /></div>
                            <div className="mt-2">所以：<InlineMath math="iz=(-b)+ai" /></div>
                            <div className="mt-2">对应平面点：<InlineMath math="(a,b)\mapsto(-b,a)" /></div>
                            <div className="mt-2">这正是逆时针旋转 90°（长度不变，方向转四分之一圈）。</div>
                            <div className="mt-2">再乘一次：<InlineMath math="i(iz)=i^2 z=-z" />，对应旋转 180°。</div>
                        </div>
                    </ReasoningBox>

                    <SolutionBox>
                        <p className="text-sm leading-relaxed">
                            你会发现：我们并不是先“规定乘 i 就是旋转”，而是先要求系统遵守代数规则并满足 <InlineMath math="i^2=-1" />。
                            在这些约束下，旋转 90° 是必然出现的几何含义。
                        </p>
                    </SolutionBox>
                </Section>

                {/* 6. Section: 3. Comparison */}
                <Section title="3. 复平面 vs 向量">
                    <AnswerBox>
                        <p className="text-sm leading-relaxed text-slate-700">
                            <span className="font-semibold text-slate-900">结论先行：</span> 复数不是“把数写成二维向量”这么简单。
                            真正的差别在于：复数在二维上带来一套
                            <span className="font-semibold text-slate-900">可做乘法/除法</span>的规则，让“缩放+旋转”可以用一次乘法表达。
                        </p>
                    </AnswerBox>

                    <div className="grid md:grid-cols-2 gap-0 border border-slate-200 rounded-3xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200 mt-8">
                        <div className="p-8 bg-slate-50">
                            <h3 className="font-bold text-lg mb-4 text-slate-700">Vector Space (ℝ²)</h3>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">拥有</span>
                                    <span>加法、实数倍缩放</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">擅长</span>
                                    <span>描述状态：位移、力、速度</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">缺少</span>
                                    <span>一种自然的“乘法/除法”，让变换可逆且自洽</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 bg-white">
                            <h3 className="font-bold text-lg mb-4 text-indigo-600">Complex Plane (ℂ)</h3>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">拥有</span>
                                    <span>加法 + 乘法（可推出除法，除 0 外）</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">擅长</span>
                                    <span>描述动作与变换：一次乘法 = 缩放 + 旋转</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-slate-400 w-12 shrink-0">要点</span>
                                    <span className="font-medium text-slate-900 border-b-2 border-indigo-100 pb-1">
                                        差别不在“二维表示”，而在“乘法结构”
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Callout type="note" title="一个关键澄清">
                        你当然可以给 ℝ² 强行定义一种乘法，让它变得“像复数”。
                        但只要这套乘法满足复数那套规则（比如 <InlineMath math="i^2=-1" /> 对应 90° 旋转），
                        你实际上得到的就是复数（在数学上叫“同构”）。
                    </Callout>
                </Section>

                {/* Footer */}
                <div className="h-32 flex items-center justify-center text-slate-300 pb-12">
                    <span className="italic font-serif">End of Lesson</span>
                </div>
            </main>
        </div>
    );
};

// -------------------- Helper Components --------------------

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
    >
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
            {title}
        </h2>
        {children}
    </motion.section>
);

type CalloutType = 'warn' | 'note';

const Callout: React.FC<{ type: CalloutType; title: string; children: React.ReactNode }> = ({
    type,
    title,
    children,
}) => {
    const styles =
        type === 'warn'
            ? 'bg-amber-50 border-amber-100 text-amber-900'
            : 'bg-slate-50 border-slate-200 text-slate-800';

    return (
        <div className={`mt-6 border rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed ${styles}`}>
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
                <div className="font-bold mb-1">{title}</div>
                <div className="text-slate-700">{children}</div>
            </div>
        </div>
    );
};

const Box: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`rounded-2xl border p-6 leading-relaxed ${className || ''}`}>{children}</div>
);

const AnswerBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box className="bg-white border-slate-200 shadow-sm">
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Answer First</div>
        {children}
    </Box>
);

const QuestionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box className="bg-slate-50 border-slate-200">
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Question</div>
        <div className="text-sm text-slate-800">{children}</div>
    </Box>
);

const ReasoningBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box className="bg-white border-slate-200">
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Reasoning</div>
        <div className="text-sm text-slate-700">{children}</div>
    </Box>
);

const SolutionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box className="bg-indigo-50 border-indigo-100">
        <div className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-2">Solution</div>
        <div className="text-sm text-indigo-900">{children}</div>
    </Box>
);
