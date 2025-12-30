"use client";

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';

// --- Types ---
interface BannerItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  headerColor: 'black' | 'white'; // Поле для управления цветом хедера
}

// --- Data ---
const banners: BannerItem[] = [
  {
    id: 1,
    image: '/images/banners/denkirsbanners.png', // СВЕТЛЫЙ ФОН
    title: 'Классика света',
    subtitle: 'Добро пожаловать в вамлюстра',
    description: '',
    buttonText: '/catalog/denkirs/lights/track-lights',
    headerColor: 'black', // Хедер должен быть ЧЕРНЫМ
  },
  {
    id: 2,
    image: '/images/banners/Dion Интерьерное изображение для серии продуктов.jpeg.jpg', // ТЕМНЫЙ ФОН
    title: 'Современный стиль',
    subtitle: 'Новые коллекции',
    description: '',
    buttonText: '/catalog/maytoni/outdoor-lights/landscape-lights',
    headerColor: 'white', // Хедер должен быть БЕЛЫМ
  },
];

const MainPage = () => {
  // State
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs
  const bannerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const TRANSITION_DURATION = 600; 
  const AUTOPLAY_DELAY = 6000; 

  // --- Logic: Dispatch Header Color Change ---
  // Отправляем событие при смене слайда, чтобы Header знал, какой цвет использовать
  useEffect(() => {
    const color = banners[currentBannerIndex].headerColor;
    const event = new CustomEvent('headerColorChange', { detail: { color } });
    window.dispatchEvent(event);
  }, [currentBannerIndex]);

  // --- Banner Autoplay ---
  const nextBanner = useCallback(() => {
    if (isTransitioning || banners.length <= 1) return;
    setIsTransitioning(true);
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, [isTransitioning, banners.length]);

  useEffect(() => {
    bannerIntervalRef.current = setInterval(nextBanner, AUTOPLAY_DELAY);
    return () => {
      if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
    };
  }, [nextBanner]);

  return (
    <div className="w-full">
      
      {/* --- 1. HERO SLIDER SECTION --- */}
      <div className="relative h-[60vh] sm:h-[500px] lg:h-[120vh] w-full overflow-hidden bg-black">
        {banners.map((banner, index) => {
          // Определяем стили текста внутри самого баннера (не хедера)
          // Если фон светлый (headerColor='black'), то текст баннера темный, и наоборот.
          const bannerTextColor = banner.headerColor === 'black' ? 'text-black' : 'text-white';
          const bannerSubTextColor = banner.headerColor === 'black' ? 'text-neutral-800' : 'text-white/80';
          const buttonClass = banner.headerColor === 'black' 
            ? 'bg-black text-white hover:bg-neutral-800' 
            : 'bg-white text-black hover:bg-neutral-200';

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                quality={90}
              />
              
              {/* Градиент (чуть заметный) для читаемости, если нужно */}
              <div className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r transition-colors duration-700 ${
                 banner.headerColor === 'black' 
                 ? 'from-white/40 via-transparent to-transparent' // Светлый градиент для светлых баннеров
                 : 'from-black/80 via-black/20 to-transparent' // Темный градиент для темных баннеров
              }`} />
              
              <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-44">
                <div 
                  className={`max-w-xl space-y-6 transition-all duration-700 ${
                    index === currentBannerIndex 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="space-y-2">
                    <h2 className={`text-4xl sm:text-5xl lg:text-8xl font-light tracking-tight leading-[1.1] ${bannerTextColor}`}>
                      {banner.title}
                    </h2>
                    <p className={`text-lg sm:text-2xl font-light ${bannerSubTextColor}`}>
                      {banner.subtitle}
                    </p>
                  </div>
                  
                  {banner.description && (
                    <p className={`text-sm sm:text-base max-w-md leading-relaxed ${bannerSubTextColor}`}>
                      {banner.description}
                    </p>
                  )}

                  <div className="flex gap-4 pt-4">
                    {banner.buttonText && (
                      <a 
                        href={banner.buttonText} 
                        className={`px-8 py-4 text-sm font-medium transition-all duration-300 hover:scale-105 ${buttonClass}`}
                      >
                        {banner.buttonText.startsWith('/') ? 'Подробнее' : banner.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Белый градиент-переход снизу в следующую секцию */}
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-40 bg-gradient-to-t from-white via-white/60 to-transparent z-20 pointer-events-none" />
      
      </div>

      {/* --- 2. ЭСТЕТИКА В ДЕТАЛЯХ --- */}
      <div className="w-full bg-white text-black py-20 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Левая колонка: Текст */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                Эстетика <br />
                <span className="text-neutral-400">в деталях.</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-xl mt-4 text-neutral-800 leading-relaxed">
                Мы не просто продаем свет и электротовары. Мы помогаем создавать атмосферу, 
                где передовые технологии встречаются с безупречным дизайном.
              </p>
            </div>

            {/* Правая колонка: Фото */}
            <div className="order-1 lg:order-2 relative w-full h-[50vh] lg:h-[80vh] bg-neutral-100 overflow-hidden rounded-sm">
              <Image 
                src="/images/banners/odeonlightbanners.jpeg" 
                alt="Минималистичный интерьер"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainPage;