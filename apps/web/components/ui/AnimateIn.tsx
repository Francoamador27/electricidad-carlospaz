"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "none";
}

export default function AnimateIn({
  children,
  delay = 0,
  className,
  direction = "up",
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === "up" ? 28 : 0,
        x: direction === "left" ? -20 : 0,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, margin: "-72px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
