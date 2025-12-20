import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SeriesLayout = () => {
  const series = [
    {
      name: 'Встраиваемые серии',
      image: '/images/categories/vstarivamvyserycategory.png',
      href: '/ElektroustnovohneIzdely/Vstraivaemy-series',
      className: 'col-span-1 md:col-span-6 md:row-span-2 h-64 md:h-full',
      titleClass: 'text-lg md:text-2xl',
      top: 'top-4 md:top-6',
      left: 'left-4 md:left-6',
    },
    {
      name: 'Выдвижные блоки',
      image: '/images/categories/vidvihnyblockcategory.png',
      href: '/ElektroustnovohneIzdely/VidviznoyBlock',
      className: 'col-span-1 md:col-span-3 h-64 md:h-full',
      titleClass: 'text-base md:text-xl',
      top: 'top-3 md:top-4',
      left: 'left-3 md:left-4',
    },
    {
      name: 'Накладыные серии',
      image: '/images/categories/nakladnyseriacategory.png',
      href: '/ElektroustnovohneIzdely/Werkel/Gallant',
      className: 'col-span-1 md:col-span-3 h-64 md:h-full',
      titleClass: 'text-base md:text-xl',
      top: 'top-3 md:top-4',
      left: 'left-3 md:left-4',
    },
    {
      name: 'Серия Vintage',
      image: '/images/categories/vintagesericategory.png',
      href: '/ElektroustnovohneIzdely/Werkel/Vintage',
      className: 'col-span-1 md:col-span-1 h-full',
      titleClass: 'text-base md:text-xl',
      top: 'top-3 md:top-4',
      left: 'left-3 md:left-4',
    },
    {
      name: 'Серия Retro',
      image: '/images/categories/retroeseriycategory.png',
      href: '/ElektroustnovohneIzdely/Werkel/Retro',
      className: 'col-span-1 md:col-span-3 h-64 md:h-full',
      titleClass: 'text-base md:text-xl',
      top: 'top-3 md:top-4',
      left: 'left-3 md:left-4',
    },
    {
      name: 'Влагозащитные серии',
      image: '/images/categories/vlagosahtyserianicategory.png',
      href: '/ElektroustnovohneIzdely/Donel/W55',
      className: 'col-span-1 md:col-span-2 h-64 md:h-full',
      titleClass: 'text-base md:text-xl',
      top: 'top-3 md:top-4',
      left: 'left-3 md:left-4',
    },
  ];

  return (
    <>
      <Head>
        <title>Купить розетки и выключатели в Москве | Электроустановочные изделия Donel, Werkel, Voltum</title>
        <meta name="description" content="Купить розетки и выключатели в Москве по выгодным ценам. Широкий выбор электроустановочных изделий от Donel, Werkel, Voltum. Встраиваемые, накладные, ретро серии. Доставка по России." />
        <meta name="keywords" content="купить розетки выключатели москва, электроустановочные изделия, розетки Donel Werkel Voltum, выключатели купить, встраиваемые розетки, накладные выключатели, ретро розетки, интернет магазин электрики" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Купить розетки и выключатели в Москве - Donel, Werkel, Voltum" />
        <meta property="og:description" content="Купить розетки и выключатели в Москве по выгодным ценам. Широкий выбор электроустановочных изделий от ведущих производителей. Доставка по России." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/categories/vstarivaevyseriycategory.png" />
      </Head>

      <div className="min-h-screen mt-24 md:mt-40 bg-[#101010] text-white font-sans">
        {/* Header */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 border-b border-gray-200">
          <h1 className="text-xl md:text-3xl font-light tracking-wide">
            Электроустановочные изделия
          </h1>
        </div>

        {/* Grid Layout */}
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[520px]">
            {series.map((item, index) => (
              <Link key={index} href={item.href} className={`relative group cursor-pointer overflow-hidden rounded-xl ${item.className}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className={`absolute ${item.top} ${item.left}`}>
                  <h2 className={`text-white font-light tracking-wider ${item.titleClass}`}>
                    {item.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SeriesLayout;
