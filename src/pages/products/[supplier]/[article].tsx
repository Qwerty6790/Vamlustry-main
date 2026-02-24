
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';
import { ClipLoader } from 'react-spinners';
import { Heart, Minus, Plus } from 'lucide-react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BASE_URL, getImageUrl } from '@/utils/constants';
import SEO from '@/components/SEO';

import type { ProductI } from '@/types/interfaces';

interface ProductDetailProps {
  product: ProductI;
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

const urlCache = new Map<string, string>();
const normalizeUrl = (url: string): string => {
  if (urlCache.has(url)) return urlCache.get(url)!;
  const clean = url.replace(/^http:\/\//i, 'https://');
  urlCache.set(url, clean);
  return clean;
};

const getImgUrl = (p: any): string | null => {
  let src: string | undefined;
  if (p.imageAddresses) src = Array.isArray(p.imageAddresses) ? p.imageAddresses[0] : p.imageAddresses;
  if (!src && p.imageAddress) src = Array.isArray(p.imageAddress) ? p.imageAddress[0] : p.imageAddress;
  if (!src && p.images && Array.isArray(p.images) && p.images.length > 0) src = p.images[0]; 
  return src ? normalizeUrl(src) : null;
};

// Извлекает префикс для первичного поиска (напр. "L5116")
const getCollectionPrefix = (article: string | number): string => {
  if (!article) return '';
  const str = String(article).trim();
  const match = str.match(/^[a-zA-Zа-яА-Я]*[-._]?\d+/);
  if (match) return match[0];
  return str.split(/[-/.\s_]/)[0];
};

// Очищает артикул для математического сравнения (напр. "L5116-6 BK" -> "l5116")
const getPrefixPart = (article: string | number): string => {
  if (!article) return '';
  const str = String(article).trim();
  const match = str.match(/^[a-zA-Zа-яА-Я]*[-._]?\d+/);
  const raw = match ? match[0] : str.split(/[-/.\s_]/)[0];
  return raw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

// Считает количество общих символов в начале (напр. "l5116" и "l5115" -> 4 совпадения "l511")
const getCommonPrefixLength = (s1: string, s2: string): number => {
  let i = 0;
  while (i < s1.length && i < s2.length && s1[i] === s2[i]) i++;
  return i;
};

// Берет базовый тип (напр. "Потолочный светильник")
const getBaseTypeFromName = (name: string): string => {
  if (!name) return '';
  const clean = name.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '').trim();
  return clean.split(/\s+/).slice(0, 2).join(' '); 
};

// Разбиваем на слова для проверки пересечений (от 2 букв, чтобы захватить цвета типа BK, WH)
const getWords = (str: string): string[] => {
  if (!str) return [];
  return str.toLowerCase().replace(/[^a-zа-я0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1);
};

// --- КОМПОНЕНТ ПОХОЖИХ ТОВАРОВ ---
const SimilarProducts: React.FC<{ currentProduct: ProductI }> = ({ currentProduct }) => {
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!currentProduct || !currentProduct.article) return;
      setLoading(true);

      try {
        const resultsMap = new Map<string, any>();

        const strictSeries = getCollectionPrefix(currentProduct.article);
        const baseType = getBaseTypeFromName(currentProduct.name);
        
        const cPrefix = getPrefixPart(currentProduct.article);
        const cWords = getWords(currentProduct.name);
        const cPrice = typeof currentProduct.price === 'string' ? parseFloat(currentProduct.price) : Number(currentProduct.price) || 0;

        const processProduct = (p: any) => {
          if (p._id === currentProduct._id || p.article === currentProduct.article) return;
          
          let score = 0;
          const pPrefix = getPrefixPart(p.article);
          const commonLen = getCommonPrefixLength(pPrefix, cPrefix);

          // 1. БРЕНД И АРТИКУЛ (Основной вес)
          if (p.source === currentProduct.source) {
             score += 30; // Тот же бренд

             // Главная магия: бонус за общие буквы/цифры в артикуле (помогает вытащить L5115 для L5116)
             score += commonLen * 40;

             // Жесткий штраф, если бренд тот же, но коллекции радикально разные (например 10121 для L5116)
             if (commonLen < 2) {
               score -= 100;
             }
          } else {
             score -= 20; 
             if (commonLen > 2) score += commonLen * 20; // поблажка для реплик других брендов
          }

          // Точное совпадение корня
          if (pPrefix === cPrefix && cPrefix.length >= 3) {
             score += 100;
          }

          // 2. СЛОВА В НАЗВАНИИ (Пересечение)
          const pWords = getWords(p.name);
          let overlap = 0;
          pWords.forEach(w => { if (cWords.includes(w)) overlap++; });
          score += overlap * 20;

          // 3. ФИЗИЧЕСКИЕ СВОЙСТВА
          const pColor = p.color ? String(p.color).toLowerCase() : '';
          const cColor = currentProduct.color ? String(currentProduct.color).toLowerCase() : '';
          const pMat = p.material ? String(p.material).toLowerCase() : '';
          const cMat = currentProduct.material ? String(currentProduct.material).toLowerCase() : '';

          if (pColor && cColor && (pColor.includes(cColor) || cColor.includes(pColor))) score += 40;
          if (pMat && cMat && (pMat.includes(cMat) || cMat.includes(pMat))) score += 40;

          // 4. ЦЕНА
          const pPrice = typeof p.price === 'string' ? parseFloat(p.price) : Number(p.price) || 0;
          if (cPrice > 0 && pPrice > 0) {
            const ratio = Math.max(cPrice, pPrice) / Math.min(cPrice, pPrice);
            if (ratio < 1.3) score += 20; 
            else if (ratio > 3) score -= 40;
          }

          if (resultsMap.has(p._id)) {
             const existing = resultsMap.get(p._id);
             if (score > existing.weight) existing.weight = score;
          } else {
             resultsMap.set(p._id, { ...p, weight: score });
          }
        };

        const requests = [];

        // Запрос 1: Строгий поиск по серии (L5116)
        if (strictSeries.length >= 2) {
          requests.push(
            fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(strictSeries)}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => data?.products?.forEach(processProduct))
          );
        }

        // Запрос 2: Широкий поиск (отрезаем последнюю цифру: L5116 -> L511). Это найдет L5115, L5110!
        if (strictSeries.length >= 3) {
          const broadSeries = strictSeries.slice(0, -1);
          requests.push(
            fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(broadSeries)}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => data?.products?.forEach(processProduct))
          );
        }

        // Запрос 3: Гарантированный поиск похожих товаров того же бренда ("Потолочный светильник LED4U")
        if (baseType && currentProduct.source) {
          const brandTypeQuery = `${baseType} ${currentProduct.source}`;
          requests.push(
            fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(brandTypeQuery)}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => data?.products?.forEach(processProduct))
          );
        }

        await Promise.allSettled(requests);

        // Оставляем только те товары, которые набрали позитивный балл
        const sortedResults = Array.from(resultsMap.values())
          .filter(p => p.weight > 0)
          .sort((a, b) => b.weight - a.weight);

        // Берем топ 4
        setSimilar(sortedResults.slice(0, 4));

      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentProduct]);

  if (!loading && similar.length === 0) return null;

  return (
    <div className="mt-24 border-t border-neutral-100 pt-16 mb-10">
      <h2 className="text-2xl md:text-3xl font-medium mb-8 text-neutral-900">
        Вам может подойти
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-full aspect-[3/4] bg-neutral-100 animate-pulse rounded-lg"></div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {similar.map((product) => {
             const imgUrl = getImgUrl(product);
             const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

             return (
               <Link 
                 key={product._id || product.article} 
                 href={`/products/${product.source}/${product.article}`} 
                 className="group block"
               >
                 <div className="relative aspect-[3/4] bg-[#F5F5F5] rounded-lg overflow-hidden mb-4 border border-transparent group-hover:border-neutral-200 transition-all">
                    {imgUrl ? (
                      <img 
                        src={imgUrl} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-4" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 uppercase tracking-widest">
                        Нет фото
                      </div>
                    )}
                 </div>
                 
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-2 leading-tight group-hover:text-neutral-600 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-2">
                      <p className="text-[10px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded w-fit">
                        {product.article}
                      </p>
                      <p className="text-base font-bold text-neutral-900">
                        {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)}
                      </p>
                    </div>
                 </div>
               </Link>
             );
          })}
        </div>
      )}
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---

const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct }) => {
  const router = useRouter();

  const product = useMemo(() => {
    if (initialProduct && initialProduct.source && initialProduct.source.toLowerCase() === 'чтк') {
      const originalPrice = typeof initialProduct.price === 'string' 
        ? parseFloat(initialProduct.price) 
        : Number(initialProduct.price) || 0;
      
      const discountedPrice = originalPrice * 0.85;
      return { ...initialProduct, price: discountedPrice };
    }
    return initialProduct;
  }, [initialProduct]);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [notifications, setNotifications] = useState<Array<{id:number,message:string,type:'success'|'error'|'info'}>>([]);

  const [mainImage, setMainImage] = useState<string>('');
  const [mainImageError, setMainImageError] = useState(false);
  const [failedThumbnailIndices, setFailedThumbnailIndices] = useState<number[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      const allImages =
        typeof product.imageAddresses === 'string'
          ? [product.imageAddresses]
          : Array.isArray(product.imageAddresses)
          ? product.imageAddresses
          : typeof product.imageAddress === 'string'
          ? [product.imageAddress]
          : Array.isArray(product.imageAddress)
          ? product.imageAddress
          : [];
          
      if (allImages.length > 0) {
        setMainImage(allImages[0]);
        setMainImageError(false);
      } else {
        setMainImage('');
      }
    }
  }, [product]);

  useEffect(() => {
    if (product && isMounted) {
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
      const isProductLiked = liked.products.some(
        (item: any) => item.article === product.article && item.source === product.source
      );
      setIsLiked(isProductLiked);
    }
  }, [product, isMounted]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', { detail: { message, type } }));
    } else {
      if (type === 'success') toast.success(message);
      else if (type === 'error') toast.error(message as any);
      else toast(message as any);
    }
  };

  useEffect(() => {
    const handler = (event: any) => {
      const { message, type } = event.detail || {};
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('showNotification', handler);
      return () => window.removeEventListener('showNotification', handler);
    }
  }, []);

  const addToCart = (product: any, qty: number) => {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"products": []}');
    const productData = {
      productId: product._id,
      article: product.article,
      source: product.source,
      quantity: qty,
    };

    if (Array.isArray(cart)) {
      const existingIndex = cart.findIndex((p: any) => p.productId === product._id);
      if (existingIndex > -1) cart[existingIndex].quantity += qty;
      else cart.push(productData);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      const existingIndex = cart.products.findIndex((p: any) => p.productId === product._id);
      if (existingIndex > -1) cart.products[existingIndex].quantity += qty;
      else cart.products.push(productData);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    const totalCount = (Array.isArray(cart) ? cart : cart.products).reduce(
      (acc: number, p: any) => acc + (p.quantity || 1), 0
    );
    localStorage.setItem("cartCount", totalCount.toString());
  };
  
  const imagesFromProduct = product
    ? Array.isArray(product.imageAddresses)
      ? product.imageAddresses
      : typeof product.imageAddresses === 'string'
      ? [product.imageAddresses]
      : Array.isArray(product.imageAddress)
      ? product.imageAddress
      : typeof product.imageAddress === 'string'
      ? [product.imageAddress]
      : []
    : [];

  const toggleLiked = () => {
    if (!product) return;
    const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const existingProductIndex = liked.products.findIndex(
      (item: any) => item.article === product.article && item.source === product.source
    );

    if (existingProductIndex > -1) {
      liked.products.splice(existingProductIndex, 1);
      setIsLiked(false);
      showNotification('Товар удален из избранного', 'info');
    } else {
      liked.products.push({ 
        article: product.article, 
        source: product.source,
        _id: product._id
      });
      setIsLiked(true);
      showNotification('Товар добавлен в избранное', 'success');
    }
    localStorage.setItem('liked', JSON.stringify(liked));
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setQuantityToAdd(isNaN(value) ? 1 : Math.max(1, value));
  };

  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <ClipLoader color="#000000" size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-black">
        <p className="text-xl font-light">Товар не найден</p>
      </div>
    );
  }

  const mainImageForStructured: string | undefined = imagesFromProduct[0];

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": mainImageForStructured,
    "description": `${product.name} - ${product.material || ''}, ${product.color || ''}`,
    "brand": { "@type": "Brand", "name": product.source },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/products/${product.source}/${product.article}`,
      "priceCurrency": "RUB",
      "price": product.price.toFixed(2),
      "availability": Number(product.stock) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      <SEO 
        title={`${product.name} | Elektromos`}
        description={`Купить ${product.name}. Цена: ${product.price} ₽. Доставка.`}
        keywords={`${product.name}, светильник, ${product.source}`}
        image={mainImageForStructured}
        url={`${BASE_URL}/products/${product.source}/${product.article}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div key={router.asPath} className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200 selection:text-black">
        <Header />
        
        <main className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 mb-10">
            <Link href="/" className="hover:text-black transition-colors">Главная</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/catalog/chandeliers" className="hover:text-black transition-colors">Каталог</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-medium truncate max-w-[200px] md:max-w-none">{product.name}</span>
          </nav>
         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-20">
            
            <div className="flex flex-col-reverse md:flex-row gap-6">
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {imagesFromProduct.slice(0, 5).map((img, idx) => {
                  const thumbUrl = getImageUrl(img);
                  const isFailed = failedThumbnailIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => { setMainImage(img); setMainImageError(false); }}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                        mainImage === img 
                          ? 'border-black opacity-100 ring-1 ring-black' 
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                      } bg-neutral-50`}
                    >
                      {isFailed ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">ERR</div>
                      ) : (
                        <img
                          src={thumbUrl}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                          onError={() => setFailedThumbnailIndices((prev) => [...prev, idx])}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex-1 bg-neutral-50 rounded-2xl flex items-center justify-center p-8 aspect-square lg:aspect-auto lg:h-[600px] relative overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainImage}
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="max-h-full max-w-full object-contain z-10 mix-blend-multiply"
                    onError={() => setMainImageError(true)}
                    style={{ display: mainImageError ? 'none' : 'block' }}
                  />
                </AnimatePresence>
                {mainImageError && <div className="text-gray-400 text-sm">Изображение недоступно</div>}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-2">
                 <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">{product.source}</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-medium mb-4 text-neutral-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-8 font-mono">
                <span>Арт. {product.article}</span>
                {Number(product.stock) > 0 ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    В наличии: {Number(product.stock)} шт.
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Нет в наличии</span>
                )}
              </div>

              <div className="text-4xl font-semibold text-neutral-900 mb-10">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(Number(product.price))}
              </div>
              
              <hr className="border-neutral-100 mb-10" />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mb-10">
                <div className="flex items-center border border-neutral-200 rounded-lg h-14 w-full sm:w-auto hover:border-neutral-400 transition-colors">
                  <button
                    onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                    className="w-14 h-full flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantityToAdd}
                    onChange={handleQuantityChange}
                    min="1"
                    className="w-12 h-full text-center bg-transparent text-neutral-900 font-medium text-lg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setQuantityToAdd(quantityToAdd + 1)}
                    className="w-14 h-full flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    addToCart(product, quantityToAdd);
                    router.push('/cart');
                  }}
                  className="flex-1 bg-neutral-900 text-white font-medium h-14 px-8 rounded-lg text-lg hover:bg-black transition-transform active:scale-[0.98] shadow-lg shadow-neutral-200"
                >
                  Купить
                </button>

                <button 
                  onClick={toggleLiked} 
                  className={`h-14 w-14 flex items-center justify-center border rounded-lg transition-all ${
                    isLiked 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-black'
                  }`}
                >
                   <Heart className={`transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} size={22}/>
                </button>
              </div>
              
              <div className="bg-neutral-50 p-6 rounded-xl space-y-2">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Характеристики</h3>
                  <p className='text-neutral-500 leading-relaxed text-sm'>
                    <span className="font-medium text-neutral-700">Материал:</span> {product.material || 'Не указан'}
                  </p>
                  <p className='text-neutral-500 leading-relaxed text-sm'>
                    <span className="font-medium text-neutral-700">Цвет:</span> {product.color || 'Не указан'}
                  </p>
                  <p className='text-neutral-500 leading-relaxed text-sm pt-2'>
                    Полные технические характеристики и описание скоро появятся.
                  </p>
              </div>
            </div>
          </div>

          {/* КОМПОНЕНТ ПОХОЖИХ ТОВАРОВ */}
          <SimilarProducts currentProduct={product} />

        </main>

        <div className="fixed top-24 right-6 z-50 pointer-events-none flex flex-col items-end gap-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg px-5 py-4 min-w-[300px] pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <p className="text-neutral-900 font-medium text-sm">{notification.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { supplier, article } = params as { supplier: string; article: string };
  try {
    const url = `${BASE_URL}/api/product/${supplier}?productArticle=${article}`;
    const response = await fetch(url);
    if (!response.ok) return { notFound: true };
    const product = await response.json();
    if (!product) return { notFound: true };
    return { props: { product }, revalidate: 60 };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
};

export default ProductDetail;