
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { YMaps, Map as YMap, Placemark, ZoomControl, FullscreenControl } from '@pbe/react-yandex-maps';
import { FaShoppingBasket, FaMinus, FaPlus, FaSpinner } from 'react-icons/fa';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

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
interface BannerItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  headerColor: 'black' | 'white';
}

interface Marker {
  id: number;
  top: string;  
  left: string;
  query?: string; 
}

// Обновленный интерфейс для подкатегорий
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
  subList?: SubListItem[]; // Теперь здесь объекты с ссылками
}

// --- Data: Banners ---
const banners: BannerItem[] = [
  {
    id: 1,
    image: '/images/banners/Bannersdenkirs98.webp',
    title: 'Классика света',
    subtitle: 'Добро пожаловать в Вамлюстра',
    description: 'Denkirs Smart',
    buttonText: '/catalog/denkirs/lights/track-lights',
    headerColor: 'black',
  },
  {
    id: 2,
    image: '/images/banners/Bannersdenkirs99.webp',
    title: 'Классика света',
    subtitle: 'Добро пожаловать в Вамлюстра',
    description: 'Denkirs Smart',
    buttonText: '/catalog/denkirs/lights/track-lights',
    headerColor: 'black',
  },
  {
    id: 3,
    image: '/images/banners/Bannersdenkirs103.webp',
    title: 'Классика света',
    subtitle: 'Добро пожаловать в Вамлюстра',
    description: 'Denkirs Smart',
    buttonText: '/catalog/denkirs/lights/track-lights',
    headerColor: 'black',
  },
];

// --- STORES ---
const STORES = [
  {
    id: 1,
    title: "ТЦ Шоколад",
    address: "Реутов, МКАД, 2-й километр, ТЦ Шоколад, 3 этаж",
    phone: "+7 (966)-033-31-11",
    hours: "с 10:00 до 21:00",
    coords: [55.764483, 37.844517], 
  },
  {
    id: 2,
    title: "ТК Конструктор",
    address: "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.41.1, 2.19. Линия В, пав. 2.4",
    phone: "+7 (966)-033-31-11",
    hours: "с 10:00 до 21:00",
    coords: [55.583222, 37.710800], 
  }
];

// --- Categories (С ОБНОВЛЕННЫМИ ССЫЛКАМИ ИЗ HEADER) ---
const categories: CategoryItem[] = [
  {
    id: 1,
    title: 'Люстры',
    image: '/images/categories/lustry.jpg',
    link: '/catalog/chandeliers',
    markers: [
      { id: 101, top: '30%', left: '45%', query: 'DK4067' },
      { id: 102, top: '48%', left: '9%', query:'DK5060' },
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
      { id: 202, top: '3%', left: '65%', query: 'DK5740-SB' },
      { id: 203, top: '3%', left: '50%', query: 'DK5751-SB' },
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
    image: '/images/categories/elektroustanovohnoe.jpg',
    link: '/ElektroustnovohneIzdely/Vstraivaemy-series',
    markers: [
       { id: 301, top: '62%', left: '90%',query: 'Подсветка светодиодная встраиваемая VOLTUM' }
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
    image: '/images/categories/ylichnoeosveheny.jpg',
    link: '/catalog/outdoor-lights',
    markers: [
      { id: 301, top: '50%', left: '40%',query: 'O440FL-L18GF3K' }
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
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bannerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [popupProduct, setPopupProduct] = useState<any | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const [mapCenter, setMapCenter] = useState<number[]>([55.68, 37.77]);
  const [mapZoom, setMapZoom] = useState<number>(10);

  const TRANSITION_DURATION = 1500; 
  const AUTOPLAY_DELAY = 7000; 
  const MARQUEE_TEXT = "ДОБРО ПОЖАЛОВАТЬ МЫ РАБОТАЕМ КРУГЛОСУТОЧНО С 9:00 ДО 18:00  +7 (966)-033-31-11";

  useEffect(() => {
    const color = banners[currentBannerIndex].headerColor;
    const event = new CustomEvent('headerColorChange', { detail: { color } });
    window.dispatchEvent(event);
  }, [currentBannerIndex]);

  const nextBanner = useCallback(() => {
    if (isTransitioning || banners.length <= 1) return;
    setIsTransitioning(true);
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, [isTransitioning, banners.length]);

  useEffect(() => {
    bannerIntervalRef.current = setInterval(nextBanner, AUTOPLAY_DELAY);
    return () => {
      if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current);
    };
  }, [nextBanner]);

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

  const handleStoreClick = (coords: number[]) => {
    setMapCenter(coords);
    setMapZoom(15);
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
    <div className="w-full bg-white">
      <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
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
          @keyframes fade-in-down {
            from { opacity: 0; transform: translate(-50%, -10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out forwards;
          }
      `}</style>

      {/* --- HERO SLIDER --- */}
      <div className="relative h-[60vh] sm:h-[500px] lg:h-[120vh] w-full overflow-hidden bg-black">
        {banners.map((banner, index) => {
          const isActive = index === currentBannerIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                quality={90}
              />
              <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-44">
                <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pt-20">
                  <div className="max-w-4xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-[1.1] mb-6">
                      Ваш Комфорт <br /> с уютом
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-white uppercase tracking-wide">
                      ВАМЛЮСТРА - продавец <br/> умного освещения
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MARQUEE --- */}
      <div className="relative w-full bg-neutral-900 text-white overflow-hidden py-3 z-60 border-b border-neutral-800">
        <div className="flex w-full whitespace-nowrap hover:[animation-play-state:paused]">
          <div className="flex items-center flex-shrink-0 min-w-full animate-marquee">
             {[0, 1, 2].map((subItem) => (
                <span key={subItem} className="px-4 text-xs sm:text-sm font-medium tracking-widest uppercase">{MARQUEE_TEXT}</span>
             ))}
          </div>
          <div className="flex items-center flex-shrink-0 min-w-full animate-marquee">
             {[0, 1, 2].map((subItem) => (
                <span key={subItem} className="px-4 text-xs sm:text-sm font-medium tracking-widest uppercase">{MARQUEE_TEXT}</span>
             ))}
          </div>
        </div>
      </div>

      {/* --- SINGLE CATEGORY SLIDER WITH MARKERS --- */}
      <section className="relative max-w-[1720px] mx-auto z-30 mt-10 px-4 md:px-8 pb-12">
        <h2 className='text-black text-3xl md:text-4xl font-light tracking-tight mb-6'>ЧАСТЫЕ КАТЕГОРИИ</h2>
        
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[950px] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-lg group">
          
          <Link href={activeCategory.link} className="absolute inset-0 z-0 block cursor-pointer">
            <Image
              key={activeCategory.id}
              src={activeCategory.image}
              alt={activeCategory.title}
              fill
              className="object-cover transition-transform duration-700"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
          </Link>
          
          {/* ОБНОВЛЕННЫЙ СПИСОК ССЫЛОК */}
          {activeCategory.subList && (
            <div className="absolute bottom-20 md:bottom-24 left-6 md:left-12 z-20 max-w-[90%] md:max-w-[70%] pointer-events-none">
              <h3 className="text-white text-2xl md:text-4xl font-bold mb-4 tracking-tight drop-shadow-md">
                {activeCategory.title}
              </h3>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {activeCategory.subList.map((item, idx) => (
                   <li key={idx} className="pointer-events-auto">
                     <Link 
                        href={item.href}
                        className="text-neutral-300 text-sm md:text-lg font-medium tracking-wide 
                       transition-all duration-300 
                       hover:text-neutral-400 hover:translate-x-1"
                     >
                       {item.label}
                     </Link>
                   </li>
                ))}
              </ul>
            </div>
          )}
          
          {activeCategory.markers && activeCategory.markers.map((marker) => {
            const isPopupRight = marker.id === 102 || marker.id === 201;
            const isPopupBottom = marker.id === 203 || marker.id === 202;
            
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
                    <div className={`absolute w-full h-full rounded-full marker-pulse bg-blue-600 ${activeMarkerId === marker.id ? 'opacity-0' : 'opacity-75'}`}></div>
                    <div className={`w-5 h-5 rounded-full border-[3px] border-white shadow-lg relative z-10 transition-all duration-300 hover:scale-125 ${activeMarkerId === marker.id ? 'bg-black border-black' : 'bg-blue-600'}`}></div>
                    
                    {!activeMarkerId && marker.query && (
                      <div className="absolute left-full ml-3 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                        Смотреть товар
                      </div>
                    )}
                </div>

                {activeMarkerId === marker.id && (
                  <div 
                    className={`absolute z-50 w-[280px] sm:w-[320px] bg-white rounded-xl shadow-2xl p-4 cursor-default
                      ${isPopupRight 
                          ? 'left-full top-2 ml-4 animate-fade-in-right origin-top-left'
                          : isPopupBottom
                            ? 'top-full left-1/2 mt-4 animate-fade-in-down origin-top'
                            : 'right-full top-1/2 -translate-y-1/2 mr-4 animate-fade-in-left origin-right'
                      }
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={`absolute w-4 h-4 bg-white rotate-45 
                        ${isPopupRight 
                          ? 'top-4 -left-2' 
                          : isPopupBottom
                            ? '-top-2 left-1/2 -translate-x-1/2' 
                            : 'top-1/2 -right-2 -translate-y-1/2' 
                        }
                    `}></div>

                    {isLoadingProduct ? (
                        <div className="flex flex-col items-center justify-center h-[150px] text-gray-400 gap-2">
                            <FaSpinner className="animate-spin text-2xl text-blue-600" />
                            <span className="text-xs">Загрузка товара...</span>
                        </div>
                    ) : popupProduct ? (
                        <div className="relative z-10 flex flex-col gap-3">
                          <div className="relative w-full h-[180px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
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

                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium mb-1 uppercase">
                              {popupProduct.article ? `Арт. ${popupProduct.article}` : ''}
                            </span>
                            <Link href={`/products/${popupProduct.source}/${popupProduct.article}`} className="text-sm font-semibold text-gray-900 leading-tight mb-1 hover:underline">
                              {popupProduct.name}
                            </Link>
                            
                            {popupProduct.params && popupProduct.params.Watt && (
                                <p className="text-xs text-gray-500 mb-2">{popupProduct.params.Watt}</p>
                            )}
                            
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-lg font-bold text-black">
                                {popupProduct.price ? `${Number(popupProduct.price).toLocaleString('ru-RU')} ₽` : 'По запросу'}
                              </span>
                              
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                                <button className="text-gray-500 hover:text-black text-xs"><FaMinus /></button>
                                <span className="text-xs font-medium w-4 text-center">1</span>
                                <button className="text-gray-500 hover:text-black text-xs"><FaPlus /></button>
                              </div>
                            </div>
                            
                            <div className="text-[10px] text-gray-400 mt-1">
                              {popupProduct.stock ? `В наличии: ${popupProduct.stock} шт.` : 'Под заказ'}
                            </div>

                            <button className="mt-3 w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                                <FaShoppingBasket /> В корзину
                            </button>
                          </div>
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
            className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button 
            onClick={handleNextCategory}
            className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-black transition-all hover:scale-105 active:scale-95 border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex gap-2">
            {categories.map((_, idx) => (
               <div 
                 key={idx}
                 className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentCategoryIndex ? 'bg-white w-6' : 'bg-white/50'}`}
               />
            ))}
          </div>

        </div>
      </section>
    
      {/* --- MAP SECTION --- */}
      <section id="where-to-buy" className="px-6 max-w-[1420px] mx-auto md:px-16 py-12 md:py-20 scroll-mt-28">
        <h2 className='text-black text-3xl p-3 md:text-4xl font-light tracking-tight'>НАШИ МАГАЗИНЫ НА КАРТЕ</h2>
        <div className="flex flex-col lg:flex-row gap-8 lg:h-[600px]">
          {/* Левая колонка со списком */}
          <div className="w-full lg:w-1/3 flex flex-col order-1 lg:h-full">
            <div className="flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
              {STORES.map((store) => (
                <div 
                  key={store.id} 
                  className="flex-1 flex flex-col justify-center pb-6 border-b border-neutral-100 last:border-0 group cursor-pointer"
                  onClick={() => handleStoreClick(store.coords)}
                >
                  <h3 className="font-light tracking-tighter leading-[1.1] text-2xl text-black mb-1 group-hover:text-blue-600 transition-colors">{store.title}</h3>
                  <p className="text-lg font-light tracking-tighter leading-[1.1] mb-3 text-black">{store.address}</p>
                  <div className="flex flex-col sm:flex-row sm:gap-6 text-neutral-500 text-1xl font-light tracking-tighter leading-[1.1]">
                      <a href={`tel:${store.phone}`} className="hover:text-black transition-colors" onClick={e => e.stopPropagation()}>{store.phone}</a>
                      <span>{store.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Правая колонка с Картой */}
          <div className="w-full lg:w-[800px] h-[400px] lg:h-full bg-white overflow-hidden order-2 shadow-sm border border-neutral-200 relative">
            <div className="absolute inset-0 w-full h-full">
              <YMaps query={{ lang: 'ru_RU', apikey: '' }}>
                <YMap 
                  state={{ center: mapCenter, zoom: mapZoom }}
                  defaultState={{ center: [55.68, 37.77], zoom: 10 }} 
                  width="100%" 
                  height="100%"
                  className="w-full h-full"
                >
                  <ZoomControl options={{ position: { right: 10, top: 50 } }} />
                  <FullscreenControl />
                  {STORES.map((store) => (
                    <Placemark
                      key={store.id}
                      geometry={store.coords}
                      properties={{ 
                        balloonContentHeader: `<span style="font-weight: bold; font-size: 16px;">${store.title}</span>`,
                        balloonContentBody: `
                          <div style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">
                            <p style="margin-bottom: 8px;">${store.address}</p>
                            <div><strong>Тел:</strong> ${store.phone}</div>
                            <div><strong>Время:</strong> ${store.hours}</div>
                          </div>
                        `
                      }}
                      modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                      options={{ 
                        iconLayout: 'default#image', 
                        iconImageHref: '/images/banners/markerlogobanners.png', 
                        iconImageSize: [80, 80], 
                        iconImageOffset: [-40, -40],
                        hideIconOnBalloonOpen: false,
                        balloonOffset: [0, -45]
                      }}
                    />
                  ))}
                </YMap>
              </YMaps>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;