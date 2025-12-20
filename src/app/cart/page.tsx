
'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ClipLoader } from 'react-spinners';
import LoadingSpinner from '../../components/LoadingSpinner';
import Link from 'next/link';
import { ChevronRight, Trash2, Plus, Minus, X, Download, Check, AlertCircle, Info } from 'lucide-react';
import { ProductI } from '../../types/interfaces';
import * as XLSX from 'xlsx';
import Head from 'next/head';

// --- Типы и интерфейсы остаются без изменений ---
interface CartProductI extends ProductI {
  imageUrl?: string;
}

interface OrderData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  comment: string;
  paymentMethod: 'cash' | 'card';
  deliveryMethod: 'pickup' | 'delivery';
}

const Cart: React.FC = () => {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<CartProductI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([]);

  // --- Логика уведомлений (Restyled) ---
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2500);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleExternalNotification = (event: any) => {
      const { message, type } = event.detail;
      showNotification(message, type);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('showNotification', handleExternalNotification);
      return () => {
        window.removeEventListener('showNotification', handleExternalNotification);
      };
    }
  }, []);
  
  const [orderData, setOrderData] = useState<OrderData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    comment: '',
    paymentMethod: 'cash',
    deliveryMethod: 'pickup'
  });

  // --- Логика загрузки корзины ---
  useEffect(() => {
    if (!isClient) return;

    const fetchCartProducts = async () => {
      setIsLoading(false);
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
        const storedCartCount = localStorage.getItem('cartCount');
        if (storedCartCount) setCartCount(Number(storedCartCount));

        if (Array.isArray(cart)) {
          if (cart.length > 0) {
            setCartProducts(cart.map((product: any) => ({
              ...product,
              _id: product.id || product._id || product.productId,
              quantity: product.quantity || 1
            })));
          } else {
            setError('Ваша корзина пуста');
          }
        } else if (cart.products && cart.products.length > 0) {
          const productsWithFullInfo = cart.products.some((p: any) => p.name);
          
          if (productsWithFullInfo) {
            setCartProducts(cart.products.map((product: any) => ({
              ...product,
              _id: product.id || product._id || product.productId,
              quantity: product.quantity || 1
            })));
          } else {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/list`,
                { products: cart.products },
                { headers: { 'Content-Type': 'application/json' } }
              );
              
              const productsWithImages = response.data.products.map((product: CartProductI) => {
                const imageUrl = (() => {
                  if (typeof product.imageAddresses === 'string') return product.imageAddresses;
                  if (Array.isArray(product.imageAddresses) && product.imageAddresses.length > 0) return product.imageAddresses[0];
                  if (typeof product.imageAddress === 'string') return product.imageAddress;
                  if (Array.isArray(product.imageAddress) && product.imageAddress.length > 0) return product.imageAddress[0];
                  return '/placeholder.jpg';
                })();

                return {
                  ...product,
                  imageUrl,
                  quantity: cart.products.find((p: any) => p.productId === product._id)?.quantity || 1
                };
              });
              
              setCartProducts(productsWithImages);
            } catch (apiError) {
              console.error('Error fetching products:', apiError);
              setCartProducts(cart.products.map((product: any) => ({
                ...product,
                _id: product.productId || product._id,
                name: product.name || `Товар ${product.article || product.productId}`,
                imageUrl: '/placeholder.jpg',
                quantity: product.quantity || 1
              })));
            }
          }
        } else {
          setError('Ваша корзина пуста');
        }
      } catch (err) {
        setError('Ошибка при загрузке товаров');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => setIsLoading(false), 3000);
    fetchCartProducts();
    return () => clearTimeout(timeoutId);
  }, [isClient]);

  // --- Логика управления корзиной (удаление, обновление) ---
  const handleRemoveProduct = (productId: string) => {
    const updatedCart = cartProducts.filter(product => product._id !== productId);
    setCartProducts(updatedCart);
    
    if (!isClient) return;
    
    let cartData;
    const currentCart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    
    if (Array.isArray(currentCart)) {
      cartData = updatedCart;
    } else {
      cartData = {
        products: updatedCart.map(product => ({
          productId: product._id,
          article: product.article,
          source: product.source,
          quantity: product.quantity || 1
        }))
      };
    }
    
    localStorage.setItem('cart', JSON.stringify(cartData));
    const newCount = updatedCart.reduce((acc, product) => acc + (product.quantity || 1), 0);
    setCartCount(newCount);
    localStorage.setItem('cartCount', newCount.toString());
    
    showNotification('Товар удален', 'info');
    if (updatedCart.length === 0) setError('Ваша корзина пуста');
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedProducts = cartProducts.map(product => {
      if (product._id === productId) return { ...product, quantity: newQuantity };
      return product;
    });
    setCartProducts(updatedProducts);
    
    if (!isClient) return;
    
    let cartData;
    const currentCart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    
    if (Array.isArray(currentCart)) {
      cartData = updatedProducts;
    } else {
      cartData = {
        products: updatedProducts.map(product => ({
          productId: product._id,
          article: product.article,
          source: product.source,
          quantity: product.quantity || 1
        }))
      };
    }
    
    localStorage.setItem('cart', JSON.stringify(cartData));
    const newCount = updatedProducts.reduce((acc, product) => acc + (product.quantity || 1), 0);
    setCartCount(newCount);
    localStorage.setItem('cartCount', newCount.toString());
  };

  const handleIncreaseQuantity = (productId: string) => {
    const product = cartProducts.find(p => p._id === productId);
    if (product) handleUpdateQuantity(productId, (product.quantity || 1) + 1);
  };

  const handleDecreaseQuantity = (productId: string) => {
    const product = cartProducts.find(p => p._id === productId);
    if (product && (product.quantity || 1) > 1) handleUpdateQuantity(productId, (product.quantity || 1) - 1);
  };

  const handleClearCart = () => {
    setCartProducts([]);
    setCartCount(0);
    if (!isClient) return;
    localStorage.setItem('cart', JSON.stringify({ products: [] }));
    localStorage.setItem('cartCount', '0');
    setError('Ваша корзина пуста');
    showNotification('Корзина очищена', 'info');
  };

  const handleExportToExcel = () => {
    if (cartProducts.length === 0) {
      showNotification('Корзина пуста', 'error');
      return;
    }
    try {
      const excelData = cartProducts.map((product, index) => {
        const stockStatus = product.stock && Number(product.stock) > 0 ? 'В наличии' : 'Под заказ';
        return {
          '№': index + 1,
          'Название': product.name || 'Без названия',
          'Артикул': product.article || 'Не указан',
          'Источник': product.source || 'Не указан',
          'Наличие': stockStatus,
          'Количество': product.quantity || 1,
          'Цена за единицу (₽)': product.price ? `${product.price} ₽` : 'По запросу',
          'Общая стоимость (₽)': product.price ? `${product.price * (product.quantity || 1)} ₽` : 'По запросу',
        } as any;
      });

      excelData.push({
        '№': '', 'Название': '', 'Артикул': '', 'Источник': '', 'Наличие': '', 'Количество': '',
        'Цена за единицу (₽)': 'ИТОГО:',
        'Общая стоимость (₽)': `${subtotal.toLocaleString('ru-RU')} ₽`,
        'Скидка (₽)': hasDiscount ? `${discountAmount.toLocaleString('ru-RU')} ₽` : '0 ₽',
        'Итого к оплате (₽)': `${totalAmount.toLocaleString('ru-RU')} ₽`,
      } as any);

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const colWidths = [{ wch: 5 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 20 }];
      worksheet['!cols'] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Корзина');
      XLSX.writeFile(workbook, `Корзина_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`);
      showNotification('Файл сохранен', 'success');
    } catch (error) {
      showNotification('Ошибка при экспорте', 'error');
    }
  };

  // --- Логика заказа ---
  const handleOrderDataChange = (field: keyof OrderData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const validateOrderForm = (): boolean => {
    if (!orderData.firstName.trim()) { showNotification('Введите имя', 'error'); return false; }
    if (!orderData.lastName.trim()) { showNotification('Введите фамилию', 'error'); return false; }
    if (!orderData.phone.trim()) { showNotification('Введите телефон', 'error'); return false; }
    if (!orderData.email.trim()) { showNotification('Введите email', 'error'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) { showNotification('Некорректный email', 'error'); return false; }
    return true;
  };

  const getApiUrl = () => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) return apiUrl;
    if (typeof window !== 'undefined') {
      return window.location.origin + '/api';
    }
    throw new Error('API URL undefined');
  };

  // --- Роль и скидки ---
  const [userProfile, setUserProfile] = useState<any>(null);
  useEffect(() => {
    if (!isClient) return;
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); } catch (e) {}
    }
  }, [isClient]);

  const getCurrentDesignerStatus = () => {
    if (!isClient) return false;
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try { return JSON.parse(savedProfile)?.role === 'Дизайнер'; } catch (e) {}
    }
    return userProfile?.role === 'Дизайнер';
  };

  const isDesigner = getCurrentDesignerStatus();
  const subtotal = cartProducts.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0);
  const discountThreshold = 50000;
  const regularDiscountPercent = 15;
  const designerDiscountPercent = 25;
  const discountPercent = isDesigner ? designerDiscountPercent : regularDiscountPercent;
  const hasDiscount = isDesigner ? true : subtotal >= discountThreshold;
  const discountAmount = hasDiscount ? (subtotal * discountPercent) / 100 : 0;
  const totalAmount = subtotal - discountAmount;

  const confirmOrder = async (paymentType: 'online' | 'offline') => {
    if (isSubmitting) return;
    if (!validateOrderForm()) return;
    if (cartProducts.length === 0) { showNotification('Корзина пуста', 'error'); return; }

    setIsSubmitting(true);
    const products = cartProducts.map((p) => ({
      name: p.name, article: p.article, source: p.source, quantity: p.quantity || 1, price: p.price || 0,
    }));

    const authToken = isClient ? localStorage.getItem('token') : null;
    const isAuthenticated = !!authToken;
    
    const commonPayload = {
      products,
      paymentType,
      subtotal,
      discountAmount,
      totalAmount,
      discountPercent,
      isDesigner,
      deliveryMethod: orderData.deliveryMethod
    };

    let orderPayload = isAuthenticated ? {
      ...commonPayload,
      customerData: orderData,
    } : {
      ...commonPayload,
      guestInfo: {
        name: orderData.firstName,
        surname: orderData.lastName,
        phone: orderData.phone,
        email: orderData.email,
        comment: orderData.comment,
        address: '' 
      },
      paymentMethod: orderData.paymentMethod,
    };

    try {
      const baseUrl = getApiUrl();
      const apiPath = (baseUrl && baseUrl.endsWith('/api')) ? '' : '/api';
      
      const url = isAuthenticated
        ? (paymentType === 'online' ? `${baseUrl}${apiPath}/orders/add-order-with-payment` : `${baseUrl}${apiPath}/orders/add-order-without-payment`)
        : (paymentType === 'online' ? `${baseUrl}${apiPath}/guest-orders/add-order-with-payment` : `${baseUrl}${apiPath}/guest-orders/add-order-without-payment`);

      const headers: any = { 'Content-Type': 'application/json' };
      if (isAuthenticated) headers.Authorization = `Bearer ${authToken}`;

      const response = await axios.post(url, orderPayload, { headers, timeout: 30000 });
      
      if (paymentType === 'online') {
        const { paymentUrl, orderId } = response.data;
        if (paymentUrl) {
          if (orderId && isClient) localStorage.setItem('pendingOrderId', orderId);
          showNotification('Переход к оплате...', 'success');
          if (typeof window !== 'undefined') window.location.href = paymentUrl;
        } else {
          showNotification('Ошибка получения ссылки на оплату', 'error');
        }
      } else {
        showNotification('Заказ принят!', 'success');
        handleClearCart();
        setTimeout(() => router.push('/orders'), 1000); 
      }
    } catch (error: any) {
      console.error('Order error:', error);
      showNotification(error.response?.data?.message || 'Ошибка при оформлении заказа', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient || isLoading) {
    return (
      <section className="min-h-screen bg-white text-black">
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner isLoading={true} heading="" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white text-gray-900 font-sans">
      <Head>
        <title>Корзина | Elektromos</title>
        <meta name="description" content="Оформление заказа" />
      </Head>
      
      {/* Минималистичные уведомления */}
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
      
      {/* Шапка: Чистая, белая */}
      <div className="pt-40 pb-12 px-4 border-b border-gray-100">
        <div className="container max-w-[88rem] mx-auto">
          <h1 className="text-5xl font-light tracking-tight text-black mb-4">Корзина</h1>
          
          {isDesigner && (
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              <span className="text-gray-900 text-sm font-medium">Дизайнерский аккаунт (–25%)</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="container max-w-[88rem] mx-auto px-4 py-12">
        {/* Инструменты */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-gray-500 text-sm">
            {cartProducts.length} {cartProducts.length === 1 ? 'товар' : cartProducts.length >= 2 && cartProducts.length <= 4 ? 'товара' : 'товаров'}
          </span>

          {cartProducts.length > 0 && (
            <div className="flex gap-6 text-sm font-medium">
              <button onClick={handleExportToExcel} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <Download size={16} />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button onClick={handleClearCart} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
                <span className="hidden sm:inline">Очистить</span>
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <h2 className="text-2xl font-light mb-4">{error}</h2>
              <Link href="/catalog" className="inline-block border-b border-black pb-0.5 text-black hover:opacity-70 transition-opacity">
                Перейти в каталог
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Левая колонка: Список товаров */}
              <div className="lg:col-span-2 space-y-0">
                {cartProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group py-8 border-b border-gray-100 last:border-0 relative"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Изображение */}
                      <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href={`/products/${product.source}/${product.article}`} className="block w-full h-full">
                          <img
                            src={`${product.imageUrl || '/placeholder.jpg'}?q=75&w=200`}
                            alt={product.name as string}
                            className="w-full h-full object-contain mix-blend-multiply p-2"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Инфо */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <Link href={`/products/${product.source}/${product.article}`}>
                              <h3 className="text-lg font-medium text-black pr-8 hover:opacity-70 transition-opacity">
                                {product.name as string}
                              </h3>
                            </Link>
                            <button
                              onClick={() => handleRemoveProduct(product._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <span>Арт: {product.article}</span>
                            <span>
                              {product.stock && Number(product.stock) > 0 
                                ? <span className="text-green-700">● В наличии</span> 
                                : <span className="text-orange-600">● Под заказ</span>}
                            </span>
                          </div>
                        </div>

                        {/* Цена и Количество */}
                        <div className="flex flex-wrap items-end justify-between gap-4">
                          <div className="flex items-center border border-gray-200 rounded-lg h-10">
                            <button
                              onClick={() => handleDecreaseQuantity(product._id)}
                              disabled={(product.quantity || 1) <= 1}
                              className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              value={product.quantity || 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                if (val >= 1 && val <= 999) handleUpdateQuantity(product._id, val);
                              }}
                              className="w-12 text-center h-full text-sm bg-transparent border-none outline-none appearance-none font-medium"
                            />
                            <button
                              onClick={() => handleIncreaseQuantity(product._id)}
                              className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                             {product.quantity && product.quantity > 1 && (
                                <div className="text-xs text-gray-400 mb-1">{product.price?.toLocaleString('ru-RU')} ₽ / шт.</div>
                             )}
                             <div className="text-xl font-medium tracking-tight">
                                {product.price ? `${((product.price || 0) * (product.quantity || 1)).toLocaleString('ru-RU')} ₽` : 'По запросу'}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="pt-8">
                  <Link href="/catalog" className="inline-flex items-center text-sm font-medium hover:opacity-60 transition-opacity">
                    <ChevronRight size={16} className="mr-2 rotate-180" />
                    Вернуться в каталог
                  </Link>
                </div>
              </div>

              {/* Правая колонка: Форма и Итог */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-8 sticky top-24">
                  <h3 className="text-2xl font-light mb-8">Оформление</h3>
                  
                  {/* Методы оплаты и доставки */}
                  <div className="space-y-6 mb-8">
                    {/* Тип оплаты */}
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Оплата</span>
                      <div className="grid grid-cols-2 gap-3">
                        {['cash', 'card'].map((method) => (
                          <label key={method} className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${
                            orderData.paymentMethod === method 
                              ? 'bg-white border-black shadow-sm' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={orderData.paymentMethod === method}
                              onChange={(e) => handleOrderDataChange('paymentMethod', e.target.value)}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">
                              {method === 'cash' ? 'Наличные' : 'Карта'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Тип доставки */}
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Получение</span>
                      <div className="grid grid-cols-2 gap-3">
                        {['pickup', 'delivery'].map((method) => (
                          <label key={method} className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${
                            orderData.deliveryMethod === method 
                              ? 'bg-white border-black shadow-sm' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value={method}
                              checked={orderData.deliveryMethod === method}
                              onChange={(e) => handleOrderDataChange('deliveryMethod', e.target.value)}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">
                              {method === 'pickup' ? 'Самовывоз' : 'Доставка'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Данные клиента */}
                  <div className="space-y-4 mb-8">
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Контактные данные</span>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Имя"
                        value={orderData.firstName}
                        onChange={(e) => handleOrderDataChange('firstName', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Фамилия"
                        value={orderData.lastName}
                        onChange={(e) => handleOrderDataChange('lastName', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Телефон"
                      value={orderData.phone}
                      onChange={(e) => handleOrderDataChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={orderData.email}
                      onChange={(e) => handleOrderDataChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <textarea
                      placeholder="Комментарий (необязательно)"
                      rows={2}
                      value={orderData.comment}
                      onChange={(e) => handleOrderDataChange('comment', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>

                  {/* Расчет */}
                  <div className="border-t border-gray-200 pt-6 space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Сумма товаров</span>
                      <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    
                    {hasDiscount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Скидка {discountPercent}%</span>
                        <span className="text-black font-medium">–{discountAmount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}

                    {!hasDiscount && subtotal > 0 && !isDesigner && (
                      <div className="text-xs text-gray-400 mt-2">
                        Добавьте товаров еще на {(discountThreshold - subtotal).toLocaleString('ru-RU')} ₽ для скидки 15%
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                      <span className="text-lg font-medium">Итого</span>
                      <span className="text-2xl font-semibold">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => confirmOrder(orderData.paymentMethod === 'card' ? 'online' : 'offline')}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <ClipLoader color="#ffffff" size={16} /> : (orderData.paymentMethod === 'card' ? 'Оплатить картой' : 'Подтвердить заказ')}
                    </button>
                    
                    <p className="text-[10px] text-gray-400 text-center leading-tight">
                      Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Cart;