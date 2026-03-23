
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, ReactNode } from 'react';

// --- ТИПИЗАЦИЯ ДЛЯ КОМПОНЕНТА REVEAL ---
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
  id?: string; // <-- Добавлено свойство id
}

// --- КАСТОМНЫЙ КОМПОНЕНТ ДЛЯ АНИМАЦИИ ПРИ СКРОЛЛЕ ---
const Reveal = ({ children, delay = 0, className = '', direction = 'up', id }: RevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const translateClasses: Record<'up' | 'left' | 'right' | 'none', string> = {
    up: 'translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
    none: 'translate-y-0 scale-95'
  };

  return (
    <div
      id={id} // <-- Передаем id в DOM-элемент
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] 
        ${isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${translateClasses[direction]}`}
        ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


export default function AboutPage() {
  
  // --- ФУНКЦИЯ ПЛАВНОЙ ПРОКРУТКИ ---
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex" id="top">
      
      {/* --- ЛЕВЫЙ САЙДБАР --- */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-20 h-screen py-12 px-8 border-r border-gray-100 z-30 bg-white/80 backdrop-blur-sm">
        <nav className="flex flex-col gap-5 text-[11px] uppercase tracking-widest text-gray-400 font-medium mt-10">
          <a href="#top" onClick={(e) => handleScroll(e, 'top')} className="text-black font-bold hover:opacity-70 transition-opacity">О компании</a>
          <a href="#cooperation" onClick={(e) => handleScroll(e, 'cooperation')} className="hover:text-black transition-colors">Сотрудничество</a>
          <a href="#history" onClick={(e) => handleScroll(e, 'history')} className="hover:text-black transition-colors">Новости (История)</a>
          <a href="#contacts" onClick={(e) => handleScroll(e, 'contacts')} className="hover:text-black transition-colors">Контакты</a>
          <a href="#legal" onClick={(e) => handleScroll(e, 'legal')} className="hover:text-black transition-colors">Правовая информация</a>
        </nav>
      </aside>

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
      <main className="flex-1 lg:ml-64 w-full overflow-hidden">
        
        {/* 1. ГЛАВНЫЙ БЛОК */}
        <section className="pt-24 pb-20 px-6 lg:px-16 max-w-[1400px] mx-auto min-h-[90vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            <div className="flex flex-col justify-center">
              <Reveal delay={0}>
                <h1 className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-tighter leading-[1.05] mb-8 uppercase">
                  Техническая эстетика <br />
                  <span className="text-gray-400">и функционализм</span>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="max-w-xl text-base md:text-lg font-light text-gray-500 leading-relaxed">
                  Мы занимаемся поставками архитектурной электрики. Исключаем лишнее, фокусируемся на качестве материалов и чистоте форм.
                </p>
              </Reveal>
            </div>
            
            <Reveal delay={400} direction="none" className="w-full">
              <div className="relative w-full h-[400px] md:h-[600px] bg-gray-50 overflow-hidden rounded-sm group">
                <Image 
                  src="/images/banners/denkirsaboutbanners303.webp" 
                  alt="Минималистичный интерьер"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] ease-out group-hover:scale-110 scale-100"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. МЫ В ЦИФРАХ */}
        <section id="numbers" className="py-20 px-6 lg:px-16 max-w-[1400px] mx-auto scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal delay={0}>
                <h2 className="text-2xl font-light tracking-wide">Наше стремеление</h2>
              </Reveal>
            </div>
            
            <div className="lg:col-span-8 relative flex flex-col gap-16 md:gap-24 mt-10 lg:mt-0">
              <Reveal delay={100} className="self-end w-full md:w-1/2">
                <div className="border-t border-gray-200 pt-4 relative overflow-hidden">
                  <div className="text-[80px] md:text-[100px] font-light leading-none tracking-tighter mb-2">10000+</div>
                  <div className="text-xs font-semibold tracking-wide uppercase text-gray-500">клиентов</div>
                </div>
              </Reveal>

              <Reveal delay={300} className="self-start w-full md:w-1/2">
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-[80px] md:text-[100px] font-light leading-none tracking-tighter mb-2">Свет</div>
                  <div className="text-xs font-semibold tracking-wide uppercase text-gray-500">который мы создаем сами</div>
                </div>
              </Reveal>

              <Reveal delay={500} className="self-end w-full md:w-3/4 relative flex items-center justify-end mt-10">
                <div className="w-full flex items-center">
                  <div className="h-px bg-gray-200 flex-1 ml-20 md:ml-32 mr-6 relative z-0 origin-left animate-pulse"></div>
                  <div className="text-right">
                    <div className="text-[60px] md:text-[90px] font-light leading-none tracking-tighter mb-2">Рейтинги</div>
                    <div className="text-xs font-semibold tracking-wide uppercase text-gray-500">и позиций</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. НАША ИСТОРИЯ */}
        <section id="history" className="py-20 px-6 lg:px-16 max-w-[1400px] mx-auto scroll-mt-20">
          <Reveal delay={0}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-light tracking-wide">Наша история начинается с вас</h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-400 hover:text-black">&larr;</button>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-400 hover:text-black">&rarr;</button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex items-center text-[10px] text-gray-400 font-mono mb-12 overflow-x-auto whitespace-nowrap pb-4 hide-scrollbar"> 
              <span className="hover:text-black cursor-pointer transition-colors">2026</span>
            </div>
          </Reveal>

          <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start">
            <Reveal delay={300} direction="left">
              <div className="text-[120px] md:text-[180px] h-72 w-full md:w-[800px] font-light leading-[0.8] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-400">
                2026
              </div>
            </Reveal>
            <Reveal delay={500}>
              <div className="max-w-md text-4xl leading-relaxed text-black md:mt-4">
                Вамлюстра для комфорта и жизни
              </div>
            </Reveal>
          </div>
        </section>

      
      

        <section id="cooperation" className="py-20 px-6 lg:px-16 max-w-[1400px] mx-auto scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Левая колонка с общим заголовком секции */}
            <div className="lg:col-span-4">
              <Reveal delay={0}>
                <h2 className="text-2xl font-light tracking-wide">Информация</h2>
              </Reveal>
            </div>
            
            {/* Правая колонка с асимметричным контентом */}
            <div className="lg:col-span-8 relative flex flex-col gap-16 md:gap-24 mt-10 lg:mt-0">
              
              {/* 01: Доставка (Сдвиг вправо) */}
              <Reveal delay={100} className="self-end w-full md:w-5/6">
                <div className="border-t border-gray-200 pt-4 relative overflow-hidden">
                  <div className="text-[60px] md:text-[90px] font-light leading-none tracking-tighter mb-4 text-gray-200 select-none">
                    01
                  </div>
                  <div className="text-4xl  font-semibold tracking-wide uppercase text-black mb-6">
                    Доставка
                  </div>
                  <div className="text-black font-light space-y-6 text-base leading-relaxed">
                    <p>
                      Доставка осуществляется в пределах Москвы и МКАД курьерской службой Яндекс GO. При заказе на сумму от 20 000 рублей доставка осуществляется бесплатно. Стандартный срок комплектации и доставки составляет от 3 до 5 дней.
                    </p>
                    <p>
                      Мы активно сотрудничаем с дизайнерами интерьеров, архитекторами и монтажными бригадами. Для обсуждения индивидуальных условий, запроса 3D-моделей или просчета проекта напишите нам на почту в свободной форме.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* 02: Гарантия (Сдвиг влево) */}
              <Reveal delay={300} className="self-start w-full md:w-4/5">
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-[60px] md:text-[90px] font-light leading-none tracking-tighter mb-4 text-gray-200 select-none">
                    02
                  </div>
                  <div className="text-4xl font-semibold tracking-wide uppercase text-black mb-6">
                    Гарантия и надежность
                  </div>
                  <div className="text-black font-light space-y-6 text-base leading-relaxed">
                    <p>
                      Мы несем ответственность за качество поставляемых компонентов. На всю продукцию действует официальная гарантия производителя. В случае возникновения вопросов мы всегда остаемся на связи и помогаем оперативно решить любую техническую задачу.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* 03: Контакты (С линией, как в блоке "Рейтинги", сдвиг вправо) */}
              <Reveal delay={500} className="self-end w-full relative mt-10" id="contacts">
                <div className="w-full flex items-center mb-8">
                  <div className="h-px bg-gray-200 flex-1 mr-6 relative z-0 origin-left animate-pulse"></div>
                  <div className="text-right">
                    <div className="text-[60px] md:text-[90px] font-light leading-none tracking-tighter mb-2 text-gray-200 select-none">
                      03
                    </div>
                    <div className="text-4xl font-semibold tracking-wide uppercase text-black">
                      Контакты и Реквизиты
                    </div>
                  </div>
                </div>
                
                <div className="ml-auto w-full md:w-5/6 text-black font-light space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <span className="block text-[11px] uppercase tracking-widest text-gray-400 mb-1">Почта для заказов:</span>
                        <a href="mailto:vama1.11@mail.ru" className="text-black text-base hover:opacity-60 transition-opacity">vama1.11@mail.ru</a>
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase tracking-widest text-gray-400 mb-1">Телефоны:</span>
                        <div className="flex flex-col space-y-1">
                          <a href="tel:+79660222111" className="text-black text-base hover:text-gray-400 transition-colors">8 966 022 21 11</a>
                          <a href="tel:+79331110311" className="text-black text-base hover:text-gray-400 transition-colors">8 933 111 03 11</a>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100">
                    <span className="block text-[11px] uppercase tracking-widest text-gray-400 mb-3">Юридические реквизиты:</span>
                    <div className="space-y-1">
                      <p className="text-black text-base">ИП [Асланян В. А]</p>
                      <p className="text-black text-base">ИНН: [581703738951]</p>
                    </div>
                  </div>
                 
                  </div>

                 
                </div>
              </Reveal>

              {/* 04: Правовая информация (Сдвиг влево) */}
              <Reveal delay={700} className="self-start w-full md:w-5/6 mt-10" id="legal">
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-[60px] md:text-[90px] font-light leading-none tracking-tighter mb-4 text-gray-200 select-none">
                    04
                  </div>
                  <div className="text-4xl font-semibold tracking-wide uppercase text-black mb-6">
                    Правовая информация
                  </div>
                  <div className="text-gray-600 font-light space-y-6 text-base leading-relaxed">
                    <p>
                      Используя наш сайт, оставляя заявки и оформляя заказы, вы соглашаетесь с условиями предоставления услуг и обработки данных. Ознакомиться с документами можно по ссылкам ниже:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <a 
                        href="/about/offer"
                        target="_blank"
                        className="inline-flex items-center justify-center border border-gray-300 px-6 py-3 text-sm text-black hover:border-black transition-colors"
                      >
                        Публичная оферта
                      </a>
                      <a 
                        href="/about/agreement"
                        target="_blank"
                        className="inline-flex items-center justify-center border border-gray-300 px-6 py-3 text-sm text-black hover:border-black transition-colors"
                      >
                        Пользовательское соглашение
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}