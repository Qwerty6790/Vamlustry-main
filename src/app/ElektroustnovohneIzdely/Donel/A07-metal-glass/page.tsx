'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationComponents from '@/components/PaginationComponents';
import CatalogOfProductSearch from '@/components/catalogofsearch';

export default function A07MetalGlassPage() {
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
      if (allFilteredProducts.length > 0) {
        const itemsPerPage = 40;
        const totalFiltered = allFilteredProducts.length;
        const totalPagesFiltered = Math.ceil(totalFiltered / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setProducts(allFilteredProducts.slice(startIndex, endIndex));
        setTotalPages(totalPagesFiltered);
        setCurrentPage(page);
        setLoading(false);
        return;
      }

      const params = { source: 'Donel', name: 'A07', page: 1, limit: 500 };
      const apiUrl = NEXT_PUBLIC_API_URL;
      const { data } = await axios.get(`${apiUrl}/api/products/Donel`, { params });

      if (data && data.products) {
        const filteredProducts = data.products.filter((product: any) => {
          const article = product.article || '';
          const name = (product.name || '').toLowerCase();
          const isA07 = name.includes('a07') || article.toLowerCase().includes('a07');
          const isNatural = name.includes('natural') || article.toLowerCase().includes('natural');
          const isMetalGlass = name.includes('metal') || name.includes('метал') || name.includes('металлик') || article.toLowerCase().includes('GM');
          return isA07 && isNatural && isMetalGlass;
        });

        setAllFilteredProducts(filteredProducts);
        const itemsPerPage = 40;
        const totalFiltered = filteredProducts.length;
        const totalPagesFiltered = Math.ceil(totalFiltered / itemsPerPage);
        setProducts(filteredProducts.slice(0, itemsPerPage));
        setTotalPages(totalPagesFiltered);
        setTotalProducts(totalFiltered);
      }
    } catch (error) { console.error(error); setProducts([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(currentPage); }, [currentPage]);
  const handlePageChange = (page: number) => { fetchProducts(page); };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-44" style={{ maxWidth: '88rem' }}>
        <div className="mb-8">
          <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">Металлик стекло</h2>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base text-white">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/ElektroustnovohneIzdely" className="hover:text-white transition-colors">Электроустановочные изделия</Link>
            <span>/</span>
            <Link href="/ElektroustnovohneIzdely/Donel" className="hover:text-white transition-colors">Donel</Link>
            <span>/</span>
            <span className="text-white">A07 Natural Металлик стекло</span>
          </nav>
        </div>

        <div className="mb-8">
          { loading ? (
  <LoadingSpinner isLoading={loading} />
) : products.length > 0 ? (
            <CatalogOfProductSearch products={products} viewMode={viewMode} isLoading={loading} />
          ) : (
            <div className="text-center py-16"><div className="text-gray-400 text-lg mb-4">Товары не найдены</div><p className="text-gray-500">Попробуйте изменить параметры поиска или вернуться позже</p></div>
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


