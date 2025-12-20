'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import Head from 'next/head';

export default function MNDPage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [allFilteredProducts, setAllFilteredProducts] = useState<ProductI[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = {
        source: 'ЧТК',
        page: 1,
        limit: 1000
      };

      const apiUrl = NEXT_PUBLIC_API_URL;
      const { data } = await axios.get(`${apiUrl}/api/products/ЧТК`, { params });

      if (data && data.products) {
        const targetProductNames = [
          'мат нагревательный мнд',
        ];

        const filteredProducts = data.products.filter((product: any) => {
          const article = product.article || '';
          const name = (product.name || '').toLowerCase();
          
          // Проверяем что это мат нагревательный МНД
          if (!name.includes('мат нагревательный мнд')) return false;
          
          // Исключаем товары с цифрой 150 в артикуле
          if (article.includes('150')) return false;
          
          // Включаем только нужные типы товаров
          return targetProductNames.some(targetName => 
            name.includes(targetName)
          );
        });
        
        // Собираем площади из name
        const areaSet = new Set<string>();
        filteredProducts.forEach((product: any) => {
          const name = (product.name || '').toLowerCase();
          // ищем паттерн типа "мнд-7,0" или "мнд-8,0" и т.д.
          const match = name.match(/мнд-(\d{1,2},\d)/);
          if (match && match[1]) areaSet.add(match[1]);
        });
        setAvailableAreas(Array.from(areaSet).sort((a, b) => parseFloat(a.replace(',', '.')) - parseFloat(b.replace(',', '.'))));
        
        filteredProducts.sort((a: any, b: any) => (a.article || '').localeCompare(b.article || ''));
        
        setAllFilteredProducts(filteredProducts);
        setTotalProducts(filteredProducts.length);
        
        const itemsPerPage = 40;
        const totalPagesCalc = Math.ceil(filteredProducts.length / itemsPerPage);
        setTotalPages(totalPagesCalc);
        
        updatePage(1, filteredProducts, itemsPerPage);
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updatePage = (page: number, allProducts: ProductI[], itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    setProducts(paginatedProducts);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Фильтрация по площади
  useEffect(() => {
    if (!selectedArea) {
      updatePage(1, allFilteredProducts, 40);
      return;
    }
    const filtered = allFilteredProducts.filter((product: any) => {
      const name = (product.name || '').toLowerCase();
      return name.includes(`мнд-${selectedArea}`);
    });
    updatePage(1, filtered, 40);
    setTotalProducts(filtered.length);
    const totalPagesCalc = Math.ceil(filtered.length / 40);
    setTotalPages(totalPagesCalc);
  }, [selectedArea, allFilteredProducts]);

  const handlePageChange = (page: number) => {
    if (products.length > 0) {
      updatePage(page, products, 40);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      <Head>
        <title>МНД — Теплый пол под плитку, ЧТК | Elektromos</title>
        <meta name="description" content="Купить  ЧТК МНД для тёплого пола: электронные, с датчиком пола, надежные решения для точного поддержания температуры." />
        <meta property="og:title" content="МНД — купить теплый пол под плитку | Elektromos" />
        <meta property="og:description" content="Купить ЧТК МНД для тёплого пола: электронные, с датчиком пола, надежные решения для точного поддержания температуры." />
        <meta property="og:url" content="https://elektromos.uz/Teplypolzdely/HTK/MND" />
        <meta property="og:image" content="/images/seris/МНД.webp" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Мат нагревательный под плитку</h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/Teplypolzdely" className="hover:text-white transition-colors">Теплый пол изделия</Link>
          <span>/</span>
          <Link href="/Teplypolzdely/HTK" className="hover:text-white transition-colors">ЧТК</Link>
          <span>/</span>
          <span className="text-white">Мат нагревательный под плитку</span>
        </nav>
        </div>
        {/* Фильтр по площади */}
        {availableAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              className={`px-4 py-2 rounded ${selectedArea === null ? 'bg-[#812626] text-white' : 'bg-[#1a1a1a] text-white border border-[#633a3a]'}`}
              onClick={() => setSelectedArea(null)}
            >
              Все площади
            </button>
            {availableAreas.map(area => (
              <button
                key={area}
                className={`px-4 py-2 rounded ${selectedArea === area ? 'bg-[#812626] text-white' : 'bg-[#1a1a1a] text-white border border-[#633a3a]'}`}
                onClick={() => setSelectedArea(area)}
              >
                {area} м²
              </button>
            ))}
          </div>
        )}

       

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

