import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShoppingCart, Phone, CheckCircle, MapPin } from 'lucide-react';

interface OrderProduct {
    name: string;
    article: string;
    source: string;
    quantity: number;
    price: number;
    status?: string;
}

interface OrderData {
    _id: string;
    status: string | string[];
    products: OrderProduct[];
    totalAmount: number;
    createdAt: string;
    isGuest?: boolean;
    guestInfo?: {
        name: string;
        surname: string;
        phone: string;
        email: string;
        comment?: string;
        address?: string;
    };
    userId?: string;
    paymentMethod?: string;
    deliveryMethod?: string;
}

export default function OrderConfirmationPage() {
    const router = useRouter();
    const { orderId } = router.query;
    
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || typeof orderId !== 'string') return;
            
            try {
                console.log('🔍 Загружаем заказ:', orderId);
                
                // Пробуем разные эндпоинты для получения заказа
                const endpoints = [
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
                    `${process.env.NEXT_PUBLIC_API_URL}/api/guest-orders/${orderId}`,
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}`,
                    typeof window !== 'undefined' ? `${window.location.origin}/api/orders/${orderId}` : null,
                    typeof window !== 'undefined' ? `${window.location.origin}/api/guest-orders/${orderId}` : null
                ].filter(Boolean) as string[];
                
                let orderData = null;
                for (const endpoint of endpoints) {
                    try {
                        console.log(`🔍 Пробуем: ${endpoint}`);
                        const response = await axios.get(endpoint);
                        orderData = response.data;
                        console.log(`✅ Заказ получен через: ${endpoint}`, orderData);
                        break;
                    } catch (error) {
                        console.log(`❌ Ошибка ${endpoint}:`, error);
                        continue;
                    }
                }
                
                if (orderData) {
                    setOrder(orderData);
                } else {
                    setError('Заказ не найден или недоступен');
                }
            } catch (error) {
                console.error('Ошибка при загрузке заказа:', error);
                setError('Произошла ошибка при загрузке заказа');
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#010101] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Загружаем информацию о заказе...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#010101] pt-32 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-8">
                        <h1 className="text-2xl font-bold text-white mb-4">Заказ не найден</h1>
                        <p className="text-red-400 mb-6">{error}</p>
                        <Link 
                            href="/catalog"
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Перейти в каталог
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#010101] pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Заказ оформлен успешно!
                    </h1>
                    <p className="text-xl text-gray-300 mb-2">
                        Номер заказа: <span className="text-red-400 font-mono">{order._id}</span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Уведомление о звонке */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-8">
                            <div className="flex items-center mb-6">
                                <Phone className="w-8 h-8 text-blue-400 mr-4" />
                                <h2 className="text-2xl font-bold text-white">Ожидайте звонка</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-blue-300 text-lg">
                                    Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
                                </p>
                                <div className="bg-blue-900/30 rounded-lg p-4">
                                    <p className="text-blue-200">
                                        📞 Время работы: пн-пт 9:00-18:00, сб 10:00-16:00
                                    </p>
                                </div>
                                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                                    <p className="text-green-300">
                                        📧 Уведомление о заказе отправлено на почту vama1.11@mail.ru
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Карта */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-[#121212] border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <MapPin className="w-6 h-6 text-red-400 mr-3" />
                                <h3 className="text-xl font-bold text-white">Наш адрес</h3>
                            </div>
                            
                            {/* Карта */}
                            <div className="mb-6 rounded-lg overflow-hidden border border-gray-600">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.7265!2d37.6156!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a636b1f8c2d%3A0x5c3f2f1234567890!2z0JzQvtGB0LrQstCwLCDQoNC-0YHRgdC40Y8!5e0!3m2!1sru!2sru!4v1234567890123"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full"
                                ></iframe>
                            </div>

                            {/* Контактная информация */}
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-white mb-2">Электромос - магазин электрики</h4>
                                    <p className="text-gray-300">г. Москва, ул. Примерная, д. 123</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm">Телефон:</p>
                                    <a href="tel:+74951234567" className="text-white hover:text-red-400 transition-colors">
                                        +7 (495) 123-45-67
                                    </a>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm">Email:</p>
                                    <a href="mailto:vama1.11@mail.ru" className="text-white hover:text-red-400 transition-colors">
                                    vama1.11@mail.ru
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Кнопка продолжить покупки */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <Link 
                        href="/catalog"
                        className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-medium"
                    >
                        <ShoppingCart className="w-6 h-6 mr-3" />
                        Продолжить покупки
                    </Link>
                </motion.div>
            </div>
        </div>
    );
} 