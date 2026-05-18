

'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';
import { ClipLoader } from 'react-spinners';
import { Heart, Search, Share2, Copy, Gift, Wrench, ChevronRight } from 'lucide-react';
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
  'chandeliers': 'Люстры', 
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
    if (isMatch) {
      return { slug, title: title.charAt(0).toUpperCase() + title.slice(1) };
    }
  }
  return { slug: 'lights', title: 'Освещение для дома' };
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

// --- ФУНКЦИИ ГЕНЕРАЦИИ SMART-ОПИСАНИЯ ---
const getStringHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const generateSmartDescription = (name: string, article: string | number, color?: string, material?: string): string => {
  if (!name) return "Стильный светильник для современного интерьера.";
  const hash = getStringHash(name + String(article));
  
  const intros = [
    `Модель — это воплощение современной эстетики в области светодизайна.`,
    `Представляем продуманное решение для создания идеального светового сценария в вашем пространстве.`,
    `Коллекция пополнилась ярким представителем, разработанным специально для тех, кто ищет баланс между функциональностью и стилем.`,
  ];
  const styles = [
    `Его визуальное исполнение органично дополнит строгий минимализм и уютный интерьер.`,
    `Выверенные пропорции и внимание к деталям делают эту модель настоящим украшением любой комнаты.`,
  ];
  const techs = [
    `Продуманная конструкция обеспечивает мягкое, но эффективное распределение светового потока.`,
    `Инженерные решения направлены на максимальный комфорт, долговечность и безопасность.`,
  ];

  const intro = intros[hash % intros.length];
  const style = styles[(hash >> 1) % styles.length];
  const tech = techs[(hash >> 2) % techs.length];

  let attributesStr = "";
  if (material || color) {
    attributesStr = ` Выполнен из качественных материалов.`;
  }

  return `${intro} ${style}${attributesStr} ${tech}`;
};

// --- КОМПОНЕНТ КОЛЛЕКЦИИ (с логикой поиска похожих товаров) ---
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
             score += 30 + (commonLen * 40);
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

          if (resultsMap.has(p._id)) {
             if (score > resultsMap.get(p._id).weight) resultsMap.get(p._id).weight = score;
          } else {
             resultsMap.set(p._id, { ...p, weight: score });
          }
        };

        const requests = [];
        if (strictSeries.length >= 2) {
          requests.push(fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(strictSeries)}`).then(res => res.ok ? res.json() : null).then(data => data?.products?.forEach(processProduct)));
        }
        await Promise.allSettled(requests);

        const sortedResults = Array.from(resultsMap.values()).filter(p => p.weight > 0).sort((a, b) => b.weight - a.weight);
        setSimilar(sortedResults.slice(0, 8)); // Берем до 8 похожих товаров для скролла
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [currentProduct]);

  const collectionName = getCollectionPrefix(currentProduct.article);

  if (!loading && similar.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-[18px] font-medium mb-5">
        {collectionName ? `Коллекция ` : 'Похожие модели'}
      </h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
             <div key={i} className="w-[72px] h-[72px] bg-gray-100 animate-pulse rounded-2xl flex-shrink-0"></div>
          ))
        ) : (
          similar.map((product) => (
            <Link 
              key={product._id} 
              href={`/products/${product.source.toLowerCase()}/${String(product.article).toLowerCase()}`}
              title={product.name}
              className="w-[72px] h-[72px] bg-[#d2d5d6] rounded-2xl flex-shrink-0 flex items-center justify-center p-1.5 cursor-pointer hover:opacity-80 transition"
            >
              <img 
                src={getImgUrl(product) || '/placeholder.png'} 
                alt={product.name} 
                className="mix-blend-multiply w-full h-full object-contain" 
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

// --- СТРОКА ХАРАКТЕРИСТИК ---
const SpecRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex items-end w-full mb-2.5 text-[14px]">
    <div className="text-gray-500 bg-white pr-2 whitespace-nowrap">{label}</div>
    <div className="flex-grow border-b-2 border-dotted border-gray-200 relative -top-1.5 mx-1"></div>
    <div className="text-right bg-white pl-2 text-gray-900 whitespace-nowrap">{value}</div>
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

  const categoryInfo = product ? getCategoryData(product.name) : { slug: 'lights', title: 'Освещение для дома' };

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (product && isMounted) {
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
      const isProductLiked = liked.products.some((item: any) => item.article === product.article && item.source === product.source);
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
    const productData = { productId: product._id, article: product.article, source: product.source, quantity: qty };

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
  
    const totalCount = (Array.isArray(cart) ? cart : cart.products).reduce((acc: number, p: any) => acc + (p.quantity || 1), 0);
    localStorage.setItem("cartCount", totalCount.toString());
    showNotification('Товар добавлен в корзину', 'success');

    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: totalCount } }));
  };

  const toggleLiked = () => {
    if (!product) return;
    const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const existingIndex = liked.products.findIndex((item: any) => item.article === product.article && item.source === product.source);
    let newCount = liked.products.length;

    if (existingIndex > -1) {
      liked.products.splice(existingIndex, 1);
      setIsLiked(false);
      newCount = liked.products.length;
      showNotification('Удалено из избранного', 'info');
    } else {
      liked.products.push({ article: product.article, source: product.source, _id: product._id });
      setIsLiked(true);
      newCount = liked.products.length;
      showNotification('Добавлено в избранное', 'success');
    }
    localStorage.setItem('liked', JSON.stringify(liked));
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('likedUpdated', { detail: { count: newCount } }));
  };
  
  const imagesFromProduct = product ? (Array.isArray(product.imageAddresses) ? product.imageAddresses : typeof product.imageAddresses === 'string' ? [product.imageAddresses] : Array.isArray(product.imageAddress) ? product.imageAddress : typeof product.imageAddress === 'string' ? [product.imageAddress] : []) : [];
  const displayImages = imagesFromProduct.length > 0 ? imagesFromProduct : ['/placeholder.png'];
  
  if (router.isFallback) return <div className="flex justify-center items-center h-screen bg-white"><ClipLoader color="#000000" size={50} /></div>;
  if (!product) return <div className="flex justify-center items-center h-screen bg-white text-black"><p className="text-xl font-light">Товар не найден</p></div>;

  return (
    <>
      <SEO 
        title={`Купить ${product.name} ${product.source} ${product.article} в Москве | Цена, фото - ВамЛюстра`}
        description={`🔥 Заказывайте ${String(product.name).toLowerCase()} от бренда ${product.source} (арт. ${product.article}) по цене ${product.price} ₽ в интернет-магазине ВамЛюстра. 🚚 Быстрая доставка по Москве и РФ, официальная гарантия.`}
        keywords={`${product.name}, ${product.source} ${product.article}, купить светильник, ${product.source}`}
        image={displayImages[0]}
        url={`${BASE_URL}/products/${product.source.toLowerCase()}/${String(product.article).toLowerCase()}`}
      />
      
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <Header />
        
        <main className="max-w-[1500px] mx-auto px-4 md:px-8 pt-24 pb-20">
          
          {/* Хлебные крошки */}
          <nav className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 mb-6 font-light">
            <Link href="/" className="hover:text-black">ВамЛюстра</Link>
            <span className="text-gray-300">/</span>
            <Link href="/catalog" className="hover:text-black">Освещение для дома</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/catalog/${categoryInfo.slug}`} className="hover:text-black capitalize">{categoryInfo.title}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400 truncate">{product.article} {product.material || ''} Smart</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ЛЕВАЯ КОЛОНКА (Галерея 60%) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Сетка фотографий: 1, 2 или 3 шт. */}
              <div className={`grid gap-6 ${displayImages.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* 1. Главное фото */}
                <div className={`bg-[#d2d5d6] rounded-3xl relative flex items-center justify-center p-8 overflow-hidden group ${displayImages.length >= 3 ? 'md:col-span-2 aspect-square md:aspect-[2/1]' : 'aspect-[4/4.5]'}`}>
                  <img 
                    src={getImageUrl(displayImages[0])} 
                    alt={product.name} 
                    className="mix-blend-multiply w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                  />  
                </div>

                {/* 2. Второе фото */}
                {displayImages.length > 1 && (
                  <div className="bg-[#d2d5d6] rounded-3xl relative aspect-[4/4.5] flex items-center justify-center p-8 overflow-hidden group">
                    <img 
                      src={getImageUrl(displayImages[1])} 
                      alt={`${product.name} вид 2`} 
                      className="mix-blend-multiply w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}

                {/* 3. Третье фото */}
                {displayImages.length > 2 && (
                  <div className="bg-[#d2d5d6] rounded-3xl relative aspect-[4/4.5] flex items-center justify-center p-8 overflow-hidden group">
                    <img 
                      src={getImageUrl(displayImages[2])} 
                      alt={`${product.name} вид 3`} 
                      className="mix-blend-multiply w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}
              </div>

            
             
            </div>

            {/* ПРАВАЯ КОЛОНКА (Инфо 40%) */}
            <div className="lg:col-span-5 flex flex-col pt-2">
              
              <h1 className="text-[26px] font-medium text-gray-900 leading-[1.2] mb-5 pr-10">
                {product.name}
              </h1>

              <div className="flex justify-between items-center text-[13px] text-gray-500 mb-8">
                <span>Код: {product.article}</span>
                <span>Бренд: {product.source}</span>
              </div>

              {/* Блок цены и кнопки */}
              <div className="flex items-center gap-4 mb-3">
                <div className="text-[30px] font-normal tracking-tight min-w-[150px]">
                  {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(Number(product.price))}
                </div>
                
                <div className="flex-grow flex flex-col">
                  <button onClick={() => addToCart(product, 1)} className="bg-[#21242c] text-white h-14 rounded-[18px] text-[15px] font-medium hover:bg-black transition-colors w-full tracking-wide">
                    КУПИТЬ
                  </button>
                  <div className="text-[12px] text-gray-500 mt-2 text-center">
                    В наличии {Number(product.stock) > 10 ? '>10' : product.stock} шт.
                  </div>
                </div>

                <button onClick={toggleLiked} className="w-14 h-14 bg-[#f4f5f5] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 self-start">
                  <Heart size={20} className={`text-gray-600 ${isLiked ? "fill-gray-900 text-gray-900" : ""}`} />
                </button>
              </div>

              {/* Характеристики */}
              <div className="mt-8">
                <h3 className="text-[18px] font-medium mb-5">Характеристики</h3>
                <div className="space-y-0 text-gray-600">
                  <SpecRow label="Артикул" value={product.article} />
                  {product.length && <SpecRow label="Длина" value={`${product.length} мм`} />}
                  {product.width && <SpecRow label="Ширина" value={`${product.width} мм`} />}
                  {product.height && <SpecRow label="Высота" value={`${product.height} мм`} />}
                  <SpecRow label="Источник света" value={"сменная лампа"} />
                </div>
                <button className="text-[14px] text-gray-400 border-b border-gray-300 border-dashed pb-0.5 mt-3 hover:text-black transition">
                  Посмотреть все
                </button>
              </div>

              {/* Табы */}
              <div className="flex gap-6 border-b border-gray-200 mt-10 overflow-x-auto scrollbar-hide">
                <div className="pb-3 border-b-2 border-black text-[14px] font-medium text-gray-900 whitespace-nowrap cursor-pointer">Забота о клиенте</div>
                <div className="pb-3 text-gray-500 text-[14px] whitespace-nowrap hover:text-black cursor-pointer transition">Инструкция</div>
                <div className="pb-3 text-gray-500 text-[14px] whitespace-nowrap hover:text-black cursor-pointer transition">Сделать умным</div>
                <div className="pb-3 text-gray-500 text-[14px] whitespace-nowrap hover:text-black cursor-pointer transition">1 отзыв</div>
              </div>

              {/* Промо блоки (Подарок, Сертификат) */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex gap-4 items-start border border-gray-100 rounded-2xl p-4">
                  <Gift size={28} strokeWidth={1} className="text-gray-700 flex-shrink-0" />
                  <p className="text-[13px] text-gray-700 leading-snug">Подарок в корзине при заказе от 30 000 ₽</p>
                </div>
                <div className="flex gap-4 items-start border border-gray-100 rounded-2xl p-4">
                  <Wrench size={28} strokeWidth={1} className="text-gray-700 flex-shrink-0" />
                  <p className="text-[13px] text-gray-700 leading-snug">Сертификат на монтажные работы при заказе от 30 000 ₽</p>
                </div>
              </div>

              {/* Коллекция / Похожие товары (Вынесенная логика) */}
              <CollectionMiniatures currentProduct={product} />

              {/* Описание */}
              <div className="mt-10 mb-8">
                <h3 className="text-[18px] font-medium mb-3">Описание</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {generateSmartDescription(product.name, product.article, product.color, product.material)}
                </p>
              </div>

            </div>
          </div>
        </main>

        {/* Уведомления */}
        <div className="fixed top-24 right-6 z-50 pointer-events-none flex flex-col items-end gap-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="bg-white border border-gray-100 shadow-xl rounded-2xl px-5 py-4 min-w-[300px] pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notification.type === 'success' ? 'bg-black' : 'bg-red-500'}`} />
                  <p className="text-gray-900 font-medium text-[14px]">{notification.message}</p>
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
