'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Backdrop séparé pour éviter le bug iOS backdrop-filter + fixed */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-black/10'
          : 'opacity-0'
      }`} />
      <div className="relative section-container">
        <div className="flex h-18 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="group relative z-50 flex items-center gap-2">
            {/* Logo mark */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/20"
            >
              <span className="text-base font-black gradient-text">T</span>
              <div className="absolute inset-0 rounded-xl bg-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-foreground">
                Tommy <span className="gradient-text">Studio</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-muted">
                Création de sites web
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-lg hover:text-foreground ${
                    isActive ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg bg-surface-elevated border border-border/50"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            <div className="ml-3 h-5 w-px bg-border" />

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/start-project"
                className="ml-3 group relative inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  Démarrer mon site
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-surface/50 backdrop-blur-sm md:hidden"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-[1.5px] w-5 rounded-full bg-foreground"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-[1.5px] w-5 rounded-full bg-foreground"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-[1.5px] w-5 rounded-full bg-foreground"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-background"
          >
            {/* Decorative backdrop */}
            <div className="absolute inset-0 bg-background" />

            {/* Decorative glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />

            <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="w-full max-w-sm"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-6 py-5 text-lg font-semibold transition-all ${
                      pathname === link.href
                        ? 'border-accent/30 bg-accent/5 text-foreground'
                        : 'border-border/50 bg-surface/50 text-muted hover:text-foreground hover:border-border'
                    }`}
                  >
                    {link.label}
                    <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-4 w-full max-w-sm"
              >
                <Link
                  href="/start-project"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-5 text-lg font-semibold text-white transition-all hover:bg-accent-light"
                >
                  Démarrer mon site
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </motion.div>

              {/* Bottom info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-xs text-muted"
              >
                thomas@tommy-studio.pro
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
