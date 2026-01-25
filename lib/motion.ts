import type { Transition, Variants } from 'framer-motion'

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const pageTransition: Transition = {
  duration: 0.25,
  ease: 'easeOut',
}

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export const revealTransition: Transition = {
  duration: 0.6,
  ease: 'easeOut',
}
