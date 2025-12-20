"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

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
  subcategories?: Subcategory[];
}

const donelSeries = [
  {
    id: 'r98',
    name: 'Серия R98',
    image: '/images/seris/r98.png',
    description: 'Универсальная серия с широкой палитрой цветов',
    subcategories: [
      { id: 'black', name: 'Черный', image: '/images/colors/черныйR98.webp', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'stali', name: 'Сталь', image: '/images/colors/стальR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-shokolad', name: 'Матовый шоколад', image: '/images/colors/матовыйшоколадR98.webp', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-seriy', name: 'Матовый серый', image: '/images/colors/матовыйсерыйR98.webp', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-korbon', name: 'Матовый корбон', image: '/images/colors/матовыйкарбонR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-koral', name: 'Матовый коралл', image: '/images/colors/матовыйкораллR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-kashmir', name: 'Матовый кашмир', image: '/images/colors/матовыйкашемирR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-beliy', name: 'Матовый белый', image: '/images/colors/матовыйбелыйR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matyovyi-emirald', name: 'Матовый изумрудный', image: '/images/colors/МатовыйИзумрудR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'white', name: 'Белый', image: '/images/colors/белыйR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'aluminum', name: 'Алюминий', image: '/images/colors/матовыйалюминийR98.png', url: '/ElektroustnovohneIzdely/Configurator' },
    ],
  },
  {
    id: 'n96',
    name: 'Серия N96',
    image: '/images/seris/n96.png',
    description: 'Премиальная серия с металлическими покрытиями',
    subcategories: [
      { id: 'black', name: 'Черный', image: '/images/colors/черныйN96.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'white', name: 'Белый', image: '/images/colors/белыйn96.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'nickel', name: 'Никель', image: '/images/colors/никельn96.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'brass', name: 'Латунь', image: '/images/colors/латуньn96.png', url: '/ElektroustnovohneIzdely/Configurator' },
    ],
  },
  {
    id: 'r98-metal',
    name: 'Серия R98 METAL',
    image: '/images/seris/r98metal.png',
    description: 'Эксклюзивная металлическая серия высшего качества',
    subcategories: [
      { id: 'brass', name: 'Латунь', image: '/images/colors/R98metalлатунь.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'nickel', name: 'Никель', image: '/images/colors/R98metalникель.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/R98metalвороненаясталь.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'blagodarnaya-stali', name: 'Благородная сталь', image: '/images/colors/R98metalблагороданясталь.png', url: '/ElektroustnovohneIzdely/Configurator' },
      { id: 'matovoy-gold', name: 'Матовое золото', image: '/images/colors/R98metalзолотоматовое.png', url: '/ElektroustnovohneIzdely/Configurator' },
    ],
  },
  {
    id: 'a07-natural',
    name: 'Серия A07 NATURAL',
    image: '/images/seris/a07naturalmetal.png',
    subcategories: [
      { id: 'gold-aluminum', name: 'Золотистый алюминий', image: '/images/colors/золотистыйNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-gold' },
      { id: 'bronze-aluminum', name: 'Бронзовый алюминий', image: '/images/colors/бронзовыйNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-bronze' },
      { id: 'silver-aluminum', name: 'Серебристый алюминий', image: '/images/colors/серебристыйалюминийNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-silver' },
      { id: 'cosmo-aluminum', name: 'Космический алюминий', image: '/images/colors/космическийалюминийNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-cosmo' },
      { id: 'black-aluminum', name: 'Черный алюминий', image: '/images/colors/черныйалюминийNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-black' },
      // Заголовок для разделения секции стекла внутри той же серии
      { id: 'glass-header', name: 'GLASS', isHeader: true },
      { id: 'metal-glass', name: 'Металлик стекло', image: '/images/colors/стеклометталикGLASS.png', url: '/ElektroustnovohneIzdely/Donel/A07-metal-glass' },
      { id: 'black-glass', name: 'Черное стекло', image: '/images/colors/черноестеклоGLASS.png', url: '/ElektroustnovohneIzdely/Donel/A07-black-glass' },
      { id: 'milk-glass', name: 'Молочное стекло', image: '/images/colors/молочноестеклоGLASS.png', url: '/ElektroustnovohneIzdely/Donel/A07-milk-glass' },
      { id: 'smoke-glass', name: 'Дымчатое стекло', image: '/images/colors/дымчатоестеклоGLASS.png', url: '/ElektroustnovohneIzdely/Donel/A07-smoke-glass' },
      { id: 'white-glass', name: 'Белое стекло', image: '/images/colors/белоестеклоGLASS.png', url: '/ElektroustnovohneIzdely/Donel/A07-white-glass' },
      { id: 'champagne-glass', name: 'Шампань стекло', image: '/images/colors/стеклошампаньGLASS.png', url: '/ElektroustnovohneIzdely/Donel/A07-champagne-glass' },
    ]
  },
  {
    id: 's08',
    name: 'Серия S08',
    image: '/images/seris/s08.png',
    subcategories: [
      { id: 'champagne-s08', name: 'Шампань', image: '/images/colors/S08шампань.png', url: '/ElektroustnovohneIzdely/Donel/S08-champagne' },
      { id: 'black-graphite', name: 'Черный графит', image: '/images/colors/серыйграфитs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-black-graphite' },
      { id: 'steel-s08', name: 'Сталь', image: '/images/colors/стальs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-steel' },
      { id: 'ivory', name: 'Слоновая кость', image: '/images/colors/слоноваякостьs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-ivory' },
      { id: 'grey-graphite', name: 'Серый графит', image: '/images/colors/серыйграфитs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-grey-graphite' },
      { id: 'mokko-s08', name: 'Мокко', image: '/images/colors/моккоs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-mokko' },
      { id: 'titan-s08', name: 'Матовый титан', image: '/images/colors/матовыйтитанs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-titan' },
      { id: 'white-matte-s08', name: 'Матовый белый', image: '/images/colors/матовыйбелыйs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-white-matte' },
      { id: 'white-gloss-s08', name: 'Глянцевый белый', image: '/images/colors/глянцевыйбелыйs08.png', url: '/ElektroustnovohneIzdely/Donel/S08-white-gloss' },
      { id: 'switch-mechanism', name: 'Механизм выключателя', image: '/images/seris/Механизмвыключателя.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-switch' },
      { id: 'outlet-220v', name: 'Розетка 220v', image: '/images/seris/Розетка220v.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-outlet' },
      { id: 'tv-outlet', name: 'Розетка телевизионная', image: '/images/seris/Розеткителевезионные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-tv' },
      { id: 'phone-outlet', name: 'Розетка телефонная', image: '/images/seris/Розеткителефонные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-phone' },
      { id: 'computer-outlet', name: 'Розетка компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
      { id: 'audio-video', name: 'Розетка аудио/видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
      { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
      { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
    ]
  },
  {
    id: 'a07',
    name: 'Серия A07',
    image: '/images/seris/a07.png',
    description: 'Классическая серия с великолепным выбором цветов',
    subcategories: [
      { id: 'champagne', name: 'Шампань', image: '/images/colors/шампаньa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-champagne' },
      { id: 'steel', name: 'Сталь', image: '/images/colors/стальa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-stal' },
      { id: 'grey', name: 'Матовый серый', image: '/images/colors/матовыйсерыйa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-matovygrey' },
      { id: 'mokko', name: 'Мокко', image: '/images/colors/моккоa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-mokko' },
      { id: 'cream', name: 'Матовый кремовый', image: '/images/colors/матовыйкремовыйa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-matovycream' },
      { id: 'cashmere', name: 'Матовый кашемир', image: '/images/colors/матовыйкашемирa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-matovycashmere' },
      { id: 'carbon', name: 'Матовый карбон', image: '/images/colors/матовыйкарбонa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-matovycarbon' },
      { id: 'titan', name: 'Матовый титан', image: '/images/colors/матовыйтитанA07.png', url: '/ElektroustnovohneIzdely/Donel/A07-matovytitan' },
      { id: 'white-matte', name: 'Матовый белый', image: '/images/colors/матовыйбелыйa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-matovywhite' },
      { id: 'white-gloss', name: 'Глянцевый белый', image: '/images/colors/глянцевыйбелыйa07.png', url: '/ElektroustnovohneIzdely/Donel/A07-white-gloss' },
      { id: 'switch-mechanism', name: 'Механизм выключателя', image: '/images/seris/Механизмвыключателя.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-switch' },
      { id: 'outlet-220v', name: 'Розетка 220v', image: '/images/seris/Розетка220v.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-outlet' },
      { id: 'tv-outlet', name: 'Розетка tv', image: '/images/seris/Розеткителевезионные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-tv' },
      { id: 'phone-outlet', name: 'Розетка телефонная', image: '/images/seris/Розеткителефонные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-phone' },
      { id: 'computer-outlet', name: 'Розетка компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
      { id: 'audio-video', name: 'Розетка аудио/видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
      { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
      { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
    ],
  },
  {
    id: 'a07-wave',
    name: 'Серия A07 WAVE',
    image: '/images/seris/a07wave.png',
    subcategories: [
      { id: 'champagne-wave', name: 'Шампань', image: '/images/colors/шампаньWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-champagne' },
      { id: 'steel-wave', name: 'Сталь', image: '/images/colors/стальWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-stal' },
      { id: 'mokko-wave', name: 'Мокко', image: '/images/colors/моккоWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-mokko' },
      { id: 'titan-wave', name: 'Матовый титан', image: '/images/colors/матовыйтитанWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-titan' },
      { id: 'grey-wave', name: 'Матовый серый', image: '/images/colors/матовыйсерыйWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-grey' },
      { id: 'cashmere-wave', name: 'Матовый кашемир', image: '/images/colors/матовыйкашемирWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-cashmere' },
      { id: 'carbon-wave', name: 'Матовый карбон', image: '/images/colors/матовыйкарбонWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-carbon' },
      { id: 'white-matte-wave', name: 'Матовый белый', image: '/images/colors/матовыйбелыйWave.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-white' },
      { id: 'gloss-wave', name: 'Глянцевый', image: '/images/colors/ГлянцевыйWAVE.png', url: '/ElektroustnovohneIzdely/Donel/A07-wave-gloss' },
      { id: 'switch-mechanism', name: 'Механизм выключателя', image: '/images/seris/Механизмвыключателя.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-switch' },
      { id: 'outlet-220v', name: 'Розетка 220v', image: '/images/seris/Розетка220v.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-outlet' },
      { id: 'tv-outlet', name: 'Розетка телевизионная', image: '/images/seris/Розеткителевезионные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-tv' },
      { id: 'phone-outlet', name: 'Розетка телефонная', image: '/images/seris/Розеткителефонные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-phone' },
      { id: 'computer-outlet', name: 'Розетка компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
      { id: 'audio-video', name: 'Розетка аудио/видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
      { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
      { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
    ],
  },
  {
    id: '45x45',
    name: 'Серия 45х45',
    image: '/images/seris/45на45.png',
    subcategories: [
      { id: 'outlet', name: 'Розетка', image: '/images/seris/45на45.png', url: '/ElektroustnovohneIzdely/Donel/45x45-outlet' },
      { id: 'usb', name: 'USB зарядное устройство', image: '/images/seris/45на45 usb.webp', url: '/ElektroustnovohneIzdely/Donel/45x45-usb' },
      { id: 'rj45', name: 'RJ45', image: '/images/seris/45на45RJ45.webp', url: '/ElektroustnovohneIzdely/Donel/45x45-rj45' },
      { id: 'keystone', name: 'Keystone', image: '/images/seris/Keystone.webp', url: '/ElektroustnovohneIzdely/Donel/45x45-keystone' },
    ],
  },
  {
    id: 'w55',
    name: 'W55',
    image: '/images/seris/w55.png',
    description: 'Категория для W55',
    subcategories: [
      { id: 'w55', name: 'накладной монтаж', url: '/ElektroustnovohneIzdely/Donel/W55-nakladnoy', image: '/images/seris/w55.png' },
      { id: 'w55', name: 'встроенный монтаж', url: '/ElektroustnovohneIzdely/Donel/W55-vstroeniy', image: '/images/seris/w55vstrony.png' },
    ]
  },
];

export default function ColorDonelPage() {
  const [selectedSeries, setSelectedSeries] = useState(null as any);

  const handleSeriesClick = (series: any) => {
    setSelectedSeries(series);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSeries = () => setSelectedSeries(null);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="container mx-auto px-6 py-44 max-w-[88rem]">
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl text-white lg:text-7xl font-bold mb-4">Серия Donel</h1>
            <h2 className="text-sm text-white racking-widest mb-4">9 СОВРЕМЕННЫХ ОТТЕНКОВ ЦВЕТА</h2>
            <p className="text-base text-white mb-6 max-w-xl">Сдержанный скандинавский дизайн и высококачественные материалы элегантных цветов. Большая функциональная клавиша и тонкая рамка являются основными чертами дизайна, в котором функциональность стоит на первом месте.</p>

            <div className="space-y-4 max-w-xs">
              <a href='/ElektroustnovohneIzdely/Configurator' className="block bg-[#340b0b] text-white py-3 rounded-lg text-center">Конфигуратор Donel</a>
              <a className="block bg-[#340b0b] opacity-30 text-white py-3 rounded-lg text-center">Серии Donel</a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md">
              <Image src="/images/banners/bannersS08.jpeg" alt="Donel" width={600} height={420} className="object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-16 grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-sm">
            <Image src="/images/banners/bannersR98.jpg" alt="Donel feature" width={520} height={360} className="object-cover" />
          </div>
          <div>
            <h3 className="text-3xl text-white font-semibold mb-4">Особенности и характерные черты серии:</h3>
            <ul className="list-disc ml-6 space-y-2 text-sm  text-white">
              <li>Лаконичный дизайн</li>
              <li>Стильная цветовая палитра</li>
              <li>Размер рамки 82x82 мм</li>
              <li>Тонкая изящная рамка 8,8 мм</li>
              <li>Рамки от 1 до 5 постов</li>
              <li>Механизмы с самозажимными контактами</li>
              <li>10 лет гарантии на механизмы</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-start">
              <h2 className="text-5xl text-white font-semibold mb-6">Все серии Donel</h2>
              <p className="text-white text-sm md:text-base mb-3 md:mb-4 leading-relaxed">Выберите интересующую вас серию Donel, чтобы узнать всё о её цветах, механизмах и ценах.
Наша продукция представлена в нескольких популярных сериях, каждая из которых отличается дизайном, функциональностью и разнообразием цветовых решений.

Серия R98 – это стильная коллекция, выполненная в современном минималистичном дизайне. Для этой серии доступно 10 актуальных цветов, что позволяет легко подобрать решения как для классических интерьеров, так и для современных пространств. Механизмы отличаются надёжностью и продуманной эргономикой.

Серия A07 – одна из самых универсальных серий Donel. Она представлена в 11 цветах, включая как базовые оттенки, так и более яркие варианты. Отличительная черта серии – плавные линии и возможность сочетать рамки и механизмы под конкретный интерьер.

Серия A07 WAVE – это особая вариация коллекции A07. Она имеет оригинальный дизайн с волнообразными линиями, что придаёт интерьеру динамику и современный акцент. Отличный выбор для тех, кто ценит стильные и необычные решения.

Серия 45х45 – практичная и удобная линейка, которая отличается компактностью и универсальностью. Подходит для различных типов монтажа и идеально вписывается в пространства, где важна эргономика и точность размеров.

Серия S08 – сочетание современного дизайна и функциональности. Эта коллекция подчёркивает строгую геометрию форм и прекрасно подходит для интерьеров в стиле хай-тек или минимализм.

Каждая серия Donel имеет собственный набор рамок, механизмов и цветовых решений, что позволяет создавать индивидуальные комбинации для любого интерьера. Благодаря широкому выбору, вы сможете подобрать не только оптимальное по функциональности решение, но и подчеркнуть уникальный стиль вашего пространства.</p>
            </div>
            <div>
              {!selectedSeries ? (
            <div className="flex flex-col gap-4 md:gap-6">
              {donelSeries.map((series) => (
                <div key={series.id} className="group cursor-pointer h-full" onClick={() => handleSeriesClick(series)}>
                  <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                    <div className="flex flex-row items-center p-4 md:p-6 h-full min-h-[160px]">
                      <div className="flex-1 pr-4 md:pr-6 flex flex-col justify-center text-left">
                        <h3 className="text-xl sm:text-5xl w-[300px]   font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors duration-300">{series.name}</h3>
                        <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{series.description}</p>
                        <div className="flex items-center justify-start text-white">
                         
                          <span className="text-xs  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 md:text-sm">Смотреть серию</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-48 md:h-48 lg:w-[600px] lg:h-[600px]">
                        <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <Image src={series.image} alt={series.name} width={600} height={600} className="object-contain max-w-[600px] max-h-[600px]" />
                        </div>
                      </div>
                    </div>
                  </div>
               
                </div>
                
              ))}
              
            </div>
          ) : (
            <div className="py-4 md:py-8">
              <div className="mb-6 md:mb-8">
                <button onClick={handleBackToSeries} className="flex  text-white hover:text-red-500 mb-4 md:mb-6  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 transition-colors duration-300 text-sm md:text-base">
                  <svg className="w-4 h-4  md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Назад к сериям Donel
                </button>
                <div className="rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg p-2 flex items-center justify-center">
                      <Image src={selectedSeries.image} alt={selectedSeries.name} width={500} height={500} className="object-contain max-w-full max-h-full" />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{selectedSeries.name}</h2>
                      <p className="text-gray-400 text-sm md:text-base">{selectedSeries.subcategories?.length || 0} доступных вариантов</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2   sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-x-4 gap-y-8 md:gap-y-12 mb-8 md:mb-12">
                {selectedSeries.subcategories?.map((subcategory: any) => (
                  subcategory.isHeader ? (
                    <div key={subcategory.id} className="col-span-full pt-2"><h3 className="text-white uppercase text-5xl font-semibold">{subcategory.name}</h3></div>
                  ) : (
                    <Link key={subcategory.id} href={subcategory.url || '#'}>
                      <div className="group cursor-pointer">
                        <div className="rounded-lg transition-all duration-300 hover:border-red-500">
                          <div className="w-full    flex items-center justify-center p-0">
                            <Image src={subcategory.image || '/images/seris/placeholder.png'} alt={subcategory.name} width={800} height={800} className="w-full h-full object-contain  group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="mt-3"><h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center leading-tight text-xs sm:text-sm md:text-base tracking-wide">{subcategory.name}</h3></div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
