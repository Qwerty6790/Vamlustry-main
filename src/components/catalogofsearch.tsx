

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
export interface ProductI {
  _id?: string;
  article?: string;
  source?: string;
  supplier?: string;
  name?: string;
  price?: number | string;
  stock?: number | string;
  isNew?: boolean | string; 
  updatedAt?: string | Date;
  imageAddresses?: string | string[];
  imageAddress?: string | string[];
}

interface CatalogOfProductProps {
  products: ProductI[];
  viewMode: 'grid' | 'list' | 'table';
  onViewModeChange?: (mode: 'grid' | 'list' | 'table') => void;
  isLoading?: boolean;
}

type SortType = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'new-first';

interface SortOption {
  value: SortType;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'default', label: 'Рекомендуемые' },
  { value: 'new-first', label: 'Сначала новинки' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'name-asc', label: 'По названию (А-Я)' },
];

// --- UTILS ---
const NEW_PRODUCT_DAYS = 30;
const urlCache = new Map<string, string>();

const isNew = (date?: string | Date): boolean => {
  if (!date) return false;
  const diff = new Date().getTime() - new Date(date).getTime();
  return Math.ceil(diff / (1000 * 3600 * 24)) <= NEW_PRODUCT_DAYS;
};

const normalizeUrl = (url: string): string => {
  if (urlCache.has(url)) return urlCache.get(url)!;
  const clean = url.replace(/^http:\/\//i, 'https://');
  urlCache.set(url, clean);
  return clean;
};

const getAllImages = (p: ProductI): string[] => {
  const images: string[] = [];
  const add = (source: string | string[] | undefined) => {
    if (!source) return;
    if (Array.isArray(source)) {
      source.forEach((s) => s && images.push(s));
    } else {
      images.push(source);
    }
  };
  add(p.imageAddresses);
  add(p.imageAddress);
  return Array.from(new Set(images.map(normalizeUrl).filter(Boolean)));
};

const getMainImgUrl = (p: ProductI): string | null => {
  const imgs = getAllImages(p);
  return imgs.length > 0 ? imgs[0] : null;
};

const formatPrice = (p?: number | string) => {
  if (p === undefined || p === null) return '';
  const num = typeof p === 'string' ? parseFloat(p) : p;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(num);
};

const updateCart = (product: ProductI, qty: number) => {
  // ЗАЩИТА: Не даем добавить в корзину, если цена 0
  const priceNum = Number(product.price) || 0;
  if (priceNum <= 0 && qty > 0) return;

  const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
  const existingIdx = cart.products.findIndex(
    (item: any) =>
      item.productId === product._id ||
      (item.article === product.article && item.source === product.source)
  );

  if (qty > 0) {
    if (existingIdx > -1) cart.products[existingIdx].quantity = qty;
    else cart.products.push({ productId: product._id, article: product.article, source: product.source, quantity: qty });
  } else if (existingIdx > -1) {
    cart.products.splice(existingIdx, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  const total = cart.products.reduce((acc: number, item: any) => acc + item.quantity, 0);
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: total } }));
};

// --- ФУНКЦИЯ ГЕНЕРАЦИИ БЕЗОПАСНОЙ ССЫЛКИ НА ТОВАР (ФИКС СЛЭШЕЙ И ТОЧЕК) ---
const getProductUrl = (product: ProductI): string => {
  const source = product.source || product.supplier || 'unknown';
  const article = String(product.article || '');
  
  // Кодируем поставщика
  const encodedSource = encodeURIComponent(source);
  
  // Разбиваем артикул по слэшу, кодируем каждую часть,
  // и принудительно меняем точку на %2E, чтобы Next.js не путал ее с расширением файла (.06)
  const encodedArticle = article.split('/').map(part => 
    encodeURIComponent(part).replace(/\./g, '%2E')
  ).join('/');
  
  return `/products/${encodedSource}/${encodedArticle}`;
};

// --- ICONS ---
const IconGrid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconTable = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconChevron = ({ r }: { r?: boolean }) => (
  <svg className={`w-3 h-3 transition-transform ${r ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// --- Image Component ---
const ImageComponent = React.memo(({ images, alt }: { images: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const displayImages = useMemo(() => images.slice(0, 5), [images]);

  const handleImageLoad = (src: string) => setLoadedImages((prev) => new Set(prev).add(src));
  const handleImageError = (src: string) => setErrorImages((prev) => new Set(prev).add(src));

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || displayImages.length <= 1) return;
      const { left, width } = containerRef.current.getBoundingClientRect();
      const xPosition = e.clientX - left;
      const segmentWidth = width / displayImages.length;
      let newIndex = Math.floor(xPosition / segmentWidth);
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= displayImages.length) newIndex = displayImages.length - 1;
      setCurrentIndex(newIndex);
    },
    [displayImages.length]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#F5F5F5] overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0);
      }}
    >
      {displayImages.length > 0 ? (
        <>
          {displayImages.map((src, idx) => {
            const isCurrent = idx === currentIndex;
            const isLoaded = loadedImages.has(src);
            const isError = errorImages.has(src);

            return (
              <React.Fragment key={src}>
                <img
                  src={src}
                  alt={`${alt} - вид ${idx + 1}`}
                  onLoad={() => handleImageLoad(src)}
                  onError={() => handleImageError(src)}
                  loading={idx === 0 ? 'lazy' : 'eager'}
                  className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4 
                    transition-opacity duration-200 ease-out
                    ${isCurrent && !isError ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                    ${!isLoaded && isCurrent ? 'opacity-0' : ''}
                  `}
                />
                {isCurrent && isError && (
                  <div className="absolute inset-0 flex items-center justify-center w-full h-full text-[10px] text-gray-300 uppercase tracking-widest z-10">
                    ВАМЛЮСТРА
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {displayImages.length > 1 && (
            <div className={`absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {displayImages.map((_, idx) => (
                <div key={idx} className={`h-0.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-black w-4' : 'bg-gray-300 w-2'}`} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full text-[10px] text-gray-300 uppercase tracking-widest">
          ВАМЛЮСТРА
        </div>
      )}
    </div>
  );
});
ImageComponent.displayName = 'ImageComponent';

// --- MAIN PRODUCT CARD ---
const MinimalCard = React.memo(({ product }: { product: ProductI }) => {
  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);

  const isAvailable = Number(product.stock) > 0;
  const isNewItem = product.isNew === true || product.isNew === 'true' || isNew(product.updatedAt);
  
  const priceNum = Number(product.price) || 0;
  const isPriceZero = priceNum <= 0;
  const canAddToCart = isAvailable && !isPriceZero;

  const images = useMemo(() => getAllImages(product), [product]);
  const productUrl = getProductUrl(product);

  const sync = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"products":[]}');
    const item = cart.products.find((i: any) => i.article === product.article && i.source === product.source);
    setInCart(!!item);
    if (item) setQty(item.quantity);
  }, [product]);

  useEffect(() => {
    sync();
    window.addEventListener('cartUpdated', sync);
    return () => window.removeEventListener('cartUpdated', sync);
  }, [sync]);

  const handleAction = (val: number) => {
    if (isPriceZero && val > 0) return;
    setQty(val);
    if (inCart || val > 0) updateCart(product, val);
  };

  return (
    <div className="flex flex-col h-full">
      <Link href={productUrl} className="block relative aspect-square overflow-hidden rounded-sm">
        <ImageComponent images={images} alt={product.name || 'Товар'} />

        <div className="absolute top-2 left-2 flex flex-col gap-2 items-start z-10 pointer-events-none">
          {isNewItem && (
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 leading-none shadow-sm">
              Новинка
            </span>
          )}
          {!isAvailable && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 leading-none shadow-sm">
              Под заказ
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow gap-1 mt-3">
        <div className="flex justify-between items-start text-[10px] uppercase tracking-wider text-gray-400 font-medium">
          <span>{product.article}</span>
          <span>{product.source}</span>
        </div>

        <Link href={productUrl} className="text-sm leading-tight font-normal text-black hover:text-gray-600 transition-colors line-clamp-2 min-h-[2.5em]">
          {product.name}
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-base font-semibold text-black">
            {isPriceZero ? (
              <span className="text-sm text-gray-500 font-medium tracking-wide">По запросу</span>
            ) : (
              <>
                {formatPrice(product.price)} <span className="text-xs font-normal text-gray-400">₽</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        {inCart ? (
          <div className="flex items-center justify-between h-10 border border-black px-2">
            <button onClick={() => handleAction(Math.max(0, qty - 1))} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">-</button>
            <span className="text-sm font-medium w-full text-center">{qty}</span>
            <button onClick={() => handleAction(qty + 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">+</button>
          </div>
        ) : (
          <button
            onClick={() => handleAction(1)}
            disabled={!canAddToCart}
            className={`w-full h-10 flex items-center justify-center text-xs font-bold uppercase tracking-widest border transition-all duration-300 
              ${canAddToCart
                ? 'border-gray-200 bg-transparent text-black hover:border-black hover:bg-black hover:text-white'
                : 'border-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {isPriceZero ? 'Цена по запросу' : isAvailable ? 'В корзину' : 'Под заказ'}
          </button>
        )}
      </div>
    </div>
  );
});
MinimalCard.displayName = 'MinimalCard';

// --- TABLE ROW ---
const TableRow = ({ product }: { product: ProductI }) => {
  const [imgError, setImgError] = useState(false);

  const isAvailable = Number(product.stock) > 0;
  const mainImg = getMainImgUrl(product);
  const productUrl = getProductUrl(product);

  const priceNum = Number(product.price) || 0;
  const isPriceZero = priceNum <= 0;
  const canAddToCart = isAvailable && !isPriceZero;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="w-16 h-16 p-2 relative bg-[#F5F5F5]">
        {!imgError && mainImg ? (
          <img
            src={mainImg}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center w-full h-full text-[8px] text-gray-300 uppercase tracking-widest text-center leading-none">
            ВАМЛЮСТРА
          </div>
        )}
      </td>
      <td className="p-2">
        <Link href={productUrl} className="block text-sm text-black font-medium group-hover:underline decoration-1 underline-offset-4">
          {product.name}
        </Link>
      </td>
      <td className="p-2 text-xs text-gray-500 whitespace-nowrap">
        {product.article} — {product.source}
      </td>
      <td className="p-2 text-right font-medium whitespace-nowrap">
        {isPriceZero ? 'По запросу' : `${formatPrice(product.price)} ₽`}
      </td>
      <td className="p-2 text-right">
        <button
          onClick={() => updateCart(product, 1)}
          disabled={!canAddToCart}
          className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all 
            ${canAddToCart
              ? 'border-black hover:bg-black hover:text-white'
              : 'opacity-50 border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isPriceZero ? 'Уточнить' : isAvailable ? 'Купить' : 'Заказ'}
        </button>
      </td>
    </tr>
  );
};

// --- CATALOG COMPONENT ---
const CatalogOfProductSearch: React.FC<CatalogOfProductProps> = ({
  products,
  viewMode,
  onViewModeChange,
  isLoading = false,
}) => {
  const [activeSort, setActiveSort] = useState<SortType>('default');
  const [internalMode, setInternalMode] = useState(viewMode);
  const [isSortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const currentMode = onViewModeChange ? viewMode : internalMode;
  const setMode = onViewModeChange || setInternalMode;

  const sorted = useMemo(() => {
    let res = [...products];
    res = res.map((p) =>
      p.source?.toLowerCase() === 'чтк' ? { ...p, price: (Number(p.price) || 0) * 0.85 } : p
    );

    return res.sort((a, b) => {
      const aIsNew = a.isNew === true || a.isNew === 'true' || isNew(a.updatedAt);
      const bIsNew = b.isNew === true || b.isNew === 'true' || isNew(b.updatedAt);

      switch (activeSort) {
        case 'price-asc': return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'price-desc': return (Number(b.price) || 0) - (Number(a.price) || 0);
        case 'name-asc': return (a.name || '').localeCompare(b.name || '');
        case 'new-first': return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        case 'default':
        default:
          if (aIsNew && !bIsNew) return -1;
          if (!aIsNew && bIsNew) return 1;
          return 0;
      }
    });
  }, [products, activeSort]);

  useEffect(() => {
    const fn = (e: MouseEvent) => sortRef.current && !sortRef.current.contains(e.target as Node) && setSortOpen(false);
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 aspect-square rounded-sm w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="text-xs font-mono text-gray-400">
          {sorted.length} ТОВАРОВ
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-xs text-black font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              {sortOptions.find((o) => o.value === activeSort)?.label}
              <IconChevron r={isSortOpen} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-56 py-2 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50"
                >
                  {sortOptions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        setActiveSort(o.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-3 text-xs uppercase tracking-widest transition-colors ${
                        activeSort === o.value ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-6 text-gray-300">
            <button onClick={() => setMode('grid')} className={`transition-colors hover:text-black ${currentMode === 'grid' ? 'text-black' : ''}`}>
              <IconGrid />
            </button>
            <button onClick={() => setMode('table')} className={`transition-colors hover:text-black ${currentMode === 'table' ? 'text-black' : ''}`}>
              <IconTable />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[50vh]">
        {sorted.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">Ничего не найдено</div>
        ) : currentMode === 'table' ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-black border-collapse min-w-[600px]">
              <tbody className="w-full">
                {sorted.map((p) => (
                  <TableRow key={p._id || p.article} product={p} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p) => (
              <MinimalCard key={p._id || p.article} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogOfProductSearch;
