import { Node, Link, Subject, LessonContent, Chapter } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'signals',
    title: 'Signals & Systems',
    description: 'Understand the mathematical manipulation of information signals.',
    icon: 'activity'
  },
  {
    id: 'algebra',
    title: 'Linear Algebra',
    description: 'The branch of mathematics concerning linear equations and vector spaces.',
    icon: 'grid'
  },
  {
    id: 'math_for_machinelearning',
    title: 'Mathmetics For Machine Learning',
    description: 'Explore how math works behind machine learning algorithms',
    icon: 'cpu'
  }
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'freq_basics',
    subjectId: 'signals',
    number: 1,
    title: 'The Basics of Frequency',
    description: 'Master the building blocks: Complex numbers, Euler\'s identity, and the intuition behind frequency decomposition.'
  },
  {
    id: 'sampling',
    subjectId: 'signals',
    number: 2,
    title: 'The Sampling Theorem',
    description: 'Analog to Digital conversion, Aliasing, and reconstruction filters.'
  }
];

// Nodes now associated with Chapter 1 (freq_basics)
export const GRAPH_NODES: Node[] = [
  { id: 'complex', label: 'Complex Numbers (i)', x: 30, y: 20, chapterId: 'freq_basics', category: 'fundamental' },
  { id: 'e', label: 'The Number e', x: 70, y: 20, chapterId: 'freq_basics', category: 'fundamental' },
  { id: 'euler', label: "Euler's Formula", x: 50, y: 50, chapterId: 'freq_basics', category: 'core' },
  { id: 'trig', label: 'Trigonometry', x: 20, y: 50, chapterId: 'freq_basics', category: 'fundamental' },
  { id: 'fourier', label: 'Fourier Transform', x: 50, y: 85, chapterId: 'freq_basics', category: 'advanced' },
];

export const GRAPH_LINKS: Link[] = [
  { source: 'euler', target: 'fourier', strength: 'strong' },
  { source: 'complex', target: 'euler', strength: 'weak' },
  { source: 'e', target: 'euler', strength: 'weak' },
  { source: 'trig', target: 'euler', strength: 'weak' },
];

export const LESSON_CONTENT_MAP: Record<string, LessonContent> = {
  fourier: {
    title: 'The Fourier Transform',
    path: ['Complex Numbers', "Euler's Formula", 'Fourier Transform'],
    interactiveType: 'wave',
    body: `
      <h3 class="text-2xl font-semibold mb-4">Deconstructing Frequencies</h3>
      <p class="mb-6 text-gray-600 leading-relaxed">
        The Fourier Transform is a mathematical tool that decomposes a signal into its constituent frequencies. Just as a musical chord can be expressed as the frequencies (or pitches) of its constituent notes, a function over time can be expressed as the sum of its constituent frequencies.
      </p>
      <h3 class="text-2xl font-semibold mb-4">The Intuition</h3>
      <p class="mb-6 text-gray-600 leading-relaxed">
        Imagine wrapping the signal around a circle. By changing the rotation speed of the wrap, we find "resonant" frequencies where the signal aligns perfectly. This center of mass calculation is the core of the transform.
      </p>
    `
  },
  euler: {
    title: "Euler's Formula",
    path: ['Complex Numbers', 'The Number e', "Euler's Formula"],
    interactiveType: 'formula',
    body: `
      <h3 class="text-2xl font-semibold mb-4">The Jewel of Mathematics</h3>
      <p class="mb-6 text-gray-600 leading-relaxed">
        Euler's formula establishes the fundamental relationship between the trigonometric functions and the complex exponential function. It states that for any real number x:
      </p>
      <div class="p-4 bg-gray-100 rounded-lg text-center font-mono text-xl mb-6">e^{ix} = cos(x) + i*sin(x)</div>
      <p class="mb-6 text-gray-600 leading-relaxed">
        This formula provides a powerful connection between analysis, trigonometry, and geometry, essentially describing rotation in the complex plane.
      </p>
    `
  },
  complex: {
    title: 'Complex Numbers (i)',
    path: ['Algebra', 'Complex Numbers'],
    interactiveType: 'generic',
    body: `
      <h3 class="text-2xl font-semibold mb-4">Beyond the Real Line</h3>
      <p class="mb-6 text-gray-600 leading-relaxed">
        Complex numbers extend the concept of the one-dimensional number line to the two-dimensional complex plane by using the horizontal axis for the real part and the vertical axis for the imaginary part.
      </p>
    `
  },
  e: {
    title: 'The Number e',
    path: ['Calculus', 'Limits', 'The Number e'],
    interactiveType: 'generic',
    body: `
      <h3 class="text-2xl font-semibold mb-4">Growth and Decay</h3>
      <p class="mb-6 text-gray-600 leading-relaxed">
        The number e, also known as Euler's number, is a mathematical constant approximately equal to 2.71828. It is the base of the natural logarithm and arises naturally in analyzing continuous growth.
      </p>
    `
  },
  trig: {
    title: 'Trigonometry',
    path: ['Geometry', 'Trigonometry'],
    interactiveType: 'generic',
    body: `
      <h3 class="text-2xl font-semibold mb-4">Triangles and Cycles</h3>
      <p class="mb-6 text-gray-600 leading-relaxed">
        Trigonometry studies relationships between side lengths and angles of triangles. The field emerged in the Hellenistic world during the 3rd century BC from applications of geometry to astronomical studies.
      </p>
    `
  }
};