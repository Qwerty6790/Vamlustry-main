
'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import { YMaps, Map as YMap, Placemark, ZoomControl, FullscreenControl } from '@pbe/react-yandex-maps';
import { FaSearch } from 'react-icons/fa';

// --- ТИПИЗАЦИЯ ---
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none'; 
}

interface Store {
  id: number;
  title: string;
  address: string;
  phones: string[];
  hours: string;
  coords: number[];
}

interface MapState {
  center: number[];
  zoom: number;
  controls?: string[];
}

// --- ДАННЫЕ МАГАЗИНОВ ---
const STORES: Store[] = [
  {
    id: 1,
    title: "ТЦ Шоколад",
    address: "Реутов, МКАД, 2-й километр, ТЦ Шоколад, 3 этаж",
    phones: ["+7 (966) 033-31-11", "+7 (999) 111-11-11"], 
    hours: "с 10:00 до 21:00",
    coords: [55.764483, 37.844517], 
  },
  {
    id: 2,
    title: "ТК Конструктор",
    address: "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.42., 2.19. Линия В, пав. 1.11 Главный магазин",
    phones: ["+7 (966) 022-21-11", "+7 (980) 999-33-66"], 
    hours: "с 10:00 до 21:00",
    coords: [55.583222, 37.710800], 
  }
];

// --- КОМПОНЕНТ АНИМАЦИИ (REVEAL) ---
const Reveal = ({ children, delay = 0, className = '', direction = 'up' }: RevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const translateClasses: Record<'up' | 'left' | 'right' | 'none', string> = {
    up: 'translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
    none: 'translate-y-0 scale-95'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] 
        ${isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${translateClasses[direction]}`}
        ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ ---
export default function WhereToBuyPage() {
  const [mapState, setMapState] = useState<MapState>({
    center: [55.67, 37.77], 
    zoom: 10, 
    controls: [] 
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleStoreClick = (coords: number[]) => {
    setMapState({
      ...mapState,
      center: coords,
      zoom: 16, 
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 pt-24 overflow-hidden">
      <section id="where-to-buy" className="px-6 lg:px-16 max-w-[1400px] mx-auto scroll-mt-28">
        
        {/* --- ШАПКА БЛОКА --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-end">
          <div className="lg:col-span-8 flex flex-col">
            <Reveal delay={0}>
              <h2 className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-tighter uppercase leading-[1.05] mb-4">
                Где купить <br />
                <span className="text-gray-400">Наши магазины</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-xl text-base md:text-lg font-light text-gray-500">
                Посетите наши шоурумы, чтобы вживую оценить качество материалов, чистоту форм и подобрать идеальное освещение для вашего проекта.
              </p>
            </Reveal>
          </div>
          
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Reveal delay={200} direction="left">
              <a 
                href='https://2gis.ru/reutov/firm/70000001105128612?m=37.84439%2C55.764583%2F16' 
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl font-bold   pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors "
              >
                Мы в 2ГИС 
              </a>
            </Reveal>
          </div>
        </div>
        
        {/* --- ОСНОВНОЙ КОНТЕНТ (СПИСОК + КАРТА) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:h-[750px]">
          
          {/* ЛЕВАЯ КОЛОНКА (Фото + Поиск + Список) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            
            {/* Фотография магазина */}
            <Reveal delay={300} className="w-full mb-8 shrink-0">
              <div className="aspect-[16/9] w-full bg-neutral-100 overflow-hidden relative group">
                <Image 
                  src="/images/banners/maytonibanners4.jpeg" 
                  alt="Интерьер магазина" 
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
              </div>
            </Reveal>

            {/* Блок поиска */}
            <Reveal delay={400} className="w-full mb-6 shrink-0">
              <div className="relative border-b border-gray-200 pb-2 group">
                <input
                  type="text"
                  disabled 
                  placeholder="Поиск магазина..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  title="Поиск заработает при добавлении новых точек"
                  className="w-full bg-transparent text-lg font-light text-black placeholder:text-gray-300 cursor-not-allowed focus:outline-none pr-10"
                />
                <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-gray-400 transition-colors" />
              </div>
            </Reveal>

            {/* Список магазинов */}
            <div className="flex-1 flex flex-col overflow-y-auto pr-2 hide-scrollbar">
              {STORES.map((store, idx) => (
                <Reveal key={store.id} delay={500 + (idx * 150)}>
                  <div 
                    className="group cursor-pointer py-6 border-b border-gray-100 last:border-0  transition-all duration-300"
                    onClick={() => handleStoreClick(store.coords)}
                  >
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-xs font-mono text-gray-300 group-hover:text-black transition-colors">
                        0{idx + 1}
                      </span>
                      <h3 className="text-2xl font-light tracking-tight text-black">
                        {store.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm font-light leading-relaxed text-gray-500 mb-4 pr-4">
                      {store.address}
                    </p>
                    
                    <div className="flex flex-col gap-1 text-sm font-light text-gray-800">
                      {store.phones.map((phone, i) => (
                        <a 
                          key={i}
                          href={`tel:${phone}`} 
                          className="hover:text-gray-400 transition-colors w-fit" 
                          onClick={e => e.stopPropagation()}
                        >
                          {phone}
                        </a>
                      ))}
                      <span className="text-gray-400 mt-2 text-xs uppercase tracking-wider font-medium">
                        {store.hours}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          
          {/* ПРАВАЯ КОЛОНКА (КАРТА) */}
          <div className="lg:col-span-8 w-full h-[500px] lg:h-full relative">
            <Reveal delay={600} direction="none" className="w-full h-full">
              <div id="map-container" className="w-full h-full bg-gray-50 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-[1500ms]">
                <YMaps query={{ lang: 'ru_RU', apikey: '' }}>
                  <YMap 
                    state={mapState}
                    defaultState={{ center: [55.67, 37.77], zoom: 10 }} 
                    width="100%" 
                    height="100%"
                    className="w-full h-full"
                    options={{ suppressMapOpenBlock: true }}
                    modules={["control.ZoomControl", "control.FullscreenControl"]}
                  >
                    <ZoomControl options={{ position: { right: 10, top: 50 } }} />
                    <FullscreenControl />
                    
                    {STORES.map((store) => (
                      <Placemark
                        key={store.id}
                        geometry={store.coords}
                        properties={{ 
                          balloonContentHeader: `<span style="font-family: sans-serif; font-weight: 600; font-size: 16px;">${store.title}</span>`,
                          balloonContentBody: `
                            <div style="font-family: sans-serif; font-size: 13px; line-height: 1.6; color: #444; padding-top: 5px;">
                              <p style="margin-bottom: 8px;">${store.address}</p>
                              <div style="margin-bottom: 4px;"><strong>Время работы:</strong> ${store.hours}</div>
                              <div><strong>Тел:</strong> ${store.phones.join(', ')}</div>
                            </div>
                          `
                        }}
                        modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                        options={{ 
                          iconLayout: 'default#image', 
                          iconImageHref: '/images/banners/markerlogobanners.png', 
                          iconImageSize: [60, 60], 
                          iconImageOffset: [-30, -30],
                          hideIconOnBalloonOpen: false,
                          balloonOffset: [0, -35]
                        }}
                        onClick={() => handleStoreClick(store.coords)}
                      />
                    ))}
                  </YMap>
                </YMaps>
              </div>
            </Reveal>
          </div>

        </div>
      </section>
    </div>
  );
}
