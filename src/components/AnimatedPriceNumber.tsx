import React, { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'motion/react';

interface AnimatedPriceNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  formatFn?: (val: number) => string;
}

export const AnimatedPriceNumber: React.FC<AnimatedPriceNumberProps> = ({
  value,
  prefix = '$',
  suffix = '',
  className = '',
  duration = 0.75,
  formatFn,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    prevValueRef.current = value;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    const controls = animate(startVal, endVal, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Custom smooth ease-out curve
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  const formatted = formatFn ? formatFn(displayValue) : displayValue.toLocaleString();

  return (
    <motion.span
      key={`animated-num-${value}`}
      initial={{ opacity: 0.85, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`inline-block tabular-nums ${className}`}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
};
