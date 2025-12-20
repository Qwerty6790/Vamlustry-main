'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/interfaces';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

export default function DonelW55NakladnoyPage() {
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
      
      // Используем более точный запрос как в каталоге
      const apiUrl = NEXT_PUBLIC_API_URL;
      let allProducts: any[] = [];
      
      // Загружаем товары с параметром name как в каталоге
      for (let pageNum = 1; pageNum <= 5; pageNum++) {
        try {
          const params = {
            source: 'Donel',
            page: pageNum,
            limit: 200, // Уменьшаем лимит для стабильности
            name: 'накладной', // Точное название категории как в каталоге
            inStock: 'true'
          };
          
          console.log(`Загружаем страницу ${pageNum} с параметрами:`, params);
          const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { params });
          
          if (data && data.products && data.products.length > 0) {
            allProducts = [...allProducts, ...data.products];
            console.log(`Страница ${pageNum}: добавлено ${data.products.length} товаров, всего: ${allProducts.length}`);
            
            // Если товаров меньше лимита, значит это последняя страница
            if (data.products.length < params.limit) {
              console.log(`Достигнута последняя страница: ${pageNum}`);
              break;
            }
          } else {
            console.log(`Страница ${pageNum}: товары закончились`);
            break;
          }
          
          // Небольшая задержка между запросами
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Ошибка загрузки страницы ${pageNum}:`, error);
        }
      }
      
      // Загружаем дополнительно товары с названием "накладная доп"
      for (let pageNum = 1; pageNum <= 5; pageNum++) {
        try {
          const params = {
            source: 'Donel',
            page: pageNum,
            limit: 200,
            name: 'накладная', // Дополнительное название
            inStock: 'true'
          };
          
          console.log(`Загружаем дополнительные товары страница ${pageNum} с параметрами:`, params);
          const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { params });
          
          if (data && data.products && data.products.length > 0) {
            allProducts = [...allProducts, ...data.products];
            console.log(`Дополнительная страница ${pageNum}: добавлено ${data.products.length} товаров, всего: ${allProducts.length}`);
            
            if (data.products.length < params.limit) {
              console.log(`Достигнута последняя дополнительная страница: ${pageNum}`);
              break;
            }
          } else {
            console.log(`Дополнительная страница ${pageNum}: товары закончились`);
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Ошибка загрузки дополнительной страницы ${pageNum}:`, error);
        }
      }
      
      // Удаляем дубликаты по артикулу
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.article === product.article)
      );
      
      console.log('Всего загружено товаров:', allProducts.length);
      console.log('Уникальных товаров:', uniqueProducts.length);

      if (uniqueProducts.length > 0) {
        // Используем ту же логику фильтрации что и в каталоге
        const filteredProducts = uniqueProducts.filter((product: any) => {
          const name = product.name || '';
          const category = product.category || '';
          
          // Проверяем что товар содержит W55
          const hasW55 = name.includes('W55') || category.includes('W55');
          
          // Проверяем что это накладной монтаж (разные варианты написания)
          const isNakladnoy = name.includes('Накладной') ||
                             name.includes('накладная') ||
                             name.includes('Накладной') ||
                             name.includes('накладной') ||
                             name.includes('накладная') ||
                             category.includes('накладная') ||
                             category.includes('накладной') ||
                             category.includes('накладная');
          
          return hasW55 && isNakladnoy;
        });
        
        // Показываем отфильтрованные товары
        setAllFilteredProducts(filteredProducts);
        setProducts(filteredProducts);
        setTotalProducts(filteredProducts.length);
        setTotalPages(1);
        setCurrentPage(1);
        
        console.log('Товары W55 Накладной:', filteredProducts.length);
        console.log('ВСЕ найденные товары:', filteredProducts.map((p: any) => ({
          name: p.name,
          article: p.article,
          category: p.category
        })));
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



  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Накладной монтаж</h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-white">
          <Link href="/" className="hover:text-white transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/ElektroustnovohneIzdely" className="hover:text-white transition-colors">Электроустановочные изделия</Link>
          <span>/</span>
          <Link href="/ElektroustnovohneIzdely/Donel" className="hover:text-white transition-colors">Donel</Link>
          <span>/</span>
          <span className="text-white">W55 Накладной монтаж</span>
        </nav>
        </div>

        

        <div className="mb-8">
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


      </div>
    </div>
  );
} 
