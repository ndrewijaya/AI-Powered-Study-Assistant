import { motion } from "motion/react";
import { BookOpen, GraduationCap, Zap } from "lucide-react";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 py-20 lg:py-32 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-400/20 mb-8">
              Empowering Students Worldwide
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-7xl mb-6"
          >
            Your 24/7 Personal <br />
            <span className="text-indigo-600 dark:text-indigo-400">AI Tutor</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 mb-10"
          >
            Master complex university subjects with a patient, Socratic tutor that adapts to your learning style. Explain, quiz, and summarize with ease.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={onStart}
              className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
            >
              Start Learning Now
            </button>
          </motion.div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              title: "Explain",
              desc: "Deep conceptual breakdowns of any topic.",
              icon: BookOpen,
              color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            },
            {
              title: "Quiz",
              desc: "Test your knowledge with AI-generated questions.",
              icon: Zap,
              color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
            },
            {
              title: "Summarize",
              desc: "Get focused bullet points of long discussions.",
              icon: GraduationCap,
              color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
            },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * idx }}
              className="relative flex flex-col items-center p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-all"
            >
              <div className={`rounded-2xl p-4 ${feature.color} mb-6`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-center text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
