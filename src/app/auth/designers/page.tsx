"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SEO from "@/components/SEO";
import { FiUser, FiHeart, FiShoppingBag, FiLogOut, FiEdit3, FiSave, FiX } from "react-icons/fi";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company?: string;
  role: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  products: any[];
  paymentMethod?: string;
  deliveryAddress?: string;
  orderNumber?: string;
}

export default function DesignerDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "Дизайнер"
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Загрузка заказов пользователя
  const loadUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const ordersData = data.orders || data || [];
        
        // Обрабатываем данные заказов для корректного отображения
        const processedOrders = ordersData.map((order: any) => ({
          id: order.id || order._id || Math.random().toString(36).substr(2, 9),
          orderNumber: order.orderNumber || order.order_number || order.id || order._id,
          date: order.date || order.createdAt || order.created_at || new Date().toISOString(),
          status: order.status || 'Новый',
          total: order.total || order.totalAmount || order.total_amount || 0,
          paymentMethod: order.paymentMethod || order.payment_method || 'Не указан',
          deliveryAddress: order.deliveryAddress || order.delivery_address || order.address,
          products: order.products || order.items || []
        }));
        
        setOrders(processedOrders);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      // Если API недоступен, показываем тестовые данные
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          date: new Date().toISOString(),
          status: 'В обработке',
          total: 15000,
          paymentMethod: 'Оплата при получении',
          deliveryAddress: 'г. Москва, ул. Примерная, д. 1, кв. 1',
          products: [
            { name: 'Люстра классическая', quantity: 1, price: 8000 },
            { name: 'Розетка двойная', quantity: 2, price: 3500 }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'Оплачен',
          total: 25000,
          paymentMethod: 'Банковская карта',
          deliveryAddress: 'г. Санкт-Петербург, пр. Невский, д. 10',
          products: [
            { name: 'Светильник настенный', quantity: 3, price: 2500 },
            { name: 'Выключатель одноклавишный', quantity: 5, price: 3500 }
          ]
        }
      ]);
    }
  };

  // Загрузка избранных товаров
  const loadFavoriteProducts = () => {
    try {
      const favorites = localStorage.getItem('favorites');
      if (favorites) {
        setFavoriteProducts(JSON.parse(favorites));
      }
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    }
  };

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    if (!isClient) return;
    
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    setIsAuthenticated(true);
    // Загружаем данные пользователя из localStorage или API
    const savedProfile = localStorage.getItem('userProfile');
    console.log('🔍 Загруженный профиль из localStorage:', savedProfile);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        console.log('🔍 Парсированный профиль дизайнера:', profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Ошибка парсинга профиля дизайнера:', error);
        if (username) {
          setUserProfile(prev => ({ ...prev, name: username }));
        }
      }
    } else if (username) {
      console.log('🔍 Профиль не найден, используем username:', username);
      setUserProfile(prev => ({ ...prev, name: username }));
    }
    
    // Загружаем заказы и избранное асинхронно
    const timeoutId = setTimeout(() => {
      try {
        loadUserOrders();
        loadFavoriteProducts();
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        // Завершаем загрузку
        setLoading(false);
      }
    }, 100);

    // Дополнительный таймаут для завершения загрузки
    const fallbackTimeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimeoutId);
    };
  }, [router, isClient]);

  // Функция для сохранения профиля
  const handleSaveProfile = () => {
    if (!isClient) return;
    console.log('💾 Сохранение профиля дизайнера:', userProfile);
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    console.log('✅ Профиль сохранен в localStorage');
    setIsEditing(false);
  };

  // Функция выхода из системы
  const handleLogout = () => {
    if (!isClient) return;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userProfile');
    router.push('/auth/login');
  };

  // Обработчик переключения вкладок
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Обновляем данные при переключении на соответствующую вкладку
    if (tab === "orders") {
      loadUserOrders();
    } else if (tab === "favorites") {
      loadFavoriteProducts();
    }
  };

  // Если загружается, не аутентифицирован или не на клиенте
  if (loading || !isAuthenticated || !isClient) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="text-white text-xl">
          {!isClient ? 'Инициализация...' : !isAuthenticated ? 'Проверка авторизации...' : 'Загрузка данных...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-32 bg-[#101010]">
      <SEO
        title="Дизайнерам Elektromos - Специальные условия и скидки | Личный кабинет дизайнера"
        description="Дизайнерам Elektromos - специальные условия, персональные скидки, личный кабинет дизайнера. Регистрация дизайнеров, оптовые цены на светильники, люстры, розетки, выключатели."
        keywords="дизайнеры elektromos, регистрация дизайнеров, личный кабинет дизайнера, скидки дизайнерам, оптовые цены, светильники для дизайнеров, люстры для дизайнеров, электроустановочные изделия для дизайнеров"
        url="/auth/designers"
        type="website"
        image="/images/logo.webp"
        openGraph={{
          title: "Дизайнерам Elektromos - Специальные условия и скидки",
          description: "Дизайнерам Elektromos - специальные условия, персональные скидки, личный кабинет дизайнера.",
          url: "https://elektromos.ru/auth/designers",
          type: "website",
          image: "/images/logo.webp",
          site_name: "Elektromos"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Дизайнерам Elektromos",
          "description": "Специальные условия и скидки для дизайнеров",
          "url": "https://elektromos.ru/auth/designers",
          "mainEntity": {
            "@type": "Service",
            "name": "Услуги для дизайнеров",
            "description": "Специальные условия и персональные скидки для дизайнеров интерьера"
          }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-40">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Добро пожаловать, {userProfile.name || 'Дизайнер'}!
          </h1>
          <p className="text-gray-400">Ваш личный кабинет дизайнера</p>
        </div>

        {/* Навигация */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#1a1a1a] p-2 rounded-lg">
                     <button
             onClick={() => handleTabChange("profile")}
             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
               activeTab === "profile" 
                 ? "bg-red-800 text-white" 
                 : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
             }`}
           >
             <FiUser size={18} />
             Профиль
           </button>
           
           <button
             onClick={() => handleTabChange("orders")}
             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
               activeTab === "orders" 
                 ? "bg-red-800 text-white" 
                 : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
             }`}
           >
             <FiShoppingBag size={18} />
             Мои заказы
             {orders.length > 0 && (
               <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                 {orders.length}
               </span>
             )}
           </button>

    

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] transition-colors ml-auto"
          >
            <FiLogOut size={18} />
            Выйти
          </button>
        </div>

        {/* Контент вкладок */}
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          {/* Профиль */}
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Мой профиль</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <FiEdit3 size={16} />
                    Редактировать
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
                    >
                      <FiSave size={16} />
                      Сохранить
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                    >
                      <FiX size={16} />
                      Отмена
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({...prev, name: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile(prev => ({...prev, phone: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Компания
                  </label>
                  <input
                    type="text"
                    value={userProfile.company}
                    onChange={(e) => setUserProfile(prev => ({...prev, company: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    placeholder="Название компании"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#2a2a2a] rounded-md">
                <h3 className="text-lg font-semibold text-white mb-2">Статус дизайнера</h3>
                <p className="text-gray-300">
                  Ваш статус: <span className="text-red-400 font-medium">{userProfile.role}</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Вы получаете специальные условия и персональные скидки.
                </p>
              </div>
            </div>
          )}

          {/* Заказы */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Мои заказы</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingBag size={48} className="text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    У вас пока нет заказов
                  </h3>
                  <p className="text-gray-500">
                    Ваши заказы будут отображаться здесь после оформления
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#2a2a2a] p-4 rounded-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-medium">
                            Заказ #{order.orderNumber || order.id}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.date).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">
                            {order.total ? `${order.total.toLocaleString('ru-RU')} ₽` : 'Цена не указана'}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Оплачен' ? 'bg-green-600' :
                            order.status === 'В обработке' ? 'bg-yellow-600' :
                            order.status === 'Отменен' ? 'bg-red-600' :
                            'bg-gray-600'
                          } text-white`}>
                            {order.status || 'Новый'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Способ оплаты */}
                      {order.paymentMethod && (
                        <div className="mb-2">
                          <span className="text-gray-400 text-sm">Способ оплаты: </span>
                          <span className="text-white text-sm">{order.paymentMethod}</span>
                        </div>
                      )}
                      
                      {/* Адрес доставки */}
                      {order.deliveryAddress && (
                        <div className="mb-3">
                          <span className="text-gray-400 text-sm">Адрес доставки: </span>
                          <span className="text-white text-sm">{order.deliveryAddress}</span>
                        </div>
                      )}
                      
                      {/* Товары в заказе */}
                      {order.products && order.products.length > 0 && (
                        <div className="border-t border-gray-600 pt-3">
                          <h4 className="text-white font-medium mb-2">Товары в заказе:</h4>
                          <div className="space-y-2">
                            {order.products.map((product: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">
                                  {product.name || product.title || `Товар ${index + 1}`}
                                  {product.quantity && ` × ${product.quantity}`}
                                </span>
                                <span className="text-white">
                                  {product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Избранное */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Избранные товары</h2>
              
                             {favoriteProducts.length === 0 ? (
                 <div className="text-center py-12">
                   <FiHeart size={48} className="text-gray-500 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-400 mb-2">
                     У вас нет избранных товаров
                   </h3>
                   <p className="text-gray-500">
                     Добавляйте товары в избранное, чтобы не потерять их
                   </p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {favoriteProducts.map((product: any, index: number) => (
                     <div key={product.id || index} className="bg-[#2a2a2a] p-4 rounded-md hover:bg-[#333] transition-colors">
                       {product.images && product.images.length > 0 && (
                         <div className="w-full h-32 bg-gray-700 rounded-md mb-3 overflow-hidden">
                           <img 
                             src={product.images[0]} 
                             alt={product.name}
                             className="w-full h-full object-cover"
                           />
                         </div>
                       )}
                       <h3 className="text-white font-medium mb-2">{product.name || 'Без названия'}</h3>
                       <p className="text-gray-400 mb-2">{product.price ? `${product.price} ₽` : 'Цена не указана'}</p>
                       {product.article && (
                         <p className="text-gray-500 text-sm">Артикул: {product.article}</p>
                       )}
                       <button
                         onClick={() => {
                           const updatedFavorites = favoriteProducts.filter((_, i) => i !== index);
                           setFavoriteProducts(updatedFavorites);
                           localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                         }}
                         className="mt-3 text-red-400 hover:text-red-300 text-sm"
                       >
                         Убрать из избранного
                       </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 