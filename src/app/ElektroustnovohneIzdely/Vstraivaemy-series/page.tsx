

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

// --- Interfaces ---
interface Subcategory { 
  id: string;
  name: string;
  url?: string;
  image?: string;
  isHeader?: boolean;
}

interface Series {
  id: string;
  name: string;
  image: string;
  description?: string;
  subcategories: Subcategory[];
}

interface Brand {
  id: string;
  name: string;
  image: string; 
  logo: string;
  description: string;
  series: Series[];
}

// --- Data (Полный список) ---
const brandsData: Brand[] = [
  {
    id: 'werkel',
    name: 'Werkel',
    image: '/images/banners/werkelbanners.png',
    logo: '/images/brands/werkellogo.png',
    description: 'Шведское качество и дизайн',
    series: [
      {
        id: 'standard-werkel',
        name: 'Встраиваемая серия Werkel',
        image: '/images/seris/ВстраиваемыесерииWerkel.webp',
        description: 'Классические встраиваемые изделия. Надежные механизмы и стильный дизайн.',
        subcategories: [
          { id: 'standard', name: 'Белое глянцевое', image: '/images/colors/белыйглянцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/white-gloss' },
          { id: 'black', name: 'Черный матовый', image: '/images/colors/черныйматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/black-matte' },
          { id: 'white-acrylic', name: 'Белый акрил', image: '/images/colors/белыйакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/white-acrylic' },
          { id: 'silver', name: 'Серебряный матовый', image: '/images/colors/серебряныйматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/silver-matte' },
          { id: 'silver-corrugated', name: 'Серебряный рифленый', image: '/images/colors/серебряныйрифленыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/silver-corrugated' },
          { id: 'nickel-corrugated', name: 'Никель рифленый глянцевый', image: '/images/colors/никельрифленыйглянцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/nickel-corrugated-gloss' },
          { id: 'ivory-matte', name: 'Айвори матовый', image: '/images/colors/айвориматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/ivory-matte' },    
          { id: 'ivory-acrylic', name: 'Айвори акрил', image: '/images/colors/айвориакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/ivory-acrylic' },
          { id: 'ivory-gloss', name: 'Слоновая кость глянцевый', image: '/images/colors/слоноваякостьгялнцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/ivory-gloss' },
          { id: 'champagne-metallic', name: 'Шампань металлик', image: '/images/colors/шампаньметалликWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/champagne-metallic' },
          { id: 'champagne-corrugated', name: 'Шампань рифленый', image: '/images/colors/шампаньрифленыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/champagne-corrugated' },
          { id: 'bronze-corrugated', name: 'Бронза глянцевый', image: '/images/colors/бронзаглянцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/bronze-corrugated' },
          { id: 'graphite-acrylic', name: 'Графит акрил', image: '/images/colors/графитакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/graphite-acrylic' },
          { id: 'graphite-matte', name: 'Графит матовый', image: '/images/colors/графитматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/graphite-matte' },
          { id: 'graphite-corrugated', name: 'Графит рифленый', image: '/images/colors/графитрифленыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/graphite-corrugated' },
          { id: 'black-acrylic', name: 'Черный акрил', image: '/images/colors/черныйакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/black-acrylic' },
          
          { id: 'frames-header', name: 'Дизайнерские рамки', isHeader: true },
          
          { id: 'Split', name: 'Split рамка', image: '/images/seris/splitramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/split' },
          { id: 'Stark', name: 'Stark рамка', image: '/images/seris/starkramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/stark' },  
          { id: 'Stream', name: 'Stream рамка', image: '/images/seris/streamramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/stream' },
          { id: 'Acrylic', name: 'Acrylic рамка', image: '/images/seris/acrylicramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/acrylic' },
          { id: 'Alumax', name: 'Alumax рамка', image: '/images/seris/alumaxramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/alumax' },
          { id: 'Aluminium', name: 'Aluminium рамка', image: '/images/seris/aluminiumramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/aluminium' },
          { id: 'Baguette', name: 'Baguette рамка', image: '/images/seris/baguetteramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/baguette' },
          { id: 'Diamant', name: 'Diamant рамка', image: '/images/seris/diamantramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/diamant' },
          { id: 'Elite', name: 'Elite рамка', image: '/images/seris/eliteramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/elite' },
          { id: 'Favorit', name: 'Favorit рамка', image: '/images/seris/favoritramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/favorit' },
          { id: 'Hammer', name: 'Hammer рамка', image: '/images/seris/hammerramkaWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/hammer' },
        ]
      }
    ]
  },
  {
    id: 'voltum',
    name: 'Voltum',
    image: '/images/banners/voltumbanners.png',
    logo: '/images/brands/voltumlogo.png',
    description: 'Технологии и стиль',
    series: [
      {
        id: 'Voltum S70',
        name: 'Voltum S70',
        image: '/images/seris/S70.png',
        description: 'Кристаллическая серия в области электроустановочных изделий.',
        subcategories: [
          { id: 'silk', name: 'Шелк', image: '/images/colors/шелкVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/shelk' },
          { id: 'black-matte', name: 'Черный матовый', image: '/images/colors/черныйматовыйVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/black-matte' },
          { id: 'titan', name: 'Титан', image: '/images/colors/титанVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/titan' },
          { id: 'steel', name: 'Сталь', image: '/images/colors/стальVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/steel' },
          { id: 'cashmere', name: 'Кашемир', image: '/images/colors/кашемирVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/cashmere' },
          { id: 'graphite', name: 'Графит', image: '/images/colors/графитVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/graphite' },
          { id: 'white-matte', name: 'Белый матовый', image: '/images/colors/белыйматовыйVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/white-matte' },
          { id: 'white-glossy', name: 'Белый глянцевый', image: '/images/colors/белыйглянцевыйVoltum.png', url: '/ElektroustnovohneIzdely/Voltum/white-gloss' },
        ]
      }
    ]
  }
];

export default function SimpleCatalogPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>(brandsData[0].id);
  const [activeSeriesId, setActiveSeriesId] = useState<string>(brandsData[0].series[0].id);

  const activeBrand = brandsData.find(b => b.id === activeBrandId) || brandsData[0];
  const activeSeries = activeBrand.series.find(s => s.id === activeSeriesId) || activeBrand.series[0];

  const handleBrandChange = (id: string) => {
    setActiveBrandId(id);
    const newBrand = brandsData.find(b => b.id === id);
    if (newBrand && newBrand.series.length > 0) {
      setActiveSeriesId(newBrand.series[0].id);
    }
  };

  if (!activeBrand) return null;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pt-24 md:pt-32 pb-20">
      <Head>
        <title>{activeSeries?.name} — {activeBrand?.name}</title>
      </Head>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- 1. Навигация по брендам (Простые текстовые вкладки) --- */}
        <div className="flex gap-8 border-b border-neutral-200 mb-12">
          {brandsData.map(brand => (
            <button
              key={brand.id}
              onClick={() => handleBrandChange(brand.id)}
              className={`pb-4 text-lg md:text-2xl font-medium transition-colors relative ${
                activeBrandId === brand.id ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {brand.name}
              {/* Подчеркивание активного бренда */}
              {activeBrandId === brand.id && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* --- 2. Шапка (Текст серии слева + Главный баннер бренда справа) --- */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 mb-16">
          <div className="w-full lg:w-5/12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {activeSeries?.name}
            </h1>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed">
              {activeSeries?.description || activeBrand.description}
            </p>
          </div>
          
          {/* Главный баннер бренда (werkelbanners / voltumbanners) */}
          <div className="w-full lg:w-7/12 h-[200px] sm:h-[300px] md:h-[600px] relative rounded-3xl overflow-hidden ">
            <Image 
              src={activeBrand.image || '/images/placeholder.png'} 
              alt={activeBrand.name}
              fill
              className="object-contain lg:object-cover mix-blend-multiply p-4 lg:p-0"
              priority
            />
          </div>
        </div>

      

        {/* --- 4. Сетка товаров --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
          {activeSeries?.subcategories.map((sub) => {
            
            // Простой текстовый разделитель для групп товаров (например "Дизайнерские рамки")
            if (sub.isHeader) {
              return (
                <div key={sub.id} className="col-span-full pt-8 pb-2 border-b border-neutral-200">
                  <h2 className="text-lg md:text-xl font-semibold text-neutral-900">
                    {sub.name}
                  </h2>
                </div>
              );
            }

            // Минималистичная карточка товара
            return (
              <Link key={sub.id} href={sub.url || '#'} className="group block">
                {/* Подложка для фото (светло-серая, чтобы белые рамки были видны) */}
                <div className="aspect-square  rounded-2xl flex items-center justify-center p-6 mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="relative w-full h-full">
                    <Image
                      src={sub.image || '/images/placeholder.png'}
                      alt={sub.name}
                      fill
                      className="object-contain drop-shadow-sm"
                    />
                  </div>
                </div>
                
                {/* Название товара */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 leading-snug">
                    {sub.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Состояние, если товаров нет */}
        {(!activeSeries?.subcategories || activeSeries.subcategories.length === 0) && (
          <div className="py-20 text-center text-neutral-400">
            В этой коллекции пока нет товаров.
          </div>
        )}

      </div>
    </div>
  );
}
