'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductI } from '../../types/interfaces';
// import { toast, Toaster } from 'sonner';
import { BASE_URL } from '@/utils/constants';
import Head from 'next/head';

interface AdminOrder {
    _id: string;
    status: string | string[];
    products: {
        name: string;
        article: string;
        source: string;
        quantity: number;
        price: number;
        status?: string;
    }[];
    userId?: string;
    totalAmount?: number;
    createdAt?: string;
    isGuest?: boolean;
    guestInfo?: {
        name: string;
        surname: string;
        phone: string;
        email: string;
        comment?: string;
        address?: string;
    };
}

const statusOptions = ['В обработке', 'Готов к выдаче', 'Выдан', 'Отменён'];

// Маппинг английских статусов на русские
const statusMapping: { [key: string]: string } = {
    'pending': 'В обработке',
    'processing': 'В обработке', 
    'ready': 'Готов к выдаче',
    'completed': 'Готов к выдаче',
    'delivered': 'Выдан',
    'cancelled': 'Отменён',
    'canceled': 'Отменён',
    'В обработке': 'В обработке',
    'Готов к выдаче': 'Готов к выдаче',
    'Выдан': 'Выдан',
    'Отменён': 'Отменён'
};

// Функция для перевода статуса на русский
const translateStatus = (status: string): string => {
    console.log(`translateStatus: входной статус="${status}"`);
    
    // Если статус пустой или undefined, возвращаем "В обработке"
    if (!status || status === '' || status === 'undefined' || status === 'null') {
        console.log(`translateStatus: пустой статус, возвращаем "В обработке"`);
        return 'В обработке';
    }
    
    const translated = statusMapping[status] || status;
    console.log(`translateStatus: "${status}" → "${translated}"`);
    return translated;
};
const correctPIN = 'Elektromos'; // Замените на ваш PIN

const Admin = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [pin, setPin] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<'processed' | 'unprocessed'>('unprocessed');
    const [userTypeFilter, setUserTypeFilter] = useState<string>('');

    // Состояние для уведомлений
    const [notifications, setNotifications] = useState<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([]);

    // Минималистичные всплывающие уведомления
    const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        
        // Автоматически убираем уведомление через 3 секунды
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    useEffect(() => {
        if (isAuthenticated) {
            const fetchOrders = async () => {
                try {
                    console.log('Запрос всех заказов для админки...');
                    let response;
                    
                    // Попробуем несколько вариантов эндпоинтов
                    console.log('🌐 BASE_URL:', BASE_URL);
                    console.log('🌐 process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
                    console.log('🌐 window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
                    
                    // Получаем возможные API URL
                    const possibleApiUrls = [
                        BASE_URL,
                        process.env.NEXT_PUBLIC_API_URL,
                        typeof window !== 'undefined' ? window.location.origin : null,
                        typeof window !== 'undefined' ? `${window.location.origin}/api` : null
                    ].filter(Boolean);
                    
                    console.log('🌐 Возможные API URLs:', possibleApiUrls);
                    
                    const endpoints = [];
                    for (const baseUrl of possibleApiUrls) {
                        endpoints.push(
                            `${baseUrl}/api/all-orders`,
                            `${baseUrl}/api/admin/orders`, 
                            `${baseUrl}/api/orders/all`,
                            `${baseUrl}/api/orders`,
                            `${baseUrl}/api/guest-orders`,
                            `${baseUrl}/api/guest-orders/all`
                        );
                    }
                    
                    console.log('🌐 Все эндпоинты для тестирования:', endpoints);
                    
                    let lastError;
                    let successfulEndpoint = null;
                    for (const endpoint of endpoints) {
                        try {
                            console.log(`🔍 Пробуем эндпоинт: ${endpoint}`);
                            const startTime = Date.now();
                            response = await axios.get(endpoint, { timeout: 10000 });
                            const endTime = Date.now();
                            
                            console.log(`✅ Успешный ответ от ${endpoint} за ${endTime - startTime}ms`);
                            console.log(`✅ Статус ответа:`, response.status);
                            console.log(`✅ Размер ответа:`, JSON.stringify(response.data).length, 'символов');
                            console.log(`✅ Структура ответа:`, typeof response.data, Array.isArray(response.data) ? 'Array' : 'Object');
                            console.log(`✅ Первые 200 символов ответа:`, JSON.stringify(response.data).substring(0, 200));
                            
                            successfulEndpoint = endpoint;
                            break;
                        } catch (error) {
                            console.log(`❌ Ошибка ${endpoint}:`);
                            if (axios.isAxiosError(error)) {
                                console.log(`   Статус: ${error.response?.status}`);
                                console.log(`   Сообщение: ${error.message}`);
                                console.log(`   Данные ошибки:`, error.response?.data);
                                console.log(`   URL запроса:`, error.config?.url);
                            } else {
                                console.log(`   Неизвестная ошибка:`, error);
                            }
                            lastError = error;
                            continue;
                        }
                    }
                    
                    if (!response) {
                        throw lastError || new Error('Все эндпоинты недоступны');
                    }
                    
                    // Проверяем структуру ответа
                    let ordersData = [];
                    console.log('=== ОТЛАДКА СТРУКТУРЫ ДАННЫХ ===');
                    console.log('response.data:', response.data);
                    console.log('typeof response.data:', typeof response.data);
                    console.log('Array.isArray(response.data):', Array.isArray(response.data));
                    console.log('response.data.orders:', response.data?.orders);
                    console.log('Array.isArray(response.data.orders):', Array.isArray(response.data?.orders));
                    
                    if (response.data && Array.isArray(response.data.orders)) {
                        ordersData = response.data.orders;
                        console.log('Используем response.data.orders');
                    } else if (Array.isArray(response.data)) {
                        ordersData = response.data;
                        console.log('Используем response.data как массив');
                    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                        ordersData = response.data.data;
                        console.log('Используем response.data.data');
                    } else {
                        console.warn('Неожиданная структура ответа:', response.data);
                        console.log('Все ключи ответа:', Object.keys(response.data || {}));
                        ordersData = [];
                    }
                    
                    console.log('ordersData после обработки:', ordersData);
                    console.log('ordersData.length:', ordersData.length);
                    
                    if (ordersData.length > 0) {
                        console.log('=== ДЕТАЛИ ЗАГРУЖЕННЫХ ЗАКАЗОВ ===');
                        ordersData.forEach((order: any, index: number) => {
                            console.log(`Заказ ${index + 1}:`, {
                                id: order._id,
                                status: order.status,
                                statusType: typeof order.status,
                                isGuest: order.isGuest,
                                hasGuestInfo: !!order.guestInfo,
                                guestInfo: order.guestInfo,
                                products: order.products?.length || 0
                            });
                        });
                        console.log('Первый заказ полностью:', ordersData[0]);
                        console.log('Структура первого заказа:', Object.keys(ordersData[0] || {}));
                    }
                    
                    setOrders(ordersData);
                    console.log('Загружено заказов:', ordersData.length);
                    
                    if (ordersData.length === 0) {
                        showNotification('Заказы не найдены', 'info');
                    } else {
                        // Определяем тип заказов
                        const guestOrders = ordersData.filter((order: any) => order.isGuest || order.guestInfo);
                        const regularOrders = ordersData.filter((order: any) => !order.isGuest && !order.guestInfo);
                        
                        let message = `Загружено ${ordersData.length} заказов`;
                        if (regularOrders.length > 0 && guestOrders.length > 0) {
                            message += ` (${regularOrders.length} зарегистрированных, ${guestOrders.length} гостевых)`;
                        } else if (guestOrders.length > 0) {
                            message += ` (все гостевые)`;
                        } else if (regularOrders.length > 0) {
                            message += ` (все зарегистрированные)`;
                        }
                        
                        if (successfulEndpoint) {
                            const endpointName = successfulEndpoint.split('/').pop();
                            message += ` через ${endpointName}`;
                        }
                        
                        showNotification(message, 'success');
                    }
                    
                } catch (error) {
                    console.error('Ошибка при загрузке заказов:', error);
                    if (axios.isAxiosError(error)) {
                        console.error('Статус ошибки:', error.response?.status);
                        console.error('Данные ошибки:', error.response?.data);
                        showNotification(`Ошибка загрузки заказов: ${error.response?.status} - ${error.response?.statusText}`, 'error');
                    } else {
                        showNotification('Неизвестная ошибка при загрузке заказов', 'error');
                    }
                    
                    // Fallback: создаем тестовые данные для демонстрации
                    console.log('🔄 API недоступен, создаем демо-данные...');
                    const demoOrders: AdminOrder[] = [
                        {
                            _id: 'demo-guest-order-1',
                            status: 'В обработке',
                            products: [
                                {
                                    name: 'Тестовый товар (гостевой заказ)',
                                    article: 'TEST-001',
                                    source: 'demo',
                                    quantity: 1,
                                    price: 1000
                                }
                            ],
                            totalAmount: 1000,
                            isGuest: true,
                            guestInfo: {
                                name: 'Иван',
                                surname: 'Тестовый',
                                phone: '+7 (999) 123-45-67',
                                email: 'test@example.com',
                                comment: 'Тестовый гостевой заказ для демонстрации'
                            },
                            createdAt: new Date().toISOString()
                        }
                    ];
                    
                    setOrders(demoOrders);
                    showNotification('⚠️ Демо-режим: показаны тестовые данные', 'info');
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handlePinSubmit = () => {
        if (pin === correctPIN) {
            setIsAuthenticated(true);
        } else {
            showNotification('Неверный PIN-код', 'error');
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            // Пробуем несколько эндпоинтов для обновления статуса
            const updateEndpoints = [
                `${BASE_URL}/api/orders/${orderId}/status`,
                `${BASE_URL}/api/admin/orders/${orderId}/status`,
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
                typeof window !== 'undefined' ? `${window.location.origin}/api/orders/${orderId}/status` : null
            ].filter(Boolean) as string[];
            
            let success = false;
            for (const endpoint of updateEndpoints) {
                try {
                    console.log(`🔄 Обновляем статус через: ${endpoint}`);
                    await axios.patch(endpoint, { status: newStatus });
                    console.log(`✅ Статус обновлен через: ${endpoint}`);
                    success = true;
                    break;
                } catch (error) {
                    console.log(`❌ Ошибка обновления через ${endpoint}:`, error);
                    continue;
                }
            }
            
            if (success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: [newStatus] } : order
                    )
                );
                showNotification('Статус заказа обновлен', 'success');
            } else {
                console.log('⚠️ API недоступен, работаем в локальном режиме');
                // Fallback: обновляем только локально
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: [newStatus] } : order
                    )
                );
                showNotification('⚠️ Статус обновлен локально (API недоступен)', 'info');
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса', error);
            // Fallback: обновляем только локально
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: [newStatus] } : order
                )
            );
            showNotification('⚠️ Статус обновлен локально (ошибка API)', 'info');
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.')) {
            return;
        }
        
        try {
            // Сначала удаляем локально для мгновенного отклика
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            showNotification('Заказ удален', 'success');
            
            // Затем пытаемся удалить через API (в фоне)
            const deleteEndpoints = [
                `${BASE_URL}/api/orders/${orderId}`,
                `${BASE_URL}/api/admin/orders/${orderId}`,
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
                typeof window !== 'undefined' ? `${window.location.origin}/api/orders/${orderId}` : null
            ].filter(Boolean) as string[];
            
            let apiSuccess = false;
            for (const endpoint of deleteEndpoints) {
                try {
                    console.log(`🗑️ Удаляем заказ через API: ${endpoint}`);
                    await axios.delete(endpoint, { timeout: 5000 });
                    console.log(`✅ Заказ удален через API: ${endpoint}`);
                    apiSuccess = true;
                    break;
                } catch (error) {
                    console.log(`❌ Ошибка удаления через API ${endpoint}:`, error);
                    continue;
                }
            }
            
            if (!apiSuccess) {
                console.log('⚠️ API недоступен, заказ удален только локально');
                showNotification('⚠️ Заказ удален локально (API недоступен)', 'info');
            }
            
        } catch (error) {
            console.error('Ошибка при удалении заказа', error);
            // Если что-то пошло не так, заказ уже удален локально
            showNotification('Заказ удален локально', 'info');
        }
    };

    const clearAllOrders = async () => {
        const currentOrders = selectedTab === 'unprocessed' ? unprocessedOrders : processedOrders;
        
        if (currentOrders.length === 0) {
            showNotification('Нет заказов для удаления', 'info');
            return;
        }
        
        if (!confirm(`Вы уверены, что хотите удалить ВСЕ ${currentOrders.length} заказов? Это действие нельзя отменить.`)) {
            return;
        }
        
        // Сразу удаляем все заказы локально для мгновенного отклика
        const orderIdsToDelete = currentOrders.map(order => order._id);
        setOrders(prevOrders => prevOrders.filter(order => !orderIdsToDelete.includes(order._id)));
        showNotification(`✅ Все ${currentOrders.length} заказов удалены`, 'success');
        
        // Затем пытаемся удалить через API (в фоне)
        let apiSuccessCount = 0;
        let apiFailCount = 0;
        
        for (const order of currentOrders) {
            try {
                const deleteEndpoints = [
                    `${BASE_URL}/api/orders/${order._id}`,
                    `${BASE_URL}/api/admin/orders/${order._id}`,
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}`,
                    typeof window !== 'undefined' ? `${window.location.origin}/api/orders/${order._id}` : null
                ].filter(Boolean) as string[];
                
                let success = false;
                for (const endpoint of deleteEndpoints) {
                    try {
                        await axios.delete(endpoint, { timeout: 5000 });
                        success = true;
                        break;
                    } catch (error) {
                        continue;
                    }
                }
                
                if (success) {
                    apiSuccessCount++;
                } else {
                    apiFailCount++;
                }
            } catch (error) {
                apiFailCount++;
            }
        }
        
        // Показываем результат API операций
        if (apiSuccessCount > 0 && apiFailCount === 0) {
            showNotification(`✅ Все ${apiSuccessCount} заказов удалены через API`, 'success');
        } else if (apiSuccessCount > 0 && apiFailCount > 0) {
            showNotification(`⚠️ ${apiSuccessCount} удалено через API, ${apiFailCount} только локально`, 'info');
        } else if (apiFailCount > 0) {
            showNotification(`⚠️ Все заказы удалены локально (API недоступен)`, 'info');
        }
    };

    const updateProductStatus = async (orderId: string, article: string, newStatus: string) => {
        try {
            // Пробуем несколько эндпоинтов для обновления статуса товара
            const updateEndpoints = [
                `${BASE_URL}/api/orders/${orderId}/products/${article}/status`,
                `${BASE_URL}/api/admin/orders/${orderId}/products/${article}/status`,
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/products/${article}/status`,
                typeof window !== 'undefined' ? `${window.location.origin}/api/orders/${orderId}/products/${article}/status` : null
            ].filter(Boolean) as string[];
            
            let success = false;
            for (const endpoint of updateEndpoints) {
                try {
                    console.log(`🔄 Обновляем статус товара через: ${endpoint}`);
                    await axios.patch(endpoint, { status: newStatus });
                    console.log(`✅ Статус товара обновлен через: ${endpoint}`);
                    success = true;
                    break;
                } catch (error) {
                    console.log(`❌ Ошибка обновления статуса товара через ${endpoint}:`, error);
                    continue;
                }
            }
            
            // Обновляем интерфейс независимо от результата API
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId
                        ? {
                              ...order,
                              products: order.products.map(product =>
                                  product.article === article ? { ...product, status: newStatus } : product
                              ),
                          }
                        : order
                )
            );
            
            if (success) {
                showNotification('Статус товара обновлен', 'success');
            } else {
                showNotification('⚠️ Статус товара обновлен локально (API недоступен)', 'info');
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса товара', error);
            // Fallback: обновляем только локально
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId
                        ? {
                              ...order,
                              products: order.products.map(product =>
                                  product.article === article ? { ...product, status: newStatus } : product
                              ),
                          }
                        : order
                )
            );
            showNotification('⚠️ Статус товара обновлен локально (ошибка API)', 'info');
        }
    };

    const calculateTotalPrice = (products: { name: string; article: string; source: string; quantity: number; price: number; status?: string }[]): number => {
        return products.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    const filteredOrders = orders.filter(order => {
        // Определяем является ли заказ гостевым (по наличию guestInfo или флагу isGuest)
        const isGuestOrder = order.isGuest || !!order.guestInfo;
        
        // Фильтрация по типу пользователя
        if (userTypeFilter === 'guest' && !isGuestOrder) {
            return false;
        }
        if (userTypeFilter === 'registered' && isGuestOrder) {
            return false;
        }
        
        // Если нет поискового запроса, показываем все заказы (с учетом фильтра типа)
        if (!searchTerm.trim()) {
            return true;
        }
        
        const searchLower = searchTerm.toLowerCase();
        
        // Поиск по ID заказа
        if (order._id.toLowerCase().includes(searchLower)) {
            return true;
        }
        
        // Поиск по данным гостя
        if (order.isGuest && order.guestInfo) {
            const guestInfo = order.guestInfo;
            if (
                guestInfo.name?.toLowerCase().includes(searchLower) ||
                guestInfo.surname?.toLowerCase().includes(searchLower) ||
                guestInfo.phone?.toLowerCase().includes(searchLower) ||
                guestInfo.email?.toLowerCase().includes(searchLower) ||
                guestInfo.comment?.toLowerCase().includes(searchLower)
            ) {
                return true;
            }
        }
        
        // Поиск по названиям товаров
        if (order.products.some(product => 
            product.name?.toLowerCase().includes(searchLower) ||
            product.article?.toLowerCase().includes(searchLower)
        )) {
            return true;
        }
        
        return false;
    });

    // Функция для получения статуса как строки с переводом
    const getOrderStatus = (order: AdminOrder): string => {
        let status = '';
        if (Array.isArray(order.status)) {
            status = order.status[0] || '';
        } else {
            status = order.status || '';
        }
        const translatedStatus = translateStatus(status);
        console.log(`getOrderStatus для ${order._id}: исходный="${status}", переведенный="${translatedStatus}"`);
        return translatedStatus;
    };

    // Отладка фильтрации заказов
    console.log('=== ОТЛАДКА ФИЛЬТРАЦИИ ЗАКАЗОВ ===');
    console.log('Всего заказов в orders:', orders.length);
    console.log('Заказы:', orders.map(o => ({ id: o._id, status: o.status, isGuest: o.isGuest, guestInfo: !!o.guestInfo })));
    console.log('filteredOrders.length:', filteredOrders.length);
    console.log('userTypeFilter:', userTypeFilter);
    console.log('searchTerm:', searchTerm);

    // Заказы, которые находятся в обработке (pending, processing и т.д.)
    const unprocessedOrders = filteredOrders.filter(order => {
        const status = getOrderStatus(order);
        // Если статус пустой или неопределенный, считаем заказ необработанным
        // Добавляем "Оплата при получении" как необработанный статус
        const isUnprocessed = !status || status === '' || status === 'В обработке' || 
               status === 'pending' || status === 'processing' || status === 'Оплата при получении';
        console.log(`Заказ ${order._id}: статус "${status}", необработанный: ${isUnprocessed}`);
        return isUnprocessed;
    });

    // Заказы, которые уже обработаны (completed, delivered и т.д.)
    const processedOrders = filteredOrders.filter(order => {
        const status = getOrderStatus(order);
        const isProcessed = status && (status === 'Готов к выдаче' || status === 'Выдан' || 
               status === 'completed' || status === 'delivered' || status === 'ready');
        console.log(`Заказ ${order._id}: статус "${status}", обработанный: ${isProcessed}`);
        return isProcessed;
    });

    console.log('unprocessedOrders.length:', unprocessedOrders.length);
    console.log('processedOrders.length:', processedOrders.length);

    if (!isAuthenticated) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-[#101010] px-4">
                {/* Минималистичные уведомления */}
                <div className="fixed top-4 right-4 z-50 space-y-2 max-w-[calc(100vw-2rem)]">
                    {notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 300 }}
                            className={`px-3 py-2 rounded-lg shadow-lg max-w-full text-xs sm:text-sm ${
                                notification.type === 'success' 
                                    ? 'bg-green-600 text-white' 
                                    : notification.type === 'error' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-blue-600 text-white'
                            }`}
                        >
                            <div className="flex items-center">
                                <span className="mr-2">
                                    {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
                                </span>
                                <span className="text-xs sm:text-sm">{notification.message}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0f0f0f] to-[#0a0a0a] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md text-center text-white border border-red-900/30">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Введите PIN-код</h2>
                    <p className="text-gray-400 mb-6 text-xs sm:text-sm">
                        Для доступа к заказам введите ваш PIN-код
                    </p>
                    <input
                        type="password"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        className="w-full p-3 mb-6 text-center border border-[#222] bg-[#010101] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-700/30 text-sm sm:text-base"
                        placeholder="PIN-код"
                    />
                    <button
                        onClick={handlePinSubmit}
                        className="w-full py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-900/20 focus:outline-none text-sm sm:text-base"
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#010101] px-4">
            <div className="text-center text-base sm:text-lg text-white animate-pulse-slow">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-red-700 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm sm:text-base">Загрузка данных...</span>
            </div>
        </div>
    );

    return (
        <>
            <Head>
                <title>Админ-панель - Управление заказами | Elektromos</title>
                <meta name="description" content="Панель администратора для управления заказами интернет-магазина Elektromos. Обработка заказов, статусы, управление товарами." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="max-w-6xl mt-20 sm:mt-24 md:mt-32 lg:mt-44 mx-auto p-3 sm:p-4 md:p-8 text-white min-h-screen">
            {/* Минималистичные уведомления */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-[calc(100vw-2rem)]">
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className={`px-3 py-2 rounded-lg shadow-lg max-w-full text-xs sm:text-sm ${
                            notification.type === 'success' 
                                ? 'bg-green-600 text-white' 
                                : notification.type === 'error' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-blue-600 text-white'
                        }`}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">
                                {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
                            </span>
                            <span className="text-xs sm:text-sm">{notification.message}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center p-4 sm:p-6 md:p-10 text-white relative">
                <span className="relative">
                    Управление заказами
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-700"></span>
                </span>
            </h1>

            {/* Admin Navigation */}
            <div className="flex justify-center mb-4 sm:mb-6">
                <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#0a0a0a] p-2 rounded-lg border border-red-900/30 w-full max-w-4xl">
                    <Link href="/admin" className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-all shadow-lg shadow-red-900/20 text-xs sm:text-sm text-center">
                        Заказы
                    </Link>
                    <Link href="/admin/products" className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-[#121212] text-white rounded-lg hover:bg-[#1a1a1a] transition-all text-xs sm:text-sm text-center">
                        Управление товарами
                    </Link>
                    <Link href="/admin/invite-codes" className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-all shadow-lg shadow-purple-700/20 text-xs sm:text-sm text-center">
                        Инвайт-коды
                    </Link>
                    <Link href="/" className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 bg-[#121212] text-white rounded-lg hover:bg-[#1a1a1a] transition-all text-xs sm:text-sm text-center">
                        На сайт
                    </Link>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-4 sm:mb-6 py-4 sm:py-6 md:py-10">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-2xl">
                    <button
                        onClick={() => setSelectedTab('unprocessed')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-xl font-semibold rounded-lg transition-all flex-1 ${selectedTab === 'unprocessed' ? 'bg-red-800 shadow-md shadow-red-900/20' : 'bg-[#121212] hover:bg-[#1a1a1a]'}`}
                    >
                        Необработанные
                    </button>
                    <button
                        onClick={() => setSelectedTab('processed')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-xl font-semibold rounded-lg transition-all flex-1 ${selectedTab === 'processed' ? 'bg-red-800 shadow-md shadow-red-900/20' : 'bg-[#121212] hover:bg-[#1a1a1a]'}`}
                    >
                        Обработанные
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-[#0a0a0a] p-4 sm:p-6 rounded-lg border border-red-900/30 shadow-md mb-6 sm:mb-8">
                <div className="flex flex-col gap-3 sm:gap-4">
                    <input
                        type="text"
                        placeholder="Поиск по ID заказа, имени или email"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 sm:p-4 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 text-sm sm:text-base"
                    />
                    <select
                        className="w-full p-3 sm:p-4 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 text-sm sm:text-base"
                        onChange={e => setUserTypeFilter(e.target.value)}
                        value={userTypeFilter}
                    >
                        <option value="">Все заказы</option>
                        <option value="guest">Только гостевые</option>
                        <option value="registered">Только зарегистрированные</option>
                    </select>
                </div>
            </div>

            {/* API Status Warning */}
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <p className="text-yellow-400 font-medium text-sm sm:text-base">Режим работы: Локальный интерфейс</p>
                        <p className="text-yellow-300 text-xs sm:text-sm">
                            При недоступности API изменения сохраняются только в интерфейсе. 
                            Данные могут быть не синхронизированы с сервером.
                        </p>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white relative inline-block">
                    <span className="relative">{selectedTab === 'unprocessed' ? 'Необработанные заказы' : 'Обработанные заказы'}</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-700/50"></span>
                </h2>
                
                {/* Кнопка очистки всех заказов */}
                {(selectedTab === 'unprocessed' ? unprocessedOrders : processedOrders).length > 0 && (
                    <button
                        onClick={clearAllOrders}
                        className="px-3 sm:px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg border border-red-700/30 hover:border-red-600 transition-all flex items-center gap-2 text-sm sm:text-base self-start sm:self-auto"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        <span className="hidden sm:inline">Очистить все заказы</span>
                        <span className="sm:hidden">Очистить</span>
                    </button>
                )}
            </div>

            {(() => {
                const currentOrders = selectedTab === 'unprocessed' ? unprocessedOrders : processedOrders;
                console.log('=== ОТЛАДКА РЕНДЕРИНГА ===');
                console.log('selectedTab:', selectedTab);
                console.log('filteredOrders.length:', filteredOrders.length);
                console.log('unprocessedOrders.length:', unprocessedOrders.length);
                console.log('processedOrders.length:', processedOrders.length);
                console.log('currentOrders.length:', currentOrders.length);
                
                if (filteredOrders.length > 0) {
                    console.log('Примеры статусов заказов:', filteredOrders.map(o => ({ 
                        id: o._id, 
                        status: o.status,
                        statusType: typeof o.status,
                        statusArray: Array.isArray(o.status) ? o.status : null,
                        firstStatus: Array.isArray(o.status) ? o.status[0] : o.status
                    })));
                }
                
                return null;
            })()}

            {(() => {
                const currentOrders = selectedTab === 'unprocessed' ? unprocessedOrders : processedOrders;
                console.log(`🎯 РЕНДЕР: selectedTab=${selectedTab}, currentOrders.length=${currentOrders.length}`);
                console.log(`🎯 РЕНДЕР: unprocessedOrders.length=${unprocessedOrders.length}, processedOrders.length=${processedOrders.length}`);
                return currentOrders.length === 0;
            })() ? (
                <div className="text-center text-gray-400 py-8 sm:py-12 animate-fade-in bg-[#0a0a0a] rounded-lg border border-red-900/20 mt-4 sm:mt-6">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-base sm:text-lg">Не найдено заказов</p>
                </div>
            ) : (
                <ul className="space-y-4 sm:space-y-6 animate-fade-in">
                    {(() => {
                        const ordersToRender = selectedTab === 'unprocessed' ? unprocessedOrders : processedOrders;
                        console.log(`🎯 РЕНДЕР MAP: отображаем ${ordersToRender.length} заказов`);
                        console.log(`🎯 РЕНДЕР MAP: заказы:`, ordersToRender.map(o => ({ id: o._id, status: o.status })));
                        return ordersToRender;
                    })().map(order => (
                        <li key={order._id} className="relative p-4 sm:p-6 border border-red-900/30 rounded-lg bg-[#0a0a0a] shadow-lg hover:shadow-xl transition-all hover:border-red-900/50">
                            {/* Кнопка удаления заказа */}
                            <button
                                onClick={() => deleteOrder(order._id)}
                                className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-full flex items-center justify-center transition-all border border-red-700/30 hover:border-red-600"
                                title="Удалить заказ"
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                            
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex flex-col sm:flex-row sm:items-center gap-2 pr-12">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm sm:text-base">Заказ ID:</span> 
                                    <span className="bg-[#121212] px-2 sm:px-3 py-1 rounded text-gray-300 text-xs sm:text-sm break-all">{order._id}</span>
                                </div>
                                <div className="flex gap-2">
                                    {order.isGuest && (
                                        <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-xs sm:text-sm border border-blue-700/30">
                                            ГОСТЬ
                                        </span>
                                    )}
                                    {order.userId && !order.isGuest && (
                                        <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded text-xs sm:text-sm border border-green-700/30">
                                            ЗАРЕГИСТРИРОВАННЫЙ
                                        </span>
                                    )}
                                </div>
                            </h2>
                            <p className="text-gray-300 mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="text-sm sm:text-base">Статус:</span>
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                    getOrderStatus(order) === 'В обработке' || getOrderStatus(order) === 'pending'
                                        ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-700/30' 
                                        : getOrderStatus(order) === 'Готов к выдаче'
                                            ? 'bg-blue-900/20 text-blue-400 border border-blue-700/30'
                                            : getOrderStatus(order) === 'Выдан'
                                                ? 'bg-green-900/20 text-green-400 border border-green-700/30'
                                                : 'bg-red-900/20 text-red-400 border border-red-700/30'
                                }`}>
                                    {getOrderStatus(order)}
                                </span>
                            </p>
                            <p className="text-gray-300 mb-4 sm:mb-5">
                                <span className="text-sm sm:text-base">Общая цена:</span> 
                                <span className="font-bold text-white bg-green-900/20 px-2 sm:px-3 py-1 rounded border border-green-700/30 text-sm sm:text-base">{calculateTotalPrice(order.products)}₽</span>
                            </p>
                            
                            {/* Информация о заказчике */}
                            {order.isGuest && order.guestInfo ? (
                                <div className="bg-blue-900/10 border border-blue-700/30 rounded-lg p-3 sm:p-4 mb-4">
                                    <h4 className="text-base sm:text-lg font-semibold text-blue-400 mb-3 flex items-center">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        Гостевой заказ
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <span className="text-gray-400 mb-1 sm:mb-0 sm:mr-2">Имя:</span>
                                            <span className="text-white font-medium">{order.guestInfo.name}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <span className="text-gray-400 mb-1 sm:mb-0 sm:mr-2">Фамилия:</span>
                                            <span className="text-white font-medium">{order.guestInfo.surname}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <span className="text-gray-400 mb-1 sm:mb-0 sm:mr-2">Телефон:</span>
                                            <a href={`tel:${order.guestInfo.phone}`} className="text-blue-400 hover:text-blue-300 font-medium underline">
                                                {order.guestInfo.phone}
                                            </a>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <span className="text-gray-400 mb-1 sm:mb-0 sm:mr-2">Email:</span>
                                            <a href={`mailto:${order.guestInfo.email}`} className="text-blue-400 hover:text-blue-300 font-medium underline">
                                                {order.guestInfo.email}
                                            </a>
                                        </div>
                                        {order.guestInfo.comment && (
                                            <div className="flex flex-col sm:flex-row sm:items-start">
                                                <span className="text-gray-400 mb-1 sm:mb-0 sm:mr-2">Комментарий:</span>
                                                <span className="text-white">{order.guestInfo.comment}</span>
                                            </div>
                                        )}
                                        {order.guestInfo.address && (
                                            <div className="flex flex-col sm:flex-row sm:items-start">
                                                <span className="text-gray-400 mb-1 sm:mb-0 sm:mr-2">Адрес:</span>
                                                <span className="text-white">{order.guestInfo.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : order.userId ? (
                                <Link 
                                    href={`/users/${order.userId}`} 
                                    className="absolute top-12 sm:top-16 right-2 sm:right-4 px-2 sm:px-4 py-1 sm:py-2 bg-[#121212] text-white rounded hover:bg-[#1a1a1a] transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    <span className="hidden sm:inline">Профиль заказчика</span>
                                    <span className="sm:hidden">Профиль</span>
                                </Link>
                            ) : (
                                <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-3 mb-4">
                                    <span className="text-yellow-400 text-xs sm:text-sm flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                        Информация о заказчике недоступна
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <span className="text-gray-400 text-sm sm:text-base">Изменить статус:</span>
                                <select
                                    className="p-2 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 text-sm sm:text-base"
                                    onChange={e => {
                                        const newStatus = e.target.value;
                                        updateOrderStatus(order._id, newStatus);
                                        
                                        // Если статус заказа изменился на "Готов к выдаче" или "Выдан",
                                        // автоматически перенесем заказ в обработанные
                                        if (newStatus === 'Готов к выдаче' || newStatus === 'Выдан') {
                                            setSelectedTab('processed'); // Переход в вкладку "Обработанные"
                                        }
                                    }}
                                    value={getOrderStatus(order)}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="bg-[#121212] p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white relative inline-block">
                                    <span className="relative">Товары в заказе</span>
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-700/30"></span>
                                </h3>
                                <ul className="space-y-3 sm:space-y-4">
                                    {order.products.map(product => (
                                        <li key={product.article} className="flex flex-col gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#222] hover:border-red-900/30 transition-all">
                                            <span className="font-medium text-white text-sm sm:text-base">{product.name}</span>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                                <span className="text-gray-400 text-xs sm:text-sm px-2 py-1 bg-[#121212] rounded">{product.quantity} шт.</span>
                                                <span className="font-bold text-white text-sm sm:text-base">{product.price}₽</span>
                                                <select
                                                    className="p-1 sm:p-2 text-xs sm:text-sm border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-1 focus:ring-red-700/30"
                                                    onChange={e => updateProductStatus(order._id, product.article, e.target.value)}
                                                    value={String(product.status || order.status)}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </>
    );
};

export default Admin;