
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';

// --- Types ---
interface BannerItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  headerColor: 'black' | 'white';
}

interface CategoryItem {
  id: number;
  title: string;
  image: string;
  link: string;
  className: string;
}

// --- Data: Banners ---
const banners: BannerItem[] = [
  {
    id: 1,
    image: '/images/banners/denkirsbanners.png',
    title: 'Классика света',
    subtitle: 'Добро пожаловать в Вамлюстра',
    description: '',
    buttonText: '/catalog/denkirs/lights/track-lights',
    headerColor: 'black',
  },
];

// --- Data: Categories ---
const categories: CategoryItem[] = [
  {
    id: 1,
    title: 'Люстры',
    image: '/images/categories/lustry.jpg',
    link: '/catalog/chandeliers',
    className: 'md:col-span-1',
  },
  {
    id: 2,
    title: 'Трековые системы освещения',
    image: '/images/categories/trekovysvetilnik.jpg',
    link: '/catalog/track-systems',
    className: 'md:col-span-2',
  },
  {
    id: 3,
    title: 'Встраиваемые серии',
    image: '/images/categories/elektroustanovohnoe.png',
    link: '/catalog/smart-home',
    className: 'md:col-span-1',
  },
  {
    id: 4,
    title: 'Точечные светильники',
    image: '/images/categories/tohehnoesvetilnik.jpeg',
    link: '/catalog/spotlights',
    className: 'md:col-span-1',
  },
  {
    id: 5,
    title: 'Настенные светильники',
    image: '/images/categories/nastenysvetilnik.jpg',
    link: '/catalog/wall-lights',
    className: 'md:col-span-1',
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
  
  // Текст для бегущей строки
  const MARQUEE_TEXT = "ДОБРО ПОЖАЛОВАТЬ  МЫ РАБОТАЕМ КРУГЛОСУТОЧНО С 9 ДО 18  У НАС ЕСТЬ ПОЛНЫЙ АССОРТИМЕНТ ОСВЕЩЕНИЯ ОТ РАЗНЫХ БРЕНДОВ  ";

  // --- Logic ---
  useEffect(() => {
    const color = banners[currentBannerIndex].headerColor;
    const event = new CustomEvent('headerColorChange', { detail: { color } });
    window.dispatchEvent(event);
  }, [currentBannerIndex]);

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
    <div className="w-full bg-white">
      
  

      {/* --- 1. HERO SLIDER SECTION --- */}
      <div className="relative h-[60vh] sm:h-[500px] lg:h-[115vh] w-full overflow-hidden bg-black">
        {banners.map((banner, index) => {
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
              <div className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r transition-colors duration-700 ${
                 banner.headerColor === 'black' 
                 ? 'from-white/40 via-transparent to-transparent' 
                 : 'from-black/80 via-black/20 to-transparent' 
              }`} />
              
              <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-44">
                <div 
                  className={`max-w-xl space-y-6 transition-all duration-700 ${
                    index === currentBannerIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
                      <Link 
                        href={banner.buttonText} 
                        className={`px-8 py-4 text-sm font-medium transition-all duration-300 hover:scale-105 ${buttonClass}`}
                      >
                        {banner.buttonText.startsWith('/') ? 'Подробнее' : banner.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Градиент снизу */}
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
      </div>
    {/* --- 0. MOVING PROMO BANNER (FIXED: NO OVERLAP) --- */}
    <div className="relative w-full bg-neutral-900 text-white overflow-hidden py-3 z-60 border-b border-neutral-800">
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
        
        {/* Flex container с запретом переноса строк */}
        <div className="flex w-full whitespace-nowrap hover:[animation-play-state:paused]">
          
          {/* Блок 1 */}
          <div className="flex items-center flex-shrink-0 min-w-full animate-marquee">
             {[0, 1, 2].map((subItem) => (
                <span key={subItem} className="px-4 text-xs sm:text-sm font-medium tracking-widest uppercase">
                  {MARQUEE_TEXT}
                </span>
             ))}
          </div>

          {/* Блок 2 (Дубликат для плавного цикла) */}
          <div className="flex items-center flex-shrink-0 min-w-full animate-marquee">
             {[0, 1, 2].map((subItem) => (
                <span key={subItem} className="px-4 text-xs sm:text-sm font-medium tracking-widest uppercase">
                  {MARQUEE_TEXT}
                </span>
             ))}
          </div>

        </div>
      </div>
      <div className='flex items-center justify-start px-5 mt-10 md:mt-5'>
        <h2 className='text-black text-3xl md:text-4xl font-light tracking-tight'>ЧАСТЫЕ КАТЕГОРИИ</h2>
      </div>

      {/* --- 2. CATEGORY GRID (BENTO STYLE) --- */}
      <section className="relative z-30 mt-6 px-4 md:px-8 pb-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link 
                href={cat.link} 
                key={cat.id}
                className={`group relative overflow-hidden rounded-[2rem] bg-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-[280px] sm:h-[350px] lg:h-[450px] ${cat.className}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                <div className="absolute inset-0 flex items-end p-6 md:p-8 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                  <h3 className="text-xl text-white md:text-2xl lg:text-3xl font-normal group-hover:text-white/90 transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. ЭСТЕТИКА В ДЕТАЛЯХ --- */}
      <div className="w-full bg-white text-black py-12 lg:py-24 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
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