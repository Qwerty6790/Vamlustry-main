
'use client';

import Image from 'next/image';
// Если Link не используется, его можно убрать, но я оставлю на всякий случай
import Link from 'next/link';



// Компонент секции
const Section = ({ title, number, children }: { title: string; number: string; children: React.ReactNode }) => (
  <section className="border-t border-black/10 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8">
    <div className="md:col-span-4 lg:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-4">
      <span className="text-3xl font-mono text-neutral-400">{number}</span>
      <h2 className="text-2xl md:text-3xl font-medium uppercase tracking-wide text-black">{title}</h2>
    </div>
    <div className="md:col-span-8 lg:col-span-6 text-1xl md:text-2xl lg:text-4xl font-light tracking-tighter  leading-[1.1]">
      {children}
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1420px] mx-auto">

        {/* --- ГЛАВНЫЙ БЛОК --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 md:mb-32 items-end">
          {/* Левая часть: Текст */}
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter  leading-[1.1]">
              ТЕХНИЧЕСКАЯ ЭСТЕТИКА <br />
              <span className="text-neutral-400">И ФУНКЦИОНАЛИЗМ</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl font-light text-neutral-600 leading-relaxed">
              Мы занимаемся поставками архитектурной электрики. Исключаем лишнее, фокусируемся на качестве материалов и чистоте форм.
            </p>
          </div>
          <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-white via-white to-transparent z-10 pointer-events-none" />
          {/* Правая часть: Изображение */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[400px] bg-neutral-100 overflow-hidden rounded-sm shadow-sm">
            <Image 
              src="/images/banners/denkirsaboutbanners.png" 
              alt="Минималистичный интерьер"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* --- СЕКЦИИ 1, 2, 3 --- */}
        <Section title="Серии" number="1">
          <p className="mb-6">
            Специализируемся на электроустановочных изделиях премиального сегмента. Каждая деталь продумана для интеграции в современный интерьер.
          </p>
        </Section>

        <Section title="Производство" number="2">
          <p className="mb-6">
            Поддерживаем обширную складскую программу по самым востребованным позициям. 
            <br/><span className="text-neutral-500 text-2xl">Отгрузка со склада: 3–4 рабочих дня.</span>
          </p>
        </Section>

        <Section title="Сотрудничество" number="3">
          <p className="mb-6">
            Предлагаем полную техническую и коммерческую поддержку для архитектурных бюро, дизайн-студий и частных комплектаторов.
          </p>
        </Section>

        {/* --- СЕКЦИЯ 4: МАГАЗИНЫ И КАРТА --- */}
       
        {/* --- СЕКЦИЯ 5: ДОСТАВКА --- */}
        <Section title="Доставка" number="5">
          <div className="space-y-10">
            <div>
              <p className="mb-3 font-medium text-neutral-400 text-sm uppercase tracking-widest">Курьер</p>
              <p>
                Доставка по Москве и области осуществляется через сервис <span className="font-normal text-black underline decoration-neutral-300 underline-offset-4 decoration-1">Яндекс Go</span>. <br/>
                Быстро, прозрачно и прямо до двери.
              </p>
            </div>
            
            <div>
              <p className="mb-3 font-medium text-neutral-400 text-sm uppercase tracking-widest">Самовывоз</p>
              <p>
                Вы можете забрать заказ самостоятельно из любого нашего магазина в рабочее время после подтверждения готовности.
              </p>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}