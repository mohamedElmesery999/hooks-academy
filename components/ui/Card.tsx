import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const Component = hover ? motion.div : 'div'
  const motionProps = hover
    ? {
        whileHover: { y: -4, scale: 1.02 },
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <Component
      className={`rounded-2xl border border-dark-border bg-dark-card p-6 ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
