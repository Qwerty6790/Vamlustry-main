
'use client'

import React, { useEffect, useState } from 'react';
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

// --- ТИПЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Оставлены без изменений) ---
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

export type Category = {
  id?: string;
  label: string;
  searchName: string;
  aliases?: string[]; 
  subcategories?: Category[];
};

const CATEGORY_TREE: Category[] = [
  {
    id: 'lyustra', label: 'Люстра', searchName: 'Люстра',
    subcategories: [
      { label: 'Подвесная люстра', searchName: 'Подвесная люстра', aliases: ['подвес', 'подвесной'] },
      { label: 'Потолочная люстра', searchName: 'Потолочная люстра', aliases: ['потолочн'] },
      { label: 'Люстра на штанге', searchName: 'Люстра на штанге', aliases: ['штанга'] },
      { label: 'Люстра каскадная', searchName: 'Люстра каскадная', aliases: ['каскад'] },
      { label: 'Люстра хрустальная', searchName: 'хрусталь Люстра', aliases: ['хрусталь'] },
      { label: 'Люстра вентилятор', searchName: 'Люстра вентилятор', aliases: ['вентилятор'] },
    ]
  },
  {
    id: 'svetilnik', label: 'Светильники', searchName: 'Светильники',
    aliases: ['светильник', 'освещение'],
    subcategories: [
      { label: 'Потолочный светильник', searchName: 'Потолочный светильник', aliases: ['накладной потолочный'] },
      { label: 'Подвесной светильник', searchName: 'Подвесной светильник', aliases: ['подвес'] },
      { label: 'Настенный светильник', searchName: 'Настенный светильник', aliases: ['бра', 'стен', 'настенн'] },
      { label: 'Встраиваемый светильник', searchName: 'Светильник встраиваемый', aliases: ['врезной', 'точка'] },
      { label: 'Накладной светильник', searchName: 'Светильник накладной', aliases: ['спот накладной'] },
      { label: 'Трековый светильник', searchName: 'Трековый светильник', aliases: ['трек', 'шинопровод', 'магнитный'] },
      { label: 'Точечный светильник', searchName: 'Точечный светильник', aliases: ['спот', 'даунлайт'] },
    ]
  },
  { id: 'bra', label: 'Бра', searchName: 'Настенный светильник', aliases: ['бра'], subcategories: [] },
  { id: 'torsher', label: 'Торшер', searchName: 'Торшер', aliases: ['торшер', 'напольный'], subcategories: [] },
  { id: 'nastolnaya', label: 'Настольная лампа', searchName: 'Настольная лампа', aliases: ['настольн'], subcategories: [] },
  { 
    id: 'ulichni', label: 'Уличный светильник', searchName: 'Уличный светильник', aliases: ['улиц', 'уличн', 'ландшафт'],
    subcategories: [
      { label: 'Настенный уличный', searchName: 'Настенный уличный светильник', aliases: ['фасадный'] },
      { label: 'Грунтовый', searchName: 'Грунтовый светильник', aliases: ['грунт'] },
      { label: 'Ландшафтный', searchName: 'Ландшафтный светильник', aliases: ['сад', 'парк'] },
      { label: 'Парковый', searchName: 'Парковый светильник', aliases: ['столб'] },
    ]
  },
  {
    id: 'komplektuyushie', label: 'Комплектующие', searchName: 'Комплектующие', aliases: ['аксессуары'],
    subcategories: [
      { label: 'Блоки питания', searchName: 'Блок питания', aliases: ['драйвер', 'трансформатор'] },
      { label: 'Профили', searchName: 'Профиль', aliases: ['профиль'] },
      { label: 'Лампочки', searchName: 'Лампа', aliases: ['led лампа'] },
      { label: 'Контроллеры', searchName: 'Контроллер', aliases: ['пульт', 'диммер'] }
    ]
  },
];

type FilterState = {
  minPrice: number;
  maxPrice: number;
  availability: 'all' | 'inStock' | 'outOfStock';
  sort: 'popularity' | 'price_asc' | 'price_desc' | 'newest';
  selectedBrands: string[];
  selectedCategory: string | null;
};

const findNodeInTree = (query: string, nodes: Category[]): Category | null => {
    const q = query.toLowerCase();
    for (const node of nodes) {
        const isNameMatch = node.searchName.toLowerCase().includes(q) || node.label.toLowerCase().includes(q);
        const isAliasMatch = node.aliases?.some(alias => isWordMatch(q, alias));
        if (isNameMatch || isAliasMatch) return node;
        if (node.subcategories) {
            const found = findNodeInTree(query, node.subcategories);
            if (found) return found;
        }
    }
    return null;
};

const SearchResults: React.FC = () => {
  const router = useRouter();
  const { qwery } = router.query;

  // --- State ---
  const [allProducts, setAllProducts] = useState<ProductI[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 24; // Чуть меньше для красивой сетки

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000000,
    availability: 'all',
    sort: 'popularity',
    selectedBrands: [],
    selectedCategory: null
  });

  const [smartCategories, setSmartCategories] = useState<{label: string, searchName: string, count: number}[]>([]);
  const [brandStats, setBrandStats] = useState<{name: string, count: number}[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // --- Fetching Logic (Оставлено без изменений) ---
  useEffect(() => {
    if (!router.isReady || !qwery) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/search`, {
          params: {
            name: qwery,
            page: 1,
            pageSize: 5000, 
            sortBy: 'date',
            sortOrder: 'desc'
          }
        });

        let products: ProductI[] = data.products || [];
        const searchString = String(qwery).toLowerCase();

        if (searchString === 'бра') {
            products = products.filter(p => {
                const info = (p.name + ' ' + (p.category || '')).toLowerCase();
                return isWordMatch(info, 'бра');
            });
        }

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
  }, [qwery]);

  const analyzeStructure = (products: ProductI[], searchQuery: string) => {
    // 1. Бренды
    const bStats = new Map<string, number>();
    products.forEach(p => {
        let brandName = p.source || (p as any).brand || (p as any).vendor || 'Другое';
        brandName = String(brandName).trim();
        if (brandName && brandName !== 'undefined' && brandName !== 'null') {
             bStats.set(brandName, (bStats.get(brandName) || 0) + 1);
        }
    });
    const sortedBrands = Array.from(bStats.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    setBrandStats(sortedBrands);

    // 2. Категории
    let targetNode = findNodeInTree(searchQuery, CATEGORY_TREE);
    if (searchQuery === 'бра') {
         const wallNode = CATEGORY_TREE.find(c => c.id === 'svetilnik')?.subcategories?.find(s => s.aliases?.includes('бра'));
         if (wallNode) targetNode = wallNode;
    }
    if (!targetNode && products.length > 0) {
        const catCounts = new Map<Category, number>();
        products.forEach(p => {
            const pInfo = (String(p.category || '') + ' ' + String(p.name || '')).toLowerCase();
            for (const rootCat of CATEGORY_TREE) {
                const keywords = [rootCat.label, rootCat.searchName, ...(rootCat.aliases || [])];
                if (keywords.some(k => isWordMatch(pInfo, k))) {
                    catCounts.set(rootCat, (catCounts.get(rootCat) || 0) + 1);
                }
            }
        });
        const sortedCats = Array.from(catCounts.entries()).sort((a,b) => b[1] - a[1]);
        if (sortedCats.length > 0) targetNode = sortedCats[0][0];
    }

    const suggestions: {label: string, searchName: string, count: number}[] = [];
    const categoryScope = targetNode?.subcategories?.length ? targetNode : CATEGORY_TREE.find(c => c.id === 'svetilnik');
    if (categoryScope && categoryScope.subcategories) {
        categoryScope.subcategories.forEach(sub => {
            let count = 0;
            const keywords = [sub.label, sub.searchName, ...(sub.aliases || [])];
            products.forEach(p => {
                const pInfo = (String(p.category) + ' ' + String(p.name)).toLowerCase();
                if (sub.aliases?.includes('бра')) {
                    if (isWordMatch(pInfo, 'бра') || pInfo.includes('настен')) count++;
                } else {
                    if (keywords.some(k => isWordMatch(pInfo, k))) count++;
                }
            });
            if (count > 0) suggestions.push({ label: sub.label, searchName: sub.searchName, count });
        });
        suggestions.sort((a,b) => b.count - a.count);
    }
    setSmartCategories(suggestions);
  };

  useEffect(() => {
    let result = [...allProducts];
    // Filter logic
    if (filters.selectedCategory) {
        const catName = filters.selectedCategory.toLowerCase();
        result = result.filter(p => {
            const info = (String(p.category) + ' ' + String(p.name)).toLowerCase();
            if (catName.includes('настенный') || catName.includes('бра')) {
                return isWordMatch(info, 'бра') || info.includes('настенн');
            }
            return info.includes(catName);
        });
    }
    if (filters.selectedBrands.length > 0) {
        result = result.filter(p => {
            let brand = p.source || (p as any).brand || (p as any).vendor || 'Другое';
            brand = String(brand).trim();
            return filters.selectedBrands.includes(brand);
        });
    }
    if (filters.minPrice > 0) result = result.filter(p => (p.price || 0) >= filters.minPrice);
    if (filters.maxPrice < 1000000) result = result.filter(p => (p.price || 0) <= filters.maxPrice);

    if (filters.availability === 'inStock') result = result.filter(p => (Number(p.stock) || 0) > 0);
    else if (filters.availability === 'outOfStock') result = result.filter(p => (Number(p.stock) || 0) <= 0);

    // Sort logic
    if (filters.sort === 'price_asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filters.sort === 'price_desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    setTotalItems(result.length);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    setDisplayedProducts(result.slice(start, start + ITEMS_PER_PAGE));
  }, [allProducts, filters, currentPage]);

  // Handlers
  const toggleBrand = (brand: string) => {
    setFilters(prev => {
        const newBrands = prev.selectedBrands.includes(brand) 
            ? prev.selectedBrands.filter(b => b !== brand) 
            : [...prev.selectedBrands, brand];
        return { ...prev, selectedBrands: newBrands };
    });
    setCurrentPage(1);
  };

  const selectCategory = (catSearchName: string) => {
    setFilters(prev => ({ 
        ...prev, 
        selectedCategory: prev.selectedCategory === catSearchName ? null : catSearchName 
    }));
    setCurrentPage(1);
  };

  const removeCategory = () => {
    setFilters(prev => ({ ...prev, selectedCategory: null }));
  }

  // UI Icons
  const CloseIcon = () => (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Header />
      
      {/* ОТСТУП СВЕРХУ ДЛЯ ФИКСИРОВАННОГО ХЕДЕРА */}
      <div className="pt-24 lg:pt-32"></div>

      <main className="container mx-auto px-4 lg:px-8 pb-20">
        
        {/* ХЛЕБНЫЕ КРОШКИ */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-black transition-colors">Главная</Link>
            <span>&larr;</span> 
            <span>Все категории</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* --- ЛЕВАЯ КОЛОНКА (САЙДБАР) --- */}
            <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-10">
                 
                 {/* КАТЕГОРИИ */}
                 <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-transparent pb-1">
                        <h3 className="font-bold text-sm uppercase tracking-wide">Категории</h3>
                        <span className="text-xl leading-none text-gray-400 font-light">&minus;</span>
                     </div>
                     
                     <div className="pl-0 space-y-3">
                        {/* Заголовок текущей категории поиска */}
                        <div className="font-medium text-gray-900 cursor-pointer flex justify-between items-center">
                           <span>{qwery ? (qwery as string).charAt(0).toUpperCase() + (qwery as string).slice(1) : 'Поиск'}</span>
                           <svg className="w-3 h-3 text-gray-500 transform rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>

                        {/* Список подкатегорий (серым) */}
                        <div className="pl-4 space-y-2 text-sm text-gray-500 border-l border-gray-200 ml-1">
                            {smartCategories.length > 0 ? smartCategories.map((cat) => (
                                <div 
                                    key={cat.searchName}
                                    onClick={() => selectCategory(cat.searchName)}
                                    className={`cursor-pointer hover:text-black transition-colors ${filters.selectedCategory === cat.searchName ? 'text-black font-semibold' : ''}`}
                                >
                                    {cat.label}
                                </div>
                            )) : (
                                <span className="text-xs text-gray-300">Нет подкатегорий</span>
                            )}
                        </div>
                     </div>
                 </div>

                 <div className="h-px bg-gray-200 w-full"></div>

                 {/* ФИЛЬТРЫ */}
                 <div className="space-y-6">
                    <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Фильтры</h3>

                    {/* Наличие */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" 
                                checked={filters.availability === 'inStock'} 
                                onChange={() => setFilters(p => ({...p, availability: p.availability === 'inStock' ? 'all' : 'inStock'}))} 
                                className="w-5 h-5 border-gray-300 rounded-none text-black focus:ring-0 checked:bg-black checked:border-black transition-all"
                             />
                             <span className="text-sm text-gray-600 group-hover:text-black">Товары в наличии</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" 
                                checked={filters.availability === 'outOfStock'} 
                                onChange={() => setFilters(p => ({...p, availability: p.availability === 'outOfStock' ? 'all' : 'outOfStock'}))} 
                                className="w-5 h-5 border-gray-300 rounded-none text-black focus:ring-0"
                             />
                             <span className="text-sm text-gray-600 group-hover:text-black">Товары со скидкой</span>
                        </label>
                         <label className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" className="w-5 h-5 border-gray-300 rounded-none text-black focus:ring-0" />
                             <span className="text-sm text-gray-600 group-hover:text-black">Бесплатная доставка</span>
                        </label>
                    </div>
                 </div>
                 
                 {/* БРЕНДЫ (если есть) */}
                 {brandStats.length > 0 && (
                     <div className="space-y-4">
                         <h3 className="font-bold text-sm uppercase tracking-wide mt-8 mb-2">Бренд</h3>
                         <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                             {brandStats.map(b => (
                                 <label key={b.name} className="flex items-center gap-3 cursor-pointer group">
                                     <input 
                                        type="checkbox" 
                                        checked={filters.selectedBrands.includes(b.name)}
                                        onChange={() => toggleBrand(b.name)}
                                        className="w-5 h-5 border-gray-300 rounded-none text-black focus:ring-0"
                                     />
                                     <span className="text-sm text-gray-600 group-hover:text-black flex-1 truncate">{b.name}</span>
                                     <span className="text-xs text-gray-400">({b.count})</span>
                                 </label>
                             ))}
                         </div>
                     </div>
                 )}

                 {/* ЦЕНА */}
                 <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Цена</h3>
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <input 
                                type="number" 
                                value={filters.minPrice === 0 ? '' : filters.minPrice} 
                                onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})} 
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none placeholder-gray-400" 
                                placeholder="10" 
                            />
                        </div>
                        <div className="w-1/2">
                            <input 
                                type="number" 
                                value={filters.maxPrice === 1000000 ? '' : filters.maxPrice} 
                                onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})} 
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none placeholder-gray-400" 
                                placeholder="1000000" 
                            />
                        </div>
                    </div>
                    {/* Имитация слайдера (серая полоса и точка) */}
                    <div className="relative h-1 bg-gray-200 w-full rounded mt-6">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-black rounded-full border-2 border-white shadow cursor-pointer"></div>
                    </div>
                 </div>

                 {/* КНОПКА ПРИМЕНИТЬ */}
                 <button className="w-full bg-black text-white text-sm font-bold uppercase py-4 hover:bg-gray-800 transition-colors tracking-wider">
                     Применить
                 </button>

            </aside>

            {/* --- ПРАВАЯ КОЛОНКА (КОНТЕНТ) --- */}
            <div className="flex-1">
               
               {/* ЗАГОЛОВОК КАТЕГОРИИ */}
               <div className="mb-8">
                   <h1 className="text-4xl lg:text-5xl font-light text-black mb-2">
                       {qwery ? (qwery as string).charAt(0).toUpperCase() + (qwery as string).slice(1) : 'Поиск'}
                   </h1>
                   <p className="text-gray-400 text-sm">{totalItems} товаров</p>
               </div>

               {/* БЛОК ВЫБРАННЫХ ФИЛЬТРОВ И СОРТИРОВКИ */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
                   
                   {/* "ВЫБРАНО" TAGS */}
                   <div className="flex items-center gap-3 flex-wrap">
                       <span className="text-xs font-bold uppercase tracking-wider text-black mr-2">Выбрано:</span>
                       
                       {filters.selectedCategory && (
                           <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-sm text-sm text-gray-800">
                               {filters.selectedCategory}
                               <button onClick={removeCategory} className="text-gray-400 hover:text-black">
                                   <CloseIcon />
                               </button>
                           </div>
                       )}

                       {/* Пример статичного тега для визуала, если ничего не выбрано можно скрыть */}
                       {!filters.selectedCategory && (
                           <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-sm text-sm text-gray-800">
                               {qwery}
                               <button onClick={() => router.push('/')} className="text-gray-400 hover:text-black">
                                   <CloseIcon />
                               </button>
                           </div>
                       )}
                   </div>

                   {/* СОРТИРОВКА И ВИД */}
                   <div className="flex items-center gap-6 self-end sm:self-auto">
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-600">
                                <span>Рекомендуемые</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {/* Dropdown menu mock */}
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg py-1 hidden group-hover:block z-10">
                                <button onClick={() => setFilters({...filters, sort: 'popularity'})} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">По популярности</button>
                                <button onClick={() => setFilters({...filters, sort: 'price_asc'})} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Сначала дешевые</button>
                                <button onClick={() => setFilters({...filters, sort: 'price_desc'})} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Сначала дорогие</button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                             <button onClick={() => setViewMode('grid')} className={`p-1 hover:text-black ${viewMode === 'grid' ? 'text-black' : ''}`}>
                                 <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="0" y="0" width="8" height="8"/><rect x="10" y="0" width="8" height="8"/><rect x="0" y="10" width="8" height="8"/><rect x="10" y="10" width="8" height="8"/></svg>
                             </button>
                             <button onClick={() => setViewMode('list')} className={`p-1 hover:text-black ${viewMode === 'list' ? 'text-black' : ''}`}>
                                 <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="0" y="2" width="18" height="2"/><rect x="0" y="8" width="18" height="2"/><rect x="0" y="14" width="18" height="2"/></svg>
                             </button>
                        </div>
                   </div>
               </div>

               {/* СПИСОК ТОВАРОВ */}
               {loading ? (
                    <div className="py-20 flex justify-center"><LoadingSpinner isLoading={loading} /></div>
                ) : displayedProducts.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded border border-dashed border-gray-300">
                        <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
                        <p className="text-gray-500 mb-6">Попробуйте изменить параметры поиска.</p>
                        <button onClick={() => setFilters({minPrice: 0, maxPrice: 1000000, availability: 'all', sort: 'popularity', selectedBrands: [], selectedCategory: null})} className="text-black underline underline-offset-4 hover:text-gray-600">Сбросить все фильтры</button>
                    </div>
                ) : (
                    <>
                        <CatalogOfProductSearch products={displayedProducts} viewMode={viewMode} isLoading={false} />
                        
                        <div className="mt-16 border-t border-gray-100 pt-8 flex justify-center">
                            <Pagination 
                                totalPages={totalPages} 
                                currentPage={currentPage} 
                                onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                isLoading={loading} 
                                totalItems={totalItems} 
                                itemsPerPage={ITEMS_PER_PAGE} 
                            />
                        </div>
                    </>
                )}

            </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        /* Стили для скроллбара внутри бренда */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        
        /* Убираем стандартные стили чекбоксов в некоторых браузерах для использования tailwind forms */
        input[type="checkbox"] {
           accent-color: black;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;