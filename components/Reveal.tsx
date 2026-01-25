'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { revealTransition, revealVariants } from '@/lib/motion'

export default function Reveal({
  children,
  delay = 0,
  className,
  amount = 0.2,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  amount?: number
}) {
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : revealVariants
  const transition = prefersReduced
    ? { duration: 0.2, ease: 'easeOut', delay: 0 }
    : { ...revealTransition, delay }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
