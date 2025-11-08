import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, GraduationCap, TrendingUp, Clock, DollarSign, Users, CheckCircle2, Sparkles, Zap, Plus, BookOpen } from 'lucide-react';
import { MAJORS, type Program, type Major } from '../data/majors';

interface CompareProgramsProps {
  onClose: () => void;
  initialMajorId?: string;
}

export function ComparePrograms({ onClose, initialMajorId = 'computer-science' }: CompareProgramsProps) {
  const [selectedMajor, setSelectedMajor] = useState<Major>(
    MAJORS.find(m => m.id === initialMajorId) || MAJORS[0]
  );
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [step, setStep] = useState<'major' | 'select' | 'compare'>('major');

  const toggleProgram = (program: Program) => {
    if (selectedPrograms.find(p => p.id === program.id)) {
      setSelectedPrograms(selectedPrograms.filter(p => p.id !== program.id));
    } else if (selectedPrograms.length < 3) {
      setSelectedPrograms([...selectedPrograms, program]);
    }
  };

  const handleMajorSelect = (major: Major) => {
    setSelectedMajor(major);
    setSelectedPrograms([]);
    setStep('select');
  };

  const handleCompare = () => {
    if (selectedPrograms.length >= 2) {
      setStep('compare');
    }
  };

  const handleBack = () => {
    if (step === 'compare') {
      setStep('select');
    } else if (step === 'select') {
      setStep('major');
      setSelectedPrograms([]);
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative h-full overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {step === 'compare' ? 'Back' : step === 'select' ? 'Change Major' : 'Close'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
                <span className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                  {step === 'major' ? 'Select Your Major' : `${selectedMajor.name} Programs`}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-6">
            <AnimatePresence mode="wait">
              {step === 'major' ? (
                <motion.div
                  key="major"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="pb-8"
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-6 shadow-sm"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm sm:text-base text-cyan-900">Choose Your Field of Study</span>
                    </motion.div>
                    
                    <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900">
                      What Would You Like to Study?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
                      Select a major to compare degree programs and see how professional certifications can boost your career potential.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {MAJORS.map((major, index) => (
                      <motion.button
                        key={major.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleMajorSelect(major)}
                        className="group text-left p-4 sm:p-6 rounded-2xl border-2 border-gray-200 hover:border-cyan-300 bg-white hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">
                          {major.icon}
                        </div>
                        <h3 className="mb-2 text-gray-900 text-base sm:text-lg">{major.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {major.description}
                        </p>
                        {major.certificationProvider && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-cyan-600">
                            <Plus className="w-3 h-3" />
                            <span>{major.certificationProvider} Certifications Available</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : step === 'select' ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="pb-24"
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-6 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm sm:text-base text-cyan-900">
                        {selectedMajor.icon} {selectedMajor.name}
                      </span>
                    </motion.div>
                    
                    <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900">
                      Select Programs to Compare
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
                      Choose 2-3 programs to see a detailed side-by-side comparison. 
                      {selectedMajor.certificationProvider && ` See the impact of adding ${selectedMajor.certificationProvider} certifications to your degree.`}
                    </p>
                    
                    {selectedPrograms.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex items-center justify-center gap-2 flex-wrap px-4"
                      >
                        <span className="text-sm text-gray-600">Selected:</span>
                        {selectedPrograms.map(p => (
                          <span
                            key={p.id}
                            className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-xs sm:text-sm font-medium"
                          >
                            {p.baseType === 'associate' ? "Associate's" : "Bachelor's"}
                            {p.hasCertification && <span className="ml-1">+ Cert</span>}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {selectedMajor.programs.map((program, index) => {
                      const isSelected = selectedPrograms.find(p => p.id === program.id);
                      const isDisabled = selectedPrograms.length >= 3 && !isSelected;
                      
                      return (
                        <motion.button
                          key={program.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => !isDisabled && toggleProgram(program)}
                          disabled={isDisabled}
                          className={`text-left p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-50/50 shadow-lg'
                              : isDisabled
                              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-cyan-300 bg-white hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${program.color} bg-opacity-10`}>
                              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="p-1 bg-cyan-600 rounded-full"
                              >
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </div>
                          
                          <h3 className="mb-2 text-gray-900 text-sm sm:text-base">{program.name}</h3>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${program.color} text-white`}>
                              {program.baseType === 'associate' ? "Associate's" : "Bachelor's"}
                            </span>
                            {program.hasCertification && (
                              <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-orange-500 text-white">
                                <Plus className="w-3 h-3" />
                                {selectedMajor.certificationProvider || 'Cert'}
                              </span>
                            )}
                            <span className="text-xs sm:text-sm text-gray-600">{program.duration}</span>
                          </div>
                          
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                              <span>{program.cost}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                              <span>{program.avgSalary}</span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Sticky Button */}
                  <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCompare}
                        disabled={selectedPrograms.length < 2}
                        className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                      >
                        Compare Selected Programs
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="pb-8"
                >
                  <div className="text-center mb-4 sm:mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-6 shadow-sm"
                    >
                      <Zap className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm sm:text-base text-cyan-900">Side-by-Side Comparison</span>
                    </motion.div>
                    
                    <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900">
                      {selectedMajor.name} Program Comparison
                    </h2>
                  </div>

                  <div className={`grid ${selectedPrograms.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3 sm:gap-4`}>
                    {selectedPrograms.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
                      >
                        <div className={`p-3 sm:p-4 bg-gradient-to-br ${program.color} text-white`}>
                          <div className="mb-2">
                            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <h3 className="text-white mb-2 text-sm sm:text-base">{program.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm">
                              {program.baseType === 'associate' ? "Associate's" : "Bachelor's"}
                            </span>
                            {program.hasCertification && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm">
                                <Plus className="w-3 h-3" />
                                {program.certificationName}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 space-y-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                              <Clock className="w-3 h-3" />
                              <span>Duration</span>
                            </div>
                            <p className="font-medium text-gray-900 text-xs sm:text-sm">{program.duration}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                              <DollarSign className="w-3 h-3" />
                              <span>Total Cost</span>
                            </div>
                            <p className="font-medium text-gray-900 text-xs sm:text-sm">{program.cost}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                              <TrendingUp className="w-3 h-3" />
                              <span>Avg Salary</span>
                            </div>
                            <p className="font-medium text-gray-900 text-xs sm:text-sm">{program.avgSalary}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                              <Users className="w-3 h-3" />
                              <span>Job Growth</span>
                            </div>
                            <p className="font-medium text-emerald-600 text-xs sm:text-sm">{program.jobGrowth}</p>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Difficulty</div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              program.difficulty === 'Entry Level' ? 'bg-green-100 text-green-700' :
                              program.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                              program.difficulty === 'Challenging' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {program.difficulty}
                            </span>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Top Skills</div>
                            <div className="flex flex-wrap gap-1">
                              {program.topSkills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                              {program.topSkills.length > 3 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{program.topSkills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Career Paths</div>
                            <div className="space-y-0.5">
                              {program.careerPaths.slice(0, 2).map((path, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                                  <div className="w-1 h-1 rounded-full bg-cyan-500"></div>
                                  {path}
                                </div>
                              ))}
                              {program.careerPaths.length > 2 && (
                                <div className="text-xs text-gray-500 pl-2.5">
                                  +{program.careerPaths.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Coming Soon: AI-Powered Recommendations</h4>
                        <p className="text-gray-700 text-xs leading-relaxed">
                          Gemini AI will analyze your background, goals, and preferences to provide personalized recommendations on which program is the best fit for your unique situation.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
