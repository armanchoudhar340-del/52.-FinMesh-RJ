import { motion } from "framer-motion";

export default function AnimatedCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.35 }}
      className={`
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        shadow-lg
        hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]
        hover:border-violet-500/40
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
