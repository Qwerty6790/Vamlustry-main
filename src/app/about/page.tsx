
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

// Компонент секции (без изменений)
const Section = ({ title, number, children }: { title: string; number: string; children: React.ReactNode }) => (
  <section className="border-t border-black/10 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8">
    <div className="md:col-span-4 lg:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-4">
      <span className="text-3xl font-mono text-neutral-400">{number}</span>
      <h2 className="text-4xl font-medium uppercase tracking-wide text-black">{title}</h2>
    </div>
    <div className="md:col-span-8 lg:col-span-6 text-lg leading-relaxed text-neutral-800 font-light">
      {children}
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-[1600px] mx-auto">

        {/* ЗАГОЛОВОК СТРАНИЦЫ */}
        <div className="mb-24 md:mb-32">
          <h1 className="text-4xl md:text-7xl font-light tracking-tighter mb-8">
            ТЕХНИЧЕСКАЯ ЭСТЕТИКА <br />
            <span className="text-neutral-400">И ФУНКЦИОНАЛИЗМ, О КОМПАНИИ</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-light text-neutral-600">
            Мы занимаемся поставками архитектурной электрики. Исключаем лишнее, фокусируемся на качестве материалов и инженерной точности механизмов.
          </p>
              {/* Правая колонка: Фото */}
              <div className="order-1 lg:order-2 relative w-full h-[50vh] lg:h-[95vh] bg-neutral-100 overflow-hidden rounded-sm">
              <Image 
                src="/images/banners/bannersmenufavorite.webp" 
                alt="Минималистичный интерьер"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out  "
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
        </div>

        {/* 01. ПРОДУКТ (ЧТО ПРОДАЕМ) */}
        <Section title="Серии" number="1">
          <p className="mb-6">
            Специализируемся на электроустановочных изделиях премиального сегмента. В ассортименте представлены механизмы тумблерного и поворотного типа, а также классические клавишные решения.
          </p>
        </Section>

        {/* 02. ДОСТАВКА (ЛОГИСТИКА) */}
        <Section title="Производство" number="2">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-black mb-2">Сроки и наличие</h3>
              <p>
                Поддерживаем складскую программу по ходовым позициям (черный/белый пластик, сталь). Отгрузка складских позиций: 1–2 рабочих дня. Заказные позиции из Европы: 4–8 недель в зависимости от сложности финишной обработки.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-neutral-50 p-6 rounded-sm">
                <span className="block text-xs font-mono text-neutral-400 mb-2">ПО МОСКВЕ</span>
                <p className="text-sm">
                  Курьерская доставка до двери или объекта. Возможен самовывоз со склада (по предварительной заявке).
                </p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-sm">
                <span className="block text-xs font-mono text-neutral-400 mb-2">ПО РФ И СНГ</span>
                <p className="text-sm">
                  Отправка через СДЭК, Деловые Линии или Major Express. Груз страхуется на полную стоимость. Жесткая обрешетка для хрупких изделий.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* 03. СОТРУДНИЧЕСТВО (ДИЗАЙНЕРАМ) */}
        <Section title="Сотрудинчество" number="3">
          <p className="mb-6">
            Предлагаем техническую и коммерческую поддержку для архитектурных бюро, дизайн-студий и комплектаторов. Работаем по договору поставки с НДС/без НДС.
          </p>
        </Section>
   
       

      </div>
    </div>
  );
}