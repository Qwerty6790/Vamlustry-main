import React from 'react';
import { CheckCircle, MapPin, Phone, ShoppingBag, Home } from 'lucide-react';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

const OrdersPage: React.FC = () => {
  console.log('🎯 Страница /orders загружается (Pages Router)');
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Шапка страницы */}
      <div className="relative bg-gradient-to-b from-[#0f0f0f] to-black pt-20 sm:pt-32 md:pt-40 lg:pt-48 px-4">
        <div className="container mx-auto relative z-10">
          <div>
            <div className="flex items-left justify-left mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold">Заказ успешно оформлен!</h1>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-green-500 rounded-full filter blur-[80px] sm:blur-[100px] opacity-20"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-[#b30000] rounded-full filter blur-[80px] sm:blur-[100px] opacity-10"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Левая колонка - Уведомление о звонке */}
          <div className="space-y-6 sm:space-y-8">
            {/* Ожидание звонка */}
            <div className=" rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold">Ожидайте звонка</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей.
                </p>
                <div className="rounded-lg p-3 sm:p-4">
                  <p className="text-blue-200 text-sm sm:text-base">
                     Время работы: 9:00-18:00, Круглосуточно, Телефон для связи: +7 (903) 797-06-99
                  </p>
                </div>
                <div className="border border-green-700/30 rounded-lg p-3 sm:p-4">
                  <p className="text-green-300 text-sm sm:text-base">
                     Уведомление о заказе отправлено вам на почту 
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/" className="flex-1">
                <button className="w-full  hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center text-sm sm:text-base">
                  <Home className="mr-2" size={18} />
                  На главную
                </button>
              </Link>
              <Link href="/catalog" className="flex-1">
                <button className="w-full  hover:bg-[#444] text-white px-4 sm:px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center text-sm sm:text-base">
                  <ShoppingBag className="mr-2" size={18} />
                  Продолжить покупки
                </button>
              </Link>
            </div>
          </div>

          {/* Правая колонка - Карта */}
          <div className="space-y-6 sm:space-y-8">
            {/* Карта магазина */}
            <div className=" rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                
                <h2 className="text-xl sm:text-2xl font-semibold">Мы на карте</h2>
                
              </div>
              
              <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                <iframe src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=31394763590" frameBorder={0} className="absolute inset-0 w-full h-full" title="Map" loading="lazy"></iframe>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage; 