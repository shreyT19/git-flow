import { motion, MotionProps } from "motion/react";
import { ComponentProps, forwardRef } from "react";

// Create typed motion components for common HTML elements
export const MotionDiv = motion.div;
export const MotionP = motion.p;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;
export const MotionImg = motion.img;
export const MotionA = motion.a;

// You can also create more specialized components with default animations
type AnimatedElementProps<T extends keyof JSX.IntrinsicElements> =
  ComponentProps<T> &
    MotionProps & {
      delay?: number;
      duration?: number;
    };

export const FadeInDiv = forwardRef<
  HTMLDivElement,
  AnimatedElementProps<"div">
>(({ children, delay = 0, duration = 0.6, ...props }, ref) => (
  <MotionDiv
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      delay,
      duration,
      ease: [0.25, 1.8, 0.5, 1], // Extra bouncy spring curve
      type: "spring",
      stiffness: 80,
      damping: 8,
      mass: 0.6,
    }}
    {...props}
  >
    {children}
  </MotionDiv>
));
FadeInDiv.displayName = "FadeInDiv";

export const SlideUpDiv = forwardRef<
  HTMLDivElement,
  AnimatedElementProps<"div">
>(({ children, delay = 0, duration = 0.8, ...props }, ref) => (
  <MotionDiv
    ref={ref}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay,
      duration,
      ease: [0.15, 2.1, 0.3, 1.1], // Extra lively bouncy spring curve
      type: "spring",
      stiffness: 120,
      damping: 6, // Lower damping for more bounce
      mass: 0.4, // Lighter mass for quicker movement
      restDelta: 0.00005, // More precise animation
      velocity: 1.2, // Initial velocity boost
    }}
    {...props}
  >
    {children}
  </MotionDiv>
));
SlideUpDiv.displayName = "SlideUpDiv";

export const SlideInLeftDiv = forwardRef<
  HTMLDivElement,
  AnimatedElementProps<"div">
>(({ children, delay = 0, duration = 0.7, ...props }, ref) => (
  <MotionDiv
    ref={ref}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      delay,
      duration,
      type: "spring",
      stiffness: 110,
      damping: 9,
      mass: 0.6,
      restDelta: 0.0001,
      bounce: 0.4,
    }}
    {...props}
  >
    {children}
  </MotionDiv>
));
SlideInLeftDiv.displayName = "SlideInLeftDiv";

export const ScaleOnHoverDiv = forwardRef<
  HTMLDivElement,
  ComponentProps<"div"> & MotionProps
>(({ children, ...props }, ref) => (
  <MotionDiv
    ref={ref}
    initial={{ scale: 1 }}
    whileHover={{
      scale: 1.07,
      y: -7,
      transition: {
        duration: 0.25,
        ease: [0.2, 1.8, 0.3, 1], // Ultra bouncy spring curve
        type: "spring",
        stiffness: 350,
        damping: 8,
        mass: 0.5,
      },
    }}
    whileTap={{
      scale: 0.93,
      transition: {
        duration: 0.15,
        type: "spring",
        stiffness: 500,
        damping: 10,
        mass: 0.4,
      },
    }}
    transition={{
      scale: {
        type: "spring",
        damping: 7,
        stiffness: 450,
        restDelta: 0.0001,
        mass: 0.6,
      },
    }}
    {...props}
  >
    {children}
  </MotionDiv>
));
ScaleOnHoverDiv.displayName = "ScaleOnHoverDiv";

export const BreathingDiv = forwardRef<
  HTMLDivElement,
  AnimatedElementProps<"div">
>(({ children, delay = 0, duration = 4, ...props }, ref) => (
  <MotionDiv
    ref={ref}
    animate={{
      scale: [1, 1.04, 1],
      opacity: [0.92, 1, 0.92],
    }}
    transition={{
      repeat: Infinity,
      repeatType: "mirror",
      duration,
      ease: [0.4, 0.0, 0.6, 1], // Smooth breathing curve
      delay,
      type: "spring",
      stiffness: 40,
      damping: 15,
    }}
    {...props}
  >
    {children}
  </MotionDiv>
));
BreathingDiv.displayName = "BreathingDiv";

export const GentleSwayDiv = forwardRef<
  HTMLDivElement,
  AnimatedElementProps<"div">
>(({ children, delay = 0, duration = 6, ...props }, ref) => (
  <MotionDiv
    ref={ref}
    animate={{
      rotate: [0, 2, 0, -2, 0],
      y: [0, -6, 0, 6, 0],
      x: [0, 2, 0, -2, 0],
    }}
    transition={{
      repeat: Infinity,
      duration,
      ease: [0.3, 1.6, 0.5, 1], // Lively spring curve
      type: "spring",
      stiffness: 35,
      damping: 12,
      delay,
    }}
    {...props}
  >
    {children}
  </MotionDiv>
));
GentleSwayDiv.displayName = "GentleSwayDiv";
