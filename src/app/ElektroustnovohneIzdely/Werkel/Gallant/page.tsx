

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

// --- Data (Адаптированные данные серии Gallant) ---
const brandsData: Brand[] = [
  {
    id: 'werkel',
    name: 'Werkel',
    image: '/images/banners/gallantbanners.png', // Большой баннер бренда (как во втором коде)
    logo: '/images/brands/werkellogo.png',
    description: 'Шведское качество и дизайн',
    series: [
      {
        id: 'gallant',
        name: 'Gallant',
        image: '/images/colors/белыйGallant.webp',
        description: 'Премиальная коллекция в стиле арт-деко. Эталон немецкого качества и элегантного дизайна.',
        subcategories: [
          { id: 'graphite-corrugated', name: 'Графит рифленый', image: '/images/colors/графитрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-graphite-corrugated' },
          { id: 'black-chrome', name: 'Черный хром', image: '/images/colors/черныйхромGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-black-chrome' },
          { id: 'ivory', name: 'Слоновая кость', image: '/images/colors/слоноваякостьGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-ivory' },
          { id: 'silver', name: 'Серебряный', image: '/images/colors/серебряныйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-silver' },
          { id: 'white', name: 'Белый', image: '/images/colors/белыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-white' },
          { id: 'champagne-corrugated', name: 'Шампань рифленый', image: '/images/colors/шампаньрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-champagne-corrugated' },
        ]
      }
    ]
  }
];

export default function WerkelGallantPage() {
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
        <title>{activeSeries?.name} — {activeBrand?.name} Каталог</title>
        <meta name="description" content={`Каталог серии ${activeSeries?.name} от ${activeBrand?.name}`} />
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
          
          {/* Главный баннер бренда */}
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
            
            // Простой текстовый разделитель для групп товаров
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
                {/* Подложка для фото */}
                <div className="aspect-square rounded-2xl flex items-center justify-center p-6 mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
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

