'use client'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function Reveal({ children, delay=0 }:{children: React.ReactNode, delay?: number}){
  const controls = useAnimation()
  const prefersReduced = useReducedMotion()
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  useEffect(()=>{ if(inView) controls.start('visible') }, [inView, controls])
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 },
        visible: prefersReduced
          ? { opacity: 1, transition: { duration: 0.15, delay: 0 } }
          : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut', delay } }
      }}
    >
      {children}
    </motion.div>
  )
}
