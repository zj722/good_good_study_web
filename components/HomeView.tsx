import React from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../types';
import { Activity, Cpu, Grid, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  subjects: Subject[];
  onSelectSubject: (id: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity size={32} className="text-indigo-600" />,
  grid: <Grid size={32} className="text-gray-400" />,
  cpu: <Cpu size={32} className="text-gray-400" />
};

export const HomeView: React.FC<HomeViewProps> = ({ subjects, onSelectSubject }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-4">Nexus</h1>
        <p className="text-xl text-gray-500 max-w-lg mx-auto">
          Explore knowledge through connections. Choose a domain to begin your journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            layoutId={`card-${subject.id}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
            onClick={() => subject.id === 'signals' ? onSelectSubject(subject.id) : null}
            className={`
              bg-white rounded-3xl p-8 h-80 flex flex-col justify-between border border-gray-100 shadow-sm cursor-pointer group relative overflow-hidden
              ${subject.id !== 'signals' ? 'opacity-50 grayscale cursor-not-allowed' : ''}
            `}
          >
             {/* Decorative Background Blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl transition-colors duration-500 group-hover:bg-indigo-50`} />
            
            <div className="relative">
              <div className="mb-6 p-3 bg-gray-50 rounded-2xl w-fit group-hover:bg-indigo-50 transition-colors duration-300">
                {iconMap[subject.icon]}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{subject.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{subject.description}</p>
            </div>

            <div className="flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              Explore Map <ArrowRight size={16} className="ml-2" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Background Subtle texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};
