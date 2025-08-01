import React from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'slide-up' | 'slide-down';
  delay?: number;
  stagger?: boolean;
  duration?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  stagger = false,
  duration = 'duration-700'
}) => {
  const { elementRef, isVisible } = stagger 
    ? useStaggeredAnimation(delay)
    : useScrollAnimation();

  const getAnimationClasses = () => {
    const baseClasses = `transition-all ${duration} ease-out`;
    
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return `${baseClasses} opacity-0 translate-y-8`;
        case 'fade-down':
          return `${baseClasses} opacity-0 -translate-y-8`;
        case 'fade-left':
          return `${baseClasses} opacity-0 translate-x-8`;
        case 'fade-right':
          return `${baseClasses} opacity-0 -translate-x-8`;
        case 'scale':
          return `${baseClasses} opacity-0 scale-95`;
        case 'slide-up':
          return `${baseClasses} translate-y-12`;
        case 'slide-down':
          return `${baseClasses} -translate-y-12`;
        default:
          return `${baseClasses} opacity-0 translate-y-8`;
      }
    }
    
    return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
};

// Specialized components for common use cases
export const FadeUpSection: React.FC<Omit<AnimatedSectionProps, 'animation'>> = (props) => (
  <AnimatedSection {...props} animation="fade-up" />
);

export const ScaleSection: React.FC<Omit<AnimatedSectionProps, 'animation'>> = (props) => (
  <AnimatedSection {...props} animation="scale" />
);

export const StaggeredSection: React.FC<Omit<AnimatedSectionProps, 'stagger'>> = (props) => (
  <AnimatedSection {...props} stagger={true} />
);
