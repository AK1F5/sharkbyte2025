import { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, TrendingUp, Users, Award, CheckCircle2, Waves, Palmtree } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { CareerWizard } from './components/CareerWizard';
import { ComparePrograms } from './components/ComparePrograms';
import { FinancialPlanner } from './components/FinancialPlanner';

// Shark Tooth Icon Component
function SharkTooth({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M12 2 L8 12 L12 22 L16 12 Z" opacity="0.9" />
      <path d="M12 2 L9 12 L12 22 L15 12 Z" opacity="0.7" />
    </svg>
  );
}

// Wave Divider Component
function WaveDivider({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const { scrollYProgress } = useScroll();
  const wave1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const wave2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg className="w-full h-24 md:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <motion.path 
          style={{ x: wave1 }}
          d="M0,50 Q300,80 600,50 T1200,50 L1200,120 L0,120 Z" 
          className="fill-cyan-100/30"
        />
        <motion.path 
          style={{ x: wave2 }}
          d="M0,60 Q300,90 600,60 T1200,60 L1200,120 L0,120 Z" 
          className="fill-teal-100/20"
        />
        <path 
          d="M0,70 Q300,100 600,70 T1200,70 L1200,120 L0,120 Z" 
          className="fill-white/40"
        />
      </svg>
    </div>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [showComparePrograms, setShowComparePrograms] = useState(false);
  const [showFinancialPlanner, setShowFinancialPlanner] = useState(false);
  const [selectedMajorId, setSelectedMajorId] = useState<string | undefined>(undefined);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Prevent background scrolling when any modal is open
  useEffect(() => {
    if (showWizard || showComparePrograms || showFinancialPlanner) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWizard, showComparePrograms, showFinancialPlanner]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowWizard(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const categories = [
    { name: 'Technology', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100' },
    { name: 'Business', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
    { name: 'Health', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
    { name: 'Arts', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  ];

  const stats = [
    { value: '500K+', label: 'Students Guided', icon: Users },
    { value: '1,200+', label: 'Career Pathways', icon: TrendingUp },
    { value: '98%', label: 'Success Rate', icon: Award },
  ];

  const pathwayCards = [
    {
      icon: Sparkles,
      title: 'Discover Your Path',
      description: 'AI-powered recommendations based on your interests, skills, and career goals',
      stat: '50+ industries',
      gradient: 'from-cyan-500/10 via-teal-500/10 to-transparent',
    },
    {
      icon: TrendingUp,
      title: 'Compare Programs',
      description: 'Side-by-side analysis of degrees, certifications, and career outcomes',
      stat: '1,200+ programs',
      gradient: 'from-teal-500/10 via-emerald-500/10 to-transparent',
    },
    {
      icon: Award,
      title: 'Financial Planning',
      description: 'Calculate costs, explore financial aid, and plan your educational investment',
      stat: '$2.1M avg ROI',
      gradient: 'from-orange-500/10 via-amber-500/10 to-transparent',
    },
  ];

  const journeySteps = [
    {
      degree: 'A.A.',
      title: 'Associate Degree',
      duration: '2 years',
      description: 'Build foundational knowledge and explore career directions',
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      degree: 'B.S.',
      title: 'Bachelor Degree',
      duration: '4 years',
      description: 'Develop specialized expertise and professional competencies',
      color: 'from-teal-400 to-teal-600',
    },
  ];

  return (
    <>
      {showWizard && (
        <CareerWizard 
          initialSearch={searchQuery} 
          onClose={() => {
            setShowWizard(false);
            setSearchQuery('');
          }} 
        />
      )}

      {showComparePrograms && (
        <ComparePrograms 
          onClose={() => {
            setShowComparePrograms(false);
            setSelectedMajorId(undefined);
          }}
          initialMajorId={selectedMajorId}
        />
      )}

      {showFinancialPlanner && (
        <FinancialPlanner 
          onClose={() => setShowFinancialPlanner(false)} 
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/30 to-orange-50/20">
      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.08),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(251,146,60,0.06),transparent_50%)]"></div>
        
        {/* Palm Tree Decorations */}
        <motion.div
          animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[8%] pointer-events-none hidden lg:block"
          style={{ 
            filter: 'drop-shadow(0 10px 30px rgba(6, 182, 212, 0.3))',
            opacity: 0.2
          }}
        >
          <Palmtree className="w-80 h-80 text-teal-500" strokeWidth={1.5} />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, -5, 0], y: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-[5%] pointer-events-none hidden lg:block"
          style={{ 
            filter: 'drop-shadow(0 10px 30px rgba(20, 184, 166, 0.3))',
            opacity: 0.25
          }}
        >
          <Palmtree className="w-96 h-96 text-cyan-500" strokeWidth={1.5} />
        </motion.div>
        {/* Additional smaller palm trees for depth */}
        <motion.div
          animate={{ rotate: [0, 3, 0], y: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-[20%] pointer-events-none hidden xl:block"
          style={{ 
            filter: 'drop-shadow(0 5px 20px rgba(251, 146, 60, 0.2))',
            opacity: 0.15
          }}
        >
          <Palmtree className="w-48 h-48 text-orange-400" strokeWidth={1.5} />
        </motion.div>
        
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-teal-300/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-orange-300/20 to-amber-300/20 rounded-full blur-3xl"
        ></motion.div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-8 shadow-sm">
              <Waves className="w-4 h-4 text-cyan-600" />
              <span className="text-cyan-900">Powered by AI Career Intelligence</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 via-teal-800 to-orange-900"
            style={{ fontSize: '4.5rem', lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }}
          >
            Your Next Wave
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-gray-600 max-w-2xl mx-auto"
            style={{ fontSize: '1.25rem', lineHeight: '1.8' }}
          >
            Navigate the currents of your career journey with AI-powered pathways that chart your course to success
          </motion.p>

          {/* Start Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWizard(true)}
              className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              style={{ fontSize: '1.25rem', fontWeight: '600' }}
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>

          {/* Category Chips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-4"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2.5 rounded-full transition-all duration-200 border ${
                  category.color
                } ${
                  selectedCategory === category.name
                    ? 'shadow-md ring-2 ring-offset-2 ring-cyan-300'
                    : 'shadow-sm hover:shadow-md'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="relative">
                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <Waves className="w-3 h-3 text-cyan-300/40" />
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <stat.icon className="w-6 h-6 text-cyan-600 mb-1" />
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Wave Transition 1 */}
      <WaveDivider className="-mb-1" />

      {/* Pathway Cards Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Your Journey Starts Here
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              Three powerful tools to help you make informed decisions about your educational future
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pathwayCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => {
                  if (index === 0) setShowWizard(true);
                  else if (index === 1) setShowComparePrograms(true);
                  else if (index === 2) setShowFinancialPlanner(true);
                }}
                className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:border-cyan-300/50 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <card.icon className="w-7 h-7 text-cyan-600" />
                  </div>
                  
                  <div className="mb-2 text-sm font-medium text-cyan-600">{card.stat}</div>
                  
                  <h3 className="mb-4 text-gray-900" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-cyan-600 group-hover:gap-4 transition-all duration-300">
                    <span className="font-medium">Explore</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Transition 2 */}
      <WaveDivider flip={true} className="-mb-1" />

      {/* Journey Timeline Section */}
      <section className="py-32 px-4 relative bg-gradient-to-b from-white to-cyan-50/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Your Academic Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              A clear, flexible roadmap from your first degree to advanced studies
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-cyan-200 via-teal-200 to-orange-200 hidden lg:block"></div>
            
            {/* Timeline Steps */}
            <div className="space-y-16">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:gap-12 gap-6`}
                >
                  {/* Content Card */}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-cyan-300/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`inline-block px-4 py-1.5 rounded-full mb-4 text-sm font-medium bg-gradient-to-r ${step.color} text-white`}>
                        {step.duration}
                      </div>
                      <h3 className="mb-3 text-gray-900" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Center Circle */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-xl">
                      {step.degree}
                    </span>
                  </motion.div>

                  {/* Spacer */}
                  <div className="hidden lg:block w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition 3 */}
      <WaveDivider className="-mb-1" />

      {/* Call to Action Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-300/30 to-teal-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-orange-300/30 to-amber-300/30 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-16 border border-gray-200/50 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
            
            <h2 className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Start Your Journey Today
            </h2>
            
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto" style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
              Join hundreds of thousands of students who've found their path with our AI-powered career planning tools
            </p>
            
            <div className="flex justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWizard(true)}
                className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-lg font-medium"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
            
            <p className="mt-8 text-sm text-gray-500">No credit card required • Get started in 2 minutes</p>
          </div>
        </motion.div>
      </section>

      {/* Wave Transition 4 */}
      <WaveDivider flip={true} className="-mb-1" />

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Waves className="w-5 h-5 text-cyan-600" />
            <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
              Next Wave
            </span>
            <Waves className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-gray-600 mb-2">Design your future with confidence</p>
          <p className="text-sm text-gray-500">&copy; 2025 Next Wave. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
