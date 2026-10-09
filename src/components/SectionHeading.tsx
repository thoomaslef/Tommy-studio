'use client';

import AnimatedSection from './AnimatedSection';

interface SectionHeadingProps {
  label?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  align?: 'center' | 'left';
}

export default function SectionHeading({
  label,
  title,
  titleAccent,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <AnimatedSection
      className={`w-full max-w-3xl ${align === 'center' ? 'mx-auto text-center flex flex-col items-center' : ''}`}
    >
      {label && (
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent badge-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {label}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="gradient-text">{titleAccent}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-loose text-muted sm:text-lg max-w-2xl">
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}
