

'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';
import { ClipLoader } from 'react-spinners';
import { Heart, Search, Gift, PenTool } from 'lucide-react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BASE_URL, getImageUrl } from '@/utils/constants';
import SEO from '@/components/SEO';

import type { ProductI } from '@/types/interfaces';

interface ProductDetailProps {
  product: ProductI;
}

// --- СЛОВАРЬ КАТЕГОРИЙ ---
const CATEGORY_MAP: Record<string, string> = {
  'chandeliers/pendant-chandeliers': 'Подвесная люстра',
  'chandeliers/ceiling-chandeliers': 'Потолочная люстра',
  'chandeliers/rod-chandeliers': 'Люстра на штанге',
  'chandeliers/cascade-chandeliers': 'Люстра каскадная',
  'chandeliers/crystal-chandeliers': 'хрусталь Люстра',
  'chandeliers': 'Люстра',
  'ceiling-fans': 'Люстра вентилятор',
  'lights/ceiling-lights': 'Потолочный светильник',
  'lights/pendant-lights': 'Подвесной светильник',
  'lights/wall-lights': 'Настенный светильник',
  'lights/recessed-lights': 'Светильник встраиваемый',
  'lights/surface-mounted-lights': 'Светильник накладной',
  'lights/track-lights': 'трековый светильник',
  'lights/spot-lights': 'Точечный светильник',
  'lights': 'Светильники',
  'wall-sconces': 'Настенный светильник',
  'floor-lamps': 'Торшер',
  'table-lamps': 'Настольная лампа',
  'led-strip-profiles': 'Профиль',
  'led-strips': 'Светодиодная лента',
  'led-lamp': 'Светодиодная лампа',
  'outdoor-lights/outdoor-wall-lights': 'Настенный уличный светильник',
  'outdoor-lights/ground-lights': 'Грунтовый светильник',
  'outdoor-lights/landscape-lights': 'Ландшафтный светильник',
  'outdoor-lights/park-lights': 'Парковый светильник',
  'outdoor-lights': 'Уличный светильник',
  'accessories/connectors': 'Коннектор',
  'accessories/cords': 'Шнур',
  'accessories/power-supplies': 'Блок питания',
  'accessories/lamp-holders': 'Патрон',
  'accessories/mounting': 'Крепление для светильников',
  'accessories/lampshades': 'Плафон',
  'accessories/controllers': 'Контроллер для светодиодной ленты',
  'accessories': 'Комплектующие',
};

const getCategoryData = (name: string): { slug: string; title: string } => {
  if (!name) return { slug: 'lights', title: 'Светильники' };
  const lowerName = name.toLowerCase();
  const sortedEntries = Object.entries(CATEGORY_MAP).sort((a, b) => b[1].length - a[1].length);
  for (const [slug, title] of sortedEntries) {
    const titleWords = title.toLowerCase().split(' ');
    const isMatch = titleWords.every(word => lowerName.includes(word));
    if (isMatch) return { slug, title: title.charAt(0).toUpperCase() + title.slice(1) };
  }
  return { slug: 'lights', title: 'Светильники' };
};

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

const getCollectionPrefix = (article: string | number): string => {
  if (!article) return '';
  const str = String(article).trim();
  const match = str.match(/^[a-zA-Zа-яА-Я]*[-._]?\d+/);
  if (match) return match[0];
  return str.split(/[-/.\s_]/)[0];
};

const getPrefixPart = (article: string | number): string => {
  if (!article) return '';
  const str = String(article).trim();
  const match = str.match(/^[a-zA-Zа-яА-Я]*[-._]?\d+/);
  const raw = match ? match[0] : str.split(/[-/.\s_]/)[0];
  return raw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

const getCommonPrefixLength = (s1: string, s2: string): number => {
  let i = 0;
  while (i < s1.length && i < s2.length && s1[i] === s2[i]) i++;
  return i;
};

const getBaseTypeFromName = (name: string): string => {
  if (!name) return '';
  const clean = name.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '').trim();
  return clean.split(/\s+/).slice(0, 2).join(' '); 
};

const getWords = (str: string): string[] => {
  if (!str) return [];
  return str.toLowerCase().replace(/[^a-zа-я0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1);
};

// --- КОМПОНЕНТ КОЛЛЕКЦИИ ---
const CollectionMiniatures: React.FC<{ currentProduct: ProductI }> = ({ currentProduct }) => {
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

        const processProduct = (p: any) => {
          if (p._id === currentProduct._id || p.article === currentProduct.article) return;
          let score = 0;
          const pPrefix = getPrefixPart(p.article);
          const commonLen = getCommonPrefixLength(pPrefix, cPrefix);

          if (p.source === currentProduct.source) {
             score += 30;
             score += commonLen * 40;
             if (commonLen < 2) score -= 100;
          } else {
             score -= 20; 
             if (commonLen > 2) score += commonLen * 20;
          }

          if (pPrefix === cPrefix && cPrefix.length >= 3) score += 100;

          const pWords = getWords(p.name);
          let overlap = 0;
          pWords.forEach(w => { if (cWords.includes(w)) overlap++; });
          score += overlap * 20;

          const pColor = p.color ? String(p.color).toLowerCase() : '';
          const cColor = currentProduct.color ? String(currentProduct.color).toLowerCase() : '';
          if (pColor && cColor && (pColor.includes(cColor) || cColor.includes(pColor))) score += 40;

          if (resultsMap.has(p._id)) {
             const existing = resultsMap.get(p._id);
             if (score > existing.weight) existing.weight = score;
          } else {
             resultsMap.set(p._id, { ...p, weight: score });
          }
        };

        const requests = [];
        if (strictSeries.length >= 2) {
          requests.push(fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(strictSeries)}`).then(res => res.ok ? res.json() : null).then(data => data?.products?.forEach(processProduct)));
        }
        if (baseType && currentProduct.source) {
          requests.push(fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(`${baseType} ${currentProduct.source}`)}`).then(res => res.ok ? res.json() : null).then(data => data?.products?.forEach(processProduct)));
        }

        await Promise.allSettled(requests);
        const sortedResults = Array.from(resultsMap.values()).filter(p => p.weight > 0).sort((a, b) => b.weight - a.weight);
        setSimilar(sortedResults.slice(0, 4));
      } catch (error) {
        console.error("Error fetching similar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [currentProduct]);

  if (!loading && similar.length === 0) return null;

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">Коллекция</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="w-20 h-20 bg-gray-200 animate-pulse rounded-2xl flex-shrink-0" />)
        ) : (
          similar.map((product) => {
             const imgUrl = getImgUrl(product);
             return (
               <Link 
                 key={product._id || product.article} 
                 href={`/products/${encodeURIComponent(product.source)}/${encodeURIComponent(String(product.article))}`} 
                 className="w-20 h-20  rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 "
               >
                 {imgUrl ? (
                   <img src={imgUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                 ) : (
                   <div className="text-[10px] text-gray-500 uppercase">Нет фото</div>
                 )}
               </Link>
             );
          })
        )}
      </div>
    </div>
  );
};

// --- СТРОКА ХАРАКТЕРИСТИК ---
const SpecRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex items-end w-full mb-3 text-[14px]">
    <div className="text-gray-500 pr-2 whitespace-nowrap">{label}</div>
    <div className="flex-grow border-b border-dotted border-gray-300 relative -top-1.5 mx-1"></div>
    <div className="text-right pl-2 text-gray-900 whitespace-nowrap">{value}</div>
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct }) => {
  const router = useRouter();

  const product = useMemo(() => {
    if (initialProduct && initialProduct.source && initialProduct.source.toLowerCase() === 'чтк') {
      const originalPrice = typeof initialProduct.price === 'string' ? parseFloat(initialProduct.price) : Number(initialProduct.price) || 0;
      return { ...initialProduct, price: originalPrice * 0.85 };
    }
    return initialProduct;
  }, [initialProduct]);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id:number,message:string,type:'success'|'error'|'info'}>>([]);

  const categoryInfo = product ? getCategoryData(product.name) : { slug: 'lights', title: 'Светильники' };

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    if (product && isMounted) {
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
      setIsLiked(liked.products.some((item: any) => item.article === product.article && item.source === product.source));
    }
  }, [product, isMounted]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('showNotification', { detail: { message, type } }));
    else type === 'success' ? toast.success(message) : toast(message as any);
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
    const productData = { productId: product._id, article: product.article, source: product.source, quantity: qty };

    const cartArray = Array.isArray(cart) ? cart : cart.products;
    const existingIndex = cartArray.findIndex((p: any) => p.productId === product._id);
    if (existingIndex > -1) cartArray[existingIndex].quantity += qty;
    else cartArray.push(productData);
    
    localStorage.setItem("cart", JSON.stringify(Array.isArray(cart) ? cartArray : { products: cartArray }));
    const totalCount = cartArray.reduce((acc: number, p: any) => acc + (p.quantity || 1), 0);
    localStorage.setItem("cartCount", totalCount.toString());
    showNotification('Товар добавлен в корзину', 'success');
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: totalCount } }));
  };

  const toggleLiked = () => {
    if (!product) return;
    const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const existingProductIndex = liked.products.findIndex((item: any) => item.article === product.article && item.source === product.source);
    let newCount = liked.products.length;

    if (existingProductIndex > -1) {
      liked.products.splice(existingProductIndex, 1);
      setIsLiked(false);
      showNotification('Удалено из избранного', 'info');
    } else {
      liked.products.push({ article: product.article, source: product.source, _id: product._id });
      setIsLiked(true);
      showNotification('Добавлено в избранное', 'success');
    }
    newCount = liked.products.length;
    localStorage.setItem('liked', JSON.stringify(liked));
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('likedUpdated', { detail: { count: newCount } }));
  };
  
  if (router.isFallback) return <div className="flex justify-center items-center h-screen bg-white"><ClipLoader color="#000000" size={50} /></div>;
  if (!product) return <div className="flex justify-center items-center h-screen bg-white text-black"><p className="text-xl font-light">Товар не найден</p></div>;

  // --- ЛОГИКА ИЗВЛЕЧЕНИЯ 4-х ФОТОГРАФИЙ ---
  const imagesFromProduct = Array.isArray(product.imageAddresses) ? product.imageAddresses : 
                            typeof product.imageAddresses === 'string' ? [product.imageAddresses] : 
                            Array.isArray(product.imageAddress) ? product.imageAddress : 
                            typeof product.imageAddress === 'string' ? [product.imageAddress] : 
                            (product.images && Array.isArray(product.images)) ? product.images : [];

  const mainImg = imagesFromProduct[0] ? getImageUrl(imagesFromProduct[0]) : null;
  const secondImg = imagesFromProduct[1] ? getImageUrl(imagesFromProduct[1]) : null;
  const thirdImg = imagesFromProduct[2] ? getImageUrl(imagesFromProduct[2]) : null;
  const fourthImg = imagesFromProduct[3] ? getImageUrl(imagesFromProduct[3]) : null;

  const hasAdditionalImages = secondImg || thirdImg || fourthImg;

  // ==========================================
  // РЕШЕНИЕ ПРОБЛЕМЫ С SEO ДЛЯ ЯНДЕКСА
  // ==========================================
  
  const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(Number(product.price));
  const seoTitle = `${product.name} (Арт. ${product.article}), бренд ${product.source} — купить | ВамЛюстра`;

  let seoDescription = `Купить ${categoryInfo.title.toLowerCase()} ${product.source} (артикул ${product.article}).`;
  if (product.color) seoDescription += ` Цвет: ${product.color}.`;
  if (product.material) seoDescription += ` Материал: ${product.material}.`;
  seoDescription += ` Выгодная цена: ${formattedPrice} в интернет-магазине ВамЛюстра. Быстрая доставка!`;

  const canonicalUrl = `${BASE_URL}/products/${encodeURIComponent(product.source.toLowerCase())}/${encodeURIComponent(String(product.article).toLowerCase())}`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        image={mainImg || undefined}
        url={canonicalUrl}
      />
      
      <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200 selection:text-black">
        <Header />
        
        <main className="container mx-auto px-4 md:px-8 pt-28 pb-20 max-w-[1500px]">
          
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Главная</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/catalog/${categoryInfo.slug}`} className="hover:text-black transition-colors capitalize">{categoryInfo.title}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400 truncate max-w-[200px] md:max-w-none">{product.article}</span>
          </nav>
         
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* ЛЕВАЯ КОЛОНКА (ФОТО) */}
            <div className="lg:w-[55%] xl:w-[60%] flex flex-col gap-4">
              
              <div className="flex flex-col sm:flex-row gap-4 h-auto sm:h-[500px] xl:h-[600px]">
                <div className={`relative bg-[#dcdcdc] rounded-[32px] overflow-hidden flex items-center justify-center p-8 group ${hasAdditionalImages ? 'flex-[3]' : 'w-full flex-1 h-[400px] sm:h-full'}`}>
                  {mainImg ? (
                    <img src={mainImg} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-gray-400">Нет фото</span>
                  )}
                </div>

                {hasAdditionalImages && (
                  <div className="flex flex-row sm:flex-col gap-4 flex-1 h-[120px] sm:h-full overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-hide">
                    {secondImg && (
                      <div className="relative flex-1 min-w-[120px] bg-[#dcdcdc] rounded-[24px] sm:rounded-[32px] overflow-hidden items-center justify-center p-4 group">
                        <img src={secondImg} alt={`${product.name} ракурс 2`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    {thirdImg && (
                      <div className="relative flex-1 min-w-[120px] bg-[#dcdcdc] rounded-[24px] sm:rounded-[32px] overflow-hidden items-center justify-center p-4 group">
                        <img src={thirdImg} alt={`${product.name} ракурс 3`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    {fourthImg && (
                      <div className="relative flex-1 min-w-[120px] bg-[#dcdcdc] rounded-[24px] sm:rounded-[32px] overflow-hidden items-center justify-center p-4 group">
                        <img src={fourthImg} alt={`${product.name} ракурс 4`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-[#f5f5f5] rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative mt-2">
                 <div className="absolute right-0 top-0 bottom-0 w-[40%] opacity-40 sm:opacity-100 pointer-events-none flex items-center justify-end pr-4">
                    <div className="w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white/50 backdrop-blur-sm rotate-6">
                       <img src={mainImg || ''} alt="" className="w-20 h-20 object-contain mix-blend-multiply opacity-50" />
                    </div>
                 </div>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА (ИНФО) */}
            <div className="lg:w-[45%] xl:w-[40%] flex flex-col">
              
              <h1 className="text-2xl sm:text-3xl font-medium text-black leading-tight mb-3">
                {product.name}
              </h1>
              
              <div className="flex gap-6 text-sm text-gray-500 mb-8">
                <span>Код: {product.article}</span>
                <span>Бренд: {product.source}</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-[40px] font-medium tracking-tight text-black">
                  {formattedPrice}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="bg-[#242424] hover:bg-black text-white px-10 py-4 rounded-full font-medium transition-colors"
                  >
                    КУПИТЬ
                  </button>
                  <button 
                    onClick={toggleLiked} 
                    className="bg-[#f5f5f5] hover:bg-[#e5e5e5] p-4 rounded-full transition-colors flex items-center justify-center"
                  >
                    <Heart size={24} className={isLiked ? "fill-black text-black" : "text-black"} />
                  </button>
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-500 mb-10 border-b border-gray-100 pb-8">
                В наличии {Number(product.stock) > 0 ? ` ${product.stock} шт.` : 'уточняйте'}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Характеристики</h3>
                <div className="space-y-1">
                  <SpecRow label="Артикул" value={product.article} />
                  {product.material && <SpecRow label="Материал" value={product.material} />}
                  {product.color && <SpecRow label="Цвет" value={product.color} />}
                  <SpecRow label="Категория" value={categoryInfo.title} />
                  <SpecRow label="Изготовитель" value={product.source} />
                </div>
                <button onClick={() => showNotification('Скоро будет доступно', 'info')} className="text-sm text-gray-500 hover:text-black underline mt-4">
                  Посмотреть все
                </button>
              </div>

              <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide text-sm">
                <button className="pb-3 border-b-2 border-black font-medium text-black whitespace-nowrap">Забота о клиенте</button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 flex items-start gap-4 border border-gray-200 rounded-2xl p-4">
                  <Gift className="w-8 h-8 text-black shrink-0" strokeWidth={1.5} />
                  Скоро будет доступно
                </div>
              </div>

              <CollectionMiniatures currentProduct={product} />
            </div>
          </div>
        </main>

        <div className="fixed top-24 right-6 z-50 pointer-events-none flex flex-col items-end gap-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="bg-white border border-gray-100 shadow-xl rounded-2xl px-6 py-4 pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { supplier, article } = params as { supplier: string; article: string };
  
  console.log(`[getStaticProps] Запрос товара: Бренд=${supplier}, Артикул=${article}`);

  try {
    // Надежный URL для серверной стороны
    const baseUrl = BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fetchUrl = `${baseUrl}/api/product/${encodeURIComponent(supplier)}?productArticle=${encodeURIComponent(article)}`;
    
    console.log(`[getStaticProps] URL API: ${fetchUrl}`);

    const response = await fetch(fetchUrl);

    if (!response.ok) {
      console.error(`[getStaticProps] Ошибка от API! Статус: ${response.status} ${response.statusText}`);
      return { notFound: true };
    }

    const product = await response.json();

    if (!product || product.error || Object.keys(product).length === 0) {
      console.error(`[getStaticProps] Товар пустой или API вернул ошибку:`, product);
      return { notFound: true };
    }

    return { 
      props: { product }, 
      revalidate: 60 
    };

  } catch (error) {
    console.error(`[getStaticProps] Сбой fetch-запроса (возможно сервер API выключен):`, error);
    return { notFound: true };
  }
};
 
export default ProductDetail;
