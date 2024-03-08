import { useEffect, useRef, useState } from 'react';

type Return = {
  containerRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
  isIntersecting: boolean;
};

export const useIntersectionObserver = (): Return => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const observer = new IntersectionObserver(
    ([notificationCenter]) => {
      setIsIntersecting(notificationCenter.isIntersecting);
    },
    {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 1,
    },
  );

  useEffect(() => {
    observer.observe(targetRef.current as Element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { containerRef, targetRef, isIntersecting };
};
