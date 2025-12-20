'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';

import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';
import Head from 'next/head';

export default function A07StalPage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [allFilteredProducts, setAllFilteredProducts] = useState<ProductI[]>([]);
  // Функция для загрузки товаров
  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Если данные уже загружены, используем кэш для пагинации
      if (allFilteredProducts.length > 0) {
        const itemsPerPage = 40;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = allFilteredProducts.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
        setCurrentPage(page);
        setLoading(false);
        return;
      }
      
      // Получаем все товары A07 и фильтруем на клиенте
      const params = {
        source: 'Donel',
        name: 'A07',
        page: 1,
        limit: 500 // Берем больше товаров для фильтрации
      };

      const apiUrl = NEXT_PUBLIC_API_URL;
      console.log('Запрос товаров A07 для фильтрации', params);
      
      const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { params });

      if (data && data.products) {
        // Фильтруем товары по коду цвета "37" в конце артикула
        const filteredProducts = data.products.filter((product: any) => {
          const article = product.article || '';
          const name = (product.name || '').toLowerCase();
          
          // Проверяем что это серия A07 и цвет "Сталь" (код 37 или слово "сталь")
          const isA07 = name.includes('a07') || article.toLowerCase().includes('a07');
          const isSteelColor = article.endsWith('37') || name.includes('сталь') || name.includes('steel');
          const isNotWave = !name.includes('wave') && !article.toLowerCase().includes('wave');
          const isNotNatural = !name.includes('natural') && !article.toLowerCase().includes('natural');
          
          console.log(`Товар: ${product.name}, артикул: ${article}, A07: ${isA07}, сталь: ${isSteelColor}, не Wave: ${isNotWave}, не Natural: ${isNotNatural}`);
          
          return isA07 && isSteelColor && isNotWave && isNotNatural;
        });
        
        console.log(`Найдено товаров A07-сталь: ${filteredProducts.length} из ${data.products.length}`);
        
        // Сохраняем все отфильтрованные товары
        setAllFilteredProducts(filteredProducts);
        
        // Пагинация для отфильтрованных товаров
        const itemsPerPage = 40;
        const totalFiltered = filteredProducts.length;
        const totalPagesFiltered = Math.ceil(totalFiltered / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
        setTotalProducts(totalFiltered);
        setTotalPages(totalPagesFiltered);
        setTotalProducts(totalFiltered);
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем товары при монтировании компонента
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Смена страницы
  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      <Head>
        <title>A07 Сталь - Donel | Elektromos</title>
        <meta name="description" content="Алюминиевые рамки серии A07 Сталь в стальном исполнении. Особенности, характеристики, применение в интерьере.Купить в Москве A07 Сталь,Купить Розетки и выключатели" />
      </Head>
      {/* Основное содержимое */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        {/* Заголовок секции */}
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Сталь
          </h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-white">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link href="/ElektroustnovohneIzdely" className="hover:text-white transition-colors">
            Электроустановочные изделия
          </Link>
          <span>/</span>
          <Link href="/ElektroustnovohneIzdely/Donel" className="hover:text-white transition-colors">
            Donel
          </Link>
          <span>/</span>
          <span className="text-white">A07 Сталь</span>
        </nav>
        </div>

      

        {/* Товары */}
        <div className="mb-8">
          { loading ? (
  <LoadingSpinner isLoading={loading} />
) : products.length > 0 ? (
            <CatalogOfProductSearch
              products={products}
              viewMode={viewMode}
              isLoading={loading}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">
                Товары не найдены
              </div>
              <p className="text-gray-500">
                Попробуйте изменить параметры поиска или вернуться позже
              </p>
            </div>
          )}
        </div>

        {/* Пагинация */}
        
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
