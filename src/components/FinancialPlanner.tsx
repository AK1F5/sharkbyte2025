import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  ArrowLeft,
  DollarSign,
  GraduationCap,
  Home,
  Book,
  Car,
  TrendingUp,
  Calculator,
  PiggyBank,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface FinancialPlannerProps {
  onClose: () => void;
}

interface CareerData {
  title: string;
  avgStartingSalary: number;
  avgMidCareerSalary: number;
  yearsToMidCareer: number;
}

const CAREER_OPTIONS: CareerData[] = [
  {
    title: "Software Developer",
    avgStartingSalary: 70000,
    avgMidCareerSalary: 110000,
    yearsToMidCareer: 5,
  },
  {
    title: "Cloud Engineer",
    avgStartingSalary: 75000,
    avgMidCareerSalary: 120000,
    yearsToMidCareer: 4,
  },
  {
    title: "Data Analyst",
    avgStartingSalary: 60000,
    avgMidCareerSalary: 90000,
    yearsToMidCareer: 5,
  },
  {
    title: "IT Support Specialist",
    avgStartingSalary: 45000,
    avgMidCareerSalary: 70000,
    yearsToMidCareer: 6,
  },
  {
    title: "Web Developer",
    avgStartingSalary: 55000,
    avgMidCareerSalary: 85000,
    yearsToMidCareer: 5,
  },
  {
    title: "Database Administrator",
    avgStartingSalary: 65000,
    avgMidCareerSalary: 95000,
    yearsToMidCareer: 5,
  },
  {
    title: "Cybersecurity Analyst",
    avgStartingSalary: 70000,
    avgMidCareerSalary: 115000,
    yearsToMidCareer: 4,
  },
];

export function FinancialPlanner({
  onClose,
}: FinancialPlannerProps) {
  const [step, setStep] = useState<"input" | "results">(
    "input",
  );

  // Education costs
  const [degreeType, setDegreeType] = useState<
    "associate" | "bachelor"
  >("associate");
  const [tuitionPerYear, setTuitionPerYear] = useState(4000);
  const [booksPerYear, setBooksPerYear] = useState(1200);
  const [feesPerYear, setFeesPerYear] = useState(500);

  // Living expenses
  const [housingPerMonth, setHousingPerMonth] = useState(800);
  const [transportationPerMonth, setTransportationPerMonth] =
    useState(200);
  const [foodPerMonth, setFoodPerMonth] = useState(400);
  const [miscPerMonth, setMiscPerMonth] = useState(300);

  // Career
  const [selectedCareer, setSelectedCareer] = useState(
    CAREER_OPTIONS[0].title,
  );

  const years = degreeType === "associate" ? 2 : 4;
  const monthsPerYear = 9; // Academic year

  const totalTuition = tuitionPerYear * years;
  const totalBooks = booksPerYear * years;
  const totalFees = feesPerYear * years;
  const totalEducationCosts =
    totalTuition + totalBooks + totalFees;

  const monthlyLivingCosts =
    housingPerMonth +
    transportationPerMonth +
    foodPerMonth +
    miscPerMonth;
  const totalLivingCosts =
    monthlyLivingCosts * monthsPerYear * years;

  const grandTotal = totalEducationCosts + totalLivingCosts;

  const career =
    CAREER_OPTIONS.find((c) => c.title === selectedCareer) ||
    CAREER_OPTIONS[0];
  const lifetimeEarnings10Years =
    career.avgStartingSalary * 5 +
    career.avgMidCareerSalary * 5;
  const roi = (
    ((lifetimeEarnings10Years - grandTotal) / grandTotal) *
    100
  ).toFixed(1);
  const breakEvenMonths = Math.ceil(
    (grandTotal / career.avgStartingSalary) * 12,
  );

  const handleBack = () => {
    if (step === "results") {
      setStep("input");
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
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative h-full overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {step === "results" ? "Back" : "Close"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-600" />
                <span className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                  Financial Planner
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-8">
            {step === "input" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-4 shadow-sm"
                  >
                    <PiggyBank className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm sm:text-base text-cyan-900">
                      Plan Your Investment
                    </span>
                  </motion.div>

                  <h2 className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900">
                    Calculate Your Education Investment
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
                    Enter your estimated costs to see a complete
                    financial breakdown and ROI analysis for
                    your education journey
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column - Education Costs */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 sm:p-5 rounded-2xl border border-cyan-200">
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                        <h3 className="text-gray-900 text-sm sm:text-base">
                          Education Costs
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Degree Type
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() =>
                                setDegreeType("associate")
                              }
                              className={`p-3 rounded-xl border-2 transition-all ${
                                degreeType === "associate"
                                  ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-cyan-300"
                              }`}
                            >
                              <div className="font-medium text-sm">
                                Associate
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5">
                                2 years
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                setDegreeType("bachelor")
                              }
                              className={`p-3 rounded-xl border-2 transition-all ${
                                degreeType === "bachelor"
                                  ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-cyan-300"
                              }`}
                            >
                              <div className="font-medium text-sm">
                                Bachelor
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5">
                                4 years
                              </div>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Tuition per Year
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={tuitionPerYear}
                              onChange={(e) =>
                                setTuitionPerYear(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Books & Supplies per Year
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={booksPerYear}
                              onChange={(e) =>
                                setBooksPerYear(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Fees per Year
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={feesPerYear}
                              onChange={(e) =>
                                setFeesPerYear(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Living Expenses */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-orange-50 to-coral-50 p-4 sm:p-5 rounded-2xl border border-orange-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                        <h3 className="text-gray-900 text-sm sm:text-base">
                          Living Expenses (Monthly)
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Housing
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={housingPerMonth}
                              onChange={(e) =>
                                setHousingPerMonth(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Transportation
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={transportationPerMonth}
                              onChange={(e) =>
                                setTransportationPerMonth(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Food & Groceries
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={foodPerMonth}
                              onChange={(e) =>
                                setFoodPerMonth(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Miscellaneous
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={miscPerMonth}
                              onChange={(e) =>
                                setMiscPerMonth(
                                  Number(e.target.value),
                                )
                              }
                              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Selection */}
                <div className="mt-4 sm:mt-6 bg-gradient-to-br from-teal-50 to-emerald-50 p-4 sm:p-5 rounded-2xl border border-teal-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    <h3 className="text-gray-900 text-sm sm:text-base">
                      Target Career Path
                    </h3>
                  </div>

                  <select
                    value={selectedCareer}
                    onChange={(e) =>
                      setSelectedCareer(e.target.value)
                    }
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    {CAREER_OPTIONS.map((career) => (
                      <option
                        key={career.title}
                        value={career.title}
                      >
                        {career.title} (Starting: $
                        {career.avgStartingSalary.toLocaleString()}
                        /year)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculate Button */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep("results")}
                    className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                    Calculate My Investment
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-cyan-200/50 rounded-full mb-4 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm sm:text-base text-cyan-900">
                      Your Financial Breakdown
                    </span>
                  </motion.div>

                  <h2 className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-teal-900">
                    Investment Analysis
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
                    Here's a complete breakdown of your
                    education investment and potential return
                  </p>
                </div>

                {/* Cost Summary Cards */}
                <div className="grid md:grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 sm:p-5 rounded-2xl border border-cyan-200"
                  >
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 mb-2" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      Education Costs
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      ${totalEducationCosts.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <div>
                        Tuition: $
                        {totalTuition.toLocaleString()}
                      </div>
                      <div>
                        Books: ${totalBooks.toLocaleString()}
                      </div>
                      <div>
                        Fees: ${totalFees.toLocaleString()}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-5 rounded-2xl border border-orange-200"
                  >
                    <Home className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 mb-2" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      Living Expenses
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      ${totalLivingCosts.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      ${monthlyLivingCosts.toLocaleString()}/mo
                      × {monthsPerYear} × {years} years
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 sm:p-5 rounded-2xl border border-teal-200"
                  >
                    <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 mb-2" />
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      Total Investment
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-teal-900 mb-2">
                      ${grandTotal.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      Over {years} years
                    </div>
                  </motion.div>
                </div>

                {/* ROI Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-2xl border border-emerald-200 mb-4 sm:mb-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    <h3 className="text-gray-900 text-sm sm:text-base">
                      Return on Investment (ROI)
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        Target Career
                      </div>
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        {career.title}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        Starting Salary
                      </div>
                      <div className="text-base sm:text-lg font-semibold text-emerald-600">
                        $
                        {career.avgStartingSalary.toLocaleString()}
                        /year
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        Break-even Time
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {Math.floor(breakEvenMonths / 12)}y{" "}
                        {breakEvenMonths % 12}m
                      </div>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        10-Year Earnings
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        $
                        {lifetimeEarnings10Years.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        ROI Percentage
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-600">
                        {roi}%
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 sm:p-5 bg-blue-50 rounded-2xl border border-blue-200"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        Important Notes
                      </h4>
                      <ul className="text-xs sm:text-sm text-gray-700 space-y-1 leading-relaxed">
                        <li>
                          • These calculations are estimates
                          based on average costs at community
                          colleges
                        </li>
                        <li>
                          • Actual costs may vary by institution
                          and location
                        </li>
                        <li>
                          • Salary figures are national averages
                          and may differ based on location and
                          experience
                        </li>
                        <li>
                          • Consider financial aid,
                          scholarships, and grants to reduce
                          your total investment
                        </li>
                        <li>
                          • Part-time work during school can
                          help offset living expenses
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep("input")}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                  >
                    Adjust Numbers
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5" />
                    Save My Plan
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}