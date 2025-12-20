
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header'; // Убедитесь, что ваш Header поддерживает светлую тему или оберните его
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

const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct }) => {
  const router = useRouter();

  // Логика скидки
  const productWithDiscount = useMemo(() => {
    if (initialProduct && initialProduct.source && initialProduct.source.toLowerCase() === 'чтк') {
      const originalPrice = typeof initialProduct.price === 'string' 
        ? parseFloat(initialProduct.price) 
        : Number(initialProduct.price) || 0;
      
      const discountedPrice = originalPrice * 0.85;
      return { ...initialProduct, price: discountedPrice };
    }
    return initialProduct;
  }, [initialProduct]);
  
  const [product, setProduct] = useState<ProductI | null>(productWithDiscount || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [notifications, setNotifications] = useState<Array<{id:number,message:string,type:'success'|'error'|'info'}>>([]);

  // Состояния изображений
  const [mainImage, setMainImage] = useState<string>('');
  const [mainImageError, setMainImageError] = useState(false);
  const [failedThumbnailIndices, setFailedThumbnailIndices] = useState<number[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Установка начального изображения
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
      }
    }
  }, [product]);

  // Проверка "Избранного"
  useEffect(() => {
    if (product && isMounted) {
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
      const isProductLiked = liked.products.some(
        (item: any) => item.article === product.article && item.source === product.source
      );
      setIsLiked(isProductLiked);
    }
  }, [product, isMounted]);

  // Управление уведомлениями
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

  // Логика добавления в корзину
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
  
  // Получение массива изображений
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

  // Toggle Like
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

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <ClipLoader color="#000000" size={50} />
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-black">
        <p className="text-xl font-light">Товар не найден</p>
      </div>
    );
  }

  const mainImageForStructured: string | undefined = imagesFromProduct[0];

  // Schema.org
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": mainImageForStructured,
    "description": `${product.name} - ${product.material}, ${product.color}`,
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
      
      {/* --- Main Layout --- */}
      <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200 selection:text-black">
        <Header />
        
        <main className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 mb-10">
            <Link href="/" className="hover:text-black transition-colors">Главная</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/catalog/chandeliers" className="hover:text-black transition-colors">Каталог</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-medium truncate max-w-[200px] md:max-w-none">{product.name}</span>
          </nav>
         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
            
            {/* Left Column: Images */}
            <div className="flex flex-col-reverse md:flex-row gap-6">
              {/* Thumbnails */}
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
              
              {/* Main Image */}
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

            {/* Right Column: Details */}
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
                {/* Quantity */}
                <div className="flex items-center border border-neutral-200 rounded-lg h-14 w-full sm:w-auto hover:border-neutral-400 transition-colors">
                  <button
                    onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                    className="w-14 h-full flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                    aria-label="Decrease"
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
                    aria-label="Increase"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                {/* Actions */}
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
                  aria-label="В избранное"
                >
                   <Heart className={`transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} size={22}/>
                </button>
              </div>
              
              {/* Description Placeholder */}
              <div className="bg-neutral-50 p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">О товаре</h3>
                  <p className='text-neutral-500 leading-relaxed text-sm'>
                    {/* Материал: {product.material || 'Не указан'}.<br/>
                    Цвет: {product.color || 'Не указан'}.<br/> */}
                    Полные технические характеристики и описание скоро появятся.
                  </p>
              </div>
            </div>
          </div>
        </main>

        {/* Minimalist Toasts (Notifications) */}
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

// --- Static Props/Paths остаются без изменений ---
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