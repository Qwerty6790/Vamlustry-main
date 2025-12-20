'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
interface ChtkSeries {
  id: string;
  name: string;
  image: string;
  url?: string;
  subcategories?: { id: string; name: string; url: string; image: string }[];
  description?: string;
}

const chtkSeriesData: ChtkSeries[] = [
  {
    id: 'mat-nagrevatelnyj',
    name: 'Мат нагревательный',
    image: '/images/seris/MNFmelodytepla.png',
    description: 'Категория для матов нагревательных',
    subcategories: [
      { id: 'mnd', name: 'МНД', url: '/Teplypolzdely/HTK/MND', image: '/images/seris/MNDmatnargevatelny.png' },
      { id: 'mnf', name: 'МНФ', url: '/Teplypolzdely/HTK/MNF', image: '/images/seris/MNFmelodytepla.png' }
    ]
  },
  {
    id: 'kabelnyj-teplyj-pol',
    name: 'Кабельный теплый пол',
    image: '/images/seris/СНТ-18.webp',
    description: 'Категория для кабельного теплого пола',
    subcategories: [
      { id: 'snt-18', name: 'СНТ-18', url: '/Teplypolzdely/HTK/cabelnyteplypol/CNT-18', image: '/images/seris/СНТ-18.webp' },
      { id: 'sn-15', name: 'СН-15', url: '/Teplypolzdely/HTK/cabelnyteplypol/CN-15', image: '/images/seris/СН-15.webp' }
    ]
  },
  {
    id: 'specialnyj-grejuschij-kabel',
    name: 'Специальный греющий кабель',
    image: '/images/seris/CH-10.webp',
    description: 'Категория для специального греющего кабеля',
    subcategories: [
      { id: 'sn-10', name: 'СН-10', url: '/Teplypolzdely/HTK/speyalnigreyhikabel/CN-10', image: '/images/seris/CH-10.webp' },
      { id: 'sngt', name: 'СНГТ', url: '/Teplypolzdely/HTK/speyalnigreyhikabel/CNGT', image: '/images/seris/СНГТ.webp' },
      { id: 'st-18', name: 'СТ-18', url: '/Teplypolzdely/HTK/speyalnigreyhikabel/CT-18', image: '/images/seris/СТ-18.webp' }
    ]
  },
  {
    id: 'obogrev-krovli-i-ploschadok',
    name: 'Обогрев кровли и площадок',
    image: '/images/seris/СН-28.webp',
    description: 'Категория для обогрева кровли и площадок',
    subcategories: [
      { id: 'sn-28', name: 'СН-28', url: '/Teplypolzdely/HTK/obogrevcrovliiplohadek/CN-28', image: '/images/seris/СН-28.webp' },
      { id: 'snv-28', name: 'СНВ-28', url: '/Teplypolzdely/HTK/obogrevcrovliiplohadek/CNV-28', image: '/images/seris/СНВ-28.webp' }
    ]
  },
  {
    id: 'termoregulator',
    name: 'Терморегулятор',
    image: '/images/seris/TermostatCHTK.png',
    description: 'Категория для терморегуляторов',
    subcategories: [
      { id: 'termoregulator', name: 'Терморегулятор', url: '/Teplypolzdely/HTK/Termoregulytor/', image: '/images/seris/TermostatCHTK.png' },
    ]
  }
];

export default function ChtkPage() {
  const router = useRouter();
  const [selectedSeries, setSelectedSeries] = useState<ChtkSeries | null>(null);
  const [showFrames, setShowFrames] = useState(false);

  const handleSeriesClick = (series: ChtkSeries) => {
    if (series.url) {
      router.push(series.url); // <-- вместо window.location.href
    } else {
      setSelectedSeries(series);
      setShowFrames(false);
    }
  };

  const handleBackToSeries = () => {
    setSelectedSeries(null);
    setShowFrames(false);
  };

  const handleBackFromFrames = () => {
    setShowFrames(false);
  };

  // SEO метаданные
  const seoData = {
    title: 'Теплые полы ЧТК - качество для вашего дома | Elektromos',
    description: 'Купить теплые полы ЧТК в России. Маты нагревательные, кабельный теплый пол, терморегуляторы. Доставка по всей России. Гарантия качества.',
    keywords: 'теплые полы ЧТК, маты нагревательные, кабельный теплый пол, терморегуляторы, обогрев кровли, греющий кабель, электрический теплый пол',
    canonical: 'https://elektromos.com.ua/Teplypolzdely/HTK',
    ogImage: '/images/seris/MNFmelodytepla.png'
  };

  // Структурированные данные для Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Теплые полы ЧТК",
    "description": "Высококачественные теплые полы бренда ЧТК. Включает маты нагревательные, кабельный теплый пол, терморегуляторы и специальный греющий кабель.",
    "brand": {
      "@type": "Brand",
      "name": "ЧТК"
    },
    "category": "Теплые полы",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "UAH",
      "seller": {
        "@type": "Organization",
        "name": "Elektromos"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Elektromos" />
        <meta name="language" content="uk" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:site_name" content="Elektromos" />
        <meta property="og:locale" content="uk_UA" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        <Head>
        <title>ЧТК - теплые полы, терморегуляторы</title>
        <meta name="description" content="Чтк - теплые полы бренда ЧТК. Включает маты нагревательные, кабельный теплый пол, терморегуляторы и специальный греющий кабель." />
      </Head>
        {/* Canonical */}
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Структурированные данные */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen text-[var(--foreground)] pt-36 md:pt-32">
        {/* H1 заголовок для SEO */}
        <h1 className="hidden md:text-[100px] lg:text-[90px] pt-10 p-2 font-bold text-white text-center opacity-100 tracking-tight whitespace-nowrap">
          Теплые полы ЧТК - Немецкое качество для вашего дома
        </h1>
        
        <div className="flex flex-col lg:flex-row">
          {/* Левая фиксированная часть */}
          <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-[#101010] p-4 sm:p-6 md:p-8 lg:p-16 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-medium text-white mb-4 md:mb-6">
              Серия ЧТК
            </h2>
            <p className="text-white mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Откройте для себя превосходные электроустановочные изделия ЧТК – эталон немецкого качества и элегантного дизайна в мире электрики!
            </p>
            <p className="text-white mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Каждая серия ЧТК представляет собой гармоничное сочетание функциональности и стиля. От классических встраиваемых серий до премиальных коллекций – каждое изделие создано с учетом высочайших стандартов качества.
            </p>
            <p className="text-white text-sm sm:text-base md:text-lg">
              ЧТК — это не просто электрика, это искусство создания совершенного пространства. Выбирайте качество, выбирайте ЧТК!
            </p>
          </div>

          {/* Правая прокручиваемая часть */}
          <div className="lg:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {selectedSeries ? (
              <div className="py-4 md:py-8">
                <div className="mb-4 md:mb-6">
                  <button
                    onClick={handleBackToSeries}
                    className="flex items-center text-white hover:text-red-500 mb-4 md:mb-6 transition-colors duration-300 text-sm md:text-base"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад к сериям
                  </button>

                  <div className="rounded-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg p-2 flex items-center justify-center">
                        <Image
                          src={selectedSeries.image}
                          alt={`${selectedSeries.name} - ЧТК`}
                          width={500}
                          height={500}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{selectedSeries.name}</h3>
                        <p className="text-gray-400 text-sm md:text-base">{selectedSeries.subcategories?.length || 0} доступных вариантов</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Секция подкатегорий */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-x-4 gap-y-8 md:gap-y-12 mb-8 md:mb-12">
                  {selectedSeries.subcategories?.map((subcategory) => (
                    <Link key={subcategory.id} href={subcategory.url}>
                      <div className="group cursor-pointer">
                        <div className="rounded-lg transition-all duration-300 hover:border-red-500">
                          <div className="w-full h-48 sm:h-56 md:h-72 lg:h-80 flex items-center justify-center p-0">
                            <Image
                              src={subcategory.image}
                              alt={`${subcategory.name} - ${selectedSeries.name} ЧТК`}
                              width={800}
                              height={800}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="">
                            <h4 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center leading-tight text-xs sm:text-sm md:text-base">
                              {subcategory.name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4 md:py-8 pt-20 md:pt-32">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-3 md:mb-4">Категории теплых полов ЧТК</h2>
                </div>
                <div className="flex flex-col gap-4 md:gap-6">
                  {chtkSeriesData.map((series) => (
                    <div
                      key={series.id}
                      onClick={() => handleSeriesClick(series)}
                      className="group cursor-pointer h-full"
                    >
                      <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                        <div className="flex flex-row items-center p-4 md:p-6 h-full min-h-[160px]">
                          <div className="flex-1 pr-4 md:pr-6 flex flex-col justify-center text-left">
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors duration-300">
                              {series.name}
                            </h3>
                            <p className="text-white text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{series.description}</p>
                            <div className="flex items-center justify-start text-white">
                              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="text-xs md:text-sm">Смотреть категорию</span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64">
                            <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                              <Image
                                src={series.image}
                                alt={`${series.name} - ЧТК теплые полы`}
                                width={400}
                                height={400}
                                className="object-contain max-w-full max-h-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
