
'use client';

import Image from 'next/image';
import Link from 'next/link';

// Компонент секции: улучшенная сетка и утонченная типографика
const Section = ({ title, number, children }: { title: string; number: string; children: React.ReactNode }) => (
  <section className="border-t border-gray-200 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 group">
    {/* Левая колонка: Номер и Заголовок */}
    <div className="lg:col-span-4 flex flex-row lg:flex-col items-baseline lg:items-start gap-4 lg:gap-2">
      <span className="text-[13px] font-medium text-gray-400 font-mono tracking-widest">{number}</span>
      <h2 className="text-xl md:text-2xl font-medium tracking-wide text-black">{title}</h2>
    </div>
    
    {/* Правая колонка: Контент */}
    <div className="lg:col-span-8 text-lg md:text-xl lg:text-[26px] font-light text-gray-800 leading-[1.45] tracking-tight space-y-6">
      {children}
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1420px] mx-auto">

        {/* --- ГЛАВНЫЙ БЛОК --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24 md:mb-32 items-center">
          {/* Левая часть: Текст */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[1.05] mb-8">
              ТЕХНИЧЕСКАЯ ЭСТЕТИКА <br />
              <span className="text-gray-400">И ФУНКЦИОНАЛИЗМ</span>
            </h1>
            <p className="max-w-xl text-base md:text-lg font-light text-gray-500 leading-relaxed">
              Мы занимаемся поставками архитектурной электрики. Исключаем лишнее, фокусируемся на качестве материалов и чистоте форм.
            </p>
          </div>
          
          {/* Правая часть: Изображение */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 overflow-hidden rounded-md">
            <Image 
              src="/images/banners/denkirsaboutbanners.png" 
              alt="Минималистичный интерьер"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-[1500ms] ease-in-out hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* --- СЕКЦИИ --- */}
        <div className="max-w-[1200px]">
        


          <Section title="Доставка и сотрудничество" number="01">
            <p>
              Доставка осуществляется в пределах Москвы и МКАД курьерской службой <strong>Яндекс GO</strong>. При заказе на сумму от 20 000 рублей доставка осуществляется <strong>бесплатно</strong>. Стандартный срок комплектации и доставки составляет от 3 до 5 дней.
            </p>
            <p>
              Мы активно сотрудничаем с дизайнерами интерьеров, архитекторами и монтажными бригадами. Для обсуждения индивидуальных условий, запроса 3D-моделей или просчета проекта напишите нам на почту в свободной форме.
            </p>
          </Section>

          <Section title="Гарантия и надежность" number="02">
            <p>
              Мы несем ответственность за качество поставляемых компонентов. На всю продукцию действует официальная гарантия производителя. В случае возникновения вопросов мы всегда остаемся на связи и помогаем оперативно решить любую техническую задачу.
            </p>
          </Section>

          <Section title="Контактная информация" number="03">
            <div className="flex flex-col gap-4">
              <p>
                Почта для заказов и сотрудничества:<br />
                <a 
                  href="mailto:infovamlystry@gmail.com" 
                  className="text-black underline decoration-gray-300 hover:decoration-black transition-colors"
                >
                  infovamlystry@gmail.com
                </a>
              </p>
              <p className="text-lg md:text-xl text-gray-500">
                Мы работаем в онлайн-формате, обеспечивая оперативную поддержку, консультации и логистику на каждом этапе реализации вашего проекта.
              </p>
            </div>
          </Section>
            
        </div>
      </div>
    </div>
  );
}
