

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaShoppingBasket, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';
import LoadingSpinner from './LoadingSpinner';

// --- UTILS ---
const urlCache = new Map<string, string>();

const normalizeUrl = (url: string): string => {
  if (urlCache.has(url)) return urlCache.get(url)!;
  const clean = url.replace(/^http:\/\//i, 'https://');
  urlCache.set(url, clean);
  return clean;
};

const getImgUrl = (p: any): string | null => {
  let src: string | undefined;
  if (p.imageAddresses) src = Array.isArray(p.imageAddresses) ? p.imageAddresses[0] : p.imageAddresses;
  if (!src && p.imageAddress) src = Array.isArray(p.imageAddress) ? p.imageAddress[0] : p.imageAddress;
  if (!src && p.images && Array.isArray(p.images) && p.images.length > 0) src = p.images[0]; 
  return src ? normalizeUrl(src) : null;
};

// --- Types ---
interface Marker {
  id: number;
  top: string;  
  left: string;
  query?: string; 
}

interface SubListItem {
  label: string;
  href: string;
}

interface CategoryItem {
  id: number;
  title: string;
  image: string;
  link: string;
  className?: string;
  markers?: Marker[];
  subList?: SubListItem[];
}

// --- Categories ---
const categories: CategoryItem[] = [
  {
    id: 1,
    title: 'Люстры',
    image: '/images/categories/lustry.jpg',
    link: '/catalog/chandeliers',
    markers: [
      { id: 101, top: '35%', left: '66%', query: 'MOD494RL' },
    ],
    subList: [
      { label: "Люстры", href: "/catalog/chandeliers" },
      { label: "Люстры потолочные", href: "/catalog/chandeliers/ceiling-chandeliers" },
      { label: "Люстры подвесные", href: "/catalog/chandeliers/pendant-chandeliers" },
      { label: "Люстры на штанге", href: "/catalog/chandeliers/rod-chandeliers" },
      { label: "Люстры каскадные", href: "/catalog/chandeliers/cascade-chandeliers" },
      { label: "Подвесные светильники", href: "/catalog/lights/pendant-lights" },
      { label: "Встраиваемые светильники", href: "/catalog/lights/recessed-lights" },
      { label: "Накладные светильники", href: "/catalog/lights/surface-mounted-light" }
    ]
  },
  {
    id: 2,
    title: 'Трековые системы освещения',
    image: '/images/categories/trekovysvetilnik.jpg',
    link: '/catalog/lights/track-lights',
    markers: [
      { id: 201, top: '25%', left: '28%', query: 'DK5771-SB' },
      { id: 202, top: '7%', left: '65%', query: 'DK5740-SB' },
      { id: 203, top: '7%', left: '50%', query: 'DK5751-SB' },
    ],
    subList: [
      { label: "Трековые светильники", href: "/catalog/lights/track-lights" },
      { label: "Магнитные трековые", href: "/catalog/lights/magnit-track-lights" },
      { label: "Умные трековые", href: "/catalog/lights/track-lights/smart" },
      { label: "Уличные трековые", href: "/catalog/lights/track-lights/outdoor" },
      { label: "Светодиодные ленты", href: "/catalog/led-strips" },
      { label: "Лампа и LED", href: "/catalog/led-lamp" },
      { label: "Аксессуары", href: "/catalog/accessories" },
      { label: "Профили разных типов", href: "/catalog/led-strip-profiles" }
    ]
  },
  {
    id: 3,
    title: 'Встраиваемые серии',
    image: '/images/categories/elektroustanovohnoeizdely.jpg',
    link: '/ElektroustnovohneIzdely/Vstraivaemy-series',
    markers: [
       { id: 301, top: '40%', left: '42%', query: 'Выключатель встраиваемый VOLTUM S70 двухклавишный 10А, (белый глянцевый)' }
    ],
    subList: [
      { label: "Встраиваемые серии", href: "/ElektroustnovohneIzdely/Vstraivaemy-series" },
      { label: "Серия Gallant", href: "/ElektroustnovohneIzdely/Werkel/Gallant" },
      { label: "Серия Retro", href: "/ElektroustnovohneIzdely/Werkel/Retro" },
      { label: "Серия Vintage", href: "/ElektroustnovohneIzdely/Werkel/Vintage" },
      { label: "Влагозащитная серия", href: "/ElektroustnovohneIzdely/Donel/W55" },
      { label: "Выдвижные лючки", href: "/ElektroustnovohneIzdely/VidviznoyBlock" }
    ]
  },
  {
    id: 4,
    title: 'Уличное освещение',
    image: '/images/categories/ylichnoeosveheny.png',
    link: '/catalog/outdoor-lights',
    markers: [
      { id: 301, top: '50%', left: '38.6%', query: 'O440FL-L18GF3K' }
    ],
    subList: [
      { label: "Уличные светильники", href: "/catalog/outdoor-lights" },
      { label: "Ландшафтные", href: "/catalog/outdoor-lights/landscape-lights" },
      { label: "Парковые", href: "/catalog/outdoor-lights/park-lights" },
      { label: "Грунтовые светильники", href: "/catalog/outdoor-lights/ground-lights" },
      { label: "Настенно-уличные", href: "/catalog/outdoor-lights/outdoor-wall-lights" }
    ]
  },
];

const MainPage = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [popupProduct, setPopupProduct] = useState<any | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const MARQUEE_TEXT = "ДОБРО ПОЖАЛОВАТЬ МЫ РАБОТАЕМ КРУГЛОСУТОЧНО С 9:00 ДО 18:00  +7 (966)-033-31-11";

  // Отправляем цвет хедера один раз при загрузке (ранее зависело от слайда)
  useEffect(() => {
    const event = new CustomEvent('headerColorChange', { detail: { color: 'black' } });
    window.dispatchEvent(event);
  }, []);

  const handleNextCategory = () => {
    setActiveMarkerId(null); 
    setPopupProduct(null);
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrevCategory = () => {
    setActiveMarkerId(null);
    setPopupProduct(null);
    setCurrentCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleMarkerClick = async (e: React.MouseEvent, markerId: number, query?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeMarkerId === markerId) {
        setActiveMarkerId(null);
        setPopupProduct(null);
        return;
    }

    if (!query) return;

    setActiveMarkerId(markerId);
    setIsLoadingProduct(true);
    setPopupProduct(null);

    try {
        const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/products/search?name=${encodeURIComponent(query)}`);
        
        if (res.ok) {
            const data = await res.json();
            if (data.products && data.products.length > 0) {
                setPopupProduct(data.products[0]);
            } else {
                console.log("Товар не найден по запросу:", query);
            }
        }
    } catch (error) {
        console.error("Ошибка при загрузке товара маркера:", error);
    } finally {
        setIsLoadingProduct(false);
    }
  };

  const closePopup = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setActiveMarkerId(null);
    setPopupProduct(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
        setActiveMarkerId(null);
        setPopupProduct(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const activeCategory = categories[currentCategoryIndex];

  return (
    <div className="w-full bg-white overflow-x-hidden">
      <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            will-change: transform;
          }
          
          .animate-marquee-slow {
             animation: marquee 60s linear infinite;
             will-change: transform;
          }

          .custom-scrollbar::-webkit-scrollbar {
             display: none;
          }
          @keyframes pulse-blue {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
          .marker-pulse {
            animation: pulse-blue 2s infinite;
          }
          @keyframes fade-in-left {
            from { opacity: 0; transform: translate(10px, -50%); }
            to { opacity: 1; transform: translate(0, -50%); }
          }
          .animate-fade-in-left {
            animation: fade-in-left 0.3s ease-out forwards;
          }
           @keyframes fade-in-right {
            from { opacity: 0; transform: translate(-10px, 0); }
            to { opacity: 1; transform: translate(0, 0); }
          }
          .animate-fade-in-right {
             animation: fade-in-right 0.3s ease-out forwards;
          }
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
      `}</style>

      {/* --- HERO VIDEO BANNER --- */}
      <div className="relative h-[60vh] min-h-[400px] md:min-h-[500px] lg:h-[120dvh] w-full overflow-hidden bg-black">
        
        {/* Видео-фон */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/banners/streetnew.mp4" /* Картинка, пока видео грузится */
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        >
          {/* ПУТЬ ДО ВАШЕГО ВИДЕО. Положите файл в папку public/videos/ */}
          <source src="/images/banners/bannersvideomaytonifreya.mp4" type="video/mp4" />
        </video>

        {/* Затемнение поверх видео (если нужно, можно убрать bg-black/20) */}
 

        <div className="absolute inset-0 flex items-center px-4 p-5 md:px-16 lg:px-44">
          <div className="relative z-10 w-full pt-10 md:pt-20">
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-lg">
                Ваш Комфорт <br /> с уютом
              </h1>
              <p className="text-sm sm:text-xl md:text-2xl font-light text-white uppercase tracking-wide drop-shadow-md">
                ВАМЛЮСТРА - продавец <br/> умного освещения
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MARQUEE (Top) --- */}
      <div className="relative w-full bg-neutral-900 text-white overflow-hidden py-3 z-30 border-b border-neutral-800">
        <div className="flex w-full whitespace-nowrap hover:[animation-play-state:paused]">
          <div className="flex items-center flex-shrink-0 min-w-full animate-marquee">
             {[0, 1, 2].map((subItem) => (
                <span key={subItem} className="px-4 text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase">{MARQUEE_TEXT}</span>
             ))}
          </div>
          <div className="flex items-center flex-shrink-0 min-w-full animate-marquee">
             {[0, 1, 2].map((subItem) => (
                <span key={subItem} className="px-4 text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase">{MARQUEE_TEXT}</span>
             ))}
          </div>
        </div>
      </div>

      {/* --- SINGLE CATEGORY SLIDER WITH MARKERS (FULL WIDTH) --- */}
      {/* <section className="relative w-full z-30 mt-6 md:mt-10 pb-6 md:pb-12">
        
        <div className="max-w-[1720px] mx-auto px-4 md:px-8">
            <h2 className='text-black text-2xl md:text-4xl font-light tracking-tight mb-4 md:mb-6'>ЧАСТЫЕ КАТЕГОРИИ</h2>
        </div>
        

        <div className="relative w-full h-[500px] md:h-[700px] lg:h-[1070px] overflow-hidden bg-neutral-100 shadow-lg group">

          <div className="absolute inset-0 z-0 block">
            <Image
              key={activeCategory.id}
              src={activeCategory.image}
              alt={activeCategory.title}
              fill
              className="object-cover transition-transform duration-700"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:via-black/10 z-10 pointer-events-none" />
          </div>
          
        
          {activeCategory.subList && (
            <div className="absolute bottom-16 md:bottom-24 left-4 md:left-12 z-20 w-[95%] md:max-w-[70%] pointer-events-none">
              <h3 className="text-white text-xl md:text-4xl font-bold mb-2 md:mb-4 tracking-tight drop-shadow-md">
                {activeCategory.title}
              </h3>
              <ul className="flex flex-wrap gap-x-3 md:gap-x-6 gap-y-2 md:gap-y-2">
                {activeCategory.subList.map((item, idx) => (
                   <li key={idx} className="pointer-events-auto">
                     <Link 
                        href={item.href}
                        className="text-white md:text-neutral-200 text-xs md:text-lg font-medium tracking-wide 
                       transition-all duration-300 
                       hover:text-white underline decoration-transparent hover:decoration-white underline-offset-4
                       opacity-90 hover:opacity-100"
                     >
                       {item.label}
                     </Link>
                   </li>
                ))}
              </ul>
            </div>
          )}
          
      
          {activeCategory.markers && activeCategory.markers.map((marker) => {
            const isPopupRight = marker.id === 102 || marker.id === 201 || marker.id === 301;
            const isPopupBottom = marker.id === 203 || marker.id === 202;
            const isOpen = activeMarkerId === marker.id;
            
            return (
              <div
                key={marker.id}
                className="absolute z-30"
                style={{ top: marker.top, left: marker.left }}
              >
               
                <div 
                  className="relative flex items-center justify-center cursor-pointer group/marker"
                  onClick={(e) => handleMarkerClick(e, marker.id, marker.query)}
                >
                    <div className={`absolute w-full h-full rounded-full  bg-neutral-400 ${isOpen ? 'opacity-0' : 'opacity-75'}`}></div>
                    <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full border-[3px] border-white shadow-lg relative z-10 transition-all duration-300 ${isOpen ? 'bg-black border-black scale-125' : 'bg-neutral-400'}`}></div>
                    
                    {!isOpen && marker.query && (
                      <div className="hidden md:block absolute left-full ml-3 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                        Смотреть
                      </div>
                    )}
                </div>

   
                {isOpen && (
                   <div className="fixed inset-0 bg-black/50 z-[45] md:hidden" onClick={(e) => closePopup(e)}></div>
                )}

            
                {isOpen && (
                  <div 
                    className={`
                      z-[50] bg-white shadow-2xl cursor-default
                      
                      fixed bottom-0 left-0 right-0 w-full rounded-t-2xl p-5 animate-slide-up
                      
                      md:absolute md:w-[320px] md:rounded-xl md:p-4 md:animate-none md:bottom-auto md:left-auto md:right-auto md:top-auto
                      ${
                        !isPopupRight && !isPopupBottom ? 'md:right-full md:top-1/2 md:-translate-y-1/2 md:mr-4 md:animate-fade-in-left md:origin-right' : ''
                      }
                      ${
                         isPopupRight ? 'md:left-full md:top-2 md:ml-4 md:animate-fade-in-right md:origin-top-left' : ''
                      }
                      ${
                         isPopupBottom ? 'md:top-full md:left-1/2 md:-translate-x-1/2 md:mt-4 md:animate-fade-in-down md:origin-top' : ''
                      }
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={`hidden md:block absolute w-4 h-4 bg-white rotate-45 
                        ${isPopupRight 
                          ? 'top-4 -left-2' 
                          : isPopupBottom
                            ? '-top-2 left-1/2 -translate-x-1/2' 
                            : 'top-1/2 -right-2 -translate-y-1/2' 
                        }
                    `}></div>

                    <button onClick={(e) => closePopup(e)} className="absolute top-3 right-3 p-2 text-gray-500 md:hidden">
                        <FaTimes size={20} />
                    </button>

                    {isLoadingProduct ? (
                        <div className="flex flex-col items-center justify-center h-[150px] text-gray-400 gap-2">
                            <LoadingSpinner isLoading={true} />
                        </div>
                    ) : popupProduct ? (
                        <div className="relative z-10 flex flex-col gap-3">
                          <div className="flex gap-4 md:block">
                              <div className="relative w-[100px] h-[100px] md:w-full md:h-[180px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                {getImgUrl(popupProduct) ? (
                                    <Image 
                                      src={getImgUrl(popupProduct)!} 
                                      alt={popupProduct.name} 
                                      fill 
                                      className="object-contain p-2" 
                                    />
                                ) : (
                                    <div className="text-xs text-gray-400">Нет фото</div>
                                )}
                              </div>

                              <div className="flex flex-col flex-grow">
                                <span className="text-[10px] text-gray-400 font-medium mb-1 uppercase">
                                  {popupProduct.article ? `Арт. ${popupProduct.article}` : ''}
                                </span>
                                <Link href={`/products/${popupProduct.source}/${popupProduct.article}`} className="text-sm font-semibold text-gray-900 leading-tight mb-1 hover:underline line-clamp-2 md:line-clamp-none">
                                  {popupProduct.name}
                                </Link>
                                
                                {popupProduct.params && popupProduct.params.Watt && (
                                    <p className="text-xs text-gray-500 mb-1">{popupProduct.params.Watt}</p>
                                )}
                                
                                <div className="flex items-center justify-between mt-auto md:mt-1">
                                  <span className="text-lg font-bold text-black">
                                    {popupProduct.price ? `${Number(popupProduct.price).toLocaleString('ru-RU')} ₽` : 'По запросу'}
                                  </span>
                                </div>
                              </div>
                          </div>
                            
                            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1 justify-center">
                                <button className="text-gray-500 hover:text-black text-xs p-1"><FaMinus /></button>
                                <span className="text-xs font-medium w-4 text-center">1</span>
                                <button className="text-gray-500 hover:text-black text-xs p-1"><FaPlus /></button>
                            </div>
                            
                            <div className="text-[10px] text-gray-400 mt-1 md:block hidden">
                              {popupProduct.stock ? `В наличии: ${popupProduct.stock} шт.` : 'Под заказ'}
                            </div>

                            <button className="mt-2 w-full bg-black text-white py-3 md:py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                                <FaShoppingBasket /> В корзину
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[100px] text-gray-400">
                            <span className="text-sm">Товар не найден</span>
                        </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button 
            onClick={handlePrevCategory}
            className="absolute top-1/2 left-2 md:left-8 -translate-y-1/2 z-40 w-10 h-10 md:w-14 md:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button 
            onClick={handleNextCategory}
            className="absolute top-1/2 right-2 md:right-8 -translate-y-1/2 z-40 w-10 h-10 md:w-14 md:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </section> */}
      
     
      <section className="relative w-full bg-white overflow-hidden py-16 md:py-32">
        <div className="max-w-[1720px] mx-auto px-4 md:px-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-32 items-center">
            
           
            <div className="flex flex-col items-start max-w-xl order-1 md:order-1">
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-normal text-black mb-8 md:mb-12 tracking-tight leading-tight">
                Дизайнерам и архитекторам
              </h2>
              <p className="text-base md:text-lg text-neutral-800 font-light mb-10 md:mb-16 leading-relaxed">
                Творческое сотрудничество с дизайнерами интерьера и архитекторами вот уже многие годы является одним из приоритетных направлений деятельности.
              </p>
              
              <Link 
                href="/auth/register" 
                className="group relative inline-flex items-center justify-between gap-12 border border-neutral-300 px-8 py-5 hover:bg-black hover:border-black transition-all duration-300 bg-transparent"
              >
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-black group-hover:text-white transition-colors">
                  Узнать подробнее
                </span>
                <span className="text-black group-hover:text-white transition-colors text-lg translate-x-0 group-hover:translate-x-1 duration-300">
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                    <path d="M1.5 1L8.5 8L1.5 15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>

         
            <div className="relative w-full h-[400px] md:h-[600px] lg:h-[800px] bg-neutral-100 order-2 md:order-2">
               <Image
                 src="/images/banners/bannersmodeluxdesigners.jpg" 
                 alt="Интерьер"
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
            </div>

          </div>
        </div>

      
        <div className="absolute bottom-[-2%] md:bottom-[55%] left-0 w-full overflow-hidden pointer-events-none z-20 select-none flex">
           <div className="flex shrink-0 animate-marquee-slow items-center whitespace-nowrap">
               {[0, 1].map((i) => (
                   <span 
                        key={i} 
                        className="text-[18vw]  font-bold  mr-20"
                        style={{
                            WebkitTextStroke: '1px black',
                            color: 'black',
                        }}
                   >
                     ДИЗАЙНЕРАМ
                   </span>
               ))}
           </div>
           <div className="flex shrink-0 animate-marquee-slow items-center whitespace-nowrap">
               {[0, 1].map((i) => (
                   <span 
                        key={i} 
                        className="text-[18vw]  font-bold  mr-20"
                        style={{
                            WebkitTextStroke: '1px black',
                            color: 'black',
                        }}
                   >
                     ДИЗАЙНЕРАМ
                   </span>
               ))}
           </div>
        </div>
      </section>
   
    </div>
  );
};

export default MainPage;
