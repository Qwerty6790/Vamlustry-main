
"use client";

import React from 'react';

type LoadingSpinnerProps = {
  isLoading: boolean;
  heading?: string;
  message?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading, heading, message }) => {
  if (!isLoading) return null;

  const brandName = "ВАМЛЮСТРА";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white/95 backdrop-blur-sm transition-all duration-500">
      
      {/* Анимация логотипа */}
      <div className="flex items-center justify-center">
        {brandName.split('').map((char, index) => (
          <span
            key={index}
            className="text-2xl sm:text-3xl font-light text-black animate-pulse"
            style={{
              animationDuration: '1.5s',
              animationDelay: `${index * 150}ms`, // Задержка для каждой буквы создает эффект волны
              letterSpacing: '0.2em' // Широкий трекинг для премиального вида
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Тонкая декоративная линия (прогресс-бар) */}
      <div className="w-24 h-[1px] bg-gray-100 mt-4 overflow-hidden rounded-full">
        <div className="h-full bg-black/80 w-1/2 animate-[shimmer_1.5s_infinite_linear] transform -translate-x-full"></div>
      </div>

      {/* Текст (если передан) */}
      <div className="text-center mt-6 space-y-2">
        {heading && (
          <p className="text-gray-900 font-medium tracking-wide text-sm uppercase">
            {heading}
          </p>
        )}
        {message && (
          <p className="text-gray-400 text-xs tracking-wider">
            {message}
          </p>
        )}
      </div>

      {/* Добавляем кастомную анимацию для линии в стили */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
