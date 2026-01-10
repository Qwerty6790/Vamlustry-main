
'use client';

import Link from 'next/link';
// Если иконка не нужна, можно удалить импорт, но я оставил на случай, если вы используете её в хедере
import { ArrowUpRight } from 'lucide-react';

// --- СПИСОК МАГАЗИНОВ ---
const STORES = [
  {
    id: 1,
    title: "ТЦ Шоколад",
    address: "МКАД, 2-й километр, ТЦ Шоколад, Реутов этаж 3",
    phone: "+7 (966)-033-31-11",
    hours: "с 10.00 до 21.00",
  },
  {
    id: 2,
    title: "Конструктор",
    address: "Москва, 25-км МКАД, ТК Конструктор, 2 этаж, пав 2.41.1, пав 2.19. Торговые ряды, ряд В пав 2.4",
    phone: "+7 (966)-033-31-11",
    hours: "с 10.00 до 21.00",
  }
];

// Компонент секции
const Section = ({ title, number, children }: { title: string; number: string; children: React.ReactNode }) => (
  <section className="border-t border-black/10 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8">
    <div className="md:col-span-4 lg:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-4">
      <span className="text-3xl font-mono text-neutral-400">{number}</span>
      <h2 className="text-3xl font-medium uppercase tracking-wide text-black">{title}</h2>
    </div>
    <div className="md:col-span-8 lg:col-span-6 text-3xl leading-relaxed text-black font-light">
      {children}
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">

        {/* ЗАГОЛОВОК */}
        <div className="mb-24 md:mb-32">
          <h1 className="text-4xl md:text-7xl font-light tracking-tighter mb-8">
            ТЕХНИЧЕСКАЯ ЭСТЕТИКА <br />
            <span className="text-neutral-400">И ФУНКЦИОНАЛИЗМ</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-light text-neutral-600">
            Мы занимаемся поставками архитектурной электрики. Исключаем лишнее, фокусируемся на качестве материалов.
          </p>
        </div>

        {/* --- СЕКЦИЯ С КАРТОЙ (IFRAME) --- */}
        <section className="border-t border-black/10 py-12 md:py-20">
          
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 lg:h-[600px]">
            
            {/* ЛЕВАЯ ЧАСТЬ: IFRAME */}
            <div className="w-full lg:w-2/3 h-[400px] lg:h-full bg-neutral-100 rounded-sm overflow-hidden order-2 lg:order-1 mt-8 lg:mt-0 shadow-sm border border-neutral-200">
            <iframe 
  src="https://yandex.ru/map-widget/v1/?um=constructor%3A82c4bcb4776e5824ba1addd702dc1f07b8d0bf9c8f1774eeae28803feb49c039&amp;source=constructor" 
  width="100%" 
  height="100%" 
  frameBorder="0"
  className="w-full h-full block"
  allowFullScreen={true}
  allow="geolocation"  // <--- ДОБАВИТЬ ЭТУ СТРОКУ
/>
            </div>

            {/* ПРАВАЯ ЧАСТЬ: СПИСОК АДРЕСОВ */}
            <div className="w-full lg:w-1/3 flex flex-col order-1 lg:order-2 h-full">
              
              {/* Заголовок блока (Номер 4) */}
              <div className="flex gap-4 items-baseline mb-6">
                <span className="text-3xl font-mono text-neutral-400">4</span>
                <h2 className="text-3xl font-medium uppercase tracking-wide text-black">Магазины</h2>
              </div>

              {/* Список */}
              <div className="flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
                {STORES.map((store) => (
                  <div key={store.id} className="pb-6 border-b border-neutral-100 last:border-0 group">
                    <h3 className="font-medium text-lg leading-snug mb-2 group-hover:text-neutral-600 transition-colors">
                      {store.address}
                    </h3>
                    <p className="text-xl font-light mb-1">{store.phone}</p>
                    <p className="text-sm text-neutral-400">{store.hours}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* СЕКЦИИ */}
        <Section title="Серии" number="1">
          <p className="mb-6">
            Специализируемся на электроустановочных изделиях премиального сегмента.
          </p>
        </Section>

        <Section title="Производство" number="2">
          <p className="mb-6">
            Поддерживаем складскую программу по ходовым позициям. Отгрузка складских позиций: 3–4 рабочих дня.
          </p>
        </Section>

        <Section title="Сотрудничество" number="3">
          <p className="mb-6">
            Предлагаем техническую и коммерческую поддержку для архитектурных бюро, дизайн-студий и комплектаторов.
          </p>
        </Section>

        {/* НОВАЯ СЕКЦИЯ: ДОСТАВКА */}
        <Section title="Доставка" number="5">
          <div className="space-y-8">
            <div>
              <p className="mb-2 font-medium text-neutral-500 text-lg uppercase tracking-wider">Курьер</p>
              <p>
                Доставка по Москве и за пределами МКАД осуществляется через приложение <span className="font-normal text-black underline decoration-neutral-300 underline-offset-4">Яндекс Go</span>. Быстро и удобно — прямо до двери или объекта.
              </p>
            </div>
            
            <div>
              <p className="mb-2 font-medium text-neutral-500 text-lg uppercase tracking-wider">Самовывоз</p>
              <p>
                Вы можете забрать заказ самостоятельно прямо из наших магазинов в рабочее время.
              </p>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}