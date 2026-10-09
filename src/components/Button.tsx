'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: boolean;
}

export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon = true,
}: ButtonProps) {
  const sizes = {
    sm: 'px-6 py-2.5 text-xs',
    md: 'px-8 py-3.5 text-sm',
    lg: 'px-10 py-5 text-base',
  };

  const variants = {
    primary:
      'relative bg-accent text-white font-bold overflow-hidden group shadow-lg shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40',
    secondary:
      'border border-border/70 text-foreground font-medium group hover:border-accent/50 hover:bg-accent/8 hover:text-foreground',
    ghost:
      'text-muted font-medium group hover:text-foreground',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 ${sizes[size]} ${variants[variant]} ${className}`}
      >
        {variant === 'primary' && (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-accent-light via-accent to-accent-dark opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute -inset-px rounded-full bg-gradient-to-r from-accent-light to-accent-dark opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-50" />
          </>
        )}
        <span className="relative flex items-center gap-2">
          {children}
          {icon && (
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          )}
        </span>
      </Link>
    </motion.div>
  );
}
