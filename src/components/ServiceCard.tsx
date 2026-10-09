'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  href: string;
  index: number;
  gradient?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  price,
  href,
  index,
  gradient = 'from-accent/10 to-accent/5',
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} className="group block h-full">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="card-shine glow-hover relative h-full overflow-hidden rounded-2xl border border-border/50 bg-surface-light p-8 sm:p-10 transition-all duration-500 hover:border-accent/30"
        >
          {/* Background gradient orb */}
          <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />

          {/* Top line accent */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/8 text-accent ring-1 ring-accent/10 transition-all duration-500 group-hover:bg-accent/15 group-hover:ring-accent/25 group-hover:shadow-lg group-hover:shadow-accent/10">
                {icon}
              </div>
            </div>

            {/* Content */}
            <h3 className="mb-4 text-base font-bold text-foreground tracking-tight transition-colors group-hover:text-accent-light">
              {title}
            </h3>
            <p className="mb-8 text-sm leading-loose text-muted">
              {description}
            </p>

            {/* Price + CTA */}
            <div className="flex items-center justify-between pt-6 border-t border-border/30">
              <span className="text-lg font-black gradient-text">{price}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-muted transition-all duration-300 group-hover:text-accent group-hover:gap-2">
                Découvrir
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
