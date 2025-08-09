"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Flame, Trophy, Star, Diamond, Crown } from "lucide-react";

const milestoneConfig = {
  7: {
    icon: Flame,
    color: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/50",
    message: "🔥 Week Warrior! 7 days strong!",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    textColor: "text-orange-800 dark:text-orange-200"
  },
  14: {
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    glow: "shadow-yellow-500/50",
    message: "🏆 Two Week Champion! Incredible consistency!",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-800 dark:text-yellow-200"
  },
  30: {
    icon: Star,
    color: "from-purple-500 to-pink-500",
    glow: "shadow-purple-500/50",
    message: "⭐ Monthly Master! 30 days of dedication!",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    textColor: "text-purple-800 dark:text-purple-200"
  },
  60: {
    icon: Diamond,
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/50",
    message: "💎 Diamond Dedication! 60 days unstoppable!",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
    textColor: "text-cyan-800 dark:text-cyan-200"
  },
  100: {
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    glow: "shadow-yellow-400/50",
    message: "👑 Century Sovereign! 100 days of pure excellence!",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-800 dark:text-yellow-200"
  }
};

export default function MilestoneToast({ show, milestone, onClose }) {
  const config = milestoneConfig[milestone];

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 right-4 z-[9999] max-w-sm"
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.5 
          }}
        >
          <div className={`${config.bgColor} rounded-xl p-4 shadow-xl border border-white/20 backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
              {/* Animated Icon */}
              <motion.div
                className={`p-2 rounded-full bg-gradient-to-br ${config.color} ${config.glow} shadow-lg`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className={`font-bold text-sm ${config.textColor} mb-1`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {milestone} Day Streak!
                </motion.div>
                <motion.p
                  className={`text-xs ${config.textColor} opacity-90`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {config.message}
                </motion.p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className={`${config.textColor} opacity-50 hover:opacity-100 transition-opacity`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${config.color}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
