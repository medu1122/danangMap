'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #00B4D8 50%, #52B788 100%)',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun */}
        <motion.div
          className="absolute top-8 right-8 w-20 h-20 rounded-full bg-yellow-300"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Clouds */}
        <motion.div
          className="absolute top-16 left-[10%]"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud />
        </motion.div>
        <motion.div
          className="absolute top-24 right-[20%]"
          animate={{ x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud scale={0.7} />
        </motion.div>

        {/* Mountains */}
        <svg
          className="absolute bottom-24 left-0 w-full h-40"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 L150,80 L300,120 L450,50 L600,90 L750,40 L900,70 L1050,30 L1200,80 L1200,160 Z"
            fill="#3D9A6E"
            opacity="0.8"
          />
          <path
            d="M0,160 L200,100 L350,130 L500,70 L650,110 L800,60 L950,100 L1100,50 L1200,90 L1200,160 Z"
            fill="#52B788"
            opacity="0.9"
          />
        </svg>

        {/* Beach */}
        <svg
          className="absolute bottom-0 left-0 w-full h-24"
          viewBox="0 0 1200 96"
          preserveAspectRatio="none"
        >
          <path
            d="M0,48 Q300,20 600,48 T1200,48 L1200,96 L0,96 Z"
            fill="#F0E68C"
            opacity="0.6"
          />
          <path
            d="M0,60 Q400,40 800,60 T1200,60 L1200,96 L0,96 Z"
            fill="#F0E68C"
            opacity="0.8"
          />
        </svg>

        {/* Waves */}
        <motion.div
          className="absolute bottom-16 left-0 w-full h-8"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 1200 32" className="w-full h-full">
            <path
              d="M0,16 Q100,0 200,16 T400,16 T600,16 T800,16 T1000,16 T1200,16 L1200,32 L0,32 Z"
              fill="#00B4D8"
              opacity="0.5"
            />
          </svg>
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-0 w-full h-6"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 1200 24" className="w-full h-full">
            <path
              d="M0,12 Q150,4 300,12 T600,12 T900,12 T1200,12 L1200,24 L0,24 Z"
              fill="#0096B4"
              opacity="0.4"
            />
          </svg>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mascot / House icon */}
        <motion.div
          className="mb-8"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative">
            {/* House body */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="drop-shadow-lg"
            >
              {/* Roof */}
              <path
                d="M40 10 L70 35 L10 35 Z"
                fill="#00B4D8"
                stroke="#0096B4"
                strokeWidth="2"
              />
              {/* Roof detail */}
              <path
                d="M40 15 L63 35 L17 35 Z"
                fill="#0096B4"
              />
              {/* Walls */}
              <rect
                x="18"
                y="35"
                width="44"
                height="35"
                fill="#F0F9FF"
                stroke="#00B4D8"
                strokeWidth="2"
                rx="2"
              />
              {/* Door */}
              <rect
                x="33"
                y="50"
                width="14"
                height="20"
                fill="#52B788"
                rx="1"
              />
              {/* Window left */}
              <rect
                x="23"
                y="42"
                width="8"
                height="8"
                fill="#FFB703"
                rx="1"
              />
              {/* Window right */}
              <rect
                x="49"
                y="42"
                width="8"
                height="8"
                fill="#FFB703"
                rx="1"
              />
            </svg>

            {/* Bounce shadow */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full"
              animate={{
                scaleX: [1, 0.7, 1],
                opacity: [0.3, 0.15, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
          style={{ fontFamily: 'Nunito, sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          TroMapDana
        </motion.h1>

        <motion.p
          className="text-white/90 text-sm mb-8 drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Đang tải bản đồ nhà trọ...
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #52B788, #00B4D8, #FFB703)',
              width: `${Math.min(progress, 100)}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Percentage */}
        <motion.p
          className="text-white/90 text-sm mt-3 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(Math.min(progress, 100))}%
        </motion.p>
      </div>

      {/* Floating elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${15 + i * 20}%`,
            top: `${30 + (i % 2) * 10}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        >
          {i === 0 && '🏠'}
          {i === 1 && '🌴'}
          {i === 2 && '🐚'}
          {i === 3 && '🌊'}
          {i === 4 && '☀️'}
        </motion.div>
      ))}
    </motion.div>
  );
}

function Cloud({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width={60 * scale}
      height={40 * scale}
      viewBox="0 0 60 40"
      fill="white"
      opacity="0.8"
    >
      <ellipse cx="20" cy="25" rx="15" ry="12" />
      <ellipse cx="35" cy="20" rx="18" ry="15" />
      <ellipse cx="50" cy="25" rx="12" ry="10" />
      <ellipse cx="30" cy="28" rx="20" ry="10" />
    </svg>
  );
}
