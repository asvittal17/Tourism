import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useScrollAnimation(options = {}) {
  const { threshold = 0.1, triggerOnce = true, delay = 0 } = options;
  
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin: '-50px',
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  return { ref, isVisible, inView };
}

export default useScrollAnimation;

