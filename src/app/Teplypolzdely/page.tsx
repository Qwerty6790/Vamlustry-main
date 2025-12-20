import React from 'react';
import { Metadata } from 'next';

// Метатеги для страницы теплых полов
export const metadata: Metadata = {
  title: 'Теплые полы - Системы обогрева пола в Москве',
  description: 'Купить теплые полы в Москве: кабельные системы, маты нагревательные, терморегуляторы. Электрические теплые полы ЧТК, Donel, Werkel, Voltum с доставкой.',
  keywords: 'теплые полы купить, электрические теплые полы, маты нагревательные, кабельный теплый пол, терморегуляторы, системы обогрева',
  openGraph: {
    title: 'Теплые полы - Системы обогрева пола в Москве',
    description: 'Теплые полы и системы обогрева от ведущих производителей. Кабельные системы, маты, терморегуляторы.',
    type: 'website',
    url: 'https://elektromos.ru/Teplypolzdely',
    images: ['/images/matnagrevatelnycollection.png'],
  },
};

const SeriesLayout = () => {
  return (
    <div className="min-h-screen mt-24 md:mt-40 bg-[#101010] text-white font-sans flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-2xl md:text-4xl font-light mb-4">Теплые полы</h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Раздел в разработке. Скоро здесь появится полный каталог товаров.
        </p>
      </div>
    </div>
  );
};

export default SeriesLayout;
