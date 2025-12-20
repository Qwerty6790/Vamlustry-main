'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { Home, FileText, ShoppingCart } from 'lucide-react';

// Тип для деталей заказа для лучшей безопасности типов
interface OrderDetails {
  _id: string;
  createdAt: string;
  totalAmount: number;
  paid: boolean;
}

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        setIsLoading(true);
        
        // Очищаем корзину из локального хранилища
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart');
          localStorage.setItem('cartCount', '0');
          localStorage.removeItem('pendingOrderId');
        }
        
        // Загружаем детали заказа с сервера
        const token = localStorage.getItem('token');
        if (token && orderId) {
          try {
            const response = await axios.get<OrderDetails>(
              `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              }
            );
            setOrderDetails(response.data);
          } catch (err) {
            console.warn('Не удалось загрузить детали заказа, но оплата прошла успешно:', err);
            // Не показываем ошибку пользователю, так как основная цель (оплата) была успешной.
          }
        }
        
      } catch (e) {
        console.error('Ошибка при обработке успешной оплаты:', e);
        setError('Произошла ошибка при обработке вашего платежа. Пожалуйста, свяжитесь с поддержкой.');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      processPaymentSuccess();
    } else {
      setError('ID заказа не найден. Невозможно подтвердить оплату.');
      setIsLoading(false);
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <ClipLoader color="#FFFFFF" size={40} />
        <p className="mt-4 text-gray-400">Обрабатываем ваш платеж...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <h1 className="mt-4 text-2xl font-bold text-white">Произошла ошибка</h1>
          <p className="mt-2 text-gray-400">{error}</p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-2.5 bg-red-800 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
            >
              <Home className="mr-2" size={16} />
              Вернуться на главную
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Заказ успешно оформлен!</h1>
          <p className="mt-2 text-lg text-gray-300 max-w-xl mx-auto">
            Спасибо за покупку! Мы получили ваш заказ и скоро начнем его обработку.
          </p>
        </motion.div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gray-900/60 border border-red-900/50 rounded-xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center">
              <FileText className="text-red-400 mr-3" size={22} />
              Детали заказа
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-red-900/50">
                <span className="text-gray-400">Номер заказа</span>
                <span className="font-mono font-medium text-gray-200">#{orderId}</span>
              </div>
              
              {orderDetails?.createdAt && (
                <div className="flex justify-between items-center py-3 border-b border-red-900/50">
                  <span className="text-gray-400">Дата</span>
                  <span className="text-gray-200">
                    {new Date(orderDetails.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 border-b border-red-900/50">
                <span className="text-gray-400">Статус оплаты</span>
                <span className="font-semibold text-green-400">Оплачено</span>
              </div>
              
              {orderDetails?.totalAmount && (
                <div className="flex justify-between items-center pt-3">
                  <span className="text-gray-300 font-semibold">Сумма</span>
                  <span className="text-xl font-bold text-white">
                    {orderDetails.totalAmount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-8 text-sm text-red-200">
              <h3 className="font-semibold mb-2 text-white">Что дальше?</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Мы отправили подтверждение вашего заказа на email.</li>
                <li>Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.</li>
                <li>Вы можете отслеживать статус заказа в личном кабинете.</li>
              </ul>
            </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-red-800 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
            >
              <FileText className="mr-2" size={16} />
              Перейти к моим заказам
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-transparent text-white border border-red-800 rounded-md font-semibold hover:bg-red-900/40 transition-colors"
            >
              <ShoppingCart className="mr-2" size={16} />
              Продолжить покупки
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentSuccess;