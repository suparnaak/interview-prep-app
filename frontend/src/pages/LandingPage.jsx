import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/70 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600">
          AI Interview Prep
        </h1>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-1 px-10 md:px-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-center md:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Ace Your Next Interview with{" "}
            <span className="text-indigo-600">AI-Powered</span> Prep
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Upload your <span className="font-semibold">Resume</span> and{" "}
            <span className="font-semibold">Job Description (JD)</span>, then
            chat with an intelligent interviewer that asks real-time,
            job-specific questions and gives you feedback.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-10 md:mt-0"
        ></motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-gray-500 text-sm bg-white/50">
        © {new Date().getFullYear()} AI Interview Prep. Built to help you shine.
      </footer>
    </div>
  );
}
