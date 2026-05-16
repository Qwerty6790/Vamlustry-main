'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CatalogOfProductSearch from '@/components/catalogofsearch';
import Pagination from '@/components/PagintaionComponentsxCatalog';
import LoadingSpinner from '@/components/LoadingSpinner';

import 'tailwindcss/tailwind.css';

import { ProductI } from '@/types/interfaces';

// ===============================
// HELPERS
// ===============================

const isWordMatch = (fullText: string, keyword: string): boolean => {
  if (!fullText) return false;

  const t = fullText.toLowerCase();
  const k = keyword.toLowerCase();

  if (k === 'бра') {
    const regex = new RegExp(
      `(?:^|[^а-яёa-z0-9])${k}(?:[^а-яёa-z0-9]|$)`,
      'iu'
    );

    return regex.test(t);
  }

  return t.includes(k);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};

// ===============================
// SEO
// ===============================

const getSeoContent = (query: string) => {
  const q = query?.toLowerCase() || '';

  if (q.includes('люстр')) {
    return {
      title:
        'Свет который окружает тебя — современные потолочные люстры и освещение',
      description:
        'Большой выбор люстр для дома и квартиры. Потолочные, подвесные, дизайнерские и современные люстры с доставкой.',
      keywords:
        'люстры, купить люстру, потолочная люстра, подвесная люстра, светильники, освещение',
      seoText: `
      Люстры — важный элемент современного интерьера и основа качественного освещения.
      В каталоге представлены потолочные люстры, подвесные модели, дизайнерские решения,
      современные LED люстры и декоративное освещение для квартиры, дома и коммерческих помещений.
      `
    };
  }

  if (q.includes('бра')) {
    return {
      title: 'Бра настенные — купить настенные светильники',
      description:
        'Современные бра и настенные светильники для спальни, гостиной и коридора. Большой каталог бра с доставкой.',
      keywords:
        'бра, настенный светильник, купить бра, освещение стены, светильники',
      seoText: `
      Настенные бра помогают создать уютное локальное освещение в спальне,
      гостиной, прихожей и коридоре. В каталоге представлены современные,
      классические и дизайнерские настенные светильники.
      `
    };
  }

  if (
    q.includes('трек') ||
    q.includes('шинопровод') ||
    q.includes('магнит')
  ) {
    return {
      title:
        'Трековые светильники — магнитные и шинные системы освещения',
      description:
        'Купить трековые светильники и магнитные системы освещения. Современное трековое освещение для интерьера.',
      keywords:
        'трековые светильники, магнитные светильники, шинопровод, трековое освещение',
      seoText: `
      Трековые светильники — современное решение для гибкого освещения интерьера.
      Магнитные и шинные системы позволяют создавать функциональное и стильное
      освещение для дома, офиса, магазина и коммерческих пространств.
      `
    };
  }

  if (
    q.includes('электро') ||
    q.includes('розет') ||
    q.includes('выключ')
  ) {
    return {
      title:
        'Электроустановочные изделия — розетки и выключатели',
      description:
        'Розетки, выключатели и электроустановочные изделия для дома и офиса. Современные решения.',
      keywords:
        'электроустановочные изделия, розетки, выключатели,',
      seoText: `
      Электроустановочные изделия включают современные розетки, выключатели,
      рамки, диммеры и аксессуары для качественного монтажа.
      `
    };
  }

  return {
    title: `${query} — купить светильники и освещение`,
    description:
      'Каталог светильников, люстр, бра и освещения для дома. Большой выбор товаров с доставкой.',
    keywords:
      'светильники, люстры, бра, освещение, купить светильники',
    seoText: `
    Каталог светильников и освещения для дома, квартиры и коммерческих помещений.
    Большой выбор люстр, бра, трековых светильников и современного освещения.
    `
  };
};

// ===============================
// TYPES
// ===============================

export type Category = {
  id?: string;
  label: string;
  searchName: string;
  aliases?: string[];
  subcategories?: Category[];
};

type FilterState = {
  minPrice: number;
  maxPrice: number;
  availability: 'all' | 'inStock' | 'outOfStock';
  sort: 'popularity' | 'price_asc' | 'price_desc' | 'newest';
  selectedBrands: string[];
  selectedCategory: string | null;
};

// ===============================
// CATEGORY TREE
// ===============================

const CATEGORY_TREE: Category[] = [
  {
    id: 'lyustra',
    label: 'Люстра',
    searchName: 'Люстра',
    subcategories: [
      {
        label: 'Подвесная люстра',
        searchName: 'Подвесная люстра',
        aliases: ['подвес', 'подвесной']
      },
      {
        label: 'Потолочная люстра',
        searchName: 'Потолочная люстра',
        aliases: ['потолочн']
      },
      {
        label: 'Люстра на штанге',
        searchName: 'Люстра на штанге',
        aliases: ['штанга']
      },
      {
        label: 'Люстра каскадная',
        searchName: 'Люстра каскадная',
        aliases: ['каскад']
      },
      {
        label: 'Люстра хрустальная',
        searchName: 'хрусталь Люстра',
        aliases: ['хрусталь']
      },
      {
        label: 'Люстра вентилятор',
        searchName: 'Люстра вентилятор',
        aliases: ['вентилятор']
      }
    ]
  },

  {
    id: 'svetilnik',
    label: 'Светильники',
    searchName: 'Светильники',
    aliases: ['светильник', 'освещение'],
    subcategories: [
      {
        label: 'Потолочный светильник',
        searchName: 'Потолочный светильник',
        aliases: ['накладной потолочный']
      },
      {
        label: 'Подвесной светильник',
        searchName: 'Подвесной светильник',
        aliases: ['подвес']
      },
      {
        label: 'Настенный светильник',
        searchName: 'Настенный светильник',
        aliases: ['бра', 'стен', 'настенн']
      },
      {
        label: 'Встраиваемый светильник',
        searchName: 'Светильник встраиваемый',
        aliases: ['врезной', 'точка']
      },
      {
        label: 'Накладной светильник',
        searchName: 'Светильник накладной',
        aliases: ['спот накладной']
      },
      {
        label: 'Трековый светильник',
        searchName: 'Трековый светильник',
        aliases: ['трек', 'шинопровод', 'магнитный']
      },
      {
        label: 'Точечный светильник',
        searchName: 'Точечный светильник',
        aliases: ['спот', 'даунлайт']
      }
    ]
  },

  {
    id: 'bra',
    label: 'Бра',
    searchName: 'Настенный светильник',
    aliases: ['бра'],
    subcategories: []
  }
];

// ===============================
// FIND NODE
// ===============================

const findNodeInTree = (
  query: string,
  nodes: Category[]
): Category | null => {
  const q = query.toLowerCase();

  for (const node of nodes) {
    const isNameMatch =
      node.searchName.toLowerCase().includes(q) ||
      node.label.toLowerCase().includes(q);

    const isAliasMatch = node.aliases?.some(alias =>
      isWordMatch(q, alias)
    );

    if (isNameMatch || isAliasMatch) return node;

    if (node.subcategories) {
      const found = findNodeInTree(query, node.subcategories);

      if (found) return found;
    }
  }

  return null;
};

// ===============================
// COMPONENT
// ===============================

const SearchResults: React.FC = () => {
  const router = useRouter();

  const { qwery } = router.query;

  const seo = useMemo(
    () => getSeoContent(String(qwery || '')),
    [qwery]
  );

  const canonicalUrl = `https://YOURDOMAIN.COM/catalog/${encodeURIComponent(
    String(qwery || '')
  )}`;

  const [allProducts, setAllProducts] = useState<ProductI[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalItems, setTotalItems] = useState(0);

  const ITEMS_PER_PAGE = 24;

  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000000,
    availability: 'all',
    sort: 'popularity',
    selectedBrands: [],
    selectedCategory: null
  });

  const [smartCategories, setSmartCategories] = useState<
    {
      label: string;
      searchName: string;
      count: number;
    }[]
  >([]);

  const [brandStats, setBrandStats] = useState<
    {
      name: string;
      count: number;
    }[]
  >([]);

  const [viewMode] = useState<'grid' | 'list'>('grid');

  // ===============================
  // FETCH
  // ===============================

  useEffect(() => {
    if (!router.isReady || !qwery) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/search`,
          {
            params: {
              name: qwery,
              page: 1,
              pageSize: 5000,
              sortBy: 'date',
              sortOrder: 'desc'
            }
          }
        );

        let products: ProductI[] = data.products || [];

        const searchString = String(qwery).toLowerCase();

        if (searchString === 'бра') {
          products = products.filter(p => {
            const info = (
              p.name +
              ' ' +
              (p.category || '')
            ).toLowerCase();

            return isWordMatch(info, 'бра');
          });
        }

        products = shuffleArray(products);

        setAllProducts(products);

        analyzeStructure(products, searchString);
      } catch (error) {
        console.error(error);

        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qwery, router.isReady]);

  // ===============================
  // ANALYZE
  // ===============================

  const analyzeStructure = (
    products: ProductI[],
    searchQuery: string
  ) => {
    const bStats = new Map<string, number>();

    products.forEach(p => {
      let brandName =
        p.source ||
        (p as any).brand ||
        (p as any).vendor ||
        'Другое';

      brandName = String(brandName).trim();

      if (
        brandName &&
        brandName !== 'undefined' &&
        brandName !== 'null'
      ) {
        bStats.set(
          brandName,
          (bStats.get(brandName) || 0) + 1
        );
      }
    });

    const sortedBrands = Array.from(bStats.entries())
      .map(([name, count]) => ({
        name,
        count
      }))
      .sort((a, b) => b.count - a.count);

    setBrandStats(sortedBrands);

    let targetNode = findNodeInTree(
      searchQuery,
      CATEGORY_TREE
    );

    if (!targetNode && products.length > 0) {
      targetNode = CATEGORY_TREE[0];
    }

    const suggestions: {
      label: string;
      searchName: string;
      count: number;
    }[] = [];

    const categoryScope =
      targetNode?.subcategories?.length
        ? targetNode
        : CATEGORY_TREE.find(c => c.id === 'svetilnik');

    if (categoryScope?.subcategories) {
      categoryScope.subcategories.forEach(sub => {
        let count = 0;

        const keywords = [
          sub.label,
          sub.searchName,
          ...(sub.aliases || [])
        ];

        products.forEach(p => {
          const pInfo = (
            String(p.category) +
            ' ' +
            String(p.name)
          ).toLowerCase();

          if (keywords.some(k => isWordMatch(pInfo, k))) {
            count++;
          }
        });

        if (count > 0) {
          suggestions.push({
            label: sub.label,
            searchName: sub.searchName,
            count
          });
        }
      });

      suggestions.sort((a, b) => b.count - a.count);
    }

    setSmartCategories(suggestions);
  };

  // ===============================
  // FILTERS
  // ===============================

  useEffect(() => {
    let result = [...allProducts];

    if (filters.selectedCategory) {
      const catName =
        filters.selectedCategory.toLowerCase();

      result = result.filter(p => {
        const info = (
          String(p.category) +
          ' ' +
          String(p.name)
        ).toLowerCase();

        return info.includes(catName);
      });
    }

    if (filters.selectedBrands.length > 0) {
      result = result.filter(p => {
        let brand =
          p.source ||
          (p as any).brand ||
          (p as any).vendor ||
          'Другое';

        brand = String(brand).trim();

        return filters.selectedBrands.includes(brand);
      });
    }

    if (filters.minPrice > 0) {
      result = result.filter(
        p => (p.price || 0) >= filters.minPrice
      );
    }

    if (filters.maxPrice < 1000000) {
      result = result.filter(
        p => (p.price || 0) <= filters.maxPrice
      );
    }

    if (filters.sort === 'price_asc') {
      result.sort(
        (a, b) => (a.price || 0) - (b.price || 0)
      );
    }

    if (filters.sort === 'price_desc') {
      result.sort(
        (a, b) => (b.price || 0) - (a.price || 0)
      );
    }

    if (filters.sort === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    setTotalItems(result.length);

    setTotalPages(
      Math.ceil(result.length / ITEMS_PER_PAGE)
    );

    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    setDisplayedProducts(
      result.slice(start, start + ITEMS_PER_PAGE)
    );
  }, [allProducts, filters, currentPage]);

  // ===============================
  // HANDLERS
  // ===============================

  const toggleBrand = (brand: string) => {
    setFilters(prev => {
      const newBrands = prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand];

      return {
        ...prev,
        selectedBrands: newBrands
      };
    });

    setCurrentPage(1);
  };

  const selectCategory = (catSearchName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategory:
        prev.selectedCategory === catSearchName
          ? null
          : catSearchName
    }));

    setCurrentPage(1);
  };

  // ===============================
  // JSON LD
  // ===============================

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.title,
    description: seo.description,
    url: canonicalUrl
  };

  // ===============================
  // UI
  // ===============================

  return (
    <>
      <Head>
        <title>{seo.title}</title>

        <meta
          name="description"
          content={seo.description}
        />

        <meta
          name="keywords"
          content={seo.keywords}
        />

        <meta
          property="og:title"
          content={seo.title}
        />

        <meta
          property="og:description"
          content={seo.description}
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content={canonicalUrl}
        />

        <meta
          property="og:image"
          content="https://YOURDOMAIN.COM/og-image.jpg"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <link
          rel="canonical"
          href={canonicalUrl}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Header />

        <div className="pt-24 lg:pt-32"></div>

        <main className="container mx-auto px-4 lg:px-8 pb-20">
          <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-black transition-colors"
            >
              Главная
            </Link>

            <span>Все категории</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* SIDEBAR */}

            <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-10">
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Категории
                </h3>

                <div className="pl-4 space-y-2 text-sm text-gray-500 border-l border-gray-200 ml-1">
                  {smartCategories.map(cat => (
                    <div
                      key={cat.searchName}
                      onClick={() =>
                        selectCategory(cat.searchName)
                      }
                      className={`cursor-pointer hover:text-black transition-colors ${
                        filters.selectedCategory ===
                        cat.searchName
                          ? 'text-black font-semibold'
                          : ''
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* BRANDS */}

              {brandStats.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    Бренды
                  </h3>

                  <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {brandStats.map(b => (
                      <label
                        key={b.name}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedBrands.includes(
                            b.name
                          )}
                          onChange={() =>
                            toggleBrand(b.name)
                          }
                        />

                        <span className="text-sm flex-1 truncate">
                          {b.name}
                        </span>

                        <span className="text-xs text-gray-400">
                          ({b.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* CONTENT */}

            <div className="flex-1">
              <header className="mb-10">
                <h1 className="text-4xl lg:text-5xl font-light text-black mb-3">
                  {qwery}
                </h1>

                <p className="text-gray-400 text-sm">
                  {totalItems} товаров
                </p>
              </header>

              {/* PRODUCTS */}

              {loading ? (
                <div className="py-20 flex justify-center">
                  <LoadingSpinner isLoading={loading} />
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded border border-dashed border-gray-300">
                  <h2 className="text-lg font-medium mb-2">
                    Ничего не найдено
                  </h2>

                  <p className="text-gray-500">
                    Попробуйте изменить параметры
                    поиска.
                  </p>
                </div>
              ) : (
                <>
                  <CatalogOfProductSearch
                    products={displayedProducts}
                    viewMode={viewMode}
                    isLoading={false}
                  />

                  <div className="mt-16 border-t border-gray-100 pt-8 flex justify-center">
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={p => {
                        setCurrentPage(p);

                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        });
                      }}
                      isLoading={loading}
                      totalItems={totalItems}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />
                  </div>
                </>
              )}

              {/* SEO TEXT */}

              <section className="mt-20 border-t border-gray-100 pt-12">
                <h2 className="text-2xl font-semibold mb-6">
                  {seo.title}
                </h2>

                <div className="space-y-4 text-gray-600 leading-8 text-[15px]">
                  <p>{seo.seoText}</p>

                  <p>
                    В интернет-магазине представлены
                    современные светильники,
                    дизайнерские люстры, настенные
                    бра, трековые системы освещения,
                    LED светильники и
                    электроустановочные изделия от
                    популярных производителей.
                  </p>

                  <p>
                    Мы предлагаем качественное
                    освещение для квартиры, дома,
                    офиса, кафе, ресторанов и
                    коммерческих объектов.
                    Доступны модели в современном,
                    классическом, минималистичном и
                    декоративном стилях.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }

          input[type='checkbox'] {
            accent-color: black;
          }
        `}</style>
      </div>
    </>
  );
};

export default SearchResults;