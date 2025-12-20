'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import CriticalPreloader from '@/components/CriticalPreloader';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import {
  fetchProductsOptimized,
  filterProducts,
  paginateProducts,
  preloadCriticalImages,
} from '@/utils/api';

export default function VoltumTitanPage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [allProducts, setAllProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  const itemsPerPage = 12;

  // Мемоизация фильтрации по “титану”
  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, (product: any) => {
      const category = product.category?.toLowerCase() || '';
      const name = product.name?.toLowerCase() || '';

      const hasTitan =
        category.includes('титан') ||
        name.includes('титан') ||
        name.includes('titan');

      const notChrome =
        !category.includes('хром') && !name.includes('хром');

      const isMatch = hasTitan && notChrome;

      if (isMatch) {
        console.log(`[Voltum Titan] Найден: ${product.name}`);
      }

      return isMatch;
    });
  }, [allProducts]);

  // Пагинация
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts, currentPage, itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Загрузка товаров
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await fetchProductsOptimized('Voltum', {
        source: 'Voltum',
        name: 'титан',
        include_name: 'титан,titan',
      });
      setAllProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Первичная загрузка
  useEffect(() => {
    fetchProducts();
  }, []);

  // Обновление состояния при изменении фильтрации или пагинации
  useEffect(() => {
    setProducts(paginatedProducts);
    setTotalProducts(filteredProducts.length);
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));

    console.log(`✅ Найдено товаров Voltum Titan: ${filteredProducts.length}`);
    if (filteredProducts.length > 0) {
      preloadCriticalImages(filteredProducts);
    }
  }, [filteredProducts, paginatedProducts]);

  // Переход между страницами
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        color: 'var(--foreground)',
      }}
    >
      {/* Принудительная предзагрузка критических изображений */}
      <CriticalPreloader products={filteredProducts} />

      <Head>
        <title>Серия S70 Титан - Voltum | Elektromos</title>
        <meta
          name="description"
          content="Серия S70 Voltum в титане. Особенности, характеристики, применение в интерьере. Купить в Москве Серия S70 Титан, розетки и выключатели Voltum."
        />
      </Head>

      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-44"
        style={{ maxWidth: '88rem' }}
      >
        {/* Хлебные крошки */}
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5">
            Титан
          </h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-black">
            <Link href="/" className=" transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link
              href="/ElektroustnovohneIzdely"
              className=" transition-colors"
            >
              Электроустановочные изделия
            </Link>
            <span>/</span>
            <Link
              href="/ElektroustnovohneIzdely/Voltum"
              className="transition-colors"
            >
              Voltum
            </Link>
            <span>/</span>
            <span className="text-black">Титан</span>
          </nav>
        </div>

        {/* Список товаров */}
        <div className="mb-8">
          {loading ? (
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
            </div>
          )}
        </div>

        {/* Пагинация */}
        <PaginationComponents
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={loading}
          totalItems={totalProducts}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
