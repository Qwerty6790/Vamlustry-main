
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  categoryName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
  totalItems = 0,
  itemsPerPage = 32,
  categoryName
}) => {
  // --- ЛОГИКА (Оставлена без изменений) ---
  
  // useSearchParams() can cause prerender errors if used outside a client-only
  // boundary during Next.js prerendering. Read search params from the
  // browser location on the client instead to avoid SSR issues.
  const [searchParamsString, setSearchParamsString] = React.useState<string>('');
  const ignoreNextSyncRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    try {
      setSearchParamsString(typeof window !== 'undefined' ? window.location.search : '');
    } catch (e) {
      setSearchParamsString('');
    }
  }, []);

  // Обновляем строку параметров при навигации назад/вперед (popstate)
  React.useEffect(() => {
    const onPopState = () => {
      try {
        setSearchParamsString(typeof window !== 'undefined' ? window.location.search : '');
      } catch (e) {
        setSearchParamsString('');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', onPopState);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', onPopState);
      }
    };
  }, []);

  const searchParams = {
    toString: () => searchParamsString,
    get: (key: string) => {
      try {
        const p = new URLSearchParams(searchParamsString || '');
        return p.get(key);
      } catch (e) {
        return null;
      }
    }
  } as unknown as URLSearchParams;

  // Проверяем, соответствует ли текущий URL категории и странице
  useEffect(() => {
    const urlPage = Number(searchParams?.get('page')) || 1;
    
    if (ignoreNextSyncRef.current) {
      ignoreNextSyncRef.current = false;
      return;
    }

    if (urlPage !== currentPage && !isLoading) {
      if (urlPage > totalPages && totalPages > 0) {
        onPageChange(totalPages);
      } else if (urlPage <= totalPages) {
        onPageChange(urlPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString(), isLoading, totalPages, onPageChange]);

  // Если пустой результат, не показываем пагинацию
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          if (i <= totalPages) pages.push(i);
        }
        if (totalPages > 6) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (i > 1 && i < totalPages) pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = getPageNumbers();

  const router = useRouter();
  const pathname = usePathname();
  
  const handleClick = (page: number) => {
    if (isLoading || page === currentPage) return;
    
    onPageChange(page);
    try {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('page', String(page));
      router.push(pathname + '?' + params.toString());
      setSearchParamsString('?' + params.toString());
    } catch (e) { /* ignore URL update errors */ }
  };

  // --- ДИЗАЙН (Обновленный, минималистичный) ---
  return (
    <div className="w-full border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Информация о количестве товаров */}
          <div className="text-sm text-gray-500">
            {totalItems > 0 ? (
              <>
                Показано <span className="font-medium text-black">{startItem}-{endItem}</span> из <span className="font-medium text-black">{totalItems}</span> товаров
              </>
            ) : (
              'Товары не найдены'
            )}
          </div>

          {/* Пагинация */}
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Pagination">
            {pages.map((page, index) => (
              <React.Fragment key={`${page}-${index}`}>
                {typeof page === 'number' ? (
                  <button
                    onClick={() => handleClick(page)}
                    disabled={isLoading}
                    className={`
                      h-9 w-9 flex items-center justify-center rounded-md text-sm transition-all duration-200
                      ${
                        page === currentPage
                          ? 'bg-black text-white font-medium shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span className="h-9 w-9 flex items-center justify-center text-gray-400 select-none pb-2">
                    {page}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

        </div>
      </div>
    </div>
  );
};

export default Pagination;