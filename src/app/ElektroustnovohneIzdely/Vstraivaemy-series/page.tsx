
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
    id: 'donel',
    name: 'Donel',
    image: '/images/banners/donelbannersseries.jpg',
    logo: '/images/brands/donellogo.svg',
    description: 'Инновационные решения для современного интерьера',
    series: [
      {
        id: 'r98',
        name: 'R98',
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
        ]
      },
      {
        id: 'n96',
        name: 'N96',
        image: '/images/seris/n96.png',
        description: 'Премиальная серия с металлическими покрытиями',
        subcategories: [
          { id: 'black', name: 'Черный', image: '/images/colors/черныйN96.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'white', name: 'Белый', image: '/images/colors/белыйn96.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'nickel', name: 'Никель', image: '/images//colors/никельn96.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'brass', name: 'Латунь', image: '/images/colors/латуньn96.png', url: '/ElektroustnovohneIzdely/Configurator' },
        ]
      },
      {
        id: 'r98-metal',
        name: 'R98 METAL',
        image: '/images/seris/r98metal.png',
        description: 'Эксклюзивная металлическая серия высшего качества',
        subcategories: [
          { id: 'brass', name: 'Латунь', image: '/images/colors/R98metalлатунь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'nickel', name: 'Никель', image: '/images/colors/R98metalникельь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/R98metalвороненаясталь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'blagodarnaya-stali', name: 'Благородная сталь', image: '/images/colors/R98metalблагороданясталь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'matovoy-gold', name: 'Матовое золото', image: '/images/colors/R98metalзолотоматовое.png', url: '/ElektroustnovohneIzdely/Configurator' },
        ]
      },
      {
        id: 'a07',
        name: 'A07',
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
          { id: 'computer-outlet', name: 'Компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
          { id: 'audio-video', name: 'Розетка аудио,видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
          { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
          { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
        ]
      },
      {
        id: 'a07-wave',
        name: 'A07 WAVE',
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
          { id: 'computer-outlet', name: 'Компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
          { id: 'audio-video', name: 'Розетка аудио,видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
          { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
          { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
        ]
      },
      {
        id: 'a07-natural',
        name: 'A07 NATURAL',
        image: '/images/seris/a07naturalmetal.png',
        subcategories: [
          { id: 'gold-aluminum', name: 'Золотистый алюминий', image: '/images/colors/золотистыйNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-gold' },
          { id: 'bronze-aluminum', name: 'Бронзовый алюминий', image: '/images/colors/бронзовыйNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-bronze' },
          { id: 'silver-aluminum', name: 'Серебристый алюминий', image: '/images/colors/серебристыйалюминийNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-silver' },
          { id: 'cosmo-aluminum', name: 'Космический алюминий', image: '/images/colors/космическийалюминийNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-cosmo' },
          { id: 'black-aluminum', name: 'Черный алюминий', image: '/images/colors/черныйалюминийNATURAL.png', url: '/ElektroustnovohneIzdely/Donel/A07-natural-black' },
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
        name: 'S08',
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
          { id: 'computer-outlet', name: 'Компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
          { id: 'audio-video', name: 'Розетка аудио,видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
          { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
          { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
        ]
      },
      {
        id: '45x45',
        name: '45х45',
        image: '/images/seris/45на45.png',
        subcategories: [
          { id: 'outlet', name: 'Розетка', image: '/images/seris/45на45.png', url: '/ElektroustnovohneIzdely/Donel/45x45-outlet' },
          { id: 'usb', name: 'USB зарядное устройство', image: '/images/seris/45на45 usb.webp', url: '/ElektroustnovohneIzdely/Donel/45x45-usb' },
          { id: 'rj45', name: 'RJ45', image: '/images/seris/45на45RJ45.webp', url: '/ElektroustnovohneIzdely/Donel/45x45-rj45' },
          { id: 'keystone', name: 'Keystone', image: '/images/seris/Keystone.webp', url: '/ElektroustnovohneIzdely/Donel/45x45-keystone' },
        ]
      },
    ]
  },
  {
    id: 'werkel',
    name: 'Werkel',
    image: '/images/banners/werkelbannersseries.jpg',
    logo: '/images/brands/werkellogo.png',
    description: 'Шведское качество и дизайн',
    series: [
      {
        id: 'standard-werkel',
        name: 'Встраиваемая серия',
        image: '/images/seris/ВстраиваемыесерииWerkel.webp',
        description: 'Классические встраиваемые изделия',
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
    image: '/images/banners/voltumbannersseries.jpg',
    logo: '/images/brands/voltumlogo.png',
    description: 'Технологии и стиль',
    series: [
      {
        id: 's70',
        name: 'S70',
        image: '/images/seris/S70.png',
        description: 'Кристаллическая серия в области электроустановочных изделий',
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

export default function ChtkPageNew() {
  const [activeBrandId, setActiveBrandId] = useState<string>(brandsData[0].id);
  const [activeSeriesId, setActiveSeriesId] = useState<string>(brandsData[0].series[0].id);

  const activeBrandIndex = brandsData.findIndex(b => b.id === activeBrandId);
  const activeBrand = brandsData[activeBrandIndex];
  
  // Calculate next brand for the background navigation
  const nextBrandIndex = (activeBrandIndex + 1) % brandsData.length;
  const nextBrand = brandsData[nextBrandIndex];

  const activeSeries = activeBrand.series.find(s => s.id === activeSeriesId) || (activeBrand.series.length > 0 ? activeBrand.series[0] : { id: 'none', name: 'Нет серий', image: '', subcategories: [] });

  const handleBrandChange = (id: string) => {
    setActiveBrandId(id);
    const newBrand = brandsData.find(b => b.id === id);
    if (newBrand && newBrand.series.length > 0) {
      setActiveSeriesId(newBrand.series[0].id);
    }
  };

  if (!activeBrand) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col pt-28 md:pt-36 overflow-x-hidden">
      <Head>
        <title>{activeSeries?.name} — {activeBrand?.name} Каталог</title>
        <meta name="description" content={`Каталог серий ${activeBrand?.name}`} />
      </Head>

      {/* --- TOP SECTION: Interactive Typography Navigation --- */}
      <div className="max-w-[1800px] mx-auto w-full px-4 lg:px-8 relative mb-8">
        <div className="relative w-full  select-none py-4 md:py-10">
           {/* Container for aligned text */}
           <div className="flex items-baseline whitespace-nowrap">
              
              {/* Active Brand Name (Huge, Dark, Foreground) */}
              <h1 className="text-[18vw] xl:text-[16rem] leading-none font-black text-black uppercase tracking-tighter relative z-20 transition-all duration-500 ease-in-out">
                {activeBrand.name}
              </h1>

              {/* Next Brand Name (Slightly Smaller, Faded, Background, Clickable) */}
              <button 
                onClick={() => handleBrandChange(nextBrand.id)}
                className="
                    group
                    text-[15vw] xl:text-[13rem] leading-none font-black text-gray-300 uppercase tracking-tighter
                    ml-[-4vw] /* Pull it behind the main text */
                    relative z-10 opacity-60
                    cursor-pointer hover:text-gray-400 hover:scale-[1.02] active:scale-95
                    transition-all duration-500 ease-out
                "
                aria-label={`Перейти к бренду ${nextBrand.name}`}
              >
                {nextBrand.name}
              </button>
           </div>
        </div>

        {/* --- MAIN HERO CARD (Overlapping the huge text slightly) --- */}
        {/* Added z-30 to ensure it sits on top of the text layers */}
        <div className="relative z-30 -mt-16 md:-mt-24 xl:-mt-32 w-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl p-8 md:p-12">
            <div className="absolute right-[-5%] top-[-10%] w-[40%] h-[120%] opacity-[0.03] pointer-events-none select-none">
                <Image src={activeBrand.logo} alt="" fill className="object-contain grayscale" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Серия</span>
                        <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">{activeBrand.name}</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-9xl font-bold text-black mb-6 tracking-tight">
                        {activeSeries?.name}
                    </h2>
                    <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                        {activeSeries?.description || activeBrand.description}
                    </p>
                </div>

                <div className="relative w-full md:w-[300px] h-[200px] md:h-[300px] shrink-0 flex justify-center md:justify-end items-center">
                    <div className="relative w-full h-full">
                       
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (Sidebar + Grid) --- */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full px-4 lg:px-8 py-8 lg:py-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* --- SIDEBAR (SERIES LIST) --- */}
          <aside className="lg:w-1/5 shrink-0">
             <div className="lg:sticky lg:top-24">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Коллекции {activeBrand.name}
                  </h2>
                </div>

                <div className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible no-scrollbar">
                  {activeBrand.series.map((series) => (
                    <button
                      key={series.id}
                      onClick={() => setActiveSeriesId(series.id)}
                      className={`
                        group flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-300 border
                        min-w-[220px] lg:min-w-0
                        ${activeSeriesId === series.id 
                          ? 'bg-white border-black ring-1 ring-black shadow-lg' 
                          : 'bg-white border-transparent hover:border-gray-200 hover:shadow-md'}
                      `}
                    >
                      <div className="relative w-12 h-12 shrink-0 bg-gray-50 rounded-lg overflow-hidden p-1">
                        <Image 
                          src={series.image} 
                          alt={series.name} 
                          fill 
                          className="object-contain mix-blend-multiply" 
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`font-semibold text-sm ${activeSeriesId === series.id ? 'text-black' : 'text-gray-600 group-hover:text-black'}`}>
                          {series.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                           {series.subcategories.length} товаров
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
             </div>
          </aside>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 min-w-0 animate-fade-in">
            {/* PRODUCT GRID */}
            <div>
               <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    Ассортимент
                  </h3>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                 {activeSeries?.subcategories.map((sub) => {
                    if (sub.isHeader) {
                      return (
                        <div key={sub.id} className="col-span-full pt-8 pb-2 border-b border-gray-100 mb-6 mt-4">
                           <h4 className="text-sm font-bold text-black uppercase tracking-widest pl-2 border-l-4 border-black">
                              {sub.name}
                           </h4>
                        </div>
                      );
                    }
                    return (
                      <Link key={sub.id} href={sub.url || '#'} className="group block">
                         <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-200">
                           <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Смотреть</span>
                           </div>

                           <div className="absolute inset-4 flex items-center justify-center bg-white">
                             <div className="relative w-full h-full">
                                <Image
                                  src={sub.image || '/images/placeholder.png'}
                                  alt={sub.name}
                                  fill
                                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                             </div>
                           </div>
                         </div>
                         
                         <div className="px-1 text-center md:text-left">
                           <h4 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                             {sub.name}
                           </h4>
                         </div>
                      </Link>
                    )
                 })}
               </div>

               {activeSeries?.subcategories.length === 0 && (
                 <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                   В этой категории пока нет товаров.
                 </div>
               )}
            </div>

          </div>
        </div>
      </main>

    </div>
  )
}