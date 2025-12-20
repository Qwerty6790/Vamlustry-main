'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';
import Head from 'next/head';

export default function DonelMechanismsComputerPage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [allFilteredProducts, setAllFilteredProducts] = useState<ProductI[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchProducts = async (retryCount = 0) => {
    try {
      setLoading(true);
      
      const params = {
        source: 'Donel',
        page: 1,
        limit: 10000,
        sortBy: 'article',
        sortOrder: 'asc',
        // Добавляем timestamp для предотвращения кэширования
        _t: Date.now()
      };

      const apiUrl = NEXT_PUBLIC_API_URL;
      console.log(`Попытка загрузки ${retryCount + 1}, параметры:`, params);
      
      const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { 
        params,
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (data && data.products) {
        console.log(`Всего товаров получено: ${data.products.length}`);
        
        // --- Deterministic whitelist logic ---
        // Укажите здесь стабильный список артикулов, которые всегда должны отображаться в этом порядке
        // Пример: ['12300', '45600', '78900'] — замените на реальные значения
        const WHITELIST_ARTICLES: string[] = [
          // TODO: вставьте нужные артикулы
        ];

        // Карта продуктов по артикулам для быстрой выборки
        const productsMap = new Map<string, any>();
        data.products.forEach((p: any) => {
          const art = String(p.article || '').trim();
          if (art) productsMap.set(art, p);
        });

        // Если whitelist пуст — используем прежнюю фильтрацию как fallback
        let filteredProducts: any[] = [];
        if (WHITELIST_ARTICLES.length === 0) {
          // fallback: исходная фильтрация (как раньше)
          filteredProducts = data.products.filter((product: any) => {
            const category = (product.category || '').toLowerCase();
            const name = (product.name || '').toLowerCase();
            const article = String(product.article || '');
            
            // Логируем первые 5 товаров для отладки
            if (data.products.indexOf(product) < 5) {
              console.log(`Товар ${data.products.indexOf(product)}: ${name}, артикул: ${article}`);
            }
            
            const endsWithZeroZero = article.endsWith('00');
            
            const computerKeywords = [
              'механизм розетки schuko с заземлением 16а 250в~ на винтах, серия db',
            'механизм розетки без заземления 16а 250в~ на винтах, серия db',
            'механизм универсальной розетки мультистандарт 16а 250в~ на винтах, серия db',
            'механизм розетки двойной без заземления 16а 250в~ на винтах, серия db',
            'механизм розетки двойной schuko с заземлением 16а 250в~ на винтах, серия db',
            'механизм розетки schuko 16а 250 в~ с зарядным устройством usb a+c, 5v/3a, мощность 20w, на винтах'
            ];
            
            const excludeKeywords = [
              'выключатель',
            ];
            
            const hasKeyword = computerKeywords.some(keyword => 
              name.includes(keyword)
            );
            
            const hasExcludeWord = excludeKeywords.some(keyword => 
              category.includes(keyword) || 
              name.includes(keyword)
            );
            
            if (endsWithZeroZero && hasKeyword && !hasExcludeWord) {
              console.log(`✅ Найден подходящий товар: ${name}, артикул: ${article}`);
            }
            
            return endsWithZeroZero && hasKeyword && !hasExcludeWord;
          });
        } else {
          // Построим итоговый массив в строго заданном порядке
          filteredProducts = WHITELIST_ARTICLES.map((art) => {
            const artKey = String(art).trim();
            const found = productsMap.get(artKey);
            if (found) return found;
            // Заглушка для отсутствующего товара — чтобы количество оставалось постоянным
            const placeholder: Partial<ProductI> = {
              _id: `missing-${artKey}`,
              article: artKey,
              name: 'Товар временно отсутствует',
              source: 'Donel',
              price: 0,
              imageAddresses: [],
              visible: false,
              quantity: 0,
              outOfStock: true
            };
            return placeholder;
          });
        }

        console.log(`Найдено компьютерных механизмов после фильтрации: ${filteredProducts.length}`);

        // Детерминированная сортировка: сначала по числовому артикулу, затем по названию
        const normalizeArticle = (p: any) => {
          const artStr = String(p.article || '').trim();
          const digits = artStr.replace(/\D/g, '');
          return digits ? Number(digits) : NaN;
        };

        filteredProducts.sort((a: any, b: any) => {
          const na = normalizeArticle(a);
          const nb = normalizeArticle(b);
          if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
          if (!isNaN(na) && isNaN(nb)) return -1;
          if (isNaN(na) && !isNaN(nb)) return 1;
          return String(a.name || '').localeCompare(String(b.name || ''));
        });

        // Удаляем дубликаты по артикулу, оставляя первое вхождение
        const seenArticles = new Set<string>();
        const deduped: any[] = [];
        for (const p of filteredProducts) {
          const art = String(p.article || '').trim();
          if (art && seenArticles.has(art)) continue;
          if (art) seenArticles.add(art);
          deduped.push(p);
        }

        const perPage = 40;

        // Проверяем стабильность результата (как раньше) и при необходимости повторяем загрузку
        if (data.products.length < 100 && retryCount < 2) {
          console.log(`Получено мало товаров (${data.products.length}), повторная попытка...`);
          setIsRetrying(true);
          setTimeout(() => fetchProducts(retryCount + 1), 1000);
          return;
        }

        setIsRetrying(false);

        setProducts(deduped);
        setTotalProducts(deduped.length);
        setTotalPages(Math.ceil(deduped.length / perPage));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      
      // Повторная попытка при ошибке
      if (retryCount < 2) {
        console.log(`Ошибка, повторная попытка ${retryCount + 1}...`);
        setTimeout(() => fetchProducts(retryCount + 1), 2000);
        return;
      }
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      <Head>
        <title>Механизмы 220V - Donel | Elektromos</title>
        <meta name="description" content="Механизмы 220V серии Donel. Особенности, характеристики, применение в интерьере.Купить в Москве Механизмы 220V,механизмы Donel" />
      </Head>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
                    <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">220V</h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-white">
          <Link href="/" className="hover:text-white transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/ElektroustnovohneIzdely" className="hover:text-white transition-colors">Электроустановочные изделия</Link>
          <span>/</span>
          <Link href="/ElektroustnovohneIzdely/Donel" className="hover:text-white transition-colors">Donel</Link>
          <span>/</span>
          <span className="text-white">220V</span>
        </nav>
        </div>

        

        <div className="mb-8">
          { loading ? (
  <LoadingSpinner isLoading={loading} />
) : products.length > 0 ? (
            <CatalogOfProductSearch 
              products={products.slice((currentPage - 1) * 40, currentPage * 40)} 
              viewMode={viewMode} 
              isLoading={loading} 
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">Товары не найдены</div>
            </div>
          )}
        </div>

        
{ /* pagination */ }
        <PaginationComponents
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={loading}
          totalItems={totalProducts}
          itemsPerPage={40}
        />
           
          </div>   
      </div>
   
  );
} 
