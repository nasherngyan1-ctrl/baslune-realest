import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

export interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isRtl?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  isRtl = false,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const triggerRipple = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== id));
    }, 650);

    onClick?.(e);
  };

  const variantClasses: Record<NonNullable<LuxuryButtonProps['variant']>, string> = {
    primary:
      'bg-[#D4AF37] text-[#0B0D11] font-semibold border border-[#E5C97B]/60 shadow-[0_6px_24px_rgba(212,175,55,0.22)] hover:bg-[#E5C97B]',
    secondary:
      'bg-[#14171F]/95 text-[#F5F3EE] font-medium border border-[#E5C97B]/35 hover:border-[#D4AF37]',
    outline:
      'bg-[#0B0D11] text-[#E5C97B] font-medium border border-[#D4AF37]/45 hover:border-[#D4AF37] hover:bg-[#D4AF37]/12',
    subtle:
      'bg-[#D4AF37]/12 text-[#E5C97B] font-semibold border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0B0D11]',
  };

  const sizeClasses: Record<NonNullable<LuxuryButtonProps['size']>, string> = {
    sm: 'px-3.5 py-2 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-sm rounded-xl gap-2.5',
  };

  const nudgeX = prefersReducedMotion ? 0 : isHovered ? (isRtl ? -4 : 4) : 0;

  const innerContent = (
    <>
      {/* Liquid Gold Sheen Sweep */}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-140%' }}
          animate={{ x: isHovered ? '220%' : '-140%' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 ${
            variant === 'primary'
              ? 'bg-gradient-to-r from-transparent via-white/40 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent'
          }`}
        />
      )}

      {/* Radial Click Ripple Waves */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 3.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: r.x,
              top: r.y,
            }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full ${
              variant === 'primary' ? 'bg-[#0B0D11]/25' : 'bg-[#D4AF37]/35'
            }`}
          />
        ))}
      </AnimatePresence>

      {icon && iconPosition === 'start' && (
        <motion.span
          animate={{ x: nudgeX }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          className="relative z-10 inline-flex items-center shrink-0"
        >
          {icon}
        </motion.span>
      )}

      <span className="relative z-10 inline-flex items-center">{children}</span>

      {icon && iconPosition === 'end' && (
        <motion.span
          animate={{ x: nudgeX }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          className="relative z-10 inline-flex items-center shrink-0"
        >
          {icon}
        </motion.span>
      )}
    </>
  );

  const sharedMotionProps = {
    whileHover: prefersReducedMotion || disabled ? undefined : { y: -2, scale: 1.02 },
    whileTap: prefersReducedMotion || disabled ? undefined : { scale: 0.94 },
    transition: { type: 'spring' as const, stiffness: 420, damping: 25 },
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    onClick: triggerRipple,
    'aria-label': ariaLabel,
    className: `relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] disabled:opacity-45 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} {...sharedMotionProps}>
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} disabled={disabled} {...sharedMotionProps}>
      {innerContent}
    </motion.button>
  );
};
