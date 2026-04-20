
'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { YMaps, Map as YMap, Placemark, ZoomControl } from '@pbe/react-yandex-maps';

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
  images: string[];
}

interface MapState {
  center: number[];
  zoom: number;
}

// --- ДАННЫЕ МАГАЗИНОВ ---
const STORES: Store[] = [
  {
    id: 1,
    title: "ТК Конструктор",
    address: "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.42., 2.19. Линия В, пав. 1.11",
    phones: ["+7 (966) 022-21-11", "+7 (980) 999-33-66"], 
    hours: "10:00 — 21:00",
    coords: [55.583222, 37.710800], 
    images: [
      "/images/banners/magzine.webp", 
      "/images/banners/magzine2.webp", 
      "/images/banners/magzine3.webp",
    ]
  }
];

// --- КОМПОНЕНТ АНИМАЦИИ ---
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
    up: 'translate-y-6',
    left: 'translate-x-6',
    right: '-translate-x-6',
    none: 'translate-y-0'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${translateClasses[direction]}`}
        ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- ГЕНЕРАТОР HTML ДЛЯ БАЛУНА КАРТЫ ---
const getBalloonHTML = (store: Store) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 280px; color: #171717; padding: 4px;">
    
    <div style="
      display: flex; 
      overflow-x: auto; 
      scroll-snap-type: x mandatory; 
      gap: 6px; 
      padding-bottom: 8px; 
      margin-bottom: 12px;
      scrollbar-width: thin; 
      scrollbar-color: #d4d4d4 transparent;
    ">
      ${store.images.map(img => `
        <img src="${img}" alt="${store.title}" style="
          height: 160px; 
          width: 240px; 
          object-fit: cover; 
          border-radius: 8px; 
          scroll-snap-align: center; 
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        "/>
      `).join('')}
    </div>

    <div style="padding: 0 4px;">
      <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500; letter-spacing: -0.01em;">${store.title}</h4>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #737373; line-height: 1.5;">${store.address}</p>
      
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 13px; color: #404040;">
        <span style="opacity: 0.5;"></span> ${store.hours}
      </div>
      <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #404040;">
        <span style="opacity: 0.5;"></span> ${store.phones[0]}
      </div>
    </div>
  </div>
`;

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function WhereToBuyPage() {
  const [mapState, setMapState] = useState<MapState>({
    center: STORES[0].coords, 
    zoom: 15, 
  });

  const [activeStoreId, setActiveStoreId] = useState<number>(STORES[0].id);
  const placemarksRef = useRef<Record<number, any>>({});

  // Клик по списку или по самому маркеру для синхронизации
  const handleStoreListClick = (store: Store) => {
    setMapState({ center: store.coords, zoom: 16 });
    setActiveStoreId(store.id);

    const placemark = placemarksRef.current[store.id];
    if (placemark && placemark.balloon && typeof placemark.balloon.isOpen === 'function') {
      if (!placemark.balloon.isOpen()) {
        placemark.balloon.open();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pb-24 pt-32 overflow-hidden selection:bg-neutral-900 selection:text-white">
      <section id="where-to-buy" className="px-6 lg:px-16 max-w-[1600px] mx-auto">
        
        {/* --- ШАПКА --- */}
        <div className="mb-20">
          <Reveal delay={0}>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight uppercase mb-6">
              Где купить
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-base font-light text-neutral-500 leading-relaxed">
              Посетите наш шоурум, чтобы оценить качество материалов и подобрать идеальное освещение для вашего проекта.
            </p>
          </Reveal>
        </div>
        
        {/* --- КОНТЕНТ (СПИСОК + КАРТА) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 h-auto lg:h-[650px]">
          
          {/* ЛЕВАЯ КОЛОНКА (Список) */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div className="flex flex-col gap-12">
              {STORES.map((store, idx) => (
                <Reveal key={store.id} delay={300 + (idx * 100)}>
                  <div 
                    className="group cursor-pointer flex flex-col"
                    onClick={() => handleStoreListClick(store)}
                  >
                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="text-sm font-medium text-neutral-400">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className={`text-2xl font-normal tracking-tight transition-colors group-hover:text-neutral-500 ${activeStoreId === store.id ? 'text-neutral-900' : 'text-neutral-600'}`}>
                        {store.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm font-light leading-relaxed text-neutral-500 mb-6 pl-8">
                      {store.address}
                    </p>
                    
                    <div className="flex flex-col gap-2 text-sm font-light pl-8">
                      {store.phones.map((phone, i) => (
                        <a 
                          key={i}
                          href={`tel:${phone}`} 
                          className="hover:text-neutral-500 transition-colors w-fit" 
                          onClick={e => e.stopPropagation()}
                        >
                          {phone}
                        </a>
                      ))}
                    
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          
          {/* ПРАВАЯ КОЛОНКА (КАРТА) */}
          <div className="lg:col-span-8 w-full h-[500px] lg:h-full relative overflow-hidden rounded-md">
            <Reveal delay={500} direction="none" className="w-full h-full bg-neutral-100">
              {/* Полностью убрали grayscale, карта теперь всегда цветная */}
              <div className="w-full h-full">
                <YMaps query={{ lang: 'ru_RU', apikey: '' }}>
                  <YMap 
                    state={mapState}
                    width="100%" 
                    height="100%"
                    options={{ suppressMapOpenBlock: true }}
                    modules={["control.ZoomControl"]}
                  >
                    <ZoomControl options={{ position: { right: 20, top: 20 } }} />
                    
                    {STORES.map((store) => (
                      <Placemark
                        key={store.id}
                        geometry={store.coords}
                        properties={{ 
                          balloonContentBody: getBalloonHTML(store)
                        }}
                        modules={['geoObject.addon.balloon']}
                        options={{ 
                          iconLayout: 'default#image', 
                          iconImageHref: '/images/banners/markerlogobanners.png', 
                          iconImageSize: [50, 50], 
                          iconImageOffset: [-25, -25],
                          hideIconOnBalloonOpen: false,
                          balloonOffset: [0, -30],
                          balloonPanelMaxMapArea: 0,
                          balloonCloseButton: false // Без крестика
                        }}
                        onClick={() => handleStoreListClick(store)}
                        instanceRef={(ref: any) => {
                          if (ref) {
                            placemarksRef.current[store.id] = ref;
                            
                            // Надежное открытие балуна: стучимся к маркеру каждые 100мс
                            if (store.id === activeStoreId) {
                              let attempts = 0;
                              const checkAndOpen = setInterval(() => {
                                attempts++;
                                // Ждем пока яндекс подгрузит метод balloon.open()
                                if (ref.balloon && typeof ref.balloon.isOpen === 'function') {
                                  if (!ref.balloon.isOpen()) {
                                    ref.balloon.open();
                                  }
                                  clearInterval(checkAndOpen); // Останавливаем проверку, как только открылось
                                }
                                // Если за 2 секунды карта так и не загрузилась — прекращаем попытки
                                if (attempts > 20) clearInterval(checkAndOpen); 
                              }, 100);
                            }
                          }
                        }}
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