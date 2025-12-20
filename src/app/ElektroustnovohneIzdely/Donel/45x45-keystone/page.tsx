'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

export default function Donel45x45KeystonePage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [allFilteredProducts, setAllFilteredProducts] = useState<ProductI[]>([]);

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Если товары уже загружены, просто показываем их
      if (allFilteredProducts.length > 0) {
        setProducts(allFilteredProducts);
        setLoading(false);
        return;
      }
      
      const apiUrl = NEXT_PUBLIC_API_URL;
      let allProducts: any[] = [];
      
      // Оптимизированная загрузка - ищем только товары с Keystone в названии
      for (let pageNum = 1; pageNum <= 3; pageNum++) {
        try {
          const params = {
            source: 'Donel',
            page: pageNum,
            limit: 500,
            inStock: 'true',
            name: 'keystone',
            include_name: ''
          };
          
          console.log(`[Keystone 45x45] Загружаем страницу ${pageNum} с поиском "keystone"...`);
          const response = await axios.get(`${apiUrl}/api/products/Donel`, { params });
          
          if (response.data && response.data.products && Array.isArray(response.data.products)) {
            const pageProducts = response.data.products;
            allProducts = [...allProducts, ...pageProducts];
            console.log(`[Keystone 45x45] Страница ${pageNum}: +${pageProducts.length} товаров (всего: ${allProducts.length})`);
            
            // Если нашли достаточно товаров или это последняя страница
            if (pageProducts.length < params.limit || allProducts.length > 100) {
              console.log(`[Keystone 45x45] Остановка загрузки на странице ${pageNum}`);
              break;
            }
          } else {
            console.log(`[Keystone 45x45] Страница ${pageNum}: нет данных`);
            break;
          }
          
          // Минимальная задержка
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`[Keystone 45x45] Ошибка страницы ${pageNum}:`, error);
          break;
        }
      }
      
      // Удаляем дубликаты по артикулу
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.article === product.article)
      );
      
      console.log('Всего загружено товаров:', allProducts.length);
      console.log('Уникальных товаров:', uniqueProducts.length);

      if (uniqueProducts.length > 0) {
        // Быстрая фильтрация только Keystone модулей 45x45
        const filteredProducts = uniqueProducts.filter((product: any) => {
          const name = (product.name || '').toLowerCase();
          const category = (product.category || '').toLowerCase();
          
          // Быстрая проверка на Keystone
          const hasKeystone = name.includes('keystone') || 
                             name.includes('кейстоун') ||
                             category.includes('keystone');
          
          // Быстрая проверка на 45x45
          const has45x45 = name.includes('45х45') || 
                          name.includes('45x45') ||
                          name.includes('(45х45') ||
                          name.includes('(45x45');
          
          const isMatch = hasKeystone && has45x45;
          
          // Логируем только подходящие товары
          if (isMatch) {
            console.log(`[Keystone 45x45] НАЙДЕН: "${product.name}"`);
          }
          
          return isMatch;
        });
        
        // Показываем отфильтрованные товары
        setAllFilteredProducts(filteredProducts);
        setProducts(filteredProducts);
        setTotalProducts(filteredProducts.length);
        setTotalPages(1);
        setCurrentPage(1);
        
        console.log(`✅ Найдено товаров Keystone 45x45: ${filteredProducts.length}`);
        if (filteredProducts.length > 0) {
          console.log('Найденные товары:', filteredProducts.map((p: any) => ({
            name: p.name,
            article: p.article
          })));
        } else {
          console.log('❌ Товары Keystone 45x45 не найдены в результатах поиска');
          // Fallback: если поиск не дал результатов, попробуем загрузить первые товары
          console.log('🔄 Поиск не дал результатов, пробуем fallback...');
          
          try {
            const fallbackParams = {
              source: 'Donel',
              page: 1,
              limit: 100,
              inStock: 'true'
            };
            
            const fallbackResponse = await axios.get(`${apiUrl}/api/products/Donel`, { params: fallbackParams });
            
            if (fallbackResponse.data && fallbackResponse.data.products) {
              const fallbackProducts = fallbackResponse.data.products;
              console.log(`Fallback загружено товаров: ${fallbackProducts.length}`);
              
              // Ищем Keystone модули среди первых товаров
              const fallbackFiltered = fallbackProducts.filter((product: any) => {
                const name = (product.name || '').toLowerCase();
                const hasKeystone = name.includes('keystone') || name.includes('кейстоун');
                const has45x45 = name.includes('45х45') || name.includes('45x45');
                return hasKeystone && has45x45;
              });
              
              if (fallbackFiltered.length > 0) {
                setAllFilteredProducts(fallbackFiltered);
                setProducts(fallbackFiltered);
                setTotalProducts(fallbackFiltered.length);
                setTotalPages(1);
                setCurrentPage(1);
                console.log(`✅ Fallback: найдено товаров Keystone 45x45: ${fallbackFiltered.length}`);
              } else {
                console.log('❌ Fallback: товары Keystone 45x45 не найдены');
              }
            }
          } catch (fallbackError) {
            console.error('Ошибка fallback загрузки:', fallbackError);
          }
        }
      } else {
        console.log('❌ Товары не загружены');
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allFilteredProducts.length === 0) {
      fetchProducts(1);
    }
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '88rem' }}>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-52" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Keystone модули серии 45x45</h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-white">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/ElektroustnovohneIzdely" className="hover:text-white transition-colors">Электроустановочные изделия</Link>
            <span>/</span>
            <Link href="/ElektroustnovohneIzdely/Donel" className="hover:text-white transition-colors">Donel</Link>
            <span>/</span>
            <span className="text-white">45x45 Keystone</span>
          </nav>
        </div>

        <div>
          { loading ? (
  <LoadingSpinner isLoading={loading} />
) : products.length > 0 ? (
            <CatalogOfProductSearch products={products} viewMode={viewMode} isLoading={loading} />
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
