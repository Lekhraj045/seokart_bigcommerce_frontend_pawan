'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { basePath } from '../../../../next.config.js';

interface ScoreMeterProps {
  score?: number;
  size?: number;
  basePath?: string;
}

const ScoreMeter: React.FC<ScoreMeterProps> = ({ 
  score = 0, 
  size = 200,
  basePath = ''
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counter - synced with arrow
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds - same as arrow transition
    const startValue = animatedScore;
    const endValue = score;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Same easing as arrow (cubic-bezier)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentScore = startValue + (endValue - startValue) * easeOutCubic;
      
      setAnimatedScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // Arrow rotation calculation:
  // Score 0   = -180° (bottom-left)
  // Score 50  = -90°  (left)
  // Score 100 = 0°    (top)
  // 
  // Formula: -180 + (score/100) * 180
  // This gives us a smooth rotation from -180° to 0° (total 180°)
  
  const arrowRotation = -180 + (animatedScore / 100) * 180;

  // Color based on score
  const getColor = (currentScore: number): string => {
    if (currentScore >= 90) return '#22C55E'; // Green
    if (currentScore >= 80) return '#FF862B'; // Orange
    return '#FF5E60'; // Red
  };

  const getColorClass = (currentScore: number) => {
    if (currentScore >= 90) return 'text-[#007A5C]';
    if (currentScore >= 80) return 'text-[#FF862B]';
    return 'text-[#FF5E60]';
  };

  return (
    <div className="relative mx-auto md:mx-0" style={{ width: 220, height: 110 }}>
      {/* Background gauge image */}
      <Image 
        src={`${basePath}/images/seo-meter.svg`}
        alt="Score Meter" 
        width={219}
        height={110}
        className="w-fullblock"
        priority
      />
      
      {/* Score number */}
      <div className='absolute top-[103px] left-1/2 -translate-x-1/2 -translate-y-1/2'>
      
      <div 
        className={`absolute text-[32px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    font-bold transition-colors duration-300 ${getColorClass(animatedScore)}`}
      >
        {Math.round(animatedScore)}%
      </div>

      {/* Triangle Pointer */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          transformOrigin: 'left center',
          transform: `translate(0, -50%) rotate(${arrowRotation}deg)`,
          transition: 'transform 2s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
        }}
      >
        {/* Filled Triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `10px solid ${getColor(animatedScore)}`,
            borderTop: `5.5px solid transparent`,
            borderBottom: `5.5px solid transparent`,
            transition: 'border-color 0.3s ease',
            marginLeft: `50px`
          }}
        />
      </div>

      </div>
    </div>
  );
};

export default ScoreMeter;