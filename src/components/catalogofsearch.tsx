
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductI } from '../types/interfaces';

// --- TYPES ---
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

// --- UPDATED: Функция для получения ВСЕХ картинок ---
const getAllImages = (p: ProductI): string[] => {
  const images: string[] = [];

  const add = (source: string | string[] | undefined) => {
    if (!source) return;
    if (Array.isArray(source)) {
      source.forEach(s => s && images.push(s));
    } else {
      images.push(source);
    }
  };

  add(p.imageAddresses);
  add(p.imageAddress);

  // Удаляем дубликаты, нормализуем ссылки и фильтруем пустые
  return Array.from(new Set(images.map(normalizeUrl).filter(Boolean)));
};

// Для обратной совместимости и использования в таблице (берем первую картинку)
const getMainImgUrl = (p: ProductI): string | null => {
  const imgs = getAllImages(p);
  return imgs.length > 0 ? imgs[0] : null;
};

const formatPrice = (p: number | string) => {
  const num = typeof p === 'string' ? parseFloat(p) : p;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(num);
};

const updateCart = (product: ProductI, qty: number) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
  const existingIdx = cart.products.findIndex((item: any) => 
    item.productId === product._id || (item.article === product.article && item.source === product.source)
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

// --- SUB-COMPONENTS ---
const IconGrid = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconTable = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const IconChevron = ({ r }: { r?: boolean }) => <svg className={`w-3 h-3 transition-transform ${r ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>;

// --- UPDATED: Image Component with Hover Slideshow ---
const ImageComponent = React.memo(({ images, alt }: { images: string[]; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Логика слайдшоу
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1000); // Перелистывание каждые 1000мс (1 сек)
    } else {
      // Сброс на первую картинку, когда мышь уходит (опционально)
      // Если хотите, чтобы картинка оставалась на последней просмотренной, уберите setCurrentIndex(0);
      setCurrentIndex(0);
    }

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const currentSrc = images.length > 0 ? images[currentIndex] : null;

  return (
    <div 
      className="w-full h-full bg-[#F5F5F5] overflow-hidden relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {currentSrc ? (
        <>
          <img
            src={currentSrc}
            alt={alt}
            onLoad={() => setLoaded(true)}
            // Добавил key={currentSrc}, чтобы React понимал, что картинка изменилась, но для плавности можно убрать key, 
            // если хотите просто подмену src. С key будет легкое мерцание при смене, без key - мгновенная смена.
            // Оставим без key для каталожной "резкости" смены, либо используем transition.
            className={`w-full h-full object-contain mix-blend-multiply p-4 transition-all duration-500 
              ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            loading="lazy"
          />
          
          {/* Индикатор количества фото (опционально, если фото > 1) */}
          {images.length > 1 && isHovered && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
               {images.map((_, idx) => (
                 <div 
                   key={idx} 
                   className={`h-0.5 rounded-full transition-all ${idx === currentIndex ? 'bg-black w-4' : 'bg-gray-300 w-2'}`}
                 />
               ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-[10px] text-gray-300 uppercase tracking-widest">ВАМЛЮСТРА</div>
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
  const isNewItem = product.isNew || isNew(product.updatedAt);
  
  // UPDATED: Получаем массив картинок вместо одной строки
  const images = useMemo(() => getAllImages(product), [product]);

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
    setQty(val);
    if (inCart || val > 0) updateCart(product, val);
  };

  return (
    <div className="group flex flex-col gap-3 relative">
      <Link href={`/products/${product.source}/${product.article}`} className="block relative aspect-square overflow-hidden rounded-sm">
        {/* UPDATED: Передаем массив изображений */}
        <ImageComponent images={images} alt={product.name} />
        
        {/* Z-INDEX 10: Чтобы быть над картинкой, но под шапкой (которая z-30) */}
        {/* Добавил pointer-events-none, чтобы бейджики не мешали ховеру на картинке */}
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

      <div className="flex flex-col flex-grow gap-1">
        <div className="flex justify-between items-start text-[10px] uppercase tracking-wider text-gray-400 font-medium">
          <span>{product.article}</span>
          <span>{product.source}</span>
        </div>
        
        <Link href={`/products/${product.source}/${product.article}`} className="text-sm leading-tight font-normal text-black hover:text-gray-600 transition-colors line-clamp-2 min-h-[2.5em]">
          {product.name}
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-base font-semibold text-black">
            {formatPrice(product.price)} <span className="text-xs font-normal text-gray-400">₽</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {inCart ? (
          <div className="flex items-center justify-between h-10 border border-black px-2">
            <button onClick={() => handleAction(Math.max(0, qty - 1))} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">-</button>
            <span className="text-sm font-medium w-full text-center">{qty}</span>
            <button onClick={() => handleAction(qty + 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">+</button>
          </div>
        ) : (
          <button 
            onClick={() => handleAction(1)}
            disabled={!isAvailable && !product.price}
            className={`w-full h-10 flex items-center justify-center text-xs font-bold uppercase tracking-widest border transition-all duration-300 
              ${isAvailable 
                ? 'border-gray-200 bg-transparent text-black hover:border-black hover:bg-black hover:text-white' 
                : 'border-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {isAvailable ? 'В корзину' : 'Под заказ'}
          </button>
        )}
      </div>
    </div>
  );
});
MinimalCard.displayName = 'MinimalCard';

// --- TABLE ROW ---
const TableRow = ({ product }: { product: ProductI }) => {
  const isAvailable = Number(product.stock) > 0;
  // Для таблицы используем только главное изображение
  const mainImg = getMainImgUrl(product);
  
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group">
      <td className="py-4 pl-0 pr-4 w-16">
        <div className="w-12 h-12 bg-[#F5F5F5] rounded-sm overflow-hidden">
           <img src={mainImg || ''} alt="" className="w-full h-full object-contain mix-blend-multiply p-1" />
        </div>
      </td>
      <td className="py-4 px-4 align-middle">
        <Link href={`/products/${product.source}/${product.article}`} className="block text-sm text-black font-medium group-hover:underline decoration-1 underline-offset-4">
          {product.name}
        </Link>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{product.article} — {product.source}</span>
      </td>
      <td className="py-4 px-4 text-right align-middle font-mono text-sm whitespace-nowrap">
        {formatPrice(product.price)} ₽
      </td>
      <td className="py-4 pl-4 pr-0 align-middle text-right w-40">
        <button 
          onClick={() => updateCart(product, 1)}
          className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-all
            ${!isAvailable ? 'opacity-50 border-gray-300' : ''}`}
        >
          {isAvailable ? 'Купить' : 'Заказ'}
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
    res = res.map(p => p.source?.toLowerCase() === 'чтк' ? { ...p, price: (Number(p.price)||0) * 0.85 } : p);

    return res.sort((a, b) => {
      const aIsNew = a.isNew || isNew(a.updatedAt);
      const bIsNew = b.isNew || isNew(b.updatedAt);

      switch (activeSort) {
        case 'price-asc': return (Number(a.price)||0) - (Number(b.price)||0);
        case 'price-desc': return (Number(b.price)||0) - (Number(a.price)||0);
        case 'name-asc': return (a.name || '').localeCompare(b.name || '');
        case 'new-first': 
           return (new Date(b.updatedAt||0).getTime()) - (new Date(a.updatedAt||0).getTime());
        
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

  if (isLoading) return <div className="animate-pulse space-y-10"><div className="h-4 bg-gray-100 w-1/4 rounded"/> <div className="grid grid-cols-3 gap-6">{[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded"/>)}</div></div>;

  return (
    <div className="w-full">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-transparent mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center py-4 gap-4">
          
          <div className="text-xs font-mono text-gray-400">
            {sorted.length} ТОВАРОВ
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-xs text-black font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                {sortOptions.find(o => o.value === activeSort)?.label}
                <IconChevron r={isSortOpen} />
              </button>
              
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-4 w-56 py-2 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50"
                  >
                    {sortOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setActiveSort(o.value); setSortOpen(false); }}
                        className={`block w-full text-left px-5 py-3 text-xs uppercase tracking-widest transition-colors ${activeSort === o.value ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
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
      </div>

      <div className="min-h-[50vh]">
        {sorted.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">Ничего не найдено</div>
        ) : currentMode === 'table' ? (
          <table className="w-full text-black border-collapse">
            <tbody className="w-full">
              {sorted.map(p => <TableRow key={p._id || p.article} product={p} />)}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {sorted.map(p => <MinimalCard key={p._id || p.article} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogOfProductSearch;
