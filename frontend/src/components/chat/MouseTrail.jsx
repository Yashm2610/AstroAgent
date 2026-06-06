import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MouseTrail() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      // Throttling: only add a star every 40ms to avoid overwhelming performance
      setStars((prev) => {
        if (prev.length > 0 && now - prev[prev.length - 1].timestamp < 40) {
          return prev;
        }
        const newStar = {
          id: now + Math.random(),
          timestamp: now,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 6 + 4,
          rotation: Math.random() * 360,
          color: Math.random() > 0.5 ? '#dfb73c' : '#7d52ff',
        };
        return [...prev.slice(-15), newStar];
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter out expired stars
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setStars((prev) => prev.filter((star) => now - star.timestamp < 600));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0.1, 
              x: star.x - star.size / 2, 
              y: star.y - star.size / 2, 
              rotate: star.rotation 
            }}
            animate={{ 
              opacity: [0.8, 1, 0], 
              scale: [0.1, 1.2, 0.1], 
              y: star.y - star.size / 2 + 10,
              x: star.x - star.size / 2 + (Math.random() * 10 - 5)
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
