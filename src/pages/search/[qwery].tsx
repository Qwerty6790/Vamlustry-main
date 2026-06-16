
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import Pagination from '@/components/PagintaionComponentsxCatalog';
import LoadingSpinner from '@/components/LoadingSpinner';

import 'tailwindcss/tailwind.css';

import { ProductI } from '@/types/interfaces';

// ===============================
// HELPERS
// ===============================

const isWordMatch = (fullText: string, keyword: string): boolean => {
  if (!fullText) return false;
  const t = fullText.toLowerCase();
  const k = keyword.toLowerCase();
  if (k === 'бра') {
    const regex = new RegExp(`(?:^|[^а-яёa-z0-9])${k}(?:[^а-яёa-z0-9]|$)`, 'iu');
    return regex.test(t);
  }
  return t.includes(k);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const cleanFilterValue = (val: any): string => {
  if (val === null || val === undefined) return '';
  let str = String(val);
  str = str.replace(/<[^>]*>?/gm, '');
  str = str.replace(/[^\p{L}\p{N}\s.-]/gu, ' ');
  str = str.replace(/^[.-]+|[.-]+$/g, ' ');
  str = str.replace(/\s+/g, ' ').trim();
  return str;
};

const isValidFilterValue = (val: any): boolean => {
  if (val === null || val === undefined) return false;
  const rawString = String(val).toLowerCase();
  if (rawString.includes('объект не найден') || rawString.includes('object not found')) return false;
  const str = cleanFilterValue(val);
  if (!str) return false;
  const lowerStr = str.toLowerCase();
  if (lowerStr === 'undefined' || lowerStr === 'null' || lowerStr === 'none') return false;
  if (/[a-zA-Z0-9]{20,}/.test(str)) return false;
  return true;
};

const capitalizeFirst = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const normalizeFilterValue = (value: string): string => {
  const cleaned = cleanFilterValue(value);
  if (!cleaned) return '';
  const lowerValue = cleaned.toLowerCase();
  
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
  return capitalizeFirst(cleaned);
};

// ===============================
// УМНАЯ ФИЛЬТРАЦИЯ КАТЕГОРИЙ
// ===============================

const getRootWord = (word: string) => {
  if (word.length <= 3) return word;
  return word.replace(/(ая|ый|ые|ие|ой|а|ы|и|у|е|о|ом|ям|ях)$/i, '');
};

const isCategoryMatch = (pInfo: string, category: Category): boolean => {
  const info = pInfo.toLowerCase();
  const words = category.searchName.toLowerCase().split(' ').filter(Boolean);
  
  const allWordsMatch = words.every(w => {
     const root = getRootWord(w);
     return info.includes(root);
  });

  if (allWordsMatch) return true;

  if (category.aliases?.some(alias => {
      const aliasRoots = alias.toLowerCase().split(' ').filter(Boolean).map(getRootWord);
      return aliasRoots.every(r => info.includes(r));
  })) {
     return true;
  }

  return false;
};

// ===============================
// SEO & TYPES
// ===============================

const getSeoContent = (query: string) => {
  const q = query?.toLowerCase() || '';
  if (q.includes('люстр')) return { title: 'Свет который окружает тебя — современные потолочные люстры и освещение', description: 'Большой выбор люстр для дома и квартиры. Потолочные, подвесные, дизайнерские и современные люстры с доставкой.', keywords: 'люстры, купить люстру, потолочная люстра, подвесная люстра, светильники, освещение', seoText: `Люстры — важный элемент современного интерьера и основа качественного освещения.` };
  if (q.includes('бра')) return { title: 'Бра настенные — купить настенные светильники', description: 'Современные бра и настенные светильники для спальни, гостиной и коридора.', keywords: 'бра, настенный светильник, купить бра, освещение стены, светильники', seoText: `Настенные бра помогают создать уютное локальное освещение в спальне, гостиной, прихожей и коридоре.` };
  if (q.includes('трек') || q.includes('шинопров') || q.includes('магнит')) return { title: 'Трековые светильники — магнитные и шинные системы освещения', description: 'Купить трековые светильники и магнитные системы освещения.', keywords: 'трековые светильники, магнитные светильники, шинопровод, трековое освещение', seoText: `Трековые светильники — современное решение для гибкого освещения интерьера.` };
  
  return {
    title: `${query} — купить светильники и освещение`,
    description: 'Каталог светильников, люстр, бра и освещения для дома. Большой выбор товаров с доставкой.',
    keywords: 'светильники, люстры, бра, освещение, купить светильники',
    seoText: `Каталог светильников и освещения для дома, квартиры и коммерческих помещений.`
  };
};

export type Category = {
  id?: string;
  label: string;
  searchName: string;
  aliases?: string[];
  subcategories?: Category[];
};

type FilterState = {
  minPrice: number;
  maxPrice: number;
  availability: 'all' | 'inStock' | 'outOfStock';
  sort: 'popularity' | 'price_asc' | 'price_desc' | 'newest';
  selectedBrands: string[];
  selectedCategory: string | null;
  socketType: string | null;
  lampCount: number | null;
  shadeColor: string | null;
  frameColor: string | null;
};

type SmartCategory = {
  label: string;
  searchName: string;
  count: number;
  matchObj: Category;
};

// ===============================
// CATEGORY TREE (ОБНОВЛЕНО)
// ===============================

const CATEGORY_TREE: Category[] = [
  {
    id: 'lyustra', label: 'Люстры', searchName: 'люстра', aliases: ['люстры'],
    subcategories: [
      { label: 'Подвесная люстра', searchName: 'подвесная люстра', aliases: ['подвес'] },
      { label: 'Потолочная люстра', searchName: 'потолочная люстра', aliases: [] },
      { label: 'Люстра на штанге', searchName: 'люстра штанга', aliases: ['на штанге'] },
      { label: 'Люстра каскадная', searchName: 'каскадная люстра', aliases: ['каскад'] },
      { label: 'Люстра хрустальная', searchName: 'хрустальная люстра', aliases: ['хрусталь'] },
      { label: 'Люстра вентилятор', searchName: 'люстра вентилятор', aliases: [] }
    ]
  },
  {
    id: 'svetilnik', label: 'Светильники', searchName: 'светильник', aliases: ['освещение'],
    subcategories: [
      { label: 'Потолочный светильник', searchName: 'потолочный светильник', aliases: [] },
      { label: 'Подвесной светильник', searchName: 'подвесной светильник', aliases: ['подвес'] },
      { label: 'Настенный светильник', searchName: 'настенный светильник', aliases: ['бра', 'стен', 'настенн'] },
      { label: 'Встраиваемый светильник', searchName: 'встраиваемый светильник', aliases: ['врезной'] },
      { label: 'Накладной светильник', searchName: 'накладной светильник', aliases: ['спот накладной'] },
      { label: 'Точечный светильник', searchName: 'точечный светильник', aliases: ['спот', 'даунлайт'] },
      // НОВЫЙ 3-Й УРОВЕНЬ
      { 
        label: 'Трековые светильники', 
        searchName: 'трековый светильник', 
        aliases: ['трек', 'шинопровод', 'трековая'],
        subcategories: [
          { label: 'Магнитный трековый светильник', searchName: 'магнитный трековый', aliases: ['магнит'] },
          { label: 'Умный трековый светильник', searchName: 'умный трековый', aliases: ['smart', 'умн'] },
          { label: 'Акцентный светильник', searchName: 'акцентный трековый', aliases: ['акцентн'] },
          { label: 'Линейный светильник', searchName: 'линейный трековый', aliases: ['линейн'] },
          { label: 'Уличный трековый светильник', searchName: 'уличный трековый', aliases: ['уличн'] },
          { label: 'Поворотный однофазный трековый светильник', searchName: 'поворотный однофазный', aliases: ['однофазн'] },
          { label: 'Угловой трековый светильник', searchName: 'угловой трековый', aliases: ['углов'] },
          { label: 'Комплект ременной трековой системы', searchName: 'ременной трековой', aliases: ['ременн'] },
          { label: 'Светильник для трека', searchName: 'светильник для трека', aliases: [] }
        ]
      }
    ]
  },
  { id: 'bra', label: 'Бра', searchName: 'настенный светильник', aliases: ['бра'], subcategories: [] },
  { id: 'torher', label: 'Торшер', searchName: 'торшер', aliases: [], subcategories: [] },
  { id: 'nastolyny svetilnik', label: 'Настольный светильник', searchName: 'настольный светильник', aliases: [], subcategories: [] }
];

// Улучшенная функция: теперь поддерживает 3 уровня (найдет меню для трековых)
const findRootCategory = (query: string, tree: Category[]): Category | null => {
  const q = query.toLowerCase();
  
  for (const root of tree) {
    const isRootMatch = root.label.toLowerCase().includes(q) || root.searchName.toLowerCase().includes(q) || root.aliases?.some(a => q.includes(a));
    
    if (root.subcategories) {
      for (const sub of root.subcategories) {
        const isSubMatch = sub.label.toLowerCase().includes(q) || sub.searchName.toLowerCase().includes(q) || sub.aliases?.some(a => q.includes(a));
        
        // Если это категория 3-го уровня (Трековые) и у нее есть свои подкатегории
        if (sub.subcategories && sub.subcategories.length > 0) {
           if (isSubMatch) return sub; // Искали "Трековые" -> возвращаем "Трековые", покажем виды треков
           
           for (const subSub of sub.subcategories) {
              const isSubSubMatch = subSub.label.toLowerCase().includes(q) || subSub.searchName.toLowerCase().includes(q) || subSub.aliases?.some(a => q.includes(a));
              if (isSubSubMatch) return sub; // Искали "Магнитный" -> возвращаем родителя "Трековые"
           }
        }
        
        // Если это обычная подкатегория (Подвесная люстра)
        if (isSubMatch) return root; // Искали "Подвесная" -> возвращаем корень "Люстры"
      }
    }
    
    if (isRootMatch) return root;
  }
  return null;
};

// ===============================
// COMPONENT
// ===============================

const SearchResults: React.FC = () => {
  const router = useRouter();
  const { qwery } = router.query;
  const seo = useMemo(() => getSeoContent(String(qwery || '')), [qwery]);
  const canonicalUrl = `https://вамлюстра.рф/catalog/${encodeURIComponent(String(qwery || ''))}`;

  const [allProducts, setAllProducts] = useState<ProductI[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 24;

  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000000,
    availability: 'all',
    sort: 'popularity',
    selectedBrands: [],
    selectedCategory: null,
    socketType: null,
    lampCount: null,
    shadeColor: null,
    frameColor: null,
  });

  const [smartCategories, setSmartCategories] = useState<SmartCategory[]>([]);
  const [brandStats, setBrandStats] = useState<{ name: string; count: number; }[]>([]);

  const [extractedFilters, setExtractedFilters] = useState({
    socketTypes: [] as string[],
    lampCounts: [] as number[],
    shadeColors: [] as string[],
    frameColors: [] as string[],
  });

  const [isSocketTypeOpen, setIsSocketTypeOpen] = useState(true);
  const [isLampCountOpen, setIsLampCountOpen] = useState(true);
  const [isShadeColorOpen, setIsShadeColorOpen] = useState(true);
  const [isFrameColorOpen, setIsFrameColorOpen] = useState(true);

  const [viewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!router.isReady || !qwery) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/search`, {
          params: { name: qwery, page: 1, pageSize: 5000, sortBy: 'date', sortOrder: 'desc' }
        });

        let products: ProductI[] = data.products || [];
        const searchString = String(qwery).toLowerCase();

        if (searchString === 'бра') {
          products = products.filter(p => {
            const info = (p.name + ' ' + (p.category || '')).toLowerCase();
            return isWordMatch(info, 'бра');
          });
        }

        products = shuffleArray(products);
        setAllProducts(products);
        analyzeStructure(products, searchString);
      } catch (error) {
        console.error(error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [qwery, router.isReady]);

  const analyzeStructure = (products: ProductI[], searchQuery: string) => {
    const bStats = new Map<string, number>();
    const socketTypes = new Set<string>();
    const lampCounts = new Set<number>();
    const shadeColorsMap = new Map<string, string>();
    const frameColorsMap = new Map<string, string>();

    products.forEach(p => {
      let brandRaw = p.source || (p as any).brand || (p as any).vendor;
      if (isValidFilterValue(brandRaw)) {
        let brandName = cleanFilterValue(brandRaw);
        bStats.set(brandName, (bStats.get(brandName) || 0) + 1);
      } else {
        bStats.set('Другое', (bStats.get('Другое') || 0) + 1);
      }

      if (isValidFilterValue(p.socketType)) socketTypes.add(cleanFilterValue(p.socketType));
      
      if (p.lampCount !== null && p.lampCount !== undefined) {
        const lcStr = cleanFilterValue(p.lampCount);
        const lc = Number(lcStr);
        if (!isNaN(lc) && lc > 0 && lcStr.length < 5) lampCounts.add(lc);
      }

      if (isValidFilterValue(p.shadeColor)) { 
        const normalized = normalizeFilterValue(String(p.shadeColor));
        if (normalized) shadeColorsMap.set(normalized, normalized); 
      }

      if (isValidFilterValue(p.frameColor)) { 
        const normalized = normalizeFilterValue(String(p.frameColor)); 
        if (normalized) frameColorsMap.set(normalized, normalized); 
      }
    });

    const sortedBrands = Array.from(bStats.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    setBrandStats(sortedBrands);

    setExtractedFilters({
      socketTypes: Array.from(socketTypes).sort(),
      lampCounts: Array.from(lampCounts).sort((a, b) => a - b),
      shadeColors: Array.from(shadeColorsMap.values()).sort(),
      frameColors: Array.from(frameColorsMap.values()).sort()
    });

    const rootNode = findRootCategory(searchQuery, CATEGORY_TREE);
    const suggestions: SmartCategory[] = [];

    if (rootNode && rootNode.subcategories && rootNode.subcategories.length > 0) {
      rootNode.subcategories.forEach(sub => {
        let count = 0;
        products.forEach(p => {
          const pInfo = (String(p.category || '') + ' ' + String(p.name || ''));
          if (isCategoryMatch(pInfo, sub)) count++;
        });
        if (count > 0) suggestions.push({ label: sub.label, searchName: sub.searchName, count, matchObj: sub });
      });
    } else {
      CATEGORY_TREE.forEach(main => {
        let count = 0;
        products.forEach(p => {
          const pInfo = (String(p.category || '') + ' ' + String(p.name || ''));
          if (isCategoryMatch(pInfo, main)) count++;
        });
        if (count > 0) suggestions.push({ label: main.label, searchName: main.searchName, count, matchObj: main });
      });
    }
    
    setSmartCategories(suggestions);
  };

  useEffect(() => {
    let result = [...allProducts];

    if (filters.selectedCategory) {
      const selectedCatObj = smartCategories.find(c => c.searchName === filters.selectedCategory)?.matchObj;
      result = result.filter(p => {
        const info = (String(p.category || '') + ' ' + String(p.name || ''));
        if (selectedCatObj) {
           return isCategoryMatch(info, selectedCatObj);
        }
        return info.toLowerCase().includes(filters.selectedCategory!.toLowerCase());
      });
    }

    if (filters.selectedBrands.length > 0) {
      result = result.filter(p => {
        let brandRaw = p.source || (p as any).brand || (p as any).vendor;
        let brand = isValidFilterValue(brandRaw) ? cleanFilterValue(brandRaw) : 'Другое';
        return filters.selectedBrands.includes(brand);
      });
    }

    if (filters.minPrice > 0) result = result.filter(p => (p.price || 0) >= filters.minPrice);
    if (filters.maxPrice < 1000000) result = result.filter(p => (p.price || 0) <= filters.maxPrice);

    if (filters.socketType) result = result.filter(p => cleanFilterValue(p.socketType) === filters.socketType);
    if (filters.lampCount !== null) result = result.filter(p => Number(cleanFilterValue(p.lampCount)) === filters.lampCount);
    if (filters.shadeColor) result = result.filter(p => p.shadeColor && normalizeFilterValue(String(p.shadeColor)) === filters.shadeColor);
    if (filters.frameColor) result = result.filter(p => p.frameColor && normalizeFilterValue(String(p.frameColor)) === filters.frameColor);

    if (filters.sort === 'price_asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (filters.sort === 'price_desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    setTotalItems(result.length);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    setDisplayedProducts(result.slice(0, currentPage * ITEMS_PER_PAGE));
  }, [allProducts, filters, currentPage, smartCategories]);

  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand) ? prev.selectedBrands.filter(b => b !== brand) : [...prev.selectedBrands, brand]
    }));
    setCurrentPage(1);
  };

  const selectCategory = (catSearchName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory: prev.selectedCategory === catSearchName ? null : catSearchName
    }));
    setCurrentPage(1);
  };

  const handleFilterSelect = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
    setCurrentPage(1);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.title,
    description: seo.description,
    url: canonicalUrl
  };

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Header />
        <div className="pt-24 lg:pt-32"></div>

        <main className="container mx-auto px-4 lg:px-8 pb-20">
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-black transition-colors">Главная</Link>
            <span>Результаты поиска</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* SIDEBAR */}
            <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-10">
              
              {/* КАТЕГОРИИ */}
              {smartCategories.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wide">Категории</h3>
                  <div className="pl-4 space-y-2 text-sm text-gray-500 border-l border-gray-200 ml-1">
                    {smartCategories.map(cat => (
                      <div
                        key={cat.searchName}
                        onClick={() => selectCategory(cat.searchName)}
                        className={`cursor-pointer hover:text-black transition-colors flex justify-between ${
                          filters.selectedCategory === cat.searchName ? 'text-black font-semibold' : ''
                        }`}
                      >
                        <span className="truncate mr-2">{cat.label}</span>
                        <span className="text-xs text-gray-400">({cat.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* БРЕНДЫ */}
              {brandStats.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wide">Бренды</h3>
                  <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {brandStats.map(b => (
                      <label key={b.name} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black cursor-pointer transition-colors"
                          checked={filters.selectedBrands.includes(b.name)}
                          onChange={() => toggleBrand(b.name)}
                        />
                        <span className="text-sm flex-1 truncate group-hover:text-black transition-colors">{b.name}</span>
                        <span className="text-xs text-gray-400">({b.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ОСТАЛЬНЫЕ ФИЛЬТРЫ */}
              <div>
                {extractedFilters.socketTypes.length > 0 && ( 
                  <div className="mb-8 border-t border-gray-100 pt-6"> 
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setIsSocketTypeOpen(!isSocketTypeOpen)}> 
                      <h3 className="text-sm font-bold text-black uppercase tracking-widest">Тип цоколя</h3> 
                      <span className="text-lg font-light text-gray-400">{isSocketTypeOpen ? '−' : '+'}</span> 
                    </div> 
                    {isSocketTypeOpen && ( 
                      <div className="space-y-3 mt-4 max-h-48 overflow-y-auto custom-scrollbar pr-2"> 
                        {extractedFilters.socketTypes.map((socket) => ( 
                          <label key={socket} className="flex items-center gap-3 cursor-pointer group"> 
                            <input type="checkbox" checked={filters.socketType === socket} onChange={() => handleFilterSelect('socketType', socket)} className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black cursor-pointer transition-colors" /> 
                            <span className={`text-sm uppercase transition-colors ${filters.socketType === socket ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black'}`}>{socket}</span> 
                          </label> 
                        ))} 
                      </div> 
                    )} 
                  </div> 
                )}

                {extractedFilters.lampCounts.length > 0 && ( 
                  <div className="mb-8 border-t border-gray-100 pt-6"> 
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setIsLampCountOpen(!isLampCountOpen)}> 
                      <h3 className="text-sm font-bold text-black uppercase tracking-widest">Кол-во ламп</h3> 
                      <span className="text-lg font-light text-gray-400">{isLampCountOpen ? '−' : '+'}</span> 
                    </div> 
                    {isLampCountOpen && ( 
                      <div className="mt-4 grid grid-cols-4 gap-2"> 
                        {extractedFilters.lampCounts.map((count) => ( 
                          <div key={count} onClick={() => handleFilterSelect('lampCount', count)} className={`flex items-center justify-center py-2 cursor-pointer text-sm transition-colors border ${filters.lampCount === count ? 'bg-black text-white border-black font-medium' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-black hover:text-black'}`}> 
                            {count} 
                          </div> 
                        ))} 
                      </div> 
                    )} 
                  </div> 
                )}

                {extractedFilters.shadeColors.length > 0 && ( 
                  <div className="mb-8 border-t border-gray-100 pt-6"> 
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setIsShadeColorOpen(!isShadeColorOpen)}> 
                      <h3 className="text-sm font-bold text-black uppercase tracking-widest">Цвет плафона</h3> 
                      <span className="text-lg font-light text-gray-400">{isShadeColorOpen ? '−' : '+'}</span> 
                    </div> 
                    {isShadeColorOpen && ( 
                      <div className="space-y-3 mt-4 max-h-48 overflow-y-auto custom-scrollbar pr-2"> 
                        {extractedFilters.shadeColors.map((color) => ( 
                          <label key={color} className="flex items-center gap-3 cursor-pointer group"> 
                            <input type="checkbox" checked={filters.shadeColor === color} onChange={() => handleFilterSelect('shadeColor', color)} className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black cursor-pointer transition-colors" /> 
                            <span className={`text-sm transition-colors ${filters.shadeColor === color ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black'}`}>{color}</span> 
                          </label> 
                        ))} 
                      </div> 
                    )} 
                  </div> 
                )}

                {extractedFilters.frameColors.length > 0 && ( 
                  <div className="mb-8 border-t border-gray-100 pt-6"> 
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setIsFrameColorOpen(!isFrameColorOpen)}> 
                      <h3 className="text-sm font-bold text-black uppercase tracking-widest">Цвет арматуры</h3> 
                      <span className="text-lg font-light text-gray-400">{isFrameColorOpen ? '−' : '+'}</span> 
                    </div> 
                    {isFrameColorOpen && ( 
                      <div className="space-y-3 mt-4 max-h-48 overflow-y-auto custom-scrollbar pr-2"> 
                        {extractedFilters.frameColors.map((color) => ( 
                          <label key={color} className="flex items-center gap-3 cursor-pointer group"> 
                            <input type="checkbox" checked={filters.frameColor === color} onChange={() => handleFilterSelect('frameColor', color)} className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black cursor-pointer transition-colors" /> 
                            <span className={`text-sm transition-colors ${filters.frameColor === color ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black'}`}>{color}</span> 
                          </label> 
                        ))} 
                      </div> 
                    )} 
                  </div> 
                )}
              </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1">
              <header className="mb-10">
                <h1 className="text-4xl lg:text-5xl font-light text-black mb-3">{qwery}</h1>
                <p className="text-gray-400 text-sm">{totalItems} товаров</p>
              </header>

              {loading ? (
                <div className="py-20 flex justify-center">
                  <LoadingSpinner isLoading={loading} />
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded border border-dashed border-gray-300">
                  <h2 className="text-lg font-medium mb-2">Ничего не найдено</h2>
                  <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры.</p>
                </div>
              ) : (
                <>
                  <CatalogOfProductSearch products={displayedProducts} viewMode={viewMode} isLoading={false} />
                  
                  {currentPage < totalPages && (
                    <div className="mt-12 flex justify-center">
                      <button onClick={() => setCurrentPage(prev => prev + 1)} className="px-10 py-3.5 bg-white border border-black text-black text-sm uppercase tracking-widest font-semibold hover:bg-black hover:text-white transition-all duration-300 rounded-sm">
                        Показать еще
                      </button>
                    </div>
                  )}

                  <div className="mt-16 border-t border-gray-100 pt-8 flex justify-center">
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} isLoading={loading} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} />
                  </div>
                </>
              )}

              {/* SEO TEXT */}
              <section className="mt-20 border-t border-gray-100 pt-12">
                <h2 className="text-2xl font-semibold mb-6">{seo.title}</h2>
                <div className="space-y-4 text-gray-600 leading-8 text-[15px]">
                  <p>{seo.seoText}</p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <Footer />

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
          input[type='checkbox'] { accent-color: black; }
          input[type='checkbox'].appearance-none:checked {
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
            border-color: transparent;
            background-color: black;
          }
        `}</style>
      </div>
    </>
  );
};

export default SearchResults;
