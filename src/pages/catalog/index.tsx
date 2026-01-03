
'use client'

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Link from 'next/link';
import Header from '@/components/Header';
import 'tailwindcss/tailwind.css';
import Footer from '@/components/Footer';
import { ProductI } from '@/types/interfaces';
import Pagination from '@/components/PagintaionComponentsxCatalog';
import SEO from '@/components/SEO';
import CatalogOfProductSearch from '@/components/catalogofsearch';

// --- ТИПЫ ---
export type Category = {
  label: string;
  searchName: string;
  href?: string;
  aliases?: string[];
  subcategories?: Category[];
  isOpen?: boolean;
  isHeatingCategory?: boolean;
  id?: string;
};

export type Brand = {
  name: string;
  categories: Category[];
};

export type PopularSearch = {
  text: string;
  queryParam: string;
  forCategories?: string[];
  forBrands?: string[];
};

// --- КАТЕГОРИИ ---
const productCategories: Category[] = [
  {
    id: 'lyustra',
    label: 'Люстра',
    searchName: 'Люстра',
    subcategories: [
      { label: 'Люстра подвесная', searchName: 'Подвесная люстра', aliases: ['Люстра подвесная', 'Подвесная люстра', 'Подвесной светильник', 'Светильник подвесной'] },
      { label: 'Люстра потолочная', searchName: 'Потолочная люстра', aliases: ['Люстра потолочная', 'Потолочная люстра', 'Потолочный светильник'] },
      { label: 'Люстра на штанге', searchName: 'Люстра на штанге', aliases: ['Люстра на штанге', 'Светильник на штанге'] },
      { label: 'Люстра каскадная', searchName: 'Люстра каскадная', aliases: ['Люстра каскадная', 'Каскадная люстра', 'Каскадный светильник'] },
      { label: 'Люстра хрустальная', searchName: 'хрусталь Люстра', aliases: ['Люстра хрустальная', 'Хрустальная люстра', 'Хрустальный светильник'] },
    ],
    isOpen: false
  },
  {
    id: 'svetilnik',
    label: 'Светильники',
    searchName: 'Светильники',
    aliases: ['Светильники', 'Светильник', 'Светильники для дома', 'Осветительные приборы'],
    subcategories: [
      { label: 'Потолочный светильник', searchName: 'Потолочный светильник', aliases: ['Потолочный светильник', 'Светильник потолочный', 'Накладной потолочный', 'Потолочное освещение'] },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник', aliases: ['Подвесной светильник', 'Светильник подвесной', 'Подвесной', 'Подвес'] },
      { label: 'Настенный светильник', searchName: 'Настенный светильник', aliases: ['Настенный светильник', 'Светильник настенный', 'Настенный', 'Настенный светильник'] },
      { label: 'Встраиваемый светильник', searchName: 'Светильник встраиваемый', aliases: ['Встраиваемый светильник', 'Светильник встраиваемый', 'Встроенный светильник', 'Точечный встраиваемый'] },
      { label: 'Накладной светильник', searchName: 'Светильник накладной', aliases: ['Накладной светильник', 'Светильник накладной', 'Накладной', 'Светильник наружный'] },
      { 
        label: 'Трековый светильник', 
        searchName: 'Трековый светильник', 
        aliases: ['Трековый светильник', 'трековый светильник', 'светильник трековый', 'Трек светильник', 'Светильник для шинопровода'],
        subcategories: [
            { label: 'Магнитный трековый светильник', searchName: 'Магнитный трековый светильник', aliases: [] },
            { label: 'Умный трековый светильник', searchName: 'Умный трековый светильник', aliases: [] },
            { label: 'Уличный трековый светильник', searchName: 'Уличный трековый светильник', aliases: [] },
        ]
      },
      { label: 'Точечный светильник', searchName: 'Точечный светильник', aliases: ['Точечный светильник', 'Спот', 'Светильник точечный', 'Даунлайты'] },
    ],
    isOpen: false
  },
  { id: 'bra', label: 'Бра', searchName: 'Настенный светильник', aliases: ['Настенный светильник', "7"], isOpen: false },
  { id: 'torsher', label: 'Торшер', searchName: 'Торшер', aliases: ['Торшер', 'Напольный светильник', 'Светильник напольный', 'Напольная лампа', 'Торшерный светильник'], isOpen: false },
  { id: 'nastolnaya', label: 'Настольная лампа', searchName: 'Настольная лампа', aliases: ['Настольная лампа', 'Лампа настольная', 'Настольный светильник', 'Светильник настольный', 'Лампа для стола'], isOpen: false },
  { id: 'led-lamp', label: 'Светодиодная лампа', searchName: 'Светодиодная лампа', aliases: ['LED лампа', 'лампа светодиодная', 'лампа LED', 'LED bulb'], isOpen: false },
  // { id: 'profil', label: 'Профили', searchName: 'Профиль', aliases: ['Профиль для ленты', 'Алюминиевый профиль', 'Профиль для светодиодной ленты', 'LED профиль'], isOpen: false },
  { id: 'lenta', label: 'Светодиодная лента', searchName: 'Светодиодная лента', aliases: ['Светодиодная лента', 'LED лента', 'Лента светодиодная', 'LED подсветка', 'Светодиодная подсветка'], isOpen: false },
  {
    id: 'ulichni', label: 'Уличный светильник', searchName: 'Уличный светильник',
    subcategories: [
      { label: 'Настенный уличный светильник', searchName: 'Настенный уличный светильник' },
      { label: 'Грунтовый светильник', searchName: 'Грунтовый светильник' },
      { label: 'Ландшафтный светильник', searchName: 'Ландшафтный светильник' },
      { label: 'Парковый светильник', searchName: 'Парковый светильник' },
    ],
    isOpen: false
  },
  {
    id: 'komplektuyushie', label: 'Комплектующие', searchName: 'Комплектующие', aliases: ['Комплектующие', 'Комплектующие для светильников', 'Комплектующие для освещения', 'Запчасти для светильников'],
    subcategories: [
      { label: 'Коннекторы', searchName: 'Коннектор', aliases: ['Коннектор', 'Коннекторы для светильников', 'Коннекторы для освещения', 'Соединители'] },
      { label: 'Шнуры', searchName: 'Шнур', aliases: ['Шнур', 'Шнуры для светильников', 'Провода для светильников', 'Кабели питания'] },
      { label: 'Блок питания', searchName: 'Блок питания', aliases: ['Блок питания', 'Трансформатор', 'Драйвер', 'Источник питания для светильников'] },
      { label: 'Патроны', searchName: 'Патрон', aliases: ['Патрон', 'Патроны для ламп', 'Цоколи', 'Держатели ламп'] },
      { label: 'Крепления', searchName: 'Крепление для светильников', aliases: ['Крепление для светильников', 'Монтажные элементы', 'Фурнитура для светильников', 'Планки крепежные'] },
      { label: 'Плафоны', searchName: 'Плафон', aliases: ['Плафон', 'Абажур', 'Стеклянный плафон', 'Рассеиватель света'] },
      { label: 'Профили', searchName: 'Профиль', aliases: ['Профиль для ленты','Алюминиевый профиль', 'Профиль для светодиодной ленты', 'Алюминиевый профиль', 'LED профиль'] },
      { label: 'Контроллеры', searchName: 'Контроллер для светодиодной ленты', aliases: ['Контроллер для светодиодной ленты', 'LED контроллер', 'RGB контроллер', 'Диммер'] }
    ],
    isOpen: false
  },
];

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

const brandSlugToName: Record<string, string> = {
  lightstar: 'LightStar', maytoni: 'Maytoni', novotech: 'Novotech', lumion: 'Lumion', artelamp: 'Artelamp', denkirs: 'Denkirs', donel: 'Donel', stluce: 'Stluce', kinklight: 'KinkLight', sonex: 'Sonex', odeonlight: 'OdeonLight', favourite: 'Favourite'
};

// ОБНОВЛЕННЫЙ СПИСОК ПУТЕЙ
const categoryPathToName: Record<string, string> = {
  'chandeliers': 'Люстра', 
  'chandeliers/pendant-chandeliers': 'Подвесная люстра', 
  'chandeliers/ceiling-chandeliers': 'Потолочная люстра', 
  'chandeliers/rod-chandeliers': 'Люстра на штанге', 
  'chandeliers/cascade-chandeliers': 'Люстра каскадная', 
  'chandeliers/crystal-chandeliers': 'хрусталь Люстра', 
  'ceiling-fans': 'Люстра вентилятор', 
  'lights': 'Светильники', 
  'lights/ceiling-lights': 'Потолочный светильник', 
  'lights/pendant-lights': 'Подвесной светильник', 
  'lights/wall-lights': 'Настенный светильник', 
  'lights/recessed-lights': 'Светильник встраиваемый', 
  'lights/surface-mounted-lights': 'Светильник накладной', 
  'lights/track-lights': 'Трековый светильник',  
  'lights/spot-lights': 'Точечный светильник', 
  'wall-sconces': 'Настенный светильник', 
  'floor-lamps': 'Торшер', 
  'lights/track-lights/smart': 'Умный трековый светильник',
  'lights/track-lights/outdoor': 'Уличный трековый светильник',
  'lights/magnit-track-lights': 'Магнитный трековый светильник', 
  'table-lamps': 'Настольная лампа', 
  // ДОБАВЛЕНЫ ПУТИ ДЛЯ ПРОФИЛЕЙ:
  'led-strip-profiles': 'Профиль', 
  'led-profiles': 'Профиль',
  'profiles': 'Профиль',
  'aluminum-profiles': 'Профиль',
  // ---------------------------
  'led-strips': 'Светодиодная лента', 
  'led-lamp': 'Светодиодная лампа', 
  'outdoor-lights': 'Уличный светильник', 
  'outdoor-lights/outdoor-wall-lights': 'Настенный уличный светильник', 
  'outdoor-lights/ground-lights': 'Грунтовый светильник', 
  'outdoor-lights/landscape-lights': 'Ландшафтный светильник', 
  'outdoor-lights/park-lights': 'Парковый светильник', 
  'accessories': 'Комплектующие', 
  'accessories/connectors': 'Коннектор', 
  'accessories/cords': 'Шнур', 
  'accessories/power-supplies': 'Блок питания', 
  'accessories/lamp-holders': 'Патрон', 
  'accessories/mounting': 'Крепление для светильников', 
  'accessories/lampshades': 'Плафон', 
  'accessories/controllers': 'Контроллер для светодиодной ленты'
};

const resolveSlug = (slugParam: any): { detectedSource?: string; detectedCategory?: string; detectedPage: number } => {
  if (!slugParam) return { detectedPage: 1 };
  let slugArray = Array.isArray(slugParam) ? [...slugParam] : [slugParam as string];
  if (slugArray.length === 0) return { detectedPage: 1 };
  let detectedPage = 1;
  const lastSegment = slugArray[slugArray.length - 1];
  if (lastSegment && !isNaN(parseInt(lastSegment, 10)) && isFinite(Number(lastSegment))) {
    detectedPage = parseInt(lastSegment, 10);
    slugArray.pop();
  }
  let detectedSource: string | undefined;
  let detectedCategory: string | undefined;
  if (slugArray.length > 0) {
    const first = slugArray[0];
    const joined = slugArray.join('/');
    if (categoryPathToName[joined]) detectedCategory = categoryPathToName[joined];
    else if (brandSlugToName[first] && slugArray.length > 1) {
      const rest = slugArray.slice(1).join('/');
      detectedSource = brandSlugToName[first];
      if (categoryPathToName[rest]) detectedCategory = categoryPathToName[rest];
    } else if (brandSlugToName[first]) detectedSource = brandSlugToName[first];
    else if (categoryPathToName[first]) detectedCategory = categoryPathToName[first];
  }
  return { detectedSource, detectedCategory, detectedPage };
};

const isLightingContext = (selectedCategory: Category | null, source: string | undefined): boolean => {
  if (selectedCategory) {
    const lightingCategories = [
      'Люстра', 'Светильник', 'Бра', 'Торшер', 'Спот', 'Подвесной',
      'Подвесная', 'Потолочный', 'Настенный', 'Настольный', 'Лампа',
      'Комплектующие', 'Коннектор', 'Шнур', 'Блок питания', 'Патрон',
      'Крепление', 'Плафон', 'Профиль', 'Контроллер'
    ];
    return lightingCategories.some(lightingCategory =>
      selectedCategory.label.includes(lightingCategory) ||
      selectedCategory.searchName?.includes(lightingCategory)
    );
  }
  return source !== 'heating';
};

const filterBrandsForLighting = (brands: Brand[], isLighting: boolean): Brand[] => {
  if (!isLighting) return brands;
  const hiddenBrands = ['Werkel', 'Voltum', 'ЧТК'];
  return brands.filter(brand => !hiddenBrands.includes(brand.name));
};

const brands: Brand[] = [
  {
    name: 'Artelamp',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Люстра подвесная', searchName: 'Подвесная люстра' },
      { label: 'Люстра на штанге', searchName: 'Люстра на штанге' },
      { label: 'Каскадная люстра', searchName: 'Каскадная люстра' },
      { label: 'Люстра потолочная', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Торшеры', searchName: 'Торшер' },
      { label: 'Потолочный Светильник', searchName: 'Потолочный Светильник' },
      { label: 'Трековый светильник', searchName: 'трековый светильник' },
      { label: 'Врезной Светильник', searchName: 'Врезной Светильник' },
      { label: 'Споты', searchName: 'Спот' },
      { label: 'Уличный настенный светильник', searchName: 'Уличный настенный светильник' },
      { label: 'Настольный Светильник', searchName: 'Настольный Светильник' },
      { label: 'Подвесной светильник', searchName: 'Подвес' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
      { label: 'Комплектующие', searchName: 'Комплектующие' },
      { label: 'Коннекторы', searchName: 'Коннектор' },
      { label: 'Патроны', searchName: 'Патрон' },
      { label: 'Крепления', searchName: 'Крепление для светильников' },
      { label: 'Плафоны', searchName: 'Плафон' },
      { label: 'Профили для ленты', searchName: 'Профиль' },
    ],
  },
  {
    name: 'Donel',
    categories: [
      { label: 'Профили', searchName: 'Профиль', aliases: ['Профиль для ленты', 'Профиль для светодиодной ленты', 'Алюминиевый профиль', 'LED профиль'] },
    ],
  },
  {
    name: 'Favourite',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Потолочный Светильник', searchName: 'Потолочный Светильник' },
      { label: 'Трековый светильник', searchName: 'трековый светильник' },
      { label: 'Врезной Светильник', searchName: 'Врезной Светильник' },
      { label: 'Споты', searchName: 'Спот' },
      { label: 'Настенный Светильник', searchName: 'Настенный Светильник' },
      { label: 'Люстра потолочные', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Напольный Светильник', searchName: 'Напольный Светильник' },
      { label: 'Настольный Светильник', searchName: 'Настольный Светильник' },
      { label: 'Подвесной светильник', searchName: 'Подвес' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
      { label: 'Комплектующие', searchName: 'Комплектующие' },
      { label: 'Патроны', searchName: 'Патрон' },
      { label: 'Плафоны', searchName: 'Плафон' },
    ],
  },
  {
    name: 'Lumion',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Потолочный Светильник', searchName: 'Потолочный Светильник' },
      { label: 'Подвесное крепление', searchName: 'Подвесное крепление' },
      { label: 'Настольная лампа', searchName: 'Интерьерная настольная лампа' },
      { label: 'Споты', searchName: 'Спот' },
      { label: 'Люстры потолочная', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Настенный светильник', searchName: 'Настенный светильник' },
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Торшеры', searchName: 'Торшер' },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник' },
      { label: 'Комплектующие', searchName: 'Комплектующие' },
      { label: 'Коннекторы', searchName: 'Коннектор' },
      { label: 'Крепления', searchName: 'Крепление для светильников' },
    ],
  },
  {
    name: 'LightStar',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Люстра потолочная', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Бра RAMO', searchName: 'Бра RAMO' },
      { label: 'Бра STREGARO', searchName: 'Бра STREGARO' },
      { label: 'Бра RAGNO', searchName: 'Бра RAGNO' },
      { label: 'Бра CILINO', searchName: 'Бра CILINO' },
      { label: 'Бра ZETA', searchName: 'Бра ZETA' },
      { label: 'Бра TUBO', searchName: 'Бра TUBO' },
      { label: 'Бра FAVO', searchName: 'Бра FAVO' },
      { label: 'Бра EXTRA', searchName: 'Бра EXTRA' },
      { label: 'Бра SIENA', searchName: 'Бра SIENA' },
      { label: 'Бра PALLA', searchName: 'Бра PALLA' },
      { label: 'Настольная лампа', searchName: 'Настольная лампа' },
      { label: 'Светильник точечный', searchName: 'Светильник точечный ' },
      { label: 'Встраиваемый светильник', searchName: 'Встраиваемый светильник' },
      { label: 'Трековый светильник', searchName: 'Трековый светильник' },
      { label: 'Подвесной светильник', searchName: 'Светильник подвесной' },
      { label: 'Соединитель', searchName: 'Соединитель' },
      { label: 'Комплектующие', searchName: 'Комплектующие' },
      { label: 'Патроны', searchName: 'Патрон' },
      { label: 'Крепления', searchName: 'Крепление для светильников' },
      { label: 'Плафоны', searchName: 'Плафон' },
      { label: 'Блок питания', searchName: 'Блок питания' },
      { label: 'Профили для ленты', searchName: 'Профиль' },
    ],
  },
  {
    name: 'OdeonLight',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Люстра каскадная', searchName: 'Люстра каскадная' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Потолочный Светильник', searchName: 'Потолочный Светильник' },
      { label: 'Споты', searchName: 'Спот' },
      { label: 'Настенный Светильник', searchName: 'Настенный Светильник' },
      { label: 'Люстра потолочная', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Напольный Светильник', searchName: 'Напольный Светильник' },
      { label: 'Настольный Светильник', searchName: 'Настольный Светильник' },
      { label: 'Подвесной светильник', searchName: 'Подвес' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
    ],
  },
  {
    name: 'Maytoni',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Freya', searchName: 'Freya' },
      { label: 'Technical', searchName: 'Technical' },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник' },
      { label: 'Трековый светильник', searchName: 'Трековый светильник' },
      { label: 'Встраиваемый светильник', searchName: 'Встраиваемый светильник' },
      { label: 'Потолочный светильник', searchName: 'Потолочный светильник' },
      { label: 'Настенный светильник', searchName: 'Настенный светильник' },
      { label: 'Ландшафтный светильник', searchName: 'Ландшафтный светильник' },
      { label: 'Светодиодная лента', searchName: 'Светодиодная лента' },
      { label: 'Люстра потолочная', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Торшеры', searchName: 'Торшер' },
      { label: 'Парковый светильник', searchName: 'Парковый светильник' },
    ],
  },
  {
    name: 'Sonex',
    categories: [
      { label: 'Люстра-вентилятор', searchName: 'Люстра-вентилятор', aliases: ['Люстра-вентилятор'] },
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Подвесное крепление', searchName: 'Подвесное крепление' },
      { label: 'Светильники MERTO', searchName: 'MERTO' },
      { label: 'Светильники LASSA', searchName: 'LASSA' },
      { label: 'Светильники PIN', searchName: 'PIN' },
      { label: 'Светильники MITRA', searchName: 'MITRA' },
      { label: 'Светильники PALE', searchName: 'PALE' },
      { label: 'Светильники VAKA', searchName: 'VAKA' },
      { label: 'Светильники MINI', searchName: 'MINI' },
      { label: 'Светильники COLOR', searchName: 'COLOR' },
      { label: 'Светильники SNOK', searchName: 'SNOK' },
      { label: 'Светильники BASICA', searchName: 'BASICA' },
      { label: 'Светильники MARON', searchName: 'MARON' },
      { label: 'Светильники AVRA', searchName: 'AVRA' },
      { label: 'Светильники TAN', searchName: 'TAN' },
      { label: 'Светильники PICO', searchName: 'PICO' },
      { label: 'Бра', searchName: 'Бра' },
    ],
  },
  {
    name: 'ElektroStandard',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Встраиваемый точечный светильник', searchName: 'Встраиваемый точечный светильник' },
      { label: 'Светильник встраиваемый', searchName: 'Светильник встраиваемый' },
      { label: 'Накладной точечный светильник', searchName: 'Накладной точечный светильник' },
      { label: 'Накладной светильник', searchName: 'Накладной светильник' },
      { label: 'Накладной акцентный светильник', searchName: 'Накладной акцентный светильник' },
      { label: 'Встраиваемый поворотный светодиодный светильник', searchName: 'Встраиваемый поворотный светодиодный светильник' },
      { label: 'Накладной поворотный светодиодный светильник ', searchName: 'Накладной поворотный светодиодный светильник ' },
      { label: 'Трековая система Line Magnetic', searchName: 'Line Magnetic' },
    ],
  },
  {
    name: 'Novotech',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Трековый светодиодный светильник', searchName: 'Трековый светодиодный светильник' },
      { label: 'Светильник трековый однофазный трехжильный', searchName: 'Светильник трековый однофазный трехжильный' },
      { label: 'Светильник накладной', searchName: 'Светильник накладной' },
      { label: 'Стандартный встраиваемый светильник', searchName: 'Встраивамый стандартный светильник' },
      { label: 'Светильник встраиваемый', searchName: 'Светильник встраиваемый' },
      { label: 'Ландшафтный настенный светильник', searchName: 'Ландшафтный настенный светильник' },
      { label: 'Подвес для светильников', searchName: 'подвес для светильников' },
      { label: 'Светильник подвесной диммируемый', searchName: 'Светильник подвесной диммируемый' },
      { label: 'Светильник подвесной', searchName: 'Светильник подвесной' },
      { label: 'Светильник без драйвера ', searchName: 'Светильник без драйвера ' },
      { label: 'Трековый светильник', searchName: 'Трековый светильник' },
    ],
  },
  {
    name: 'Denkirs',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Встраиваемый светильник', searchName: 'Встраиваемый светильник' },
      { label: 'Светильник встраиваемый в стену', searchName: 'Светильник встраиваемый в стену' },
      { label: 'Линейный светильник', searchName: 'Линейный светильник' },
      { label: 'Грунтовый светильник', searchName: 'Грунтовый светильник' },
      { label: 'Настенный уличный светильник', searchName: 'Настенный уличный светильник' },
      { label: 'Повортный встраиваемый светильник', searchName: 'Повортный встраиваемый светильник' },
      { label: 'Светильник на магните', searchName: 'Светильник на магните' },
      { label: 'Светильник для трека ремня', searchName: 'DK55' },
      { label: 'Светильник для трека', searchName: 'Светильник для трека' },
      { label: 'Накладной светильник', searchName: 'Светильник накладной' },
      { label: 'Акцентный светильник', searchName: 'Акцентный светильник' },
      { label: 'Повортный светильник для трека', searchName: 'Повортный светильник для трека' },
      { label: 'Трековый светильник', searchName: 'Трековый светильник' },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник' },
      { label: 'Угловой светильник', searchName: 'Угловой светильник' },
      { label: 'Ландшафтный светильник', searchName: 'Ландшафтный светильник' },
      { label: 'Коннектор соединитель гибкий наконечник', searchName: 'TR' },
      { label: 'Бра', searchName: 'DK50' },
    ],
  },
  {
    name: 'KinkLight',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Настольная лампа', searchName: 'Настольная лампа' },
      { label: 'Люстра', searchName: 'Люстра' },
      { label: 'Торшер', searchName: 'Торшер' },
      { label: 'Люстра потолочная', searchName: 'Люстра', aliases: ['Потолочная люстра'] },
      { label: 'Настенный Светильник', searchName: 'Настенный Светильник' },
      { label: 'Светильник уличный', searchName: 'Светильник уличный' },
      { label: 'Подвес', searchName: 'Подвес' },
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Трековый светильник', searchName: 'трековый светильник' },
    ],
  },
  {
    name: 'StLuce',
    categories: [
      { label: 'Все товары', searchName: 'Все товары' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Торшеры', searchName: 'Торшер' },
      { label: 'Люстра потолочная', searchName: 'Люстра потолочная' },
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Настенно-потолочный светильник', searchName: 'Настенно-потолочный светильник' },
      { label: 'Настольный Светильник', searchName: 'Настольный Светильник' },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник' },
    ],
  },
];

brands[0].categories = [
  { label: 'Все товары', searchName: 'Все товары' },
  ...productCategories.map(cat => ({ label: cat.label, searchName: cat.searchName, aliases: [] }))
];

interface CatalogIndexProps {
  initialProducts: ProductI[];
  initialTotalPages: number;
  initialTotalProducts: number;
  source?: string;
}

const fetchProductsWithSorting = async (brandStr: string, params: Record<string, any> = {}, signal?: AbortSignal) => {
  try {
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${encodeURIComponent(brandStr)}`;
    if (params.name && typeof params.name === 'string') {
      const lightingCategories = [
        'Люстра', 'Светильник', 'Бра', 'Торшер', 'Спот', 'Подвесной',
        'Подвесная', 'Потолочный', 'Настенный', 'Настольный', 'Лампа',
        'Комплектующие', 'Коннектор', 'Шнур', 'Блок питания', 'Патрон',
        'Крепление', 'Плафон', 'Профиль', 'Контроллер'
      ];
      const isLightingCategory = lightingCategories.some(lightingCategory =>
        params.name.includes(lightingCategory)
      );
      if (isLightingCategory && brandStr === 'heating') {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/Все товары`;
      }
    }

    const { data } = await axios.get(apiUrl, {
      params,
      signal,
      timeout: 30000,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (data && data.products && data.products.length > 0 && params.sortBy === 'price') {
      const sortedPrices = [...data.products].sort((a: any, b: any) =>
        params.sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
      if (data.products[0].price !== sortedPrices[0].price) {
        data.products = sortedPrices;
      }
    }

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      throw new Error(`Превышено время ожидания запроса (таймаут).`);
    }
    if (axios.isCancel(error)) {
      throw error;
    }
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      if (params.name && typeof params.name === 'string') {
        const lightingCategories = [
          'Люстра', 'Светильник', 'Бра', 'Торшер', 'Спот', 'Подвесной',
          'Подвесная', 'Потолочный', 'Настенный', 'Настольный', 'Лампа',
          'Комплектующие', 'Коннектор', 'Шнур', 'Блок питания', 'Патрон',
          'Крепление', 'Плафон', 'Профиль', 'Контроллер'
        ];
        const isLightingCategory = lightingCategories.some(lightingCategory =>
          params.name.includes(lightingCategory)
        );
        if (isLightingCategory) {
          return { products: [], totalPages: 1, totalProducts: 0 };
        }
      }
      throw new Error(`Ошибка загрузки данных: ${error.message}`);
    }
    if (axios.isAxiosError(error)) {
      throw new Error(`Ошибка загрузки данных: ${error.message}`);
    }
    throw error;
  }
};

const combineProductsFromMultiplePages = async (
  sourceName: string,
  initialPage: number = 1,
  limit: number = 40,
  params: Record<string, any> = {},
  signal?: AbortSignal
): Promise<{ products: ProductI[], totalPages: number, totalProducts: number }> => {
  const baseParams: Record<string, any> = { ...params, limit, source: sourceName || '' };
  
  if (!baseParams.sortBy) {
      baseParams.sortBy = 'date';
      baseParams.sortOrder = 'desc';
  }

  let allProducts: ProductI[] = [];
  let currentPage = initialPage;
  let originalTotalPages = 0;
  let originalTotalProducts = 0;
  const MAX_PAGES_TO_LOAD = 3;
  const MAX_RETRY_ATTEMPTS = 2;
  const MIN_PRODUCTS_COUNT = limit;
  const brand = sourceName || 'Все товары';
  const brandStr = typeof brand === 'string' ? brand : Array.isArray(brand) ? brand[0] : 'Все товары';

  const fetchWithRetry = async (fetchFn: Function, retryCount = 0): Promise<any> => {
    try {
      return await fetchFn();
    } catch (error: any) {
      if (signal?.aborted || error instanceof DOMException && error.name === 'AbortError' || axios.isCancel(error)) {
        throw error;
      }
      if (retryCount < MAX_RETRY_ATTEMPTS && ((axios.isAxiosError(error) && error.code === 'ECONNABORTED') || error.message?.includes('timeout'))) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(fetchFn, retryCount + 1);
      }
      throw error;
    }
  };

  try {
    if (signal?.aborted) throw new DOMException('Запрос был отменен', 'AbortError');
    const firstPageParams = { ...baseParams, page: initialPage };
    const initialData = await fetchWithRetry(() => fetchProductsWithSorting(brandStr, firstPageParams, signal));
    if (signal?.aborted) throw new DOMException('Запрос был отменен', 'AbortError');
    originalTotalPages = initialData.totalPages || 0;
    originalTotalProducts = initialData.totalProducts || 0;
    const pageProductsRaw = Array.isArray(initialData.products) ? initialData.products : [];
    allProducts = [...allProducts, ...pageProductsRaw];
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError' || axios.isCancel(error) || signal?.aborted) {
      throw new DOMException('Запрос был отменен', 'AbortError');
    }
    return { products: [], totalPages: 1, totalProducts: 0 };
  }

  if (signal?.aborted) throw new DOMException('Запрос был отменен', 'AbortError');
  if (allProducts.length === 0) return { products: [], totalPages: originalTotalPages > 0 ? originalTotalPages : 1, totalProducts: originalTotalProducts };

  const startIndex = 0;
  const endIndex = Math.min(limit, allProducts.length);
  const pageProducts = allProducts.slice(startIndex, endIndex);

  return { products: pageProducts, totalPages: originalTotalPages > 0 ? originalTotalPages : 1, totalProducts: originalTotalProducts };
};

const isProductNew = (product: ProductI): boolean => {
  if (!product.createdAt) return false;
  const createDate = new Date(product.createdAt as string);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - createDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
};

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const CatalogIndex: React.FunctionComponent<CatalogIndexProps> = ({
  initialProducts,
  initialTotalPages,
  initialTotalProducts,
  source
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductI[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [totalProducts, setTotalProducts] = useState<number>(initialTotalProducts);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 40;

  useEffect(() => {
    const handleRouteChange = () => window.scrollTo(0, 0);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  const getSafePathname = useCallback(() => {
    try {
      const hasSlug = Boolean((router.query as any)?.slug);
      if (hasSlug && typeof router.asPath === 'string') {
        const path = router.asPath.split('?')[0];
        if (path.split('/').length > 2) return '/catalog';
        return path;
      }
      return router.pathname;
    } catch {
      return router.pathname;
    }
  }, [router.asPath, router.pathname, router.query]);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [minPrice, setMinPrice] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'popularity' | 'newest' | 'random' | null>('newest');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [showOnlyNewItems, setShowOnlyNewItems] = useState<boolean>(false);
  const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const [selectedSocketType, setSelectedSocketType] = useState<string | null>(null);
  const [selectedLampCount, setSelectedLampCount] = useState<number | null>(null);
  const [selectedShadeColor, setSelectedShadeColor] = useState<string | null>(null);
  const [selectedFrameColor, setSelectedFrameColor] = useState<string | null>(null);
  const [isSocketTypeOpen, setIsSocketTypeOpen] = useState(false);
  const [isLampCountOpen, setIsLampCountOpen] = useState(false);
  const [isShadeColorOpen, setIsShadeColorOpen] = useState(false);
  const [isFrameColorOpen, setIsFrameColorOpen] = useState(false);
  const [isBrandFilterOpen, setIsBrandFilterOpen] = useState(false);

  const capitalizeFirst = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && router.isReady) {
      const { socketType, lampCount, shadeColor, frameColor, availability, newItems } = router.query;
      if (socketType && typeof socketType === 'string') setSelectedSocketType(decodeURIComponent(socketType));
      if (lampCount && typeof lampCount === 'string') {
        const parsedLampCount = parseInt(lampCount, 10);
        if (!isNaN(parsedLampCount)) setSelectedLampCount(parsedLampCount);
      }
      if (shadeColor && typeof shadeColor === 'string') setSelectedShadeColor(decodeURIComponent(shadeColor));
      if (frameColor && typeof frameColor === 'string') setSelectedFrameColor(decodeURIComponent(frameColor));
      if (availability && typeof availability === 'string') setAvailabilityFilter(availability as 'all' | 'inStock' | 'outOfStock');
      if (newItems === 'true') setShowOnlyNewItems(true);
    }
  }, [router.isReady, router.query.socketType, router.query.lampCount, router.query.shadeColor, router.query.frameColor, router.query.availability, router.query.newItems]);

  useEffect(() => {
    if (!router.isReady || initializedFromQuery.current) return;
    const q = router.query;
    if (q.source && typeof q.source === 'string') {
      const sourceStr = decodeURIComponent(q.source);
      const foundBrand = brands.find(b => b.name.toLowerCase() === sourceStr.toLowerCase());
      if (foundBrand) setSelectedBrand(foundBrand);
    }
    if (q.category && typeof q.category === 'string') {
      const decoded = decodeURIComponent(q.category);
      const cat = findCategoryByName(decoded);
      if (cat) setSelectedCategory(cat);
    }
    if (q.color && typeof q.color === 'string') setSelectedColor(decodeURIComponent(q.color));
    if (q.material && typeof q.material === 'string') setSelectedMaterial(decodeURIComponent(q.material));
    if (q.minPrice && !isNaN(Number(q.minPrice))) setMinPrice(Number(q.minPrice));
    if (q.maxPrice && !isNaN(Number(q.maxPrice))) setMaxPrice(Number(q.maxPrice));
    if (q.availability && typeof q.availability === 'string') setAvailabilityFilter(q.availability as any);
    if (q.newItems === 'true') setShowOnlyNewItems(true);
    if (q.sort && typeof q.sort === 'string') setSortOrder(q.sort as any);
    if (q.search && typeof q.search === 'string') setSearchQuery(decodeURIComponent(q.search));
    if (q.power && typeof q.power === 'string') setSelectedPower(decodeURIComponent(q.power));
    if (q.socketType && typeof q.socketType === 'string') setSelectedSocketType(decodeURIComponent(q.socketType));
    if (q.lampCount && !isNaN(Number(q.lampCount))) setSelectedLampCount(Number(q.lampCount));
    if (q.shadeColor && typeof q.shadeColor === 'string') setSelectedShadeColor(decodeURIComponent(q.shadeColor));
    if (q.frameColor && typeof q.frameColor === 'string') setSelectedFrameColor(decodeURIComponent(q.frameColor));
    const page = q.page ? (Array.isArray(q.page) ? q.page[0] : q.page) : '1';
    setCurrentPage(Number(page));
    const sourceName = (q.source && typeof q.source === 'string') ? decodeURIComponent(q.source) : (source || '');
    
    // Передаем категорию в запрос, если она есть
    const paramsOverride: Record<string, any> = {};
    if (q.category && typeof q.category === 'string') {
         paramsOverride.name = decodeURIComponent(q.category);
    }
    
    fetchProducts(sourceName, Number(page), paramsOverride);
    initializedFromQuery.current = true;
  }, [router.isReady]);

  const [productCategoriesState, setProductCategoriesState] = useState(() => productCategories);
  const [availableCategoriesForBrand, setAvailableCategoriesForBrand] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedBrand) {
      setAvailableCategoriesForBrand({});
      return;
    }
    const productsToAnalyze = (initialProducts && initialProducts.length > 0) ? initialProducts : products;
    const available: Record<string, boolean> = {};
    try {
      (productsToAnalyze || []).forEach((p: ProductI) => {
        const prodCatRaw = (p.category || '').toString().trim();
        let catObj = null as Category | null;
        if (prodCatRaw) catObj = findCategoryByName(prodCatRaw);
        if (!catObj && p.name) {
          const nameLower = String(p.name).toLowerCase();
          for (const pc of productCategories) {
            if (nameLower.includes(pc.label.toLowerCase()) || (pc.searchName && nameLower.includes(pc.searchName.toLowerCase()))) {
              catObj = pc; break;
            }
            if (pc.subcategories) {
              for (const sc of pc.subcategories) {
                if (nameLower.includes(sc.label.toLowerCase()) || (sc.searchName && nameLower.includes(sc.searchName.toLowerCase()))) {
                  catObj = sc; break;
                }
              }
              if (catObj) break;
            }
          }
        }
        if (catObj) {
          const key = (catObj.searchName || catObj.label).toString().trim();
          if (key) available[key] = true;
        } else if (prodCatRaw) {
          available[prodCatRaw] = true;
        }
      });
    } catch (e) {
      console.warn('Failed to compute available categories for brand (useEffect):', e);
    }
    setAvailableCategoriesForBrand(available);
  }, [selectedBrand, initialProducts, products]);

  const [extractedFilters, setExtractedFilters] = useState<{
    colors: string[]; materials: string[]; features: string[]; styles: string[]; places: string[];
    socketTypes: string[]; lampCounts: number[]; shadeColors: string[]; frameColors: string[];
  }>({ colors: [], materials: [], features: [], styles: [], places: [], socketTypes: [], lampCounts: [], shadeColors: [], frameColors: [] });

  const fetchAbortController = useRef<AbortController | null>(null);
  const initializedFromQuery = useRef<boolean>(false);

  useEffect(() => {
    if ((router.query as any).slug) return;
    const hasCategory = router.isReady && router.query.category;
    if (hasCategory && router.query.category) {
      const categoryName = router.query.category as string;
      const lightingCategories = [
        'Люстра', 'Светильник', 'Бра', 'Торшер', 'Спот', 'Подвесной',
        'Подвесная', 'Потолочный', 'Настенный', 'Настольный', 'Лампа',
        'Комплектующие', 'Коннектор', 'Шнур', 'Блок питания', 'Патрон',
        'Крепление', 'Плафон', 'Профиль', 'Контроллер'
      ];
      const isLightingCategory = lightingCategories.some(lightingWord => categoryName.includes(lightingWord));
      if (isLightingCategory && router.query.source === 'heating') {
        const { source, ...queryWithoutSource } = router.query;
        router.push({ pathname: getSafePathname(), query: queryWithoutSource }, undefined, { shallow: true });
        return;
      }
    }

    if (router.isReady && router.query.source && !hasCategory) {
      const sourceName = router.query.source as string;
      const isLighting = isLightingContext(selectedCategory, source);
      const filteredBrands = filterBrandsForLighting(brands, isLighting);
      const foundBrand = filteredBrands.find(b => b.name.toLowerCase() === sourceName.toLowerCase());
      if (foundBrand) {
        setSelectedBrand(foundBrand);
        // Logic for initializing category if brand selected
      }
    } else if (!hasCategory && !router.query.source) {
      setSelectedBrand(null);
      setSelectedCategory(null);
    }
  }, [source, router.isReady, router.query, (router.query as any).slug]);

  useEffect(() => {
    if (!router.isReady) return;
    const slugParam = (router.query as any).slug;
    let categoryName: string | null = null;
    if (router.query.category) categoryName = router.query.category as string;
    else if (slugParam) {
      const { detectedCategory } = resolveSlug(slugParam);
      categoryName = detectedCategory || null;
    }
    if (categoryName) {
      const matchedMainCategory = mainCategories.find(mc => categoryName!.toLowerCase().includes(mc.toLowerCase()));
      if (matchedMainCategory) {
        setActiveMainCategory(matchedMainCategory);
        setShowAllCategories(false);
      } else {
        for (const mainCat of mainCategories) {
          const tempCategory: Category = { label: categoryName!, searchName: categoryName! };
          const prevActiveCategory = activeMainCategory;
          setActiveMainCategory(mainCat);
          if (isRelatedToMainCategory(tempCategory)) {
            setShowAllCategories(false); break;
          } else {
            setActiveMainCategory(prevActiveCategory);
          }
        }
      }
    } else if (!router.query.category && !slugParam) {
      setActiveMainCategory(null);
      setShowAllCategories(true);
      const isHeatingPage = router.query.source === 'heating';
      setIsHeatingContext(isHeatingPage);
    }
  }, [router.isReady, router.query.category, router.query.source, (router.query as any).slug]);

  const findCategoryByName = (name: string): Category | null => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    for (const brand of brands) {
      for (const category of brand.categories) {
        if (category.label.toLowerCase() === lowerName || category.searchName.toLowerCase() === lowerName || (category.aliases && category.aliases.some(alias => alias.toLowerCase() === lowerName))) {
          return { ...category, label: category.label, searchName: category.searchName || category.label };
        }
        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            if (subcategory.label.toLowerCase() === lowerName || subcategory.searchName.toLowerCase() === lowerName || (subcategory.aliases && subcategory.aliases.some(alias => alias.toLowerCase() === lowerName))) {
              return { ...subcategory, label: subcategory.label, searchName: subcategory.searchName || subcategory.label };
            }
             // Deep check for 3rd level (Track lights subs)
             if (subcategory.subcategories) {
                 for (const subSub of subcategory.subcategories) {
                     if (subSub.label.toLowerCase() === lowerName || subSub.searchName.toLowerCase() === lowerName) {
                          return { ...subSub, label: subSub.label, searchName: subSub.searchName };
                     }
                 }
             }
          }
        }
      }
    }
    // Fallback search in productCategories
    for (const pc of productCategories) {
        if (pc.label.toLowerCase() === lowerName) return pc;
        if (pc.subcategories) {
            for (const sc of pc.subcategories) {
                if (sc.label.toLowerCase() === lowerName) return sc;
                 if (sc.subcategories) {
                    for (const ssc of sc.subcategories) {
                        if (ssc.label.toLowerCase() === lowerName) return ssc;
                    }
                }
            }
        }
    }
    
    for (const brand of brands) {
      for (const category of brand.categories) {
        if (category.aliases && category.aliases.some(alias => alias.toLowerCase().includes(lowerName) || lowerName.includes(alias.toLowerCase()))) {
          return { ...category, label: category.label, searchName: category.searchName || category.label };
        }
        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            if (subcategory.aliases && subcategory.aliases.some(alias => alias.toLowerCase().includes(lowerName) || lowerName.includes(alias.toLowerCase()))) {
              return { ...subcategory, label: subcategory.label, searchName: subcategory.searchName || subcategory.label };
            }
          }
        }
      }
    }
    return null;
  };

  const generatePrettyUrl = (category: Category, brandName?: string): string => {
    const searchName = category.searchName || category.label;
    let categoryUrl = '';
    if (categoryPathToName[searchName]) categoryUrl = categoryPathToName[searchName];
    else if (categoryPathToName[category.label]) categoryUrl = categoryPathToName[category.label];
    else if (category.aliases) {
      for (const alias of category.aliases) {
        if (categoryPathToName[alias]) { categoryUrl = categoryPathToName[alias]; break; }
      }
    }
    // Попробуем найти URL по значению в мапе (обратный поиск)
    if (!categoryUrl) {
       const entry = Object.entries(categoryPathToName).find(([key, val]) => val === searchName || val === category.label);
       if (entry) categoryUrl = '/' + entry[0];
    }

    // Маппинг брендов для URL (обратный)
    const brandMap: Record<string, string> = {};
    Object.entries(brandSlugToName).forEach(([slug, name]) => {
        brandMap[name] = slug;
    });

    if (brandName && brandMap[brandName] && categoryUrl) return `/catalog/${brandMap[brandName]}${categoryUrl}`;
    if (brandName && brandMap[brandName] && (searchName === 'Все товары' || !categoryUrl)) return `/catalog/${brandMap[brandName]}`;
    if (categoryUrl) return `/catalog${categoryUrl}`;
    if (brandName) return `/catalog?source=${encodeURIComponent(brandName)}&category=${encodeURIComponent(searchName)}`;
    return `/catalog?category=${encodeURIComponent(searchName)}`;
  };

  React.useEffect(() => {
    const slugParam = (router.query as any).slug;
    if (!slugParam) return;
    const { detectedSource, detectedCategory, detectedPage } = resolveSlug(slugParam);
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('currentCategory')) localStorage.removeItem('currentCategory');
    } catch (e) { console.warn('Не удалось очистить currentCategory из localStorage', e); }
    
    if (detectedSource) {
      const brandObj = brands.find(b => b.name === detectedSource);
      if (brandObj) setSelectedBrand(brandObj);
    }
    
    if (detectedCategory) {
      const catObj = findCategoryByName(detectedCategory);
      if (catObj) setSelectedCategory(catObj);
    } else if (detectedSource && !detectedCategory) {
       // ВАЖНОЕ ИЗМЕНЕНИЕ: Не сбрасываем категорию, если она есть в query параметрах
       if (!router.query.category) {
          setSelectedCategory(null);
       }
    }

    try {
      const sourceForFetch = detectedSource || '';
      const paramsOverride: Record<string, any> = {};
      
      // Определяем категорию для запроса: из слага или из query параметров
      let finalCategoryName = detectedCategory;
      if (!finalCategoryName && router.query.category) {
          finalCategoryName = decodeURIComponent(router.query.category as string);
      }

      if (finalCategoryName) {
        paramsOverride.name = finalCategoryName;
        const catObj = findCategoryByName(finalCategoryName);
        if (catObj?.aliases?.length) paramsOverride.aliases = catObj.aliases;
      }
      
      setCurrentPage(detectedPage);
      fetchProducts(sourceForFetch, detectedPage, paramsOverride);
    } catch (e) { console.warn('Ошибка при загрузке товаров по slug:', e); }
  }, [router.query.slug]);

  const handleCategoryChange = (category: Category & { isHeatingCategory?: boolean }) => {
    const isHeatingPage = router.query.source === 'heating';
    setIsHeatingContext(isHeatingPage);
    if (isHeatingPage) {
      const isMainHeatingCategory = mainHeatingCategories.some(mc => category.label.toLowerCase().includes(mc.toLowerCase()));
      if (isMainHeatingCategory) {
        const mainHeatingCategory = mainHeatingCategories.find(mc => category.label.toLowerCase().includes(mc.toLowerCase()));
        if (mainHeatingCategory) { setActiveMainCategory(mainHeatingCategory); setShowAllCategories(false); }
      }
    } else {
      const isMainLightingCategory = mainCategories.some(mc => category.label.toLowerCase().includes(mc.toLowerCase()));
      if (isMainLightingCategory) {
        const mainCategory = mainCategories.find(mc => category.label.toLowerCase().includes(mc.toLowerCase()));
        if (mainCategory) { setActiveMainCategory(mainCategory); setShowAllCategories(false); }
      }
    }
    showSpinnerWithMinDuration();
    const lightingCategories = [
      'Люстра', 'Светильник', 'Бра', 'Торшер', 'Спот', 'Подвесной',
      'Подвесная', 'Потолочный', 'Настенный', 'Настольный', 'Лампа',
      'Комплектующие', 'Коннектор', 'Шнур', 'Блок питания', 'Патрон',
      'Крепление', 'Плафон', 'Профиль для ленты', 'Контроллер'
    ];
    const isLightingCategory = lightingCategories.some(lightingCategory => category.label.includes(lightingCategory) || (category.searchName && category.searchName.includes(lightingCategory)));
    if (selectedBrand && selectedBrand.name !== 'Все товары' && !isLightingCategory) { return handleBrandCategoryChange(category); }
    if (isLightingCategory) {
      setSelectedCategory(category);
      setCurrentPage(1);
      const prettyUrl = generatePrettyUrl(category, selectedBrand && selectedBrand.name !== 'Все товары' ? selectedBrand.name : undefined);
      
      if (prettyUrl.startsWith('/catalog/') && !prettyUrl.includes('?')) {
        const url = new URLSearchParams();
        Object.keys(router.query).forEach(key => { if (key !== 'category' && key !== 'page' && key !== 'source' && key !== 'slug') url.set(key, router.query[key] as string); });
        url.set('page', '1');
        const finalUrl = url.toString() ? `${prettyUrl}?${url.toString()}` : prettyUrl;
        router.push(finalUrl, undefined, { shallow: true });
        fetchProducts(selectedBrand && selectedBrand.name !== 'Все товары' ? selectedBrand.name : '', 1);
      } else {
        if (selectedBrand && selectedBrand.name !== 'Все товары') {
          router.push({ pathname: '/catalog', query: { ...router.query, source: selectedBrand.name, category: category.searchName || category.label, page: '1' } }, undefined, { shallow: true });
          fetchProducts(selectedBrand.name, 1);
        } else {
          const { source, slug, ...queryWithoutSource } = router.query;
          router.push({ pathname: '/catalog', query: { ...queryWithoutSource, category: category.searchName || category.label, page: '1' } }, undefined, { shallow: true });
          fetchProducts('', 1);
        }
      }
      return;
    }
    if (!selectedCategory || selectedCategory.label !== category.label) {
      setSelectedCategory(category);
      setCurrentPage(1);
      const { source, slug, ...queryWithoutSource } = router.query;
      const prettyUrl = generatePrettyUrl(category);
      if (prettyUrl.startsWith('/catalog/') && !prettyUrl.includes('?')) {
        const url = new URLSearchParams();
        Object.keys(queryWithoutSource).forEach(key => { if (key !== 'category' && key !== 'page') url.set(key, queryWithoutSource[key] as string); });
        url.set('page', '1');
        const finalUrl = url.toString() ? `${prettyUrl}?${url.toString()}` : prettyUrl;
        router.push(finalUrl, undefined, { shallow: true });
      } else {
        router.push({ pathname: '/catalog', query: { ...queryWithoutSource, category: category.searchName || category.label, page: '1' }, }, undefined, { shallow: true });
      }
    }
    fetchProducts('', 1);
  };

  const handleBrandCategoryChange = (category: Category) => {
    showSpinnerWithMinDuration();
    const sourceName = selectedBrand?.name || '';
    const isSelectedMainCategory = mainCategories.some(mc => category.label.toLowerCase().includes(mc.toLowerCase()));
    if (isSelectedMainCategory) {
      const mainCategory = mainCategories.find(mc => category.label.toLowerCase().includes(mc.toLowerCase()));
      if (mainCategory) { setActiveMainCategory(mainCategory); setShowAllCategories(false); }
    }
    if (category.label === 'Все товары' || category.searchName === 'all') {
      setSelectedCategory(null);
      router.push({ pathname: '/catalog', query: { ...router.query, source: sourceName || undefined, category: undefined, page: 1, slug: undefined } }, undefined, { shallow: true });
    } else {
      setSelectedCategory(category);
      const prettyUrl = generatePrettyUrl(category, sourceName);
      if (prettyUrl.startsWith('/catalog/') && !prettyUrl.includes('?')) {
        const url = new URLSearchParams();
        Object.keys(router.query).forEach(key => { if (key !== 'category' && key !== 'page' && key !== 'source' && key !== 'slug') url.set(key, router.query[key] as string); });
        url.set('page', '1');
        const finalUrl = url.toString() ? `${prettyUrl}?${url.toString()}` : prettyUrl;
        router.push(finalUrl, undefined, { shallow: true });
      } else {
        router.push({ pathname: '/catalog', query: { ...router.query, category: category.searchName || category.label, source: sourceName || undefined, page: 1, slug: undefined } }, undefined, { shallow: true });
      }
    }
    fetchProducts(sourceName, 1);
  };

  const findParentCategory = (childCategory: Category): Category | null => {
    if (!childCategory) return null;
    for (const parent of productCategories) {
      if (parent.subcategories?.some(sub => sub.label === childCategory.label || sub.searchName === childCategory.searchName)) { return parent; }
      // Deep search
      if (parent.subcategories) {
        for (const sub of parent.subcategories) {
            if (sub.subcategories?.some(deepSub => deepSub.label === childCategory.label)) {
                return sub;
            }
        }
      }
    }
    return null;
  };

  const handleBrandDeselect = () => {
    showSpinnerWithMinDuration();
    setSelectedBrand(null);
    const defaultCategory = productCategories.find(cat => cat.label === 'Люстра');
    if (defaultCategory) {
        setSelectedCategory(defaultCategory);
        const { source, slug, ...restQuery } = router.query;
        restQuery.page = '1';
        restQuery.category = defaultCategory.searchName || defaultCategory.label;
        router.push({ pathname: '/catalog', query: restQuery }, undefined, { shallow: true });
        fetchProducts('', 1, { name: restQuery.category });
    } else {
        const { source, category, slug, ...restQuery } = router.query;
        restQuery.page = '1';
        router.push({ pathname: '/catalog', query: restQuery }, undefined, { shallow: true });
        fetchProducts('', 1);
    }
  };

  const handleCategoryDeselect = () => {
    showSpinnerWithMinDuration();
    if (!selectedCategory) return;
    const parentCategory = findParentCategory(selectedCategory);
    if (parentCategory) {
      setSelectedCategory(parentCategory);
      setCurrentPage(1);
      const { slug, ...restQuery } = router.query;
      restQuery.page = '1';
      restQuery.category = parentCategory.searchName || parentCategory.label;
      
      const prettyUrl = generatePrettyUrl(parentCategory, selectedBrand?.name);
      if (prettyUrl.startsWith('/catalog/') && !prettyUrl.includes('?')) {
          router.push(prettyUrl, undefined, { shallow: true });
      } else {
          router.push({ pathname: '/catalog', query: restQuery }, undefined, { shallow: true });
      }
      
      const currentBrandName = selectedBrand ? selectedBrand.name : (router.query.source as string || '');
      fetchProducts(currentBrandName, 1, { name: restQuery.category });
    } else {
      setSelectedCategory(null);
      const { category, slug, ...restQuery } = router.query;
      restQuery.page = '1';
      router.push({ pathname: '/catalog', query: restQuery }, undefined, { shallow: true });
      const currentBrandName = selectedBrand ? selectedBrand.name : (router.query.source as string || '');
      fetchProducts(currentBrandName, 1, { name: undefined, aliases: undefined });
    }
  };

  const handleBackToMainCategories = () => {
    // 1. Сброс визуального состояния сайдбара
    setShowAllCategories(true);
    setActiveMainCategory(null);
    
    // 2. Сброс выбранной категории
    setSelectedCategory(null);
    
    // 3. Обновление URL (удаляем category, оставляем source/бренд и фильтры)
    const { category, slug, ...restQuery } = router.query;
    restQuery.page = '1';
    
    router.push({ 
        pathname: '/catalog', 
        query: restQuery 
    }, undefined, { shallow: true });

    // 4. Загрузка всех товаров (с учетом бренда, если он выбран)
    const currentBrandName = selectedBrand ? selectedBrand.name : (router.query.source as string || '');
    fetchProducts(currentBrandName, 1, { name: undefined, aliases: undefined });
  };

  const fetchProducts = async (
    sourceName: string, page: number = 1, paramsOverride?: Record<string, any>, append: boolean = false, fetchAll: boolean = false
  ) => {
    if (!append) showSpinnerWithMinDuration(); else setIsLoading(true);
    if (fetchAbortController.current) fetchAbortController.current.abort();
    fetchAbortController.current = new AbortController();
    const signal = fetchAbortController.current.signal;
    try {
      const params: Record<string, any> = { ...(paramsOverride || {}) };
      if (sourceName && sourceName.toLowerCase() === 'donel') params.excludeNameWords = ['клавиша', 'мат нагревательный', 'накладка', 'рамки', 'выдвижной блок'];
      const usingSlugRouting = Boolean((router.query as any)?.slug);
      const pathWithoutQuery = typeof router.asPath === 'string' ? router.asPath.split('?')[0] : '';
      const usingPrettyUrl = pathWithoutQuery.startsWith('/catalog/') && (!router.asPath.includes('?') || /\?page=\d+/i.test(router.asPath));
      if (!params.name && selectedCategory && selectedCategory.label !== 'Все товары') {
        params.name = selectedCategory.searchName || selectedCategory.label;
        if (!usingSlugRouting && !usingPrettyUrl && selectedCategory.aliases?.length && !params.aliases) params.aliases = selectedCategory.aliases;
      }
      const categoryFromURL = router.query.category;
      if (categoryFromURL && typeof categoryFromURL === 'string' && categoryFromURL.toLowerCase() !== 'все товары') {
        const decodedCategory = decodeURIComponent(categoryFromURL);
        const categoryFromDB = findCategoryByName(decodedCategory);
        if (categoryFromDB) {
          if (!params.name) params.name = categoryFromDB.searchName || categoryFromDB.label;
          if (!usingSlugRouting && !usingPrettyUrl && categoryFromDB.aliases?.length && !params.aliases) params.aliases = categoryFromDB.aliases;
        } else { if (!params.name) params.name = decodedCategory; }
      }
      if (selectedColor) params.color = selectedColor;
      if (selectedMaterial) params.material = selectedMaterial;
      if (minPrice !== 10) params.minPrice = minPrice;
      if (maxPrice !== 1000000) params.maxPrice = maxPrice;
      if (searchQuery) params.search = searchQuery;
      if (selectedPower) params.power = selectedPower;
      if (selectedSocketType) params.socketType = selectedSocketType;
      if (selectedLampCount) params.lampCount = selectedLampCount;
      if (selectedShadeColor) params.shadeColor = selectedShadeColor;
      if (selectedFrameColor) params.frameColor = selectedFrameColor;
      if (router.query.includeName) params.includeName = decodeURIComponent(router.query.includeName as string);
      if (router.query.collection) params.collection = decodeURIComponent(router.query.collection as string);
      const currentAvailability = params.availability || router.query.availability || availabilityFilter;
      if (currentAvailability === 'inStock') params.inStock = true;
      params.excludeBrands = ['Voltum', 'Werkel', 'ЧТК'];
      const needClientSideNewItems = (params.newItems === 'true') || (router.query.newItems === 'true') || showOnlyNewItems;
      if (needClientSideNewItems) params.newItems = 'true';
      const sortFromURL = router.query.sort;
      let currentSortOrder = sortOrder;
      if (sortFromURL && typeof sortFromURL === 'string') currentSortOrder = sortFromURL as any;
      if (currentSortOrder) {
          if (currentSortOrder === 'asc') { params.sortBy = 'price'; params.sortOrder = 'asc'; }
          else if (currentSortOrder === 'desc') { params.sortBy = 'price'; params.sortOrder = 'desc'; }
          else if (currentSortOrder === 'popularity') { params.sortBy = 'popularity'; params.sortOrder = 'desc'; }
          else if (currentSortOrder === 'newest') { params.sortBy = 'date'; params.sortOrder = 'desc'; }
          else if (currentSortOrder === 'random') { params.sortBy = 'random'; params.randomize = 'true'; }
      } else { 
          // Default logic
          params.sortBy = 'date'; params.sortOrder = 'desc'; 
      }
      params.forceSort = 'true';
      let adjustedPage = page;
      let adjustedLimit = limit;
      if (fetchAll || currentAvailability === 'outOfStock' || needClientSideNewItems) {
        adjustedPage = 1; adjustedLimit = 2000;
      }
      const result = await combineProductsFromMultiplePages(sourceName, adjustedPage, adjustedLimit, params, signal);
      if (signal.aborted) return;
      let filteredProducts = result.products.filter((product: ProductI) => !params.excludeBrands.includes(product.source));
      if (availabilityFilter === 'outOfStock') filteredProducts = filteredProducts.filter(p => (Number(p.stock) || 0) <= 0);
      else if (availabilityFilter === 'inStock') filteredProducts = filteredProducts.filter(p => (Number(p.stock) || 0) > 0);
      if (append) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = filteredProducts.filter(p => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      } else { setProducts(filteredProducts); }
      if (fetchAll) setTotalPages(1); else setTotalPages(result.totalPages);
      setTotalProducts(result.totalProducts);
      extractFiltersFromProducts(result.products);
    } catch (error) { if (!axios.isCancel(error)) console.error('Ошибка при получении товаров:', error);
    } finally { if (!append) hideSpinner(); setIsLoading(false); }
  };
  fetchProducts.lastRequestId = '';

  const handleShowMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;
    setCurrentPage(nextPage);
    const sourceName = selectedBrand?.name || (router.query.source as string || '');
    fetchProducts(sourceName, nextPage, {}, true);
    router.push({ pathname: '/catalog', query: { ...router.query, page: nextPage } }, undefined, { shallow: true });
  };

  const normalizeFilterValue = (value: string): string => {
    const lowerValue = value.toLowerCase().trim();
    if (lowerValue.includes('золот') || lowerValue.includes('gold')) {
      if (lowerValue.includes('матов') || lowerValue.includes('matte')) return 'Золото матовое';
      if (lowerValue.includes('глянц') || lowerValue.includes('gloss')) return 'Золото глянцевое';
      if (lowerValue.includes('алюмин')) return 'Золотистый алюминий';
      return 'Золото';
    }
    if (lowerValue.includes('сереб') || lowerValue.includes('silver')) return 'Серебро';
    if (lowerValue.includes('белый') || lowerValue.includes('белая') || lowerValue.includes('white')) {
      if (lowerValue.includes('матов') || lowerValue.includes('matte')) return 'Белый матовый';
      if (lowerValue.includes('глянц') || lowerValue.includes('gloss')) return 'Белый глянцевый';
      return 'Белый';
    }
    if (lowerValue.includes('черный') || lowerValue.includes('черная') || lowerValue.includes('black')) {
      if (lowerValue.includes('матов') || lowerValue.includes('matte')) return 'Черный матовый';
      if (lowerValue.includes('глянц') || lowerValue.includes('gloss')) return 'Черный глянцевый';
      return 'Черный';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const extractFiltersFromProducts = (products: ProductI[]) => {
    const colorsMap = new Map<string, string>();
    const materialsMap = new Map<string, string>();
    const features = new Set<string>();
    const styles = new Set<string>();
    const places = new Set<string>();
    const socketTypes = new Set<string>();
    const lampCounts = new Set<number>();
    const shadeColorsMap = new Map<string, string>();
    const frameColorsMap = new Map<string, string>();
    products.forEach(product => {
      if (product.color) { const normalizedColor = normalizeFilterValue(String(product.color)); colorsMap.set(normalizedColor, normalizedColor); }
      if (product.material) { const normalizedMaterial = normalizeFilterValue(String(product.material)); materialsMap.set(normalizedMaterial, normalizedMaterial); }
      if (product.socketType) socketTypes.add(String(product.socketType));
      if (product.lampCount && typeof product.lampCount === 'number') lampCounts.add(product.lampCount);
      if (product.shadeColor) { const normalizedShadeColor = normalizeFilterValue(String(product.shadeColor)); shadeColorsMap.set(normalizedShadeColor, normalizedShadeColor); }
      if (product.frameColor) { const normalizedFrameColor = normalizeFilterValue(String(product.frameColor)); frameColorsMap.set(normalizedFrameColor, normalizedFrameColor); }
    });
    setExtractedFilters({
      colors: Array.from(colorsMap.values()).sort(), materials: Array.from(materialsMap.values()).sort(), features: Array.from(features), styles: Array.from(styles),
      places: Array.from(places), socketTypes: Array.from(socketTypes), lampCounts: Array.from(lampCounts).sort((a, b) => a - b), shadeColors: Array.from(shadeColorsMap.values()).sort(), frameColors: Array.from(frameColorsMap.values()).sort()
    });
  };

  useEffect(() => {
    try {
      if (initialProducts && initialProducts.length > 0) extractFiltersFromProducts(initialProducts);
      else if (products && products.length > 0) extractFiltersFromProducts(products);
      else setExtractedFilters({ colors: [], materials: [], features: [], styles: [], places: [], socketTypes: [], lampCounts: [], shadeColors: [], frameColors: [] });
    } catch (e) { console.warn('Failed to recompute extracted filters:', e); }
  }, [initialProducts, products]);

  const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

  const handleSocketTypeChange = (socketType: string | null) => {
    const newSocket = selectedSocketType === socketType ? null : socketType;
    setSelectedSocketType(newSocket);
    setCurrentPage(1);
    const paramsOverride: Record<string, any> = {};
    if (newSocket) paramsOverride.socketType = newSocket;
    paramsOverride.page = 1;
    const sourceName = selectedBrand?.name || (typeof router.query.source === 'string' ? router.query.source : source) || '';
    fetchProducts(sourceName, 1, paramsOverride);
    const newQuery = { ...(router.query || {}) } as Record<string, any>;
    if (newSocket) newQuery.socketType = newSocket; else delete newQuery.socketType;
    newQuery.page = 1;
    router.push({ pathname: '/catalog', query: newQuery }, undefined, { shallow: true });
  };

  const handleLampCountChange = (lampCount: number | null) => {
    if (selectedLampCount === lampCount) {
      setSelectedLampCount(null);
      const { lampCount: removed, ...restQuery } = router.query;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    } else {
      setSelectedLampCount(lampCount);
      router.push({ pathname: '/catalog', query: { ...router.query, lampCount: lampCount?.toString(), page: 1 }, }, undefined, { shallow: true });
    }
    setCurrentPage(1);
    const sourceName = selectedBrand?.name || (typeof router.query.source === 'string' ? router.query.source : source) || '';
    const paramsOverride: Record<string, any> = { page: 1 };
    if (lampCount !== null) paramsOverride.lampCount = lampCount; else paramsOverride.lampCount = undefined;
    fetchProducts(sourceName, 1, paramsOverride);
  };

  const handleShadeColorChange = (shadeColor: string | null) => {
    if (selectedShadeColor === shadeColor) {
      setSelectedShadeColor(null);
      const { shadeColor: removed, ...restQuery } = router.query;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    } else {
      const normalizedShadeColor = shadeColor ? normalizeFilterValue(shadeColor) : null;
      setSelectedShadeColor(normalizedShadeColor);
      router.push({ pathname: '/catalog', query: { ...router.query, shadeColor: normalizedShadeColor, page: 1 }, }, undefined, { shallow: true });
    }
    setCurrentPage(1);
    const sourceName = selectedBrand?.name || (typeof router.query.source === 'string' ? router.query.source : source) || '';
    const paramsOverride: Record<string, any> = { page: 1 };
    if (shadeColor) paramsOverride.shadeColor = normalizeFilterValue(shadeColor);
    fetchProducts(sourceName, 1, paramsOverride);
  };

  const handleFrameColorChange = (frameColor: string | null) => {
    if (selectedFrameColor === frameColor) {
      setSelectedFrameColor(null);
      const { frameColor: removed, ...restQuery } = router.query;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    } else {
      const normalizedFrameColor = frameColor ? normalizeFilterValue(frameColor) : null;
      setSelectedFrameColor(normalizedFrameColor);
      router.push({ pathname: '/catalog', query: { ...router.query, frameColor: normalizedFrameColor, page: 1 }, }, undefined, { shallow: true });
    }
    setCurrentPage(1);
    const sourceName = selectedBrand?.name || (typeof router.query.source === 'string' ? router.query.source : source) || '';
    const paramsOverride: Record<string, any> = { page: 1 };
    if (frameColor) paramsOverride.frameColor = normalizeFilterValue(frameColor);
    fetchProducts(sourceName, 1, paramsOverride);
  };

  const toggleCategoryAccordion = (categoryId: string) => {
    setOpenCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
  };

  const renderCategories = () => {
    const isHeatingPage = router.query.source === 'heating';
    const categoriesToShow = productCategoriesState;
    let filteredCategories;
    if (showAllCategories) filteredCategories = categoriesToShow.filter(c => c.label !== 'Все товары');
    else filteredCategories = categoriesToShow.filter(c => c.label !== 'Все товары' && isRelatedToMainCategory(c));

    const renderBackButton = () => {
      if (!showAllCategories) {
        return (
          // ИЗМЕНЕНИЕ ЗДЕСЬ: используем handleBackToMainCategories вместо простого setState
          <div className="flex items-center gap-2 mb-6 cursor-pointer group text-zinc-400 hover:text-white transition-colors" onClick={handleBackToMainCategories}>
             <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-[#812626] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             </div>
             <span className="text-sm font-medium">Все категории</span>
          </div>
        );
      }
      return null;
    };

    const generateCategoryHtml = (categories: Category[]) => {
      return (
        <div className="space-y-1">
          {categories.map((category) => {
            if (!showAllCategories && !isRelatedToMainCategory(category)) return null;
            if (selectedBrand && availableCategoriesForBrand && Object.keys(availableCategoriesForBrand).length > 0) {
              const catKey = (category.searchName || category.label || '').toString().trim();
              if (catKey && !availableCategoriesForBrand[catKey]) {
                const anySubAvailable = (category.subcategories || []).some(sub => {
                  const sk = (sub.searchName || sub.label || '').toString().trim(); return sk && availableCategoriesForBrand[sk];
                });
                if (!anySubAvailable) return null;
              }
            }
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            const isActive = selectedCategory?.label === category.label;
            
            const isChildActive = hasSubcategories && category.subcategories?.some(sub => {
                if (selectedCategory?.label === sub.label) return true;
                if (sub.subcategories && sub.subcategories.some(grand => selectedCategory?.label === grand.label)) return true;
                return false;
            });

            const filteredSubcategories = hasSubcategories ? (category.subcategories || []).filter(sub => {
                  if (!selectedBrand || !availableCategoriesForBrand || Object.keys(availableCategoriesForBrand).length === 0) return true;
                  const sk = (sub.searchName || sub.label || '').toString().trim(); return !!sk && !!availableCategoriesForBrand[sk];
                }) : [];
            
            const handleClick = () => {
              if (selectedBrand && selectedBrand.name !== 'Все товары') { handleBrandCategoryChange(category); return; }
              handleCategoryChange(category);
            };

            return (
              <div key={category.label} className="group">
                <div 
                   onClick={handleClick} 
                   className={`
                     relative py-2 px-3 text-sm cursor-pointer transition-all duration-200 rounded-lg flex items-center justify-between
                     ${isActive 
                       ? 'bg-gradient-to-r from-[#812626]/20 to-transparent text-white font-medium pl-4 border-l-2 border-[#812626]' 
                       : 'text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}
                   `}
                >
                  <span className="truncate">{category.label}</span>
                  {hasSubcategories && <span className="text-xs text-zinc-600 group-hover:text-zinc-400">+</span>}
                </div>
                
                {filteredSubcategories.length > 0 && (isActive || isChildActive || openCategories.includes(category.label)) && (
                  <div className="ml-3 pl-3 border-l border-white/5 mt-1 space-y-1 mb-2">
                    {filteredSubcategories.map((sub) => {
                      const isSubActive = selectedCategory?.label === sub.label;
                      const isGrandChildActive = sub.subcategories && sub.subcategories.some(grand => selectedCategory?.label === grand.label);
                      const hasDeepSubs = sub.subcategories && sub.subcategories.length > 0;
                      
                      const handleSubClick = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (selectedBrand && selectedBrand.name !== 'Все товары') { handleBrandCategoryChange(sub); return; }
                        handleCategoryChange(sub);
                      };

                      return (
                        <div key={sub.label}>
                            <div 
                                onClick={handleSubClick} 
                                className={`
                                  py-1.5 px-2 text-xs rounded-md cursor-pointer transition-colors flex justify-between items-center
                                  ${isSubActive ? 'text-[#812626] font-medium' : 'text-zinc-500 hover:text-zinc-300'}
                                `}
                            >
                              <span className="truncate">{sub.label}</span>
                              {hasDeepSubs && <span className="text-[10px] opacity-50">▼</span>}
                            </div>
                            {hasDeepSubs && (isSubActive || isGrandChildActive) && (
                                <div className="ml-2 pl-2 border-l border-white/5 mt-0.5 space-y-0.5 mb-1">
                                    {sub.subcategories?.map(grand => {
                                        const isGrandActive = selectedCategory?.label === grand.label;
                                        return (
                                            <div
                                                key={grand.label}
                                                onClick={(e) => { e.stopPropagation(); handleCategoryChange(grand); }}
                                                className={`py-1 px-2 text-[11px] rounded-md cursor-pointer transition-colors ${isGrandActive ? 'text-[#812626] font-medium' : 'text-zinc-600 hover:text-zinc-400'}`}
                                            >
                                                {grand.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="pr-2">
        <h2 className='text-3xl font-bold text-white mb-4 tracking-tight'>{selectedCategory?.label || 'Каталог'}</h2>
        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-6"></div>
        {renderBackButton()}
        <nav className="space-y-0.5">{generateCategoryHtml(filteredCategories)}</nav>
      </div>
    );
  };

  const handleBrandChange = (brand: Brand) => {
    showSpinnerWithMinDuration();
    const brandMap: Record<string, string> = {
      'LightStar': 'lightstar', 'Maytoni': 'maytoni', 'Novotech': 'novotech', 'Lumion': 'lumion', 'Artelamp': 'artelamp', 'Donel': 'donel', 'Denkirs': 'denkirs', 'StLuce': 'stluce', 'KinkLight': 'kinklight', 'Sonex': 'sonex', 'OdeonLight': 'odeonlight', 'Favourite': 'favourite',
    };
    const brandSlug = brandMap[brand.name];
    let newPath = '/catalog';
    if (brandSlug) newPath = `/catalog/${brandSlug}`;
    
    // ВАЖНОЕ ИЗМЕНЕНИЕ: Сохраняем категорию при переходе на бренд
    const { slug, source, page, category, ...restQuery } = router.query;
    const queryParams = new URLSearchParams();
    
    // Копируем существующие фильтры
    Object.entries(restQuery).forEach(([key, value]) => { if (value) queryParams.set(key, String(value)); });
    
    // Если категория выбрана, сохраняем её в query параметрах
    let categoryToKeep = '';
    if (selectedCategory && selectedCategory.label !== 'Все товары') {
        categoryToKeep = selectedCategory.searchName || selectedCategory.label;
    } else if (category && typeof category === 'string') {
        categoryToKeep = decodeURIComponent(category);
    }

    if (categoryToKeep) {
         queryParams.set('category', categoryToKeep);
    }
    
    // Сбрасываем страницу
    queryParams.set('page', '1');

    const queryString = queryParams.toString();
    const finalUrl = queryString ? `${newPath}?${queryString}` : newPath;
    
    // Используем push для навигации без полной перезагрузки, но с сохранением состояния
    router.push(finalUrl).then(() => {
        // Дополнительно форсируем обновление данных (на всякий случай)
        const brandName = brand.name;
        const params: any = { page: 1 };
        if (categoryToKeep) params.name = categoryToKeep;
        fetchProducts(brandName, 1, params);
    });
  };

  // ФИЛЬТРАЦИЯ БРЕНДОВ В САЙДБАРЕ
  const availableFilteredBrands = useMemo(() => {
    if (!selectedCategory || selectedCategory.label === 'Все товары') {
        return brands;
    }

    const normalizedCategoryLabel = selectedCategory.label.toLowerCase();
    const normalizedSearchName = (selectedCategory.searchName || '').toLowerCase();

    return brands.filter(brand => {
        // Не показываем технический бренд "Все товары" в списке
        if (brand.name === 'Все товары') return false;

        // Проверяем, есть ли у бренда выбранная категория
        return brand.categories.some(cat => {
            const catLabel = cat.label.toLowerCase();
            const catSearch = (cat.searchName || '').toLowerCase();
            
            // Прямое совпадение
            if (catLabel === normalizedCategoryLabel || catSearch === normalizedSearchName) return true;
            
            // Совпадение по алиасам
            if (cat.aliases && cat.aliases.some(a => a.toLowerCase() === normalizedCategoryLabel)) return true;
            
            return false;
        });
    });
  }, [selectedCategory, brands]);

  const handleColorChange = (color: string | null) => {
    showSpinnerWithMinDuration();
    if (selectedColor === color) {
      setSelectedColor(null);
      const { color, ...restQuery } = router.query;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 } }, undefined, { shallow: true });
    } else {
      const normalizedColor = color ? normalizeFilterValue(color) : null;
      setSelectedColor(normalizedColor);
      router.push({ pathname: '/catalog', query: { ...router.query, color: normalizedColor, page: 1 } }, undefined, { shallow: true });
    }
    setCurrentPage(1);
    const sourceName = selectedBrand?.name || (typeof router.query.source === 'string' ? router.query.source : source) || '';
    const paramsOverride: Record<string, any> = { page: 1 };
    if (color) paramsOverride.color = normalizeFilterValue(color); else paramsOverride.color = undefined;
    fetchProducts(sourceName, 1, paramsOverride);
  };

  const handleMaterialChange = (material: string | null) => {
    showSpinnerWithMinDuration();
    const normalizedMaterial = material ? normalizeFilterValue(material) : null;
    if (selectedMaterial === normalizedMaterial) {
      setSelectedMaterial(null);
      const { material: removed, ...restQuery } = router.query;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 } }, undefined, { shallow: true });
    } else {
      setSelectedMaterial(normalizedMaterial);
      router.push({ pathname: '/catalog', query: { ...router.query, material: normalizedMaterial, page: 1 } }, undefined, { shallow: true });
    }
    setCurrentPage(1);
    const sourceName = selectedBrand?.name || (typeof router.query.source === 'string' ? router.query.source : source) || '';
    const paramsOverride: Record<string, any> = { page: 1 };
    if (normalizedMaterial) paramsOverride.material = normalizedMaterial; else paramsOverride.material = undefined;
    fetchProducts(sourceName, 1, paramsOverride);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    showSpinnerWithMinDuration();
    setMinPrice(min); setMaxPrice(max);
    router.push({ pathname: '/catalog', query: { ...router.query, minPrice: min.toString(), maxPrice: max.toString(), page: 1 } }, undefined, { shallow: true });
    setCurrentPage(1);
    const sourceName = source || '';
    fetchProducts(sourceName, 1);
  };

  const handleSortOrderChange = (order: 'asc' | 'desc' | 'popularity' | 'newest' | 'random' | null) => {
    showSpinnerWithMinDuration();
    setSortOrder(order);
    if (order) router.push({ pathname: '/catalog', query: { ...router.query, sort: order, page: 1 } }, undefined, { shallow: true });
    else {
      const { sort, ...restQuery } = router.query;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 } }, undefined, { shallow: true });
    }
    setCurrentPage(1);
    const sourceName = source || '';
    fetchProducts(sourceName, 1);
  };

  const handleResetFilters = () => {
    setSelectedBrand(null); 
    setSelectedCategory(null); 
    setMinPrice(10); 
    setMaxPrice(1000000); 
    setSelectedColor(null); 
    setSelectedMaterial(null); 
    setSelectedPower(null);
    setSelectedSocketType(null);
    setSelectedLampCount(null);
    setSelectedShadeColor(null);
    setSelectedFrameColor(null);
    setSortOrder('newest'); 
    setSearchQuery(''); 
    setCurrentPage(1); 
    setAvailabilityFilter('all'); 
    setShowOnlyNewItems(false); 
    setActiveMainCategory(null); 
    setShowAllCategories(true);
    router.push({ pathname: '/catalog', query: { page: 1, sort: 'newest' } }, undefined, { shallow: true });
    fetchProducts('', 1);
  };

  const handlePageChange = (page: number) => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
    showSpinnerWithMinDuration();
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const { slug, ...restQuery } = router.query;
    if (slug) {
        let slugArray = Array.isArray(slug) ? [...slug] : [slug];
        const lastSegment = slugArray[slugArray.length - 1];
        if (lastSegment && !isNaN(parseInt(lastSegment, 10)) && isFinite(Number(lastSegment))) slugArray.pop();
        if (page > 1) slugArray.push(page.toString());
        delete restQuery.page;
        const newPath = `/catalog/${slugArray.join('/')}`;
        router.push({ pathname: '/catalog/[...slug]', query: { ...restQuery, slug: slugArray }, }, newPath, { shallow: true });
    } else {
        restQuery.page = page.toString();
        // Используем явный путь, чтобы избежать ошибки интерполяции href
        router.push({ pathname: '/catalog', query: restQuery, }, undefined, { shallow: true });
    }
    const sourceNameComputed = selectedBrand?.name || (router.query.source as string || '');
    fetchProducts(sourceNameComputed, page);
  };

  const getSourceTitle = (): JSX.Element | string => {
    const brandName = selectedBrand?.name;
    const categoryLabel = selectedCategory?.label;
    if (brandName === 'Все товары' || !brandName) {
      if (categoryLabel && categoryLabel !== 'Все товары') return `Каталог товаров - ${categoryLabel}`;
      return 'Каталог';
    }
    if (categoryLabel && categoryLabel !== 'Все товары') {
      return (<div className="flex gap-2  items-center"><span>Товары бренда </span><span className='text-6xl text-red-950'>{brandName}</span><span> - {categoryLabel}</span></div>);
    }
    return (<div className="flex gap-4 items-center"><span>Товары бренда </span><span className='text-4xl text-red-950'>{brandName}</span></div>);
  };

  const sourceTitle = getSourceTitle();

  useEffect(() => {
    return () => { if (fetchAbortController && fetchAbortController.current) fetchAbortController.current = null; };
  }, []);

  const getPageTitle = (): string => {
    if (selectedBrand && selectedBrand.name !== 'All Products') {
      if (selectedCategory && selectedCategory.label !== 'All Products') return `${selectedCategory.label} ${selectedBrand.name} - купить в интернет-магазине Elektromos`;
      return `${selectedBrand.name} - купить товары от производителя в интернет-магазине Elektromos`;
    }
    if (selectedCategory && selectedCategory.label !== 'All Products') return `${selectedCategory.label} - купить по выгодной цене в интернет-магазине Elektromos`;
    return 'Каталог товаров - Elektromos: освещение и электротовары';
  };

  const getPageDescription = (): string => {
    if (selectedBrand && selectedBrand.name !== 'All Products') {
      if (selectedCategory && selectedCategory.label !== 'All Products') return `${selectedCategory.label} ${selectedBrand.name} по выгодным ценам. Быстрая доставка ✓ Гарантия от производителя ✓ Большой выбор моделей. Заказывайте на сайте Elektromos!`;
      return `Товары ${selectedBrand.name} в официальном интернет-магазине Elektromos. Большой выбор моделей, выгодные цены, быстрая доставка, гарантия производителя.`;
    }
    if (selectedCategory && selectedCategory.label !== 'All Products') return `${selectedCategory.label} в интернет-магазине Elektromos. Широкий ассортимент, качественные товары, выгодные цены, быстрая доставка, гарантия.`;
    return 'Каталог интернет-магазина Elektromos: светильники, люстры, бра, розетки, выключатели и другие товары для освещения и электрики. Выгодные цены, большой выбор, быстрая доставка по всей России.';
  };

  useEffect(() => {
    if (router.isReady) {
      setProductCategoriesState(productCategories);
    }
  }, [router.isReady, router.query, brands, productCategories]);

  const showSpinnerWithMinDuration = useCallback(() => {
    if (spinnerTimeoutRef.current) { clearTimeout(spinnerTimeoutRef.current); spinnerTimeoutRef.current = null; }
    setIsLoading(true); setIsFullscreenLoading(true);
    spinnerTimeoutRef.current = setTimeout(() => {
      if (!isLoading) setIsFullscreenLoading(false);
      spinnerTimeoutRef.current = null;
    }, 500);
  }, [isLoading]);

  const hideSpinner = useCallback(() => {
    setIsLoading(false);
    if (!spinnerTimeoutRef.current) setIsFullscreenLoading(false);
    else setTimeout(() => setIsFullscreenLoading(false), 100);
  }, []);

  useEffect(() => {
    return () => { if (spinnerTimeoutRef.current) clearTimeout(spinnerTimeoutRef.current); };
  }, []);

  const handlePowerChange = (power: string | null) => {
    showSpinnerWithMinDuration();
    if (selectedPower === power) {
      setSelectedPower(null); const { power, ...restQuery } = router.query; router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    } else {
      setSelectedPower(power); router.push({ pathname: '/catalog', query: { ...router.query, power, page: 1 }, }, undefined, { shallow: true });
    }
    setCurrentPage(1); const sourceName = source || ''; fetchProducts(sourceName, 1);
  };

  const handleAvailabilityFilter = (filter: 'all' | 'inStock' | 'outOfStock') => {
    let categoryForFilter = selectedCategory;
    if (!categoryForFilter || categoryForFilter.label === 'Все товары') {
      if (router.query.category && typeof router.query.category === 'string') {
        const categoryFromQuery = decodeURIComponent(router.query.category); categoryForFilter = { label: categoryFromQuery, searchName: categoryFromQuery };
      } else {
        const pathParts = router.asPath.split('?')[0].split('/').filter(Boolean);
        if (pathParts.length >= 2 && pathParts[0] === 'catalog') {
          const categoryPath = pathParts.slice(1).join('/');
          const categoryFromPath = categoryPathToName[categoryPath];
          if (categoryFromPath) categoryForFilter = { label: categoryFromPath, searchName: categoryFromPath };
        }
      }
    }
    if (categoryForFilter && categoryForFilter.label !== 'Все товары') {
      const categoryToSave = { label: categoryForFilter.label, searchName: categoryForFilter.searchName || categoryForFilter.label };
      localStorage.setItem('currentCategory', JSON.stringify(categoryToSave));
    }
    showSpinnerWithMinDuration(); setAvailabilityFilter(filter); setCurrentPage(1);
    if (filter === 'all') {
      const { availability, ...restQuery } = router.query;
      if (categoryForFilter && categoryForFilter.label !== 'Все товары') (restQuery as any).category = categoryForFilter.searchName || categoryForFilter.label;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    } else if (filter === 'inStock') {
      const updatedQuery: Record<string, any> = { ...router.query, availability: filter, page: 1 };
      if (categoryForFilter && categoryForFilter.label !== 'Все товары') updatedQuery.category = categoryForFilter.searchName || categoryForFilter.label;
      router.push({ pathname: '/catalog', query: updatedQuery, }, undefined, { shallow: true });
    } else {
      const { availability, ...restQuery } = router.query;
      if (categoryForFilter && categoryForFilter.label !== 'Все товары') (restQuery as any).category = categoryForFilter.searchName || categoryForFilter.label;
      router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    }
    const sourceName = source || ''; fetchProducts(sourceName, 1);
  };

  const handleNewItemsFilter = (showNew: boolean) => {
    showSpinnerWithMinDuration(); setShowOnlyNewItems(showNew); setCurrentPage(1);
    if (!showNew) { const { newItems, ...restQuery } = router.query; router.push({ pathname: '/catalog', query: { ...restQuery, page: 1 }, }, undefined, { shallow: true });
    } else { router.push({ pathname: '/catalog', query: { ...router.query, newItems: 'true', page: 1 }, }, undefined, { shallow: true }); }
    const sourceName = source || ''; fetchProducts(sourceName, 1);
  };

  const [mainCategories] = useState<string[]>(['Люстра', 'Светильник', 'Бра', 'Торшер', 'Уличный светильник', 'Комплектующие', 'Профиль']); // Добавил "Профиль" в основные категории
  const [mainHeatingCategories] = useState<string[]>(['Мат нагревательный', 'Обогрев кровли и площадок', 'Специальный греющий кабель', 'Терморегулятор']);
  const [activeMainCategory, setActiveMainCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(true);
  const [isHeatingContext, setIsHeatingContext] = useState<boolean>(false);

  const isRelatedToMainCategory = (category: Category): boolean => {
    if (!activeMainCategory) return true;
    const categoryNameLower = category.label.toLowerCase();
    const mainCategoryLower = activeMainCategory.toLowerCase();
    if (categoryNameLower.includes(mainCategoryLower)) return true;
    const isHeatingPage = router.query.source === 'heating';
    if (isHeatingPage && mainHeatingCategories.some(c => c.toLowerCase() === mainCategoryLower)) {
       // ... (existing heating logic kept for brevity)
       return true; 
    }
    switch (mainCategoryLower) {
      case 'люстра': return categoryNameLower.includes('подвес') || categoryNameLower.includes('потолочн') || (categoryNameLower.includes('лампа') && categoryNameLower.includes('потолок'));
      case 'светильник': return categoryNameLower.includes('точечн') || categoryNameLower.includes('встраиваем') || categoryNameLower.includes('трековый') || categoryNameLower.includes('спот');
      case 'бра': return categoryNameLower.includes('настен') || categoryNameLower.includes('стен');
      case 'торшер': return categoryNameLower.includes('напольн') || (categoryNameLower.includes('пол') && categoryNameLower.includes('свет'));
      case 'уличный светильник': return categoryNameLower.includes('улиц') || categoryNameLower.includes('фасад') || categoryNameLower.includes('ландшафт') || categoryNameLower.includes('наруж');
      case 'профиль': return categoryNameLower.includes('профиль');
      default: return false;
    }
  };

 const ActiveFilters = () => {
    const brandLogos: Record<string, string> = { 'Artelamp': '/images/brands/artelamplogo.png', 'Favourite': '/images/brands/favouritelogo.png', 'Lumion': '/images/brands/lumionlogo.png', 'LightStar': '/images/brands/lightstarlogo.png', 'OdeonLight': '/images/brands/odeonlightlogo.png', 'Maytoni': '/images/brands/maytonilogo.png', 'Sonex': '/images/brands/sonexlogo.png', 'ElektroStandard': '/images/brands/elektrostandartlogo.png', 'Novotech': '/images/brands/novotechlogo.png', 'Denkirs': '/images/brands/denkirslogo.png', 'KinkLight': '/images/brands/kinklightlogo.png', 'StLuce': '/images/brands/stlucelogo.webp', };
    const hasActiveFilters = (selectedBrand && selectedBrand.name !== 'Все товары') || selectedCategory || selectedColor || selectedMaterial || (minPrice !== 10 || maxPrice !== 1000000) || selectedPower || selectedSocketType || selectedLampCount || selectedShadeColor || selectedFrameColor || availabilityFilter !== 'all' || showOnlyNewItems || sortOrder;
    if (!hasActiveFilters) return null;
    
    // Minimalistic Chips
    const Chip = ({ children, onRemove }: any) => (
        <div className="flex items-center bg-white/5 border border-white/10 text-zinc-200 text-xs rounded-full px-3 py-1.5 transition-colors hover:border-[#812626]/50">
            <span>{children}</span>
            <button onClick={onRemove} className="ml-2 text-zinc-500 hover:text-white transition-colors">✕</button>
        </div>
    );

    return (
      <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-sm">
        <span className="text-xs font-medium text-zinc-500 mr-2 uppercase tracking-wider">Выбрано:</span>
        {selectedBrand && selectedBrand.name !== 'Все товары' && (
            <Chip onRemove={handleBrandDeselect}>
                {brandLogos[selectedBrand.name] ? (
                    <img src={brandLogos[selectedBrand.name]} alt={selectedBrand.name} className="h-5 max-w-[100px] object-contain" />
                ) : (
                    selectedBrand.name
                )}
            </Chip>
        )}
        {selectedCategory && <Chip onRemove={handleCategoryDeselect}>{selectedCategory.label}</Chip>}
        {selectedColor && <Chip onRemove={() => handleColorChange(null)}>Цвет: {selectedColor}</Chip>}
        {(minPrice !== 10 || maxPrice !== 1000000) && <Chip onRemove={() => handlePriceRangeChange(10, 1000000)}>{formatPrice(minPrice)} - {formatPrice(maxPrice)} ₽</Chip>}
        {/* ... other chips for power, socket etc ... */}
        {availabilityFilter !== 'all' && <Chip onRemove={() => handleAvailabilityFilter('all')}>{availabilityFilter === 'inStock' ? 'В наличии' : 'Под заказ'}</Chip>}
        {showOnlyNewItems && <Chip onRemove={() => handleNewItemsFilter(false)}>Новинки</Chip>}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col text-white max-w-[100vw] overflow-x-hidden">
      <SEO
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={`купить ${selectedCategory?.label?.toLowerCase() || 'светильники'} elektromos, ${selectedCategory?.label?.toLowerCase() || 'светильники'}, ${selectedBrand?.name || ''}, электроустановочные изделия, теплые полы, люстры потолочные, люстры подвесные, настенные светильники, торшеры, настольные лампы, розетки, выключатели, Werkel, Donel, Voltum, LightStar, Maytoni, Novotech, Artelamp, Lumion`}
        url={`/catalog${router.asPath.split('?')[0]}`}
        type="website"
        image="/images/logo.webp"
        openGraph={{
          title: `${getPageTitle()} | Elektromos`,
          description: getPageDescription(),
          url: `https://elektromos.ru/catalog${router.asPath.includes('?') ? router.asPath : ''}`,
          type: "website",
          image: "/images/logo.webp",
          site_name: "Elektromos"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": getPageTitle(),
          "description": getPageDescription(),
          "url": `https://elektromos.ru/catalog${router.asPath.includes('?') ? router.asPath : ''}`,
          "numberOfItems": products.length,
          "itemListElement": products.slice(0, 10).map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": product.name,
              "description": product.description || product.name,
              "url": `https://elektromos.ru/products/${product.supplier}/${product.article}`,
              "image": Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/images/logo.webp",
              "brand": { "@type": "Brand", "name": product.supplier || "Elektromos" }
            }
          }))
        }}
      />
      <Header />
      
      {/* Minimalistic Loader */}
      {isFullscreenLoading && (
        <div className="fixed inset-0 bg-[#121212]/90 z-[9999] flex justify-center items-center backdrop-blur-sm">
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 border-2 border-zinc-800 border-t-[#812626] rounded-full animate-spin"></div>
             <span className="mt-4 text-xs font-medium tracking-widest text-zinc-500 uppercase">Загрузка</span>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 mt-40">
        <div className="max-w-[1600px] mx-auto">
          <div className="lg:hidden mb-4">
            <h2 className="text-3xl font-bold text-white mb-4">Каталог</h2>
            <button onClick={toggleMobileFilter} className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-sm text-white">
              <span className="font-medium flex items-center gap-2">Фильтры</span>
              <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400">{totalProducts} товаров</span>
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* SIDEBAR */}
            <aside className={`${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-[#121212] p-6  overflow-y-auto' : 'hidden lg:block'} w-full lg:w-72 mt-20 lg:flex-shrink-0`}>
              {isMobileFilterOpen && (
                 <div className="flex justify-between items-center mb-32 text-white sticky top-0 bg-[#121212] z-20 py-2">
                    <span className="text-2xl font-bold">Фильтры</span>
                    <button onClick={toggleMobileFilter} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>
              )}
              
              <div className="space-y-8 lg:sticky lg:top-32">
                {renderCategories()}
                
                {/* Minimal Price Filter */}
                <div className="border-t border-white/5 pt-6">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Цена, ₽</h3>
                   <div className="flex items-center gap-3 mb-4">
                      <input type="number" value={minPrice} onChange={(e) => setMinPrice(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white focus:border-[#812626] focus:outline-none" placeholder="От" />
                      <div className="w-2 h-px bg-zinc-700"></div>
                      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white focus:border-[#812626] focus:outline-none" placeholder="До" />
                   </div>
                   <input type="range" min="10" max="1000000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#812626]" />
                   <button onClick={() => handlePriceRangeChange(minPrice, maxPrice)} className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-medium text-white rounded-lg transition-colors">Применить</button>
                </div>

                {/* Availability Filter - Restored to Sidebar */}
                <div className="border-t border-white/5 pt-6">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Наличие</h3>
                    <div className="space-y-2">
                         <div 
                             onClick={() => handleAvailabilityFilter('all')} 
                             className={`flex items-center gap-3 py-1 cursor-pointer group ${availabilityFilter === 'all' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                         >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${availabilityFilter === 'all' ? 'border-[#812626]' : 'border-zinc-700'}`}>
                                {availabilityFilter === 'all' && <div className="w-2 h-2 rounded-full bg-[#812626]"></div>}
                            </div>
                            <span className="text-sm">Все</span>
                         </div>
                         <div 
                             onClick={() => handleAvailabilityFilter('inStock')} 
                             className={`flex items-center gap-3 py-1 cursor-pointer group ${availabilityFilter === 'inStock' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                         >
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${availabilityFilter === 'inStock' ? 'border-[#812626]' : 'border-zinc-700'}`}>
                                {availabilityFilter === 'inStock' && <div className="w-2 h-2 rounded-full bg-[#812626]"></div>}
                            </div>
                            <span className="text-sm">В наличии</span>
                         </div>
                         <div 
                             onClick={() => handleAvailabilityFilter('outOfStock')} 
                             className={`flex items-center gap-3 py-1 cursor-pointer group ${availabilityFilter === 'outOfStock' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                         >
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${availabilityFilter === 'outOfStock' ? 'border-[#812626]' : 'border-zinc-700'}`}>
                                {availabilityFilter === 'outOfStock' && <div className="w-2 h-2 rounded-full bg-[#812626]"></div>}
                            </div>
                            <span className="text-sm">Под заказ</span>
                         </div>
                    </div>
                </div>

                {/* Technical Filters - Restored */}
                
                {extractedFilters.socketTypes.length > 0 && (
                  <div className="border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsSocketTypeOpen(!isSocketTypeOpen)}>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Тип цоколя</h3>
                      <span className="text-zinc-600 text-xs">{isSocketTypeOpen ? '−' : '+'}</span>
                    </div>
                    {isSocketTypeOpen && (
                      <div className="space-y-1 mt-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {extractedFilters.socketTypes.map((socket) => (
                          <div key={socket} onClick={() => handleSocketTypeChange(socket)} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedSocketType === socket ? 'bg-[#812626] border-[#812626]' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                {selectedSocketType === socket && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                             </div>
                             <span className={`text-sm ${selectedSocketType === socket ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{socket.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {extractedFilters.lampCounts.length > 0 && (
                    <div className="border-t border-white/5 pt-6">
                        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsLampCountOpen(!isLampCountOpen)}>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Кол-во ламп</h3>
                            <span className="text-zinc-600 text-xs">{isLampCountOpen ? '−' : '+'}</span>
                        </div>
                        {isLampCountOpen && (
                            <div className="mt-2 grid grid-cols-4 gap-2">
                                {extractedFilters.lampCounts.map((count) => (
                                    <div 
                                        key={count} 
                                        onClick={() => handleLampCountChange(count)}
                                        className={`
                                            flex items-center justify-center py-2 rounded-md cursor-pointer text-xs font-medium transition-colors border
                                            ${selectedLampCount === count 
                                                ? 'bg-[#812626]/20 border-[#812626] text-[#812626]' 
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}
                                        `}
                                    >
                                        {count}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {extractedFilters.shadeColors.length > 0 && (
                  <div className="border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsShadeColorOpen(!isShadeColorOpen)}>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Цвет плафона</h3>
                      <span className="text-zinc-600 text-xs">{isShadeColorOpen ? '−' : '+'}</span>
                    </div>
                    {isShadeColorOpen && (
                      <div className="space-y-1 mt-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {extractedFilters.shadeColors.map((color) => (
                          <div key={color} onClick={() => handleShadeColorChange(color)} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedShadeColor === color ? 'bg-[#812626] border-[#812626]' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                {selectedShadeColor === color && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                             </div>
                             <span className={`text-sm ${selectedShadeColor === color ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{capitalizeFirst(color)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {extractedFilters.frameColors.length > 0 && (
                  <div className="border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsFrameColorOpen(!isFrameColorOpen)}>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Цвет арматуры</h3>
                      <span className="text-zinc-600 text-xs">{isFrameColorOpen ? '−' : '+'}</span>
                    </div>
                    {isFrameColorOpen && (
                      <div className="space-y-1 mt-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {extractedFilters.frameColors.map((color) => (
                          <div key={color} onClick={() => handleFrameColorChange(color)} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedFrameColor === color ? 'bg-[#812626] border-[#812626]' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                {selectedFrameColor === color && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                             </div>
                             <span className={`text-sm ${selectedFrameColor === color ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{capitalizeFirst(color)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              

                {/* Brands Accordion - CHANGED TO USE availableFilteredBrands */}
                <div className="border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsBrandFilterOpen(!isBrandFilterOpen)}>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                           {selectedCategory && selectedCategory.label !== 'Все товары' ? 'Бренды этой категории' : 'Бренды'}
                        </h3>
                        <span className="text-zinc-600 text-xs">{isBrandFilterOpen ? '−' : '+'}</span>
                    </div>
                    {isBrandFilterOpen && (
                        <div className="space-y-1 mt-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {availableFilteredBrands.length === 0 && (
                                <div className="text-zinc-500 text-xs italic py-2">Нет брендов для этой категории</div>
                            )}
                            {availableFilteredBrands.map(brand => brand.name !== 'Все товары' && (
                                <div key={brand.name} onClick={() => handleBrandChange(brand)} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrand?.name === brand.name ? 'bg-[#812626] border-[#812626]' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                        {selectedBrand?.name === brand.name && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className={`text-sm ${selectedBrand?.name === brand.name ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{brand.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                </div>
                     {/* Desktop Sorting Bar */}
               <div className="hidden lg:flex lg:flex-col items-center justify-between mb-8 pb-4 border-b border-white/5">
                   <div className=" flex-col items-center gap-4">
                       <div className=" flex-col bg-[#1E1E1E] p-1 rounded-lg">
                           <button onClick={() => handleSortOrderChange('newest')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sortOrder === 'newest' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Новинки</button>
                           <button onClick={() => handleSortOrderChange('popularity')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sortOrder === 'popularity' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Популярные</button>
                           <button onClick={() => handleSortOrderChange('asc')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sortOrder === 'asc' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Цена по убыванию</button>
                           <button onClick={() => handleSortOrderChange('desc')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sortOrder === 'desc' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Цена по возрастанию</button>
                       </div>
                   </div>
                   
                 
               </div>
              </div>
            </aside>
            
            {/* CONTENT */}
            <div className="flex-1 min-w-0">
            
               
               <ActiveFilters />
               
               <div id="products-section">
                {isLoading && products.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-[#1E1E1E] aspect-[3/4] rounded-2xl"></div>)}
                  </div>
                ) : !isLoading && products.length === 0 ? (
                  <div className="p-20 text-center bg-[#1a1a1a]/40 backdrop-blur-sm rounded-xl border border-white/5">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Ничего не найдено</h3>
                      <p className="text-zinc-500 max-w-md mx-auto mb-6">Попробуйте изменить параметры фильтрации или поисковый запрос.</p>
                      <button onClick={handleResetFilters} className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-medium transition-colors">Сбросить фильтры</button>
                  </div>
                ) : (
                  <>
                    <CatalogOfProductSearch products={products} viewMode={'grid'} isLoading={isLoading} />
                    <div className="mt-12 space-y-6">
                      {isLoading && products.length > 0 && (<div className="flex justify-center items-center p-4"><div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-[#812626]"></div></div>)}
                      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} isLoading={isLoading} totalItems={totalProducts} itemsPerPage={limit} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        html, body { overflow-x: hidden !important; max-width: 100vw !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 16px; height: 16px; background: #812626; border-radius: 50%; cursor: pointer; border: 2px solid #121212;
        }
        @media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
        @media (max-width: 480px) { .product-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, params: routeParams }) => {
    const { detectedSource, detectedCategory } = resolveSlug((routeParams as any)?.slug || query.slug);
    const sourceName = detectedSource || query.source || '';
    const categoryName = detectedCategory || query.category;
    const pageNumber = query.page ? parseInt(query.page as string, 10) : 1;
    const timeoutPromise = new Promise((_, reject) => { setTimeout(() => { reject(new Error('Превышено время запроса данных')); }, 10000); });

    try {
        const params: Record<string, any> = {};
        if (categoryName && categoryName !== 'Все товары' && categoryName !== 'все-товары') {
            params.name = categoryName;
            if (typeof params.name === 'string') {
                const lightingCategories = ['Люстра', 'Светильник', 'Бра', 'Торшер', 'Спот', 'Подвесной', 'Подвесная', 'Потолочный', 'Настенный', 'Настольный', 'Лампа', 'Комплектующие', 'Коннектор', 'Шнур', 'Блок питания', 'Патрон', 'Крепление', 'Плафон', 'Профиль для ленты', 'Контроллер'];
                const isLightingCategory = lightingCategories.some(lc => params.name.includes(lc));
                const hiddenBrands = ['Werkel', 'Voltum', 'ЧТК'];
                const isHiddenBrand = hiddenBrands.includes(sourceName as string);
                if (isLightingCategory && (sourceName === 'heating' || isHiddenBrand)) { return { props: { initialProducts: [], initialTotalPages: 1, initialTotalProducts: 0, source: '' } }; }
            }
        }
        // ... params processing
        if (query.minPrice) params.minPrice = query.minPrice;
        if (query.maxPrice) params.maxPrice = query.maxPrice;
        
        // SERVER SIDE DEFAULT SORT: Newest
        if (query.sort) {
            const sortOrder = query.sort as string;
            if (sortOrder === 'asc') { params.sortBy = 'price'; params.sortOrder = 'asc'; }
            else if (sortOrder === 'desc') { params.sortBy = 'price'; params.sortOrder = 'desc'; }
            else if (sortOrder === 'popularity') { params.sortBy = 'popularity'; params.sortOrder = 'desc'; }
            else if (sortOrder === 'newest') { params.sortBy = 'date'; params.sortOrder = 'desc'; }
        } else { 
            // DEFAULT
            params.sortBy = 'date'; params.sortOrder = 'desc'; 
        }

        const dataPromise = combineProductsFromMultiplePages(sourceName as string, pageNumber, 40, params);
        try {
            const data = await Promise.race([dataPromise, timeoutPromise]) as { products: ProductI[], totalPages: number, totalProducts: number };
            return { props: { initialProducts: data.products || [], initialTotalPages: data.totalPages || 1, initialTotalProducts: data.totalProducts || 0, source: sourceName || null, } };
        } catch (error) {
            console.error('Ошибка при получении товаров с сервера', error);
            return { props: { initialProducts: [], initialTotalPages: 1, initialTotalProducts: 0, source: sourceName || null, } };
        }
    } catch (error) {
        console.error('Ошибка при получении товаров с сервера', error);
        return { props: { initialProducts: [], initialTotalPages: 1, initialTotalProducts: 0, source: sourceName || null, } };
    }
};

export default CatalogIndex;
