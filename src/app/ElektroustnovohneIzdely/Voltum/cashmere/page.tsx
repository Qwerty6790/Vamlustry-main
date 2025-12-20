'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import CriticalPreloader from '@/components/CriticalPreloader';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import { fetchProductsOptimized, filterProducts, paginateProducts, preloadCriticalImages } from '@/utils/api';
import SEO from '@/components/SEO'; // ✅ подключаем компонент SEO

export default function VoltumCashmerePage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const itemsPerPage = 12;

  const [allProducts, setAllProducts] = useState<ProductI[]>([]);

  // 🔍 Фильтрация по "кашемир"
  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, (product: any) => {
      const category = product.category?.toLowerCase() || '';
      const name = product.name?.toLowerCase() || '';

      const hasCashmere =
        category.includes('кашемир') ||
        name.includes('кашемир') ||
        name.includes('cashmere');

      const notChrome = !category.includes('хром') && !name.includes('хром');
      const isMatch = hasCashmere && notChrome;

      if (isMatch) console.log(`[Voltum Cashmere] НАЙДЕН: "${product.name}"`);
      return isMatch;
    });
  }, [allProducts]);

  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts, currentPage, itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // 🔄 Загрузка товаров
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await fetchProductsOptimized('Voltum', {
        source: 'Voltum',
        name: 'кашемир',
        include_name: 'кашемир,cashmere',
      });
      setAllProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setProducts(paginatedProducts);
    setTotalProducts(filteredProducts.length);
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));

    console.log(`✅ Найдено товаров Voltum Cashmere: ${filteredProducts.length}`);

    if (filteredProducts.length > 0) preloadCriticalImages(filteredProducts);
  }, [paginatedProducts, filteredProducts.length, itemsPerPage, filteredProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ SEO параметры
  const seoData = {
    title: 'Серия S70 Кашемир - Voltum | Elektromos',
    description:
      'Серия S70 Voltum в кашемире. Купить в Москве, характеристики, применение в интерьере. Купить в Москве Серия S70 Кашемир, розетки и выключатели Voltum. Самый широкий выбор ассортимента в России.',
    keywords:
      'Voltum, кашемир, серия S70, розетки Voltum, выключатели Voltum, кашемир розетки, выключатели, Elektromos, купить Voltum, светильники, электроустановочные изделия',
    url: '/ElektroustnovohneIzdely/Voltum/Cashmere',
    image: '/images/voltum-cashmere.webp',
    openGraph: {
      title: 'Серия S70 Кашемир - Voltum | Elektromos',
      description:
        'Серия S70 Voltum Кашемир. Купить в Москве и по всей России. Доставка, подбор и консультация по ассортименту.',
      url: 'https://elektromos.ru/ElektroustnovohneIzdely/Voltum/Cashmere',
      type: 'product.group',
      image: 'https://elektromos.ru/images/voltum-cashmere.webp',
      site_name: 'Elektromos',
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProductCollection',
      name: 'Серия S70 Voltum Кашемир',
      description:
        'Розетки и выключатели Voltum серии S70 в цвете Кашемир. Купить в Москве и по всей России с доставкой.',
      brand: {
        '@type': 'Brand',
        name: 'Voltum',
      },
      url: 'https://elektromos.ru/ElektroustnovohneIzdely/Voltum/Cashmere',
      image: 'https://elektromos.ru/images/voltum-cashmere.webp',
    },
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        color: 'var(--foreground)',
      }}
    >
      {/* ✅ Подключаем SEO */}
      <SEO {...seoData} />

      <CriticalPreloader products={filteredProducts} />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            Кашемир
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
            <Link href="/ElektroustnovohneIzdely/Voltum" className="hover:text-white transition-colors">
              Voltum
            </Link>
            <span>/</span>
            <span className="text-white">Кашемир</span>
          </nav>
        </div>

        <div className="mb-8">
          {loading ? (
            <LoadingSpinner isLoading={loading} />
          ) : products.length > 0 ? (
            <CatalogOfProductSearch products={products} viewMode={viewMode} isLoading={loading} />
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">Товары не найдены</div>
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
          itemsPerPage={40}
        />
      </div>
    </div>
  );
}
