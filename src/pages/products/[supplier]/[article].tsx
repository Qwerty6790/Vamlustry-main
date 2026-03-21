import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';
import { ClipLoader } from 'react-spinners';
import { Heart, Minus, Plus, Share2, Copy, ShoppingCart, FileText, Box, ChevronDown, GitCompare, ChevronUp, Sparkles } from 'lucide-react';
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
  'chandeliers': 'Люстра', // Короткие названия должны идти после длинных при сортировке
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

// Функция определения слага и названия категории по имени товара
const getCategoryData = (name: string): { slug: string; title: string } => {
  if (!name) return { slug: 'lights', title: 'Светильники' };
  
  const lowerName = name.toLowerCase();
  
  // Сортируем ключи по убыванию длины значения, чтобы сначала искать точные фразы
  const sortedEntries = Object.entries(CATEGORY_MAP).sort((a, b) => b[1].length - a[1].length);

  for (const [slug, title] of sortedEntries) {
    const titleWords = title.toLowerCase().split(' ');
    const isMatch = titleWords.every(word => lowerName.includes(word));
    
    if (isMatch) {
      return { 
        slug, 
        title: title.charAt(0).toUpperCase() + title.slice(1) 
      };
    }
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

// --- ФУНКЦИИ ГЕНЕРАЦИИ SMART-ОПИСАНИЯ ---
const getStringHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const generateSmartDescription = (name: string, article: string | number, color?: string, material?: string, prefix?: string): string => {
  if (!name) return "Стильный светильник для современного интерьера.";
  
  const hash = getStringHash(name + String(article));
  
  const intros = [
    `Модель — это воплощение современной эстетики в области светодизайна.`,
    `Представляем  — продуманное решение для создания идеального светового сценария в вашем пространстве.`,
    `Коллекция пополнилась ярким представителем:  разработан специально для тех, кто ищет баланс между функциональностью и стилем.`,
    `Осветите свое пространство по-новому с помощью элегантного светильника .`,
    `Уникальный силуэт модели $ привлекает внимание и становится самостоятельным арт-объектом в интерьере.`
  ];

  const styles = [
    `Его визуальное исполнение органично дополнит как строгий минимализм, так и уютный скандинавский интерьер или стиль лофт.`,
    `Выверенные пропорции и внимание к деталям делают эту модель настоящим украшением любой комнаты.`,
    `Дизайн изделия отражает актуальные европейские тренды в интерьерном освещении, притягивая восхищенные взгляды.`,
    `Лаконичная, но выразительная форма позволяет светильнику не перегружать пространство, оставаясь при этом заметным акцентом.`,
    `Плавные линии в сочетании с качественной сборкой подчеркивают премиальный статус данного элемента освещения.`
  ];

  const techs = [
    `Продуманная конструкция обеспечивает мягкое, но эффективное распределение светового потока, исключая неприятные блики и защищая глаза.`,
    `Оптимальный угол рассеивания света помогает создать правильное зонирование или обеспечить яркое базовое освещение.`,
    `Инженерные решения, примененные в данной модели, направлены на максимальный комфорт, долговечность и безопасность использования.`,
    `Особая геометрия плафона способствует правильному преломлению лучей, создавая приятную атмосферу уюта в вечернее время.`,
    `Светотехнические характеристики изделия удовлетворят даже самые строгие требования к quality домашнего и коммерческого освещения.`
  ];

  const outros = [
    `Это не просто источник света, а важный инструмент дизайнера, задающий настроение всему помещению.`,
    `Сделайте выбор в пользу безупречного вкуса и надежности для вашего дома, квартиры или офиса.`,
    `Преобразите интерьер, добавив в него профессионально поставленный свет, который подчеркнет текстуры и цвета вашей мебели.`,
    `Создайте гармонию и уют, доверив освещение проверенным решениям современного рынка.`,
    `Идеальный финальный штрих для завершения концепции вашего идеального ремонта.`
  ];

  const intro = intros[hash % intros.length];
  const style = styles[(hash >> 1) % styles.length];
  const tech = techs[(hash >> 2) % techs.length];
  const outro = outros[(hash >> 3) % outros.length];

  let attributesStr = "";
  if (material || color) {
    const matText = material ? `Выполнен из высококачественных материалов (${material.toLowerCase()}).` : "";
    const colText = color ? ` Изысканное цветовое решение — ${color.toLowerCase()} — легко интегрируется в любую палитру.` : "";
    attributesStr = ` ${matText}${colText}`;
  }

  return `${intro} ${style}${attributesStr} ${tech} ${outro}`;
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
          const pMat = p.material ? String(p.material).toLowerCase() : '';
          const cMat = currentProduct.material ? String(currentProduct.material).toLowerCase() : '';

          if (pColor && cColor && (pColor.includes(cColor) || cColor.includes(pColor))) score += 40;
          if (pMat && cMat && (pMat.includes(cMat) || cMat.includes(pMat))) score += 40;

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

        if (strictSeries.length >= 2) {
          requests.push(
            fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(strictSeries)}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => data?.products?.forEach(processProduct))
          );
        }

        if (strictSeries.length >= 3) {
          const broadSeries = strictSeries.slice(0, -1);
          requests.push(
            fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(broadSeries)}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => data?.products?.forEach(processProduct))
          );
        }

        if (baseType && currentProduct.source) {
          const brandTypeQuery = `${baseType} ${currentProduct.source}`;
          requests.push(
            fetch(`${BASE_URL}/api/products/search?name=${encodeURIComponent(brandTypeQuery)}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => data?.products?.forEach(processProduct))
          );
        }

        await Promise.allSettled(requests);

        const sortedResults = Array.from(resultsMap.values())
          .filter(p => p.weight > 0)
          .sort((a, b) => b.weight - a.weight);

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
    <div className="mt-12 mb-10">
      <h2 className="text-2xl md:text-3xl font-medium mb-6 text-neutral-900">
        Похожие товары
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-full aspect-square bg-white border border-gray-100 animate-pulse rounded-lg"></div>
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
                 className="group block bg-white rounded-lg p-4 border border-transparent hover:border-neutral-200 hover:shadow-sm transition-all"
               >
                 <div className="relative aspect-square bg-white overflow-hidden mb-4 flex items-center justify-center">
                    {imgUrl ? (
                      <img 
                        src={imgUrl} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="text-[10px] text-gray-300 uppercase tracking-widest">Нет фото</div>
                    )}
                 </div>
                 
                 <div className="space-y-1">
                    <p className="text-sm text-neutral-700 line-clamp-2 leading-tight group-hover:text-black transition-colors h-20">
                      {product.name}
                    </p>
                    <div className="flex flex-col gap-1 mt-3">
                      <p className="text-lg font-bold text-neutral-900">
                        {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)}
                      </p>
                      <p className="text-xs text-neutral-400 font-mono">
                        Арт. {product.article}
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

// --- СТРОКА ХАРАКТЕРИСТИК (С ТОЧКАМИ) ---
const SpecRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex items-end w-full mb-2.5 text-[13px] md:text-sm">
    <div className="text-gray-500 bg-white pr-2 whitespace-nowrap">{label}</div>
    <div className="flex-grow border-b-2 border-dotted border-gray-200 relative -top-1.5 mx-1"></div>
    <div className="text-right bg-white pl-2 text-gray-900 font-medium whitespace-nowrap">{value}</div>
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct }) => {
  const router = useRouter();

  const product = useMemo(() => {
    if (initialProduct && initialProduct.source && initialProduct.source.toLowerCase() === 'чтк') {
      const originalPrice = typeof initialProduct.price === 'string' 
        ? parseFloat(initialProduct.price) 
        : Number(initialProduct.price) || 0;
      return { ...initialProduct, price: originalPrice * 0.85 };
    }
    return initialProduct;
  }, [initialProduct]);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id:number,message:string,type:'success'|'error'|'info'}>>([]);

  const [mainImage, setMainImage] = useState<string>('');
  const [mainImageError, setMainImageError] = useState(false);
  const [failedThumbnailIndices, setFailedThumbnailIndices] = useState<number[]>([]);

  const categoryInfo = product ? getCategoryData(product.name) : { slug: 'lights', title: 'Светильники' };

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (product) {
      const allImages = typeof product.imageAddresses === 'string' ? [product.imageAddresses]
          : Array.isArray(product.imageAddresses) ? product.imageAddresses
          : typeof product.imageAddress === 'string' ? [product.imageAddress]
          : Array.isArray(product.imageAddress) ? product.imageAddress : [];
          
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

    // Оповещаем Header мгновенно обновить корзину
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { count: totalCount } 
      }));
    }
  };

  // --- ФУНКЦИИ КОПИРОВАНИЯ И ШЕРИНГА ---
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
        .then(() => showNotification('Ссылка скопирована', 'success'))
        .catch(() => showNotification('Ошибка при копировании', 'error'));
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: product?.name || 'Товар',
            url: window.location.href
          });
        } catch (error) {
          console.error('Ошибка шаринга', error);
        }
      } else {
        handleCopyLink();
      }
    }
  };
  
  const imagesFromProduct = product
    ? Array.isArray(product.imageAddresses) ? product.imageAddresses
      : typeof product.imageAddresses === 'string' ? [product.imageAddresses]
      : Array.isArray(product.imageAddress) ? product.imageAddress
      : typeof product.imageAddress === 'string' ? [product.imageAddress] : [] : [];

  const toggleLiked = () => {
    if (!product) return;
    const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const existingProductIndex = liked.products.findIndex((item: any) => item.article === product.article && item.source === product.source);

    let newCount = liked.products.length;

    if (existingProductIndex > -1) {
      liked.products.splice(existingProductIndex, 1);
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

    // Оповещаем Header мгновенно обновить избранное
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('likedUpdated', { 
        detail: { count: newCount } 
      }));
    }
  };
  
  if (router.isFallback) return <div className="flex justify-center items-center h-screen bg-white"><ClipLoader color="#000000" size={50} /></div>;
  if (!product) return <div className="flex justify-center items-center h-screen bg-white text-black"><p className="text-xl font-light">Товар не найден</p></div>;

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <div key={router.asPath} className="min-h-screen bg-[#ffffff] text-neutral-900 font-sans selection:bg-neutral-200 selection:text-black">
        <Header />
        
        <main className="container mx-auto px-4 md:px-8 pt-32 pb-20 max-w-[1400px]">
          
          <div className="mb-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 mb-4">
              <Link href="/" className="hover:text-black transition-colors">Главная</Link>
              <span className="text-neutral-300">/</span>
              
              <Link 
                href={`/catalog/${categoryInfo.slug}`} 
                className="hover:text-black transition-colors capitalize"
              >
                {categoryInfo.title}
              </Link>
              
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-400 truncate max-w-[200px] md:max-w-none">{product.article}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 leading-tight">
              {product.article} {product.name}
            </h1>
          </div>
         
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide order-2 md:order-1">
                {imagesFromProduct.slice(0, 5).map((img, idx) => {
                  const thumbUrl = getImageUrl(img);
                  const isFailed = failedThumbnailIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => { setMainImage(img); setMainImageError(false); }}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0 border transition-all duration-300 ${
                        mainImage === img 
                          ? 'border-black ring-1 ring-black' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {isFailed ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">ERR</div>
                      ) : (
                        <img
                          src={thumbUrl}
                          alt={`Вид ${idx + 1}`}
                          className="w-full h-full object-contain p-1 rounded-lg"
                          onError={() => setFailedThumbnailIndices((prev) => [...prev, idx])}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex-1 flex items-center justify-center p-4 min-h-[400px] md:min-h-[500px] relative order-1 md:order-2">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainImage}
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[500px] max-w-full object-contain z-10 mix-blend-multiply"
                    onError={() => setMainImageError(true)}
                    style={{ display: mainImageError ? 'none' : 'block' }}
                  />
                </AnimatePresence>
                {mainImageError && <div className="text-gray-400 text-sm">Изображение недоступно</div>}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2"></div>
                  <div className="flex gap-3 text-gray-400">
                    <button onClick={() => showNotification('Скоро будет доступно', 'info')} className="hover:text-black transition-colors" title="Сравнить"><GitCompare size={20} /></button>
                    <button onClick={toggleLiked} className={`hover:text-black transition-colors ${isLiked ? 'text-black' : ''}`} title="В избранное">
                      <Heart size={20} className={isLiked ? "fill-black" : ""} />
                    </button>
                    <button onClick={handleCopyLink} className="hover:text-black transition-colors" title="Скопировать ссылку"><Copy size={20} /></button>
                    <button onClick={handleShare} className="hover:text-black transition-colors" title="Поделиться"><Share2 size={20} /></button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-black mb-2">
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(Number(product.price))}
                  </div>
                  
                  {Number(product.stock) > 0 ? (
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>Товар в наличии</span>
                      <div className="h-1.5 w-24  rounded-full overflow-hidden">
                         <div className="h-full  w-3/4"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm ">Нет в наличии</div>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full bg-black text-white font-medium h-14 rounded-lg flex items-center justify-center gap-2 text-lg hover:bg-neutral-800 transition-colors mb-8"
                >
                  Добавить в корзину
                </button>

                <div className="mb-6">
                  <SpecRow label="Артикул" value={product.article} />
                  <SpecRow label="Изготовитель" value={product.source} />
                  <SpecRow label="Категория" value={categoryInfo.title} />
                  {product.material && <SpecRow label="Материал" value={product.material} />}
                  {product.color && <SpecRow label="Цвет" value={product.color} />}
                  {product.stock && <SpecRow label="Остаток" value={`${product.stock} шт.`} />}
                  
                  <div className="mt-4 text-right">
                     <button onClick={() => showNotification('Скоро будет доступно', 'info')} className="text-sm font-medium text-black hover:underline flex items-center justify-end gap-1 w-full">
                        Все характеристики <ChevronDown size={16}/>
                     </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => showNotification('Скоро будет доступно', 'info')}
                    className="flex items-center gap-2 text-sm hover:underline w-fit"
                  >
                    <FileText size={18} /> Сертификат
                  </button>
                  <button 
                    onClick={() => showNotification('Скоро будет доступно', 'info')}
                    className="flex items-center gap-2 text-sm hover:underline w-fit"
                  >
                    <Box size={18} /> Скачать 3D-модель
                  </button>
                </div>

              </div>

            </div>
          </div>

          <div className="bg-[#FAFAFA] rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-purple-100 opacity-50 pointer-events-none">
               ВАМЛЮСТРА
            </div>

            <p className="text-sm text-gray-700 leading-relaxed max-w-4xl relative z-10">
              {generateSmartDescription(
                product.name, 
                product.article, 
                product.color, 
                product.material, 
                getCollectionPrefix(product.article)
              )}
            </p>
          </div>

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
                className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg px-5 py-4 min-w-[300px] pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    notification.type === 'success' ? 'bg-black' : notification.type === 'error' ? 'bg-red-500' : 'bg-gray-500'
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