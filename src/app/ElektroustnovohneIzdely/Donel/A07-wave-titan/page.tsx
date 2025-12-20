'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import CatalogOfProductSearch from '@/components/catalogofsearch';

export default function A07WaveTitanPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [allFilteredProducts, setAllFilteredProducts] = useState<any[]>([]);

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    try {
      // Используем кеш если уже загружали товары
      if (allFilteredProducts.length > 0) {
        // Пагинация для отфильтрованных товаров
        const itemsPerPage = 40;
        const totalFiltered = allFilteredProducts.length;
        const totalPagesFiltered = Math.ceil(totalFiltered / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = allFilteredProducts.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
        setTotalProducts(totalFiltered);
        setTotalPages(totalPagesFiltered);
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
      console.log('Запрос товаров A07 Wave для фильтрации', params);
      
      const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { params });

      if (data && data.products) {
        // Фильтруем товары для A07 Wave Титан
        const filteredProducts = data.products.filter((product: any) => {
          const article = product.article || '';
          const name = (product.name || '').toLowerCase();
          
          // Проверяем что это серия A07 и цвет "Титан" (код 45)
          const isA07 = name.includes('a07') || article.toLowerCase().includes('a07');
          const isTitanColor = article.endsWith('45') || name.includes('титан');
          
          // Для Wave: накладки обычные A07, рамки Wave
          const isWaveFrame = name.includes('wave') && name.includes('рамка');
          const isA07Overlay = !name.includes('wave') && !name.includes('рамка');
          const isWaveProduct = isWaveFrame || isA07Overlay;
          
          const isNotNatural = !name.includes('natural') && !article.toLowerCase().includes('natural');
          
          console.log(`Товар: ${product.name}, артикул: ${article}, A07: ${isA07}, титан: ${isTitanColor}, Wave продукт: ${isWaveProduct}, не Natural: ${isNotNatural}`);
          
          return isA07 && isTitanColor && isWaveProduct && isNotNatural;
        });
        
        console.log(`Найдено товаров A07-Wave-титан: ${filteredProducts.length} из ${data.products.length}`);
        
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

      {/* Основное содержимое */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        {/* Заголовок секции */}
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Матовый титан
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
          <span className="text-white">A07 Wave Матовый титан</span>
        </nav>
        </div>

        {/* Переключатель вида */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-1 items-center rounded-lg  p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
              title="Сетка"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
              title="Список"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white text-black' : 'text-white hover:bg-white/10'
              }`}
              title="Таблица"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v3h16V5H4zm0 5v3h7v-3H4zm9 0v3h7v-3h-7zm-9 5v3h7v-3H4zm9 0v3h7v-3h-7z"/>
              </svg>
            </button>
          </div>
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
