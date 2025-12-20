'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Интерфейс
interface ChtkSeries {
  id: string;
  name: string;
  image: string;
  logo: string;
  url?: string;
  subcategories?: { id: string; name: string; url: string; image: string }[];
  description?: string;
}

// Данные (исправил id на уникальные)
const chtkSeriesData: ChtkSeries[] = [
  {
    id: 'donel',
    name: 'Donel',
    url: '/Teplypolzdely/Donel/MatynagervatlnyElecktrihicky',
    image: '/images/seris/matnagrevatelnyDonel.png',
    logo: '/images/brands/donellogo.svg',
    description: 'Категория для матов нагревательных Donel',
  },
  {
    id: 'voltum',
    name: 'Voltum',
    url: '/Teplypolzdely/Voltum/Matnagrevatelny',
    image: '/images/seris/matnagrevatelnyVoltum.png',
    logo: '/images/brands/voltumlogo.png',
    description: 'Категория для матов нагревательных Voltum',
  },
  {
    id: 'chtk',
    name: 'ЧТК',
    image: '/images/seris/MNFmelodytepla.png',
    logo: '/images/brands/chtklogo.webp',
    description: 'Категория для матов нагревательных ЧТК',
    subcategories: [
      { id: 'mnd', name: 'Маты нагревательные под плитку', url: '/Teplypolzdely/HTK/MND', image: '/images/seris/MNDmatnargevatelny.png' },
      { id: 'mnf', name: 'Мат нагревательный фольгированный ламинат кварцвинил', url: '/Teplypolzdely/HTK/MNF', image: '/images/seris/MNFmelodytepla.png' },
    ],
  },
];

export default function ChtkPage() {
  const router = useRouter();
  const [selectedSeries, setSelectedSeries] = useState<ChtkSeries | null>(null);
  const [showFrames, setShowFrames] = useState(false);

  // Прокрутка к верху при изменении выбранной серии
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSeries]);

  const handleSeriesClick = (series: ChtkSeries) => {
    if (series.url) {
      router.push(series.url);
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

  return (
    <>
      {/* SEO meta теги */}
      <Head>
        <title>Купить ЧТК маты нагревательные в Москве | Теплый пол электрический</title>
        <meta
          name="description"
          content="Купить ЧТК маты нагревательные в Москве по выгодным ценам. Электрические теплые полы Donel, Voltum, ЧТК. МНД под плитку, МНФ под ламинат. Доставка по России."
        />
        <meta
          name="keywords"
          content="купить ЧТК маты нагревательные, теплый пол электрический, маты нагревательные москва, МНД МНФ, Donel Voltum ЧТК, теплые полы купить, электрический теплый пол под плитку ламинат"
        />
        <meta property="og:title" content="Купить ЧТК маты нагревательные в Москве - теплый пол электрический" />
        <meta
          property="og:description"
          content="Купить ЧТК маты нагревательные в Москве по выгодным ценам. Электрические теплые полы МНД, МНФ от Donel, Voltum, ЧТК. Доставка по России."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://elektromos.ru/Teplypolzdely/Mat-nagrevatelny" />
        <meta property="og:image" content="/images/seris/MNFmelodytepla.png" />
      </Head>

      <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen text-[var(--foreground)] pt-36 md:pt-32 max-w-[88rem] mx-auto      ">
        <h1 className="hidden md:text-[100px] lg:text-[90px] pt-10 p-2 font-bold text-white text-center opacity-100 tracking-tight whitespace-nowrap">
          Теплые полы
        </h1>
        <div className="flex flex-col lg:flex-row">
          {/* Левая часть */}
          <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-[#101010] p-4 sm:p-6 md:p-8 lg:p-16 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-medium text-white mb-4 md:mb-6">
              Маты нагревательные
            </h2>
            <p className="text-white mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Откройте для себя нагревательные маты Donel, Voltum и ЧТК — надёжное решение для тёплого пола под плитку, ламинат и другие покрытия.
            </p>
            <p className="text-white mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Электрические маты обеспечивают быстрый монтаж, энергоэффективность и комфорт в вашем доме. Подходят для жилых и коммерческих помещений.
            </p>
            <p className="text-white text-sm sm:text-base md:text-lg">
             Выбирайте качество, выбирайте <b>elektromos.ru</b>!
            </p>
          </div>

          {/* Правая часть */}
          <div className="lg:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {selectedSeries ? (
              <div className="py-4 md:py-8">
                <div className="mb-6 md:mb-8">
                  <button
                    onClick={handleBackToSeries}
                     className="flex  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 text-white hover:text-red-500 mb-4 md:mb-6 transition-colors duration-300 text-sm md:text-base"
                  >
                    Назад к сериям
                  </button>

                  <div className="rounded-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg p-2 flex items-center justify-center">
                        <Image
                          src={selectedSeries.image}
                          alt={selectedSeries.name}
                          width={500}
                          height={500}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{selectedSeries.name}</h2>
                        <p className="text-white text-sm md:text-base">
                          {selectedSeries.subcategories?.length || 0} доступных вариантов
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Список подкатегорий */}
                <div className="flex">
                  {selectedSeries.subcategories?.map((subcategory) => (
                    <Link key={subcategory.id} href={subcategory.url}>
                      <div className="group cursor-pointer">
                        <div className="rounded-lg transition-all duration-300 hover:border-red-500">
                          <div className="w-full h-48 sm:h-56 md:h-72  lg:h-full flex  flex-col  p-0">
                            <Image
                              src={subcategory.image}
                              alt={subcategory.name}
                              width={850}
                              height={850}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          <div className="p-0  flex flex-row   justify-center   mt-2">
                            <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center leading-tight text-xs sm:text-sm md:text-base">
                              {subcategory.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4 md:py-8 pt-20 md:pt-32">
                <div className="flex flex-col gap-4 md:gap-6">
                  {chtkSeriesData.map((series) => (
                    <div key={series.id} onClick={() => handleSeriesClick(series)} className="group cursor-pointer h-full">
                      <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                        <div className="flex flex-row items-center p-4 md:p-6 h-full min-h-[160px]">
                          <div className="flex-1 pr-4 md:pr-6 flex flex-col justify-center text-left">
                            <div className="w-56 h-20 sm:w-64 sm:h-24 md:w-80 md:h-28 lg:w-72 lg:h-32 mb-2 md:mb-3">
                              <Image
                                src={series.logo}
                                alt={series.name}
                                width={400}
                                height={400}
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <p className="text-white text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{series.description}</p>
                            <div className="flex  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 text-white">
                            
                              <span className="text-xs md:text-sm">Смотреть категорию</span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:w-[600px] lg:h-[600px] ">
                            <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                              <Image
                                src={series.image}
                                alt={series.name}
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
