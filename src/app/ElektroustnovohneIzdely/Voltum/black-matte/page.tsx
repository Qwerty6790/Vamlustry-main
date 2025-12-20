'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import CriticalPreloader from '@/components/CriticalPreloader';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import { fetchProductsOptimized, filterProducts, paginateProducts, preloadCriticalImages } from '@/utils/api';
import SEO from '@/components/SEO'; // ✅ Подключаем твой компонент SEO

export default function VoltumBlackMattePage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const itemsPerPage = 12;

  const [allProducts, setAllProducts] = useState<ProductI[]>([]);

  // Фильтрация
  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, (product: any) => {
      const category = product.category?.toLowerCase() || '';
      const name = product.name?.toLowerCase() || '';
      const hasBlackMatte =
        category.includes('черный матовый') ||
        name.includes('черный матовый') ||
        (name.includes('черный') && name.includes('матовый')) ||
        (name.includes('black') && name.includes('matte'));
      const notChrome = !category.includes('хром') && !name.includes('хром');
      return hasBlackMatte && notChrome;
    });
  }, [allProducts]);

  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts, currentPage, itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await fetchProductsOptimized('Voltum', { 
        source: 'Voltum',
        name: 'черный матовый',
        include_name: 'черный,матовый,black,matte'
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
    if (filteredProducts.length > 0) {
      preloadCriticalImages(filteredProducts);
    }
  }, [paginatedProducts, filteredProducts.length, itemsPerPage, filteredProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      {/* ✅ SEO блок */}
      <SEO
        title="Voltum S70 Черный Матовый — розетки и выключатели | Elektromos"
        description="Купить серию Voltum S70 в цвете Черный Матовый. Розетки, выключатели, рамки и аксессуары Voltum. Большой выбор и доставка по всей России."
        keywords="Voltum S70 Черный Матовый, розетки Voltum, выключатели Voltum, электроустановочные изделия Voltum, купить Voltum в Москве"
        url="/ElektroustnovohneIzdely/Voltum/black-matte"
        type="product"
        image="/images/categories/voltum-black-matte.webp"
        openGraph={{
          title: "Voltum S70 Черный Матовый — купить розетки и выключатели | Elektromos",
          description: "Купить серию Voltum S70 Черный Матовый — розетки, выключатели, рамки и аксессуары Voltum. Быстрая доставка по Москве и всей России.",
          url: "https://elektromos.ru/ElektroustnovohneIzdely/Voltum/black-matte",
          type: "product",
          image: "https://elektromos.ru/images/categories/voltum-black-matte.webp",
          site_name: "Elektromos"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Voltum S70 Черный Матовый",
          "description": "Розетки и выключатели Voltum S70 Черный Матовый — современный дизайн и надёжное качество.",
          "image": "https://elektromos.ru/images/categories/voltum-black-matte.webp",
          "brand": { "@type": "Brand", "name": "Voltum" },
          "offers": {
            "@type": "AggregateOffer",
            "url": "https://elektromos.ru/ElektroustnovohneIzdely/Voltum/black-matte",
            "priceCurrency": "RUB",
            "availability": "https://schema.org/InStock"
          }
        }}
      />

      <CriticalPreloader products={filteredProducts} />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Voltum S70 Черный матовый</h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-white">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/ElektroustnovohneIzdely" className="hover:text-white transition-colors">Электроустановочные изделия</Link>
            <span>/</span>
            <Link href="/ElektroustnovohneIzdely/Voltum" className="hover:text-white transition-colors">Voltum</Link>
            <span>/</span>
            <span className="text-white">Черный матовый</span>
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
