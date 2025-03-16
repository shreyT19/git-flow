"use client";
import { motion, AnimatePresence } from "motion/react";

// Define the Transition component with proper type annotations
const Transition = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 1,
          duration: 0.6,
          delay: 0.05,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Transition;
