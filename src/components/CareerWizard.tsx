import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, GraduationCap, MapPin, CheckCircle2, Waves, Loader2 } from 'lucide-react';

interface CareerWizardProps {
  initialSearch?: string;
  onClose: () => void;
}

interface PathwayData {
  career: string;
  degreeLevel: string;
  associates?: {
    programs: string[];
    duration: string;
    keyCourses: string[];
  };
  bachelors?: {
    universities: string[];
    articulationAgreements: string[];
    duration: string;
    keyCourses: string[];
  };
  masters?: {
    universities: string[];
    duration: string;
    required: boolean;
  };
  certifications?: Array<{ name: string; required: boolean; timing: string }>;
  exams?: Array<{ name: string; required: boolean; timing: string }>;
  internships?: string[];
  alternativePathways?: string[];
}

// API Gateway endpoint - Update this with your actual endpoint
// Set VITE_API_ENDPOINT in .env file or environment variable
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/pathway';

export function CareerWizard({ initialSearch = '', onClose }: CareerWizardProps) {
  const [step, setStep] = useState(1);
  const [career, setCareer] = useState(initialSearch);
  const [degree, setDegree] = useState('');
  const [pathway, setPathway] = useState<PathwayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const degrees = [
    { id: 'associate', name: "Associate's degree", duration: '2 years', color: 'from-cyan-400 to-cyan-600' },
    { id: 'bachelor', name: "Bachelor's degree", duration: '4 years', color: 'from-teal-400 to-teal-600' },
  ];

  const roadmapSteps = [
    {
      year: 'Year 1-2',
      title: 'Foundation Building',
      description: 'Core coursework and fundamental skills',
      courses: ['Introduction to Computer Science', 'Data Structures', 'Web Development Basics'],
    },
    {
      year: 'Year 3-4',
      title: 'Specialization',
      description: 'Advanced topics and practical experience',
      courses: ['Advanced Algorithms', 'Cloud Computing (AWS)', 'Software Engineering'],
    },
    {
      year: 'Post-Graduation',
      title: 'Career Launch',
      description: 'Entry-level positions and growth',
      courses: ['AWS Solutions Architect', 'DevOps Engineer', 'Cloud Consultant'],
    },
  ];

  const fetchPathway = async () => {
    if (!career.trim() || !degree) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          career: career.trim(),
          degreeLevel: degree,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPathway(data.pathway);
      setStep(3);
    } catch (err) {
      console.error('Error fetching pathway:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate pathway. Please try again.');
      // Still show step 3 with fallback data
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 2 && degree) {
      // Fetch pathway when moving from step 2 to step 3
      fetchPathway();
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
      {/* Solid Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-white to-orange-50"></div>
      
      {/* Scrollable Content */}
      <div className="relative h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-600" />
            <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
              Next Wave
            </span>
          </div>

          <div className="w-20"></div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    num <= step ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gray-200'
                  }`}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={step === 1 ? 'text-cyan-600 font-medium' : ''}>Choose Career</span>
            <span className={step === 2 ? 'text-cyan-600 font-medium' : ''}>Select Degree</span>
            <span className={step === 3 ? 'text-cyan-600 font-medium' : ''}>Your Roadmap</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Career */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-8"
              >
                <Sparkles className="w-6 h-6 text-cyan-600" />
                <h2 className="text-gray-700">To start, what do you want to become?</h2>
              </motion.div>

              <motion.input
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                type="text"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                placeholder="e.g., AWS Cloud Engineer, Data Scientist, Web Developer"
                className="w-full text-5xl font-light text-gray-800 bg-transparent border-none outline-none mb-8 placeholder:text-gray-300"
                autoFocus
              />

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={handleNext}
                disabled={!career.trim()}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-sm text-gray-500 flex items-center gap-2"
              >
                <span className="text-gray-400">💡</span>
                Tip: Be as specific as possible for better recommendations
              </motion.p>
            </motion.div>
          )}

          {/* Step 2: Select Degree */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-8"
              >
                <GraduationCap className="w-6 h-6 text-cyan-600" />
                <h2 className="text-gray-700">What degree are you pursuing?</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="text-5xl font-light text-gray-800 mb-4">{career}</div>
                <div className="text-2xl text-gray-400 font-light">Select your degree level</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {degrees.map((deg, index) => (
                  <motion.button
                    key={deg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setDegree(deg.id)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      degree === deg.id
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-lg'
                        : 'border-gray-200 hover:border-cyan-300 bg-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">{deg.name}</div>
                        <div className="text-sm text-gray-500">{deg.duration}</div>
                      </div>
                      {degree === deg.id && (
                        <CheckCircle2 className="w-6 h-6 text-cyan-600" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleNext}
                disabled={!degree || loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    See My Roadmap
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Roadmap */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-6 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span className="text-cyan-900">Your Personalized Roadmap</span>
                </div>
                
                <h1 className="text-5xl font-light text-gray-800 mb-4">{career}</h1>
                <p className="text-xl text-gray-500">
                  {degrees.find((d) => d.id === degree)?.name}
                </p>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                  <p className="text-gray-600">Generating your personalized pathway with AI...</p>
                </div>
              )}

              {/* Roadmap Timeline */}
              {!loading && (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-200 via-teal-200 to-orange-200"></div>

                  {/* Timeline Steps */}
                  <div className="space-y-12">
                    {/* Associate's Degree */}
                    {pathway?.associates && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative pl-20"
                      >
                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">AA</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <div className="text-sm font-medium text-cyan-600 mb-2">{pathway.associates.duration}</div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Associate's Degree</h3>
                          <p className="text-gray-600 mb-4">MDC Programs and Foundation Courses</p>
                          <div className="space-y-2 mb-4">
                            {pathway.associates.programs.map((program, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                {program}
                              </div>
                            ))}
                          </div>
                          {pathway.associates.keyCourses.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-2">Key Courses:</p>
                              <div className="flex flex-wrap gap-2">
                                {pathway.associates.keyCourses.map((course, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs">
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Bachelor's Degree */}
                    {pathway?.bachelors && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative pl-20"
                      >
                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">BS</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <div className="text-sm font-medium text-teal-600 mb-2">{pathway.bachelors.duration}</div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Bachelor's Degree</h3>
                          <p className="text-gray-600 mb-4">Transfer Universities and Programs</p>
                          <div className="space-y-2 mb-4">
                            {pathway.bachelors.universities.map((university, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                {university}
                              </div>
                            ))}
                          </div>
                          {pathway.bachelors.articulationAgreements.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-2">Articulation Agreements:</p>
                              {pathway.bachelors.articulationAgreements.map((agreement, idx) => (
                                <p key={idx} className="text-sm text-gray-600 mb-1">{agreement}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Master's Degree */}
                    {pathway?.masters && pathway.masters.required && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="relative pl-20"
                      >
                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">MS</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <div className="text-sm font-medium text-orange-600 mb-2">{pathway.masters.duration}</div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Master's Degree</h3>
                          <div className="space-y-2">
                            {pathway.masters.universities.map((university, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                {university}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Certifications & Exams */}
                    {(pathway?.certifications && pathway.certifications.length > 0) || 
                     (pathway?.exams && pathway.exams.length > 0) ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="relative pl-20"
                      >
                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Certifications & Exams</h3>
                          {pathway.certifications && pathway.certifications.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                              {pathway.certifications.map((cert, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                  {cert.name} {cert.required && <span className="text-red-600">(Required)</span>} - {cert.timing}
                                </div>
                              ))}
                            </div>
                          )}
                          {pathway.exams && pathway.exams.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Exams:</p>
                              {pathway.exams.map((exam, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                  {exam.name} {exam.required && <span className="text-red-600">(Required)</span>} - {exam.timing}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : null}

                    {/* Internships */}
                    {pathway?.internships && pathway.internships.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="relative pl-20"
                      >
                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Internships & Experience</h3>
                          <div className="space-y-2">
                            {pathway.internships.map((internship, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                {internship}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Fallback to hardcoded steps if no pathway data */}
                    {!pathway && !loading && roadmapSteps.map((roadmapStep, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.2 }}
                        className="relative pl-20"
                      >
                        <div className={`absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br ${
                          index === 0 ? 'from-cyan-400 to-cyan-600' :
                          index === 1 ? 'from-teal-400 to-teal-600' :
                          'from-orange-400 to-orange-600'
                        } shadow-lg flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                          <div className="text-sm font-medium text-cyan-600 mb-2">{roadmapStep.year}</div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{roadmapStep.title}</h3>
                          <p className="text-gray-600 mb-4">{roadmapStep.description}</p>
                          <div className="space-y-2">
                            {roadmapStep.courses.map((course, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                {course}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Save My Roadmap
                </button>
                <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-cyan-300 hover:shadow-lg transition-all duration-300">
                  Explore Programs
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center text-sm text-gray-500"
              >
                This roadmap is personalized based on your goals and current education level
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  );
}
