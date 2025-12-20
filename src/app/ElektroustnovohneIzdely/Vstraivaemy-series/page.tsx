
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

// --- Data ---
const brandsData: Brand[] = [
  {
    id: 'donel',
    name: 'Donel',
    image: '/images/banners/donelbannersseries.jpg',
    logo: '/images/brands/donellogo.svg',
    description: '',
    series: [
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
        ]
      },
      {
        id: 'n96',
        name: 'Серия N96',
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
        name: 'Серия R98 METAL',
        image: '/images/seris/r98metal.png',
        description: 'Эксклюзивная металлическая серия высшего качества',
        subcategories: [
          { id: 'brass', name: 'Латунь', image: '/images/colors/R98metalлатунь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'nickel', name: 'Никель', image: '/images/colors/R98metalникель.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/R98metalвороненаясталь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'blagodarnaya-stali', name: 'Благородная сталь', image: '/images/colors/R98metalблагороданясталь.png', url: '/ElektroustnovohneIzdely/Configurator' },
          { id: 'matovoy-gold', name: 'Матовое золото', image: '/images/colors/R98metalзолотоматовое.png', url: '/ElektroustnovohneIzdely/Configurator' },
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
          { id: 'computer-outlet', name: 'Компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
          { id: 'audio-video', name: 'Розетка аудио,видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
          { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
          { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
        ]
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
          { id: 'computer-outlet', name: 'Компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
          { id: 'audio-video', name: 'Розетка аудио,видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
          { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
          { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
        ]
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
          { id: 'computer-outlet', name: 'Компьютерная', image: '/images/seris/Розеткикомпьютерные.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-computer' },
          { id: 'audio-video', name: 'Розетка аудио,видео', image: '/images/seris/Розеткиаудиовидео.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-audio-video' },
          { id: 'cable-outlets', name: 'Кабельные выводы и заглушки', image: '/images/seris/Кабельные выводы и заглушки.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-cable-outlet' },
          { id: 'usb-power-supply', name: 'Источники питания USB', image: '/images/seris/РозеткиUSB.webp', url: '/ElektroustnovohneIzdely/Donel/Mechanisms-power-supply' },
        ]
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
        ]
      },
    ]
  },
  {
    id: 'werkel',
    name: 'Werkel',
    image: '/images/banners/werkelbannersseries.jpg',
    logo: '/images/brands/werkellogo.png',
    description: '',
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
    description: '',
    series: [
      {
        id: 's70',
        name: 'Серия S70',
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

export default function ChtkPage() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedBrand, selectedSeries]);

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setSelectedSeries(null);
  };

  const handleSeriesClick = (series: Series) => {
    setSelectedSeries(series);
  };

  const handleBackToBrands = () => {
    setSelectedBrand(null);
    setSelectedSeries(null);
  };

  const handleBackToSeries = () => {
    setSelectedSeries(null);
  };

  // --- RENDERING LEVEL 1: Full Screen 3-Part Brand Split ---
  if (!selectedBrand) {
    return (
      <div className="min-h-screen bg-white">
        <Head>
          <title>Выберите бренд — Donel, Werkel, Voltum</title>
          <meta name="description" content="Каталог встраиваемых серий электроустановочных изделий" />
        </Head>

        {/* Full-width container that splits into 3 columns on desktop */}
        <div className="w-full flex flex-col lg:flex-row min-h-screen">
          {brandsData.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand)}
              className="group relative flex-1 min-h-[50vh] lg:h-screen overflow-hidden cursor-pointer border-r border-gray-100 last:border-0"
            >
              {/* Background Image (Scales on hover) */}
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                {/* Logo Area */}
                <div className="mb-6 relative w-48 h-16 md:w-64 md:h-20 transition-transform duration-500 group-hover:-translate-y-2">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain drop-shadow-sm"
                  />
                </div>

                {/* --- ОПИСАНИЕ УДАЛЕНО ЗДЕСЬ --- */}

                {/* Call to Action Button (Appears/Moves up on hover) */}
                <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="inline-flex items-center px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-black transition-colors shadow-lg">
                    Перейти в каталог
                    
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDERING LEVEL 2 & 3: Standard Container Layout ---
  return (
    <div className="min-h-screen text-gray-900 bg-white font-sans animate-fade-in">
      <Head>
        <title>{selectedSeries ? selectedSeries.name : `Серии ${selectedBrand.name}`} — Elektromos</title>
      </Head>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="text-center max-w-5xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-normal text-gray-900 mb-4 tracking-tight">
            {selectedSeries ? selectedSeries.name : `Серии ${selectedBrand.name}`}
          </h1>
          <div className="w-16 h-1 bg-gray-900 mx-auto opacity-20 mb-6"></div>
          
          <div className="text-gray-500 font-light text-base md:text-lg">
             {selectedSeries ? selectedSeries.description : selectedBrand.description}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          
          {selectedSeries ? (
            // ==========================================
            // LEVEL 3: Subcategories (Products)
            // ==========================================
            <div>
               <button
                  onClick={handleBackToSeries}
                  className="inline-flex items-center text-gray-500 hover:text-black mb-10 transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Назад к сериям
                </button>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
                {selectedSeries.subcategories?.map((subcategory) => (
                   subcategory.isHeader ? (
                    <div key={subcategory.id} className="col-span-full pt-10 pb-4 border-b border-gray-100 mb-6 mt-6">
                      <h3 className="text-gray-900 uppercase text-2xl font-light tracking-[0.2em] text-center md:text-left">{subcategory.name}</h3>
                    </div>
                  ) : (
                    <Link key={subcategory.id} href={subcategory.url || '#'}>
                      <div className="group cursor-pointer flex flex-col h-full">
                        {/* Image Box */}
                        <div className="bg-[#f7f7f7] rounded-xl aspect-square flex items-center justify-center p-6 mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:bg-white border border-transparent group-hover:border-gray-100">
                          <div className="relative w-full h-full">
                            <Image
                              src={subcategory.image || '/images/seris/placeholder.png'}
                              alt={subcategory.name}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>
                        {/* Text */}
                        <div className="text-center mt-auto">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                            {subcategory.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>

          ) : (
            // ==========================================
            // LEVEL 2: Series List
            // ==========================================
            <div>
                <button
                  onClick={handleBackToBrands}
                  className="inline-flex items-center text-gray-500 hover:text-black mb-10 transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Все бренды
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {selectedBrand.series.map((series) => (
                    <div
                        key={series.id}
                        onClick={() => handleSeriesClick(series)}
                        className="group relative bg-[#f7f7f7] hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden min-h-[280px] p-8 flex flex-row justify-between shadow-sm hover:shadow-xl"
                    >
                        {/* Left Side: Text & Arrow */}
                        <div className="flex flex-col justify-between z-10 w-1/2">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-3 group-hover:text-black">
                                    {series.name}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-[90%]">
                                    {series.description}
                                </p>
                            </div>
                            
                            {/* Arrow Icon at Bottom Left */}
                            <div className="mt-8 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="inline-flex items-center text-sm font-semibold uppercase tracking-wider border-b border-black pb-1">
                                  Смотреть
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Image */}
                        <div className="w-1/2 flex items-center justify-end md:justify-center relative">
                            <div className={`relative w-40 h-40 md:w-56 md:h-56 transition-transform duration-500 group-hover:scale-110 ${selectedBrand.id === 'werkel' ? 'scale-90' : ''}`}>
                                <Image
                                    src={series.image}
                                    alt={series.name}
                                    fill
                                    className="object-contain drop-shadow-lg"
                                />
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
  );
}