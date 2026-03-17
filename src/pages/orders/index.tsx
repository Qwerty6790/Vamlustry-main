
'use client';

import React, { useState } from 'react';
import { Home, ShoppingBag, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { YMaps, Map as YMap, Placemark, ZoomControl, FullscreenControl } from '@pbe/react-yandex-maps';
import 'tailwindcss/tailwind.css';

// Данные магазинов
const STORES = [
  {
    id: 1,
    title: "ТЦ Шоколад",
    address: "Реутов, МКАД, 2-й километр, ТЦ Шоколад, 3 этаж",
    phones: ["+7 (966)-033-31-11", "+7 (999)-111-11-11"], 
    hours: "с 10:00 до 21:00",
    coords: [55.764483, 37.844517], 
  },
  {
    id: 2,
    title: "ТК Конструктор",
    address: "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.42., 2.19. Линия В, пав. 1.11",
    phones: ["+7 (966)-022-21-11", "+7 (980)-999-33-66"], 
    hours: "с 10:00 до 21:00",
    coords: [55.583222, 37.710800], 
  }
];

const OrdersPage: React.FC = () => {
  // Состояние карты
  const [mapState, setMapState] = useState({
    center: [55.67, 37.77], 
    zoom: 10, 
  });

  // Перемещение камеры при клике на магазин
  const handleStoreClick = (coords: number[]) => {
    setMapState({
      center: coords,
      zoom: 16, 
    });
  };

  return (
    <div className="min-h-screen bg-white text-black pb-20">
      
      {/* Шапка страницы */}
      <div className="pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-12 px-4 border-b border-neutral-100">
        <div className="max-w-[1420px] mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight uppercase">
            Заказ успешно оформлен
          </h1>
        </div>
      </div>

      <div className="max-w-[1420px] mx-auto px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* ЛЕВАЯ КОЛОНКА - Уведомление и действия */}
          <div className="flex flex-col h-full justify-between space-y-10">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-6">Ожидайте звонка</h2>
              
              <div className="space-y-6">
                <p className="text-neutral-500 text-lg leading-relaxed font-light">
                  Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
                </p>

                {/* Блок контактов (минималистичный серый фон) */}
                <div className="bg-neutral-50 p-6 rounded-xl">
                  <p className="text-neutral-600 text-base font-light leading-relaxed">
                     <span className="font-medium text-black">Время работы:</span> 9:00-18:00, Круглосуточно <br/>
                     <span className="font-medium text-black">Телефон:</span> +7 (966)-033-31-11
                  </p>
                </div>

                {/* Блок успешной отправки */}
                <div className="flex items-center gap-3 bg-green-50/50 border border-green-100 p-5 rounded-xl">
                  <CheckCircle size={20} className="text-green-600 shrink-0"/>
                  <p className="text-green-800 text-sm sm:text-base font-light">
                    Копия заказа и уведомление отправлены на вашу почту
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 lg:pt-0">
              <Link href="/" className="flex-1">
                <button className="w-full bg-white border border-neutral-300 hover:border-black text-black px-6 py-4 rounded-xl transition-colors font-medium flex items-center justify-center text-sm sm:text-base">
               
                  На главную
                </button>
              </Link>
              <Link href="/catalog/chandeliers" className="flex-1">
                <button className="w-full border   text-black px-6 py-4 rounded-xl transition-colors font-medium flex items-center justify-center text-sm sm:text-base">
                
                  Продолжить покупки
                </button>
              </Link>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА - Карта и магазины */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-medium tracking-tight">Мы на карте</h2>
            
            {/* Контейнер интерактивной карты */}
            <div className="relative w-full h-[350px] sm:h-[450px] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <div className="absolute inset-0 w-full h-full">
                <YMaps query={{ lang: 'ru_RU', apikey: '' }}>
                  <YMap 
                    state={mapState}
                    width="100%" 
                    height="100%"
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
                          balloonContentHeader: `<span style="font-weight: bold; font-size: 16px; color: black;">${store.title}</span>`,
                          balloonContentBody: `
                            <div style="font-family: sans-serif; font-size: 14px; line-height: 1.5; color: black;">
                              <p style="margin-bottom: 8px;">${store.address}</p>
                              <div><strong>Время работы:</strong> ${store.hours}</div>
                              <div><strong>Тел:</strong> ${store.phones.join(', ')}</div>
                            </div>
                          `
                        }}
                        modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                        options={{ 
                          iconLayout: 'default#image', 
                          iconImageHref: '/images/banners/markerlogobanners.png', // Убедитесь, что путь верный
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

            {/* Список магазинов */}
            <div className="flex flex-col gap-3">
              {STORES.map((store) => (
                <div 
                  key={store.id} 
                  className="p-5 bg-white border border-neutral-200 rounded-xl cursor-pointer group hover:border-black transition-all duration-300"
                  onClick={() => handleStoreClick(store.coords)}
                >
                  <h3 className="font-medium text-lg text-black mb-1 group-hover:text-neutral-500 transition-colors tracking-tight">
                    {store.title}
                  </h3>
                  <p className="text-sm font-light text-neutral-500 mb-4 leading-relaxed">
                    {store.address}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm font-light text-neutral-600 gap-2 sm:gap-0">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        {store.phones.map((phone, idx) => (
                          <a 
                            key={idx}
                            href={`tel:${phone}`} 
                            className="hover:text-black font-medium transition-colors" 
                            onClick={e => e.stopPropagation()}
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                      <span>{store.hours}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
