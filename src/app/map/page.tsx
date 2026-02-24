
'use client';

import React, { useState } from 'react';
import { YMaps, Map as YMap, Placemark, ZoomControl, FullscreenControl } from '@pbe/react-yandex-maps';
import { FaSearch } from 'react-icons/fa'; // npm install react-icons

// Ваши актуальные магазины
const STORES = [
  {
    id: 1,
    title: "ТЦ Шоколад",
    address: "Реутов, МКАД, 2-й километр, ТЦ Шоколад, 3 этаж",
    phone: "+7 (966)-033-31-11",
    hours: "с 10:00 до 21:00",
    coords: [55.764483, 37.844517], 
  },
  {
    id: 2,
    title: "ТК Конструктор",
    address: "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.41.1, 2.19. Линия В, пав. 2.4",
    phone: "+7 (966)-033-31-11",
    hours: "с 10:00 до 21:00",
    coords: [55.583222, 37.710800], 
  }
];

export default function AboutPage() {
  // Состояние карты
  const [mapState, setMapState] = useState({
    center: [55.67, 37.77], 
    zoom: 10, 
    controls: [] 
  });

  // Обработчик клика по магазину
  const handleStoreClick = (coords: number[]) => {
    setMapState({
      ...mapState,
      center: coords,
      zoom: 16, 
    });
  };

  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* --- MAP SECTION --- */}
      <section id="where-to-buy" className="px-4 md:px-16 max-w-[1420px] mx-auto py-8 md:py-20 scroll-mt-28">
        
        {/* Заголовки */}
        <div className="mb-8 md:mb-12">
          <a href='https://2gis.ru/reutov/firm/4504127913251710' className="text-black text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 uppercase hover:text-neutral-600 transition-colors">
            МЫ ЕСТЬ И В 2ГИС
          </a>
          <h3 className='text-neutral-500 text-2xl md:text-4xl font-light tracking-tight'>
            НАШИ МАГАЗИНЫ
          </h3>
        </div>
        
        {/* Изменили высоту lg:h-[700px] (было 600px), чтобы карта стала еще больше */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-[700px]">
          
          {/* Левая колонка со списком. Уменьшили ширину: lg:w-[400px] shrink-0 (было 550px) */}
          <div className="w-full lg:w-[400px] shrink-0 flex flex-col lg:h-full">
            <div className="flex flex-col h-full lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar gap-4 lg:gap-0">
              {STORES.map((store) => (
                <div 
                  key={store.id} 
                  className={`
                    flex-1 flex flex-col justify-center p-4 lg:p-6
                    border border-neutral-200 lg:border-0 lg:border-b lg:border-neutral-100 
                    last:border-0 group cursor-pointer rounded-lg lg:rounded-none 
                    bg-neutral-50 lg:bg-transparent transition-all duration-300
                    hover:bg-neutral-100 lg:hover:bg-transparent
                  `}
                  onClick={() => handleStoreClick(store.coords)}
                >
                  <h3 className="font-medium lg:font-light tracking-tighter leading-[1.1] text-xl lg:text-2xl text-black mb-2 group-hover:text-neutral-500 transition-colors">
                    {store.title}
                  </h3>
                  <p className="text-sm lg:text-base font-light tracking-tight leading-[1.4] mb-3 text-neutral-800">
                    {store.address}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:gap-6 text-neutral-500 text-sm lg:text-base font-light tracking-tighter leading-[1.1]">
                      <a 
                        href={`tel:${store.phone}`} 
                        className="hover:text-black transition-colors mb-1 sm:mb-0 font-medium" 
                        onClick={e => e.stopPropagation()}
                      >
                        {store.phone}
                      </a>
                      <span>{store.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Центральная колонка с Картой (flex-1 забирает всё оставшееся место) */}
          <div id="map-container" className="w-full flex-1 min-w-0 h-[400px] sm:h-[500px] lg:h-full bg-white overflow-hidden shadow-sm relative rounded-xl lg:rounded-md">
            <div className="absolute inset-0 w-full h-full">
              <YMaps query={{ lang: 'ru_RU', apikey: '' }}>
                <YMap 
                  state={mapState}
                  defaultState={{ center: [55.67, 37.77], zoom: 10 }} 
                  width="100%" 
                  height="100%"
                  className="w-full h-full"
                  options={{
                    suppressMapOpenBlock: true,
                  }}
                  modules={["control.ZoomControl", "control.FullscreenControl"]}
                >
                  <ZoomControl options={{ position: { right: 10, top: 50 } }} />
                  <FullscreenControl />
                  
                  {STORES.map((store) => (
                    <Placemark
                      key={store.id}
                      geometry={store.coords}
                      properties={{ 
                        balloonContentHeader: `<span style="font-weight: bold; font-size: 16px;">${store.title}</span>`,
                        balloonContentBody: `
                          <div style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">
                            <p style="margin-bottom: 8px;">${store.address}</p>
                            <div><strong>Время работы:</strong> ${store.hours}</div>
                            <div><strong>Тел:</strong> ${store.phone}</div>
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
          </div>

        </div>
      </section>
    </div>
  );
}
