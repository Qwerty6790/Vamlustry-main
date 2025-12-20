'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

export default function A07NaturalBronzePage() {
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
      
      const params = {
        source: 'Donel',
        name: 'A07',
        page: 1,
        limit: 500
      };

      console.log('Запрос товаров A07 Natural для фильтрации', params);
      
      const apiUrl = NEXT_PUBLIC_API_URL;
      const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { params });

      if (data && data.products) {
        // Фильтруем товары для A07 Natural Bronze
        const filteredProducts = data.products.filter((product: any) => {
          const article = product.article || '';
          const name = (product.name || '').toLowerCase();
          
          // Проверяем что это серия A07 и бронзовый алюминий
          const isA07 = name.includes('a07') || article.toLowerCase().includes('a07');
          const isNatural = name.includes('natural') || article.toLowerCase().includes('natural');
          const isBronzeAluminum = name.includes('бронзовый') || name.includes('bronze') || article.includes('RA');
          
          console.log(`Товар: ${product.name}, артикул: ${article}, A07: ${isA07}, Natural: ${isNatural}, бронзовый: ${isBronzeAluminum}`);
          
          return isA07 && isNatural && isBronzeAluminum;
        });
        
        console.log(`Найдено товаров A07-Natural-бронзовый: ${filteredProducts.length} из ${data.products.length}`);
        
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
            Бронзовый алюминий
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
          <span className="text-white">A07 Natural Бронзовый алюминий</span>
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

