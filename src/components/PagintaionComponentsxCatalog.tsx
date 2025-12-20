
'use client';

import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
  totalItems = 0,
  itemsPerPage = 40,
}) => {
  // Если пустой результат или одна страница — не рендерим
  if (totalItems === 0 || totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) if (i <= totalPages) pages.push(i);
      if (totalPages > 6) {
        pages.push('...');
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 3) {
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) if (i > 1) pages.push(i);
    } else {
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) if (i > 1 && i < totalPages) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(totalItems, currentPage * itemsPerPage) : 0;

  const handleClick = (page: number) => {
    if (isLoading || page === currentPage) return;
    onPageChange(page);
  };

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
            {pages.map((p, idx) => (
              <React.Fragment key={`${p}-${idx}`}>
                {typeof p === 'number' ? (
                  <button
                    onClick={() => handleClick(p)}
                    disabled={isLoading}
                    className={`
                      h-9 w-9 flex items-center justify-center rounded-md text-sm transition-all duration-200
                      ${
                        p === currentPage
                          ? 'bg-black text-white font-medium shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ) : (
                  <span className="h-9 w-9 flex items-center justify-center text-gray-400 select-none pb-2">
                    {p}
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