
  
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
      images: [],
      
    },
    // Добавьте больше магазинов здесь для теста списка
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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 250px; color: #171717; padding: 4px;">
      
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
  
  // --- ИКОНКИ ДЛЯ МЕНЮ ---
  const IconBrandZone = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  );
  const IconMap = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
  );
  const IconList = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
  );
  
  // --- ОСНОВНОЙ КОМПОНЕНТ ---
  export default function WhereToBuyPage() {
    const [mapState, setMapState] = useState<MapState>({
      center: STORES[0].coords, 
      zoom: 15, 
    });
  
    const [activeStoreId, setActiveStoreId] = useState<number>(STORES[0].id);
    const [activeTab, setActiveTab] = useState<'offline' | 'online' | 'marketplaces'>('offline');
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const placemarksRef = useRef<Record<number, any>>({});
  
    const handleStoreListClick = (store: Store) => {
      setMapState({ center: store.coords, zoom: 16 });
      setActiveStoreId(store.id);
      setViewMode('map'); // Переключаем на карту, если кликнули из списка
  
      const placemark = placemarksRef.current[store.id];
      if (placemark && placemark.balloon && typeof placemark.balloon.isOpen === 'function') {
        if (!placemark.balloon.isOpen()) {
          placemark.balloon.open();
        }
      }
    };
  
    return (
      // Заменен цвет фона на теплый светлый, как на картинке
      <div className="min-h-screen  text-neutral-900 font-sans pb-0 pt-32 overflow-hidden ">
        
        {/* --- ШАПКА ЦЕНТРИРОВАННАЯ (Как на картинке) --- */}
        <section className="px-6 lg:px-16 max-w-[1600px] mx-auto text-start mb-10">
          <Reveal delay={0}>
            {/* font-serif и italic помогают сымитировать элегантный шрифт с картинки */}
            <h1 className="text-5xl md:text-6xl lg:text-[55px] font-serif italic font-light tracking-tight  text-neutral-800 mb-6">
              Где купить
            </h1>
          </Reveal>
        </section>
  
      
          
        {/* --- КОНТЕНТ (КАРТА ИЛИ СПИСОК) --- */}
        <section className="w-full relative h-[700px] lg:h-[800px] ">
          
          {/* ВИД: КАРТА */}
          <div className={`w-full h-full transition-opacity duration-500 absolute inset-0 ${viewMode === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <YMaps query={{ lang: 'ru_RU', apikey: '' }}>
              <YMap 
                state={mapState}
                width="100%" 
                height="100%"
                options={{ suppressMapOpenBlock: true }}
                modules={["control.ZoomControl"]}
              >
                {/* Контрол зума убран с картинки, но если нужен — оставляем. Можно скрыть убрав эту строку */}
                {/* <ZoomControl options={{ position: { right: 20, top: 20 } }} /> */}
                
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
                      balloonCloseButton: false
                    }}
                    onClick={() => handleStoreListClick(store)}
                    instanceRef={(ref: any) => {
                      if (ref) {
                        placemarksRef.current[store.id] = ref;
                        if (store.id === activeStoreId && viewMode === 'map') {
                          let attempts = 0;
                          const checkAndOpen = setInterval(() => {
                            attempts++;
                            if (ref.balloon && typeof ref.balloon.isOpen === 'function') {
                              if (!ref.balloon.isOpen()) {
                                ref.balloon.open();
                              }
                              clearInterval(checkAndOpen); 
                            }
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
  
          {/* ВИД: СПИСОК (показывается при клике на "СПИСОК") */}
          <div className={`w-full h-full bg-[#Faf9f7] overflow-y-auto transition-opacity duration-500 absolute inset-0 py-12 px-6 lg:px-16 ${viewMode === 'list' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="max-w-[800px] mx-auto flex flex-col gap-8">
              {STORES.map((store, idx) => (
                <div 
                  key={store.id}
                  className="group cursor-pointer flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-all"
                  onClick={() => handleStoreListClick(store)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium tracking-tight text-neutral-800 group-hover:text-neutral-500 transition-colors">
                      {store.title}
                    </h3>
                    <button className="text-xs font-medium px-3 py-1 bg-neutral-100 rounded text-neutral-600 uppercase tracking-wider">
                      На карте
                    </button>
                  </div>
                  
                  <p className="text-sm text-neutral-500 mb-6">
                    {store.address}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 text-sm text-neutral-700">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Телефоны</span>
                      {store.phones.map((phone, i) => (
                        <a key={i} href={`tel:${phone}`} className="hover:text-neutral-500" onClick={e => e.stopPropagation()}>{phone}</a>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Режим работы</span>
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
        </section>
      </div>
    );
  }
 