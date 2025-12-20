
'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ProductI } from '../../types/interfaces';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { Trash2, Download, Share2, X, ShoppingBag, Check, AlertCircle, Info, ChevronRight } from 'lucide-react';
import Head from 'next/head';

const Liked: React.FC = () => {
  const [likedProducts, setLikedProducts] = useState<ProductI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Начальное состояние true для предотвращения мелькания
  const router = useRouter();

  // --- Система уведомлений (Стиль Cart) ---
  const [notifications, setNotifications] = useState<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2500);
  };

  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true);
      const liked = JSON.parse(localStorage.getItem('liked') || '{"products": []}');

      if (liked.products && liked.products.length > 0) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/list`,
            { products: liked.products },
            { headers: { 'Content-Type': 'application/json' } }
          );

          setLikedProducts(
            response.data.products.map((product: any) => ({
              ...product,
              price: parseFloat(product.price) || 0,
            }))
          );
          setError(null);
        } catch (error) {
          setError('Ошибка при загрузке товаров.');
          console.error(error);
        }
      } else {
        setError('Ваш список избранного пуст');
      }
      setLoading(false);
    };

    fetchLikedProducts();
  }, []);

  const handleRemoveProduct = (id: string) => {
    const updatedList = likedProducts.filter((product) => product._id !== id);
    setLikedProducts(updatedList);
    
    const likedData = JSON.parse(localStorage.getItem('liked') || '{"products": []}');
    const products = Array.isArray(likedData.products) ? likedData.products : [];
    
    const updatedLiked = {
        products: products.filter((p: any) => (p.productId || p) !== id)
    };

    localStorage.setItem('liked', JSON.stringify(updatedLiked));
    showNotification('Товар удален', 'info');
    
    if (updatedList.length === 0) {
      setError('Ваш список избранного пуст');
    }
  };

  const handleClearLiked = () => {
    setLikedProducts([]);
    localStorage.setItem('liked', JSON.stringify({ products: [] }));
    setError('Ваш список избранного пуст');
    showNotification('Список очищен', 'info');
  };

  const handleProductClick = (article: string, source: string) => {
    const encodedArticle = article.replace(/\//g, '%2F');
    router.push(`/products/${source}/${encodedArticle}`);
  };

  const handleExportToExcel = () => {
    if (likedProducts.length === 0) {
      showNotification('Список пуст', 'error');
      return;
    }

    try {
      const excelData = likedProducts.map((product, index) => ({
        '№': index + 1,
        'Название': product.name || 'Без названия',
        'Артикул': product.article || 'Не указан',
        'Источник': product.source || 'Не указан',
        'Цена (₽)': product.price ? `${product.price}` : 'По запросу',
      } as any));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Настройка ширины колонок
      const colWidths = [{ wch: 5 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Избранное');

      const currentDate = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
      const fileName = `Избранное_${currentDate}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showNotification('Файл сохранен', 'success');
    } catch (e) {
      console.error('Ошибка экспорта:', e);
      showNotification('Ошибка экспорта', 'error');
    }
  };

  return (
    <section className="min-h-screen bg-white text-gray-900 font-sans">
      <Head>
        <title>Избранное | Elektromos</title>
        <meta name="description" content="Ваши сохраненные товары" />
      </Head>

      {/* Уведомления */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 shadow-xl rounded-lg px-6 py-4 min-w-[300px]"
            >
              <div className="flex items-center gap-3">
                {notification.type === 'success' && <Check className="text-green-600 w-5 h-5" />}
                {notification.type === 'error' && <AlertCircle className="text-red-600 w-5 h-5" />}
                {notification.type === 'info' && <Info className="text-gray-600 w-5 h-5" />}
                <span className="text-sm font-medium text-gray-800">{notification.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Шапка */}
      <div className="pt-40 pb-12 px-4 border-b border-gray-100">
        <div className="container max-w-[88rem] mx-auto">
          <h1 className="text-5xl font-light tracking-tight text-black mb-2">Избранное</h1>
          <p className="text-gray-500 font-light">
            Сохраненные товары и списки покупок
          </p>
        </div>
      </div>

      <div className="container max-w-[88rem] mx-auto px-4 py-12">
        {/* Инструменты */}
        {!loading && !error && likedProducts.length > 0 && (
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-500 text-sm">
              {likedProducts.length} {likedProducts.length === 1 ? 'товар' : likedProducts.length >= 2 && likedProducts.length <= 4 ? 'товара' : 'товаров'}
            </span>
            <div className="flex gap-6 text-sm font-medium">
              <button 
                onClick={handleExportToExcel} 
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button 
                onClick={handleClearLiked} 
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Очистить всё</span>
              </button>
            </div>
          </div>
        )}

        {/* Контент */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color="#000000" size={30} />
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-20 text-center"
            >
              <h2 className="text-2xl font-light mb-4">{error}</h2>
              <Link href="/catalog" className="inline-block border-b border-black pb-0.5 text-black hover:opacity-70 transition-opacity">
                Перейти в каталог
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {likedProducts.map((product) => {
                // Обработка изображений
                const images = (() => {
                  if (typeof product.imageAddresses === 'string') return [product.imageAddresses];
                  if (Array.isArray(product.imageAddresses)) return product.imageAddresses;
                  if (typeof product.imageAddress === 'string') return [product.imageAddress];
                  if (Array.isArray(product.imageAddress)) return product.imageAddress;
                  return [];
                })();
                const imageUrl = images.length > 0 ? images[0] : '/placeholder.jpg';

                return (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group flex flex-col"
                  >
                    {/* Карточка товара */}
                    <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300">
                      <button
                        onClick={() => handleRemoveProduct(product._id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить из избранного"
                      >
                        <X size={16} />
                      </button>
                      
                      <div
                        onClick={() => handleProductClick(product.article, product.source)}
                        className="w-full h-full p-6 cursor-pointer"
                      >
                        <img
                          src={`${imageUrl}?q=75&w=600`}
                          alt={product.name as string}
                          className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="flex flex-col flex-grow">
                      <div 
                        onClick={() => handleProductClick(product.article, product.source)}
                        className="cursor-pointer"
                      >
                        <h3 className="text-base font-medium text-black line-clamp-2 mb-1 group-hover:opacity-70 transition-opacity">
                          {product.name as string}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                          Артикул: {product.article}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-semibold tracking-tight">
                          {typeof product.price === 'number' && !isNaN(product.price) && product.price > 0
                            ? `${product.price.toLocaleString('ru-RU')} ₽`
                            : 'По запросу'}
                        </span>
                        
                        <button
                           onClick={() => handleProductClick(product.article, product.source)}
                           className="text-sm font-medium text-black border-b border-black/20 hover:border-black transition-colors pb-0.5"
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Liked;