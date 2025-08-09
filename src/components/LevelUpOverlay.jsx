"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Confetti from "./Confetti";
import Icon from "./Icon";

const motivationalMessages = [
  "🚀 You're on fire! Keep grinding!",
  "💪 Level up! Your dedication is paying off!",
  "⭐ Amazing progress! You're unstoppable!",
  "🎯 New level unlocked! Stay focused!",
  "🔥 Incredible! Your consistency is inspiring!",
  "💎 Level up achieved! You're a champion!",
  "🏆 Outstanding! Keep pushing your limits!",
  "⚡ Power up! Your hard work shows!",
  "🌟 Brilliant! Another milestone conquered!",
  "🎉 Level up! You're crushing your goals!"
];

export default function LevelUpOverlay({ show, level, onClose }) {
  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <Confetti particleCount={60} duration={3.5} />
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-center px-8 py-12 max-w-md mx-4"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.2 
              }}
            >
              {/* Level Badge */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.5 
                }}
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="Award" className="w-8 h-8 text-orange-500 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{level}</div>
                    </div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-30 scale-110" />
              </motion.div>

              {/* Level Up Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  LEVEL UP!
                </h1>
                <p className="text-xl text-white/90 drop-shadow-md">
                  Level {level} Achieved
                </p>
              </motion.div>

              {/* Motivational Message */}
              <motion.p
                className="text-lg text-white/80 mt-6 drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {message}
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
