
"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiX, FiMenu, FiChevronDown, FiChevronRight } from 'react-icons/fi'; // 🔥 Добавил иконки стрелок
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  // 🔥 НОВОЕ: Состояние для мобильного меню
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 🔥 НОВОЕ: Состояние для открытия подменю "Каталог" внутри мобильного меню
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  
  // Refs
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cart State
  const [cartCount, setCartCount] = useState(0);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  
  // Cart Hover
  const [isCartHoverOpen, setIsCartHoverOpen] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const formatCurrency = (value: number) => `${new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(value || 0)))} ₽`;

  // --- Logic for Text Colors ---
  const isMainPage = pathname === '/';

  // Переменная активна при скролле ИЛИ при открытом меню (десктоп) ИЛИ при открытом поиске (чтобы текст стал черным на белом фоне)
  const isHeaderActive = scrolled || showDropdown !== null || showSearch || mobileMenuOpen;

  const textColorClass = isHeaderActive 
    ? 'text-black' 
    : (isMainPage ? 'text-black' : 'text-black'); 

  const hoverColorClass = isHeaderActive
    ? 'hover:text-neutral-600'
    : (isMainPage ? 'hover:text-neutral-600' : 'hover:text-neutral-600');

  const underlineColorClass = isHeaderActive 
    ? 'bg-black' 
    : (isMainPage ? 'bg-white' : 'bg-black');

  const searchInputClass = isHeaderActive
    ? 'text-black placeholder:text-gray-500 border-black/20'
    : (isMainPage 
        ? 'text-black placeholder:text-gray-400 border-white/50' 
        : 'text-black placeholder:text-gray-500 border-black/20');

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            setCartCount(cart?.products?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0);
        }
    } catch {}

    const handleCartUpdate = (e: any) => {
        setCartCount(e.detail.count);
        if (e.detail.animate) {
            setIsCartAnimating(true);
            setTimeout(() => setIsCartAnimating(false), 600);
        }
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
        // Небольшая задержка для анимации
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    }
  }, [showSearch]);

  // Закрываем мобильное меню при смене страницы
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  }, [pathname]);

  // Блокируем скролл страницы при открытом мобильном меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const id = setTimeout(async () => {
      if (searchAbortRef.current) searchAbortRef.current.abort();
      const ac = new AbortController();
      searchAbortRef.current = ac;
      try {
        const resp = await fetch(`${NEXT_PUBLIC_API_URL}/api/products/search?name=${encodeURIComponent(searchQuery)}`, { signal: ac.signal });
        if (resp.ok) {
           const data = await resp.json();
           setSearchResults(data.products ? data.products.slice(0, 8) : []);
        }
      } catch (e) {}
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        router.push(`/search/${encodeURIComponent(searchQuery)}`);
        setShowSearch(false);
    }
  };

  const menuItems = [
    { title: 'Каталог', key: 'products', href: '/catalog/chandeliers' }, // Этот пункт обрабатываем отдельно в мобилке
    { title: 'Серии', key: 'series', href: '/about' },
    { title: 'Производство', key: 'custom', href: '/about' },
    { title: 'Сотрудничество', key: 'partners', href: '/about' },
    { title: 'Материалы', key: 'materials', href: '/about' },
    { title: 'О компании', key: 'about', href: '/about' },
    { title: 'Новости', key: 'news', href: '/about' },
    { title: 'Контакты', key: 'contacts', href: '/about' },
  ];

  const MenuLink = ({ href, children, className = "" }: { href: string, children: React.ReactNode, className?: string }) => (
    <Link href={href} className={`block text-[13px] leading-12 text-black hover:text-black hover:translate-x-1 transition-all duration-200 ${className}`}>
        {children}
    </Link>
  );

  const MenuHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <h3 className={`font-bold text-[24px] uppercase tracking-wide text-black mb-4 ${className}`}>
        {children}
    </h3>
  );

  return (
    <>
      <header 
        ref={headerRef} 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
            isHeaderActive 
            ? 'py-4 sm:py-5 shadow-sm bg-white/95 backdrop-blur-sm border-gray-100' 
            : 'py-4 sm:py-5 border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8 max-w-[1920px]">
          <div className="flex items-center justify-between relative">
            
            {/* 1. LOGO */}
            {/* 🔥 Скрываем логотип, если открыт поиск на мобильном, чтобы не мешал */}
            <div className={`flex-shrink-0 z-20 transition-opacity duration-300 ${showSearch ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
              <Link href="/">
                <div className={`flex flex-col items-center justify-center leading-none transition-colors duration-300 ${textColorClass}`}>
                   <h1 className='flex font-bold text-xl sm:text-2xl tracking-[0.15em]'>ВАМЛЮСТРА</h1>
                </div>
              </Link>
            </div>

            {/* 2. NAVIGATION (Desktop) */}
            <div className={`hidden xl:flex items-center justify-center absolute left-0 right-0 mx-auto w-auto transition-opacity duration-300 ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <nav className="flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.key} 
                            href={item.href}
                            className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors relative group py-4 ${textColorClass} ${hoverColorClass}`}
                            onMouseEnter={() => {
                                if (item.key === 'products') setShowDropdown('products');
                                else setShowDropdown(null);
                            }}
                        >
                            {item.title}
                            <span className={`absolute bottom-3 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 ${underlineColorClass}`}></span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* 3. SEARCH INPUT */}
            {/* 🔥 ИЗМЕНЕНИЕ: Полностью переработана логика отображения для мобильных.
                Теперь это абсолютный слой на весь хедер (inset-0), который перекрывает всё. */}
            <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-30
                ${showSearch 
                    ? 'opacity-100 visible bg-white md:bg-transparent' // На мобильном белый фон
                    : 'opacity-0 invisible pointer-events-none'}`}
            >
                <div className="container mx-auto px-4 w-full md:max-w-2xl relative">
                    <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Поиск..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            // 🔥 Убрал text-center для мобильных, чтобы было удобно печатать
                            className={`w-full bg-transparent py-2 text-lg outline-none font-light pr-10 md:pr-0 ${searchInputClass}`}
                        />
                        <button 
                            type="button" 
                            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 transition-colors ${textColorClass} ${hoverColorClass}`}
                        >
                            <FiX size={24} />
                        </button>
                    </form>
                </div>
            </div>

            {/* 4. ICONS */}
            <div className={`flex items-center gap-4 sm:gap-6 z-20 transition-colors duration-300 ${textColorClass}`}>
                {/* 🔥 Бургер теперь переключает стейт mobileMenuOpen */}
                {/* Скрываем бургер, если открыт поиск */}
                <button 
                    onClick={() => setMobileMenuOpen(true)} 
                    className={`xl:hidden p-1 ${hoverColorClass} ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <FiMenu size={22} />
                </button>
                
                <Link href="" className={`hidden md:block cursor-not-allowed p-1 ${hoverColorClass}`}><FiUser size={22} /></Link>
                
                {/* Кнопка поиска. Если поиск уже открыт - не показываем саму иконку поиска (крестик внутри формы закроет) */}
                <button 
                    onClick={() => setShowSearch(true)} 
                    className={`p-1 ${hoverColorClass} ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <FiSearch size={22} />
                </button>
                
                {/* Корзина. Скрываем на мобильном при поиске, чтобы не мешала */}
                <div ref={cartIconRef} className={`relative p-1 cursor-pointer ${hoverColorClass} ${showSearch ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
                    <Link href="/cart">
                        <FiShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY (DRAWER) --- */}
      {/* 🔥 НОВОЕ: Полноэкранное меню для мобильных устройств */}
      <div className={`fixed inset-0 z-[60] xl:hidden pointer-events-none`}>
        {/* Затемнение фона */}
        <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} 
            onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Сама панель меню */}
        <div className={`absolute top-0 left-0 w-[85%] sm:w-[350px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Шапка меню */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="font-bold text-lg uppercase tracking-wider">Меню</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Ссылки */}
                <div className="flex-1 py-6 px-6 overflow-y-auto">
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                {item.key === 'products' ? (
                                    // Логика для Каталога (Аккордеон)
                                    <div>
                                        <div 
                                            onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                                            className="flex items-center justify-between w-full text-lg font-bold text-black cursor-pointer"
                                        >
                                            <span className="uppercase tracking-widest">{item.title}</span>
                                            {mobileCatalogOpen ? <FiChevronDown /> : <FiChevronRight />}
                                        </div>
                                        
                                        {/* Подменю каталога */}
                                        <div className={`mt-2 ml-2 space-y-3 border-l-2 border-gray-100 pl-4 overflow-hidden transition-all duration-300 ${mobileCatalogOpen ? 'max-h-[1000px] opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                                            <Link href="/catalog/chandeliers" className="block text-sm font-medium text-gray-600 hover:text-black">Люстры</Link>
                                            <Link href="/catalog/lights/track-lights" className="block text-sm font-medium text-gray-600 hover:text-black">Трековые светильники</Link>
                                            <Link href="/catalog/lights/pendant-lights" className="block text-sm font-medium text-gray-600 hover:text-black">Подвесные светильники</Link>
                                            <Link href="/catalog/lights/wall-lights" className="block text-sm font-medium text-gray-600 hover:text-black">Бра</Link>
                                            <Link href="/catalog/floor-lamps" className="block text-sm font-medium text-gray-600 hover:text-black">Торшеры</Link>
                                            <Link href="/catalog/table-lamps" className="block text-sm font-medium text-gray-600 hover:text-black">Настольные лампы</Link>
                                            <Link href="/catalog/led-strips" className="block text-sm font-medium text-gray-600 hover:text-black">LED ленты</Link>
                                            <Link href="/catalog/outdoor-light" className="block text-sm font-medium text-gray-600 hover:text-black">Уличное освещение</Link>
                                            <Link href="/Configurator" className="block text-sm font-bold text-red-500 hover:text-red-700 mt-2">Электроустановочное</Link>
                                        </div>
                                    </div>
                                ) : (
                                    // Обычные ссылки
                                    <Link 
                                        href={item.href} 
                                        className="block text-lg font-bold uppercase tracking-widest text-black hover:text-gray-600"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Футер меню */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <Link href="/cart" className="flex items-center gap-3 text-black font-medium mb-4">
                        <FiShoppingCart size={20} />
                        <span>Корзина ({cartCount})</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-3 text-black font-medium">
                        <FiUser size={20} />
                        <span>Личный кабинет</span>
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* --- DESKTOP CATALOG MEGA MENU (Оставил без изменений, только проверил ref) --- */}
      <div 
        ref={dropdownRef}
        onMouseLeave={() => setShowDropdown(null)}
        className={`hidden xl:block fixed top-[70px] left-0 w-full bg-white text-black z-40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out border-t border-gray-100
        ${showDropdown === 'products' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}
      >
        <div className="container mx-auto px-8 py-10 relative overflow-hidden min-h-[600px]">
            <div className="grid grid-cols-4 gap-x-12 gap-y-10 relative z-10">
                {/* ... (Ваш контент мега-меню остался без изменений) ... */}
                {/* 1. Декоративное */}
                <div>
                    <div className="mb-10">
                        <MenuHeader className=''>Декоративное</MenuHeader>
                        <div className="space-y-1">
                        <Link href="/catalog/chandeliers" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Люстры</Link>
                        <div className='pl-3 space-y-1 border-l border-gray-100'>
                            <MenuLink href="/catalog/chandeliers/ceiling-chandeliers" className="!text-xs !text-gray-500">Люстры потолочные</MenuLink>
                            <MenuLink href="/catalog/chandeliers/pendant-chandeliers" className="!text-xs !text-gray-500">Люстры подвесные</MenuLink>
                            <MenuLink href="/catalog/chandeliers/rod-chandeliers" className="!text-xs !text-gray-500">Люстры на штанге</MenuLink>
                            <MenuLink href="/catalog/chandeliers/cascade-chandeliers" className="!text-xs !text-gray-500">Люстры каскадные</MenuLink>
                        </div>
                          
                        <div>
                            <Link href="/catalog/lights/track-lights" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Трековый светильники</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/lights/magnit-track-lights" className="!text-xs !text-gray-500">Магнитный трековый светильник</MenuLink>
                                <MenuLink href="/catalog/lights/track-lights/smart" className="!text-xs !text-gray-500">Умный трековый светильник</MenuLink>
                                <MenuLink href="/catalog/lights/track-lights/outdoor" className="!text-xs !text-gray-500">Уличный трековый светильник</MenuLink>
                            </div>
                        </div>

                        <div>
                            <Link href="/catalog/lights/pendant-lights" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Подвесные светильники</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/lights/recessed-lights" className="!text-xs !text-gray-500">Встраиваемые светильники</MenuLink>
                                <MenuLink href="/catalog/lights/surface-mounted-light" className="!text-xs !text-gray-500">Накладные светиильники</MenuLink>
                            </div>
                        </div>

                        <div>
                            <Link href="/catalog/lights/wall-lights" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Бра</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/lights/wall-lights" className="!text-xs !text-gray-500">Настенные светильники</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/floor-lamps" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Торшеры</Link>
                        </div>
                        <div>
                            <Link href="/catalog/table-lamps" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Настольные лампы</Link>
                        </div>
                        </div>
                    </div>
                </div>

                {/* 2. Функциональное */}
                <div>
                    <MenuHeader>Функциональное</MenuHeader>
                    <div className="space-y-5">
                    <div>
                            <Link href="/catalog/led-strips" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Светодиодные ленты</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                            <MenuLink href="/catalog/led-lamp" className="!text-xs !text-gray-500">Лампа и LED</MenuLink>
                            <MenuLink href="/catalog/accessories" className="!text-xs !text-gray-500">Аксессуары</MenuLink>
                            <MenuLink href="/catalog/led-strip-profiles" className="!text-xs !text-gray-500">Профили разных типов</MenuLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Уличное */}
                <div>
                    <MenuHeader>Уличное</MenuHeader>
                    <div>
                        <Link href="/catalog/outdoor-light" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Уличные светильники</Link>
                        <div className="pl-3 space-y-1 border-l border-gray-100">
                            <MenuLink href="/catalog/outdoor-lights/landscape-lights" className="!text-xs !text-gray-500">Ландшафтные</MenuLink>
                            <MenuLink href="/catalog/outdoor-lights/park-lights" className="!text-xs !text-gray-500">Парковые</MenuLink>
                            <MenuLink href="/catalog/outdoor-lights/ground-lights" className="!text-xs !text-gray-500">Грунтовые светильники</MenuLink>
                            <MenuLink href="/catalog/outdoor-lights/outdoor-wall-lights" className="!text-xs !text-gray-500">Настенно уличные светильники</MenuLink>
                        </div>
                    </div>     
                </div>

                {/* 4. Ссылки Sale/New */}
                <div className="flex flex-col items-start z-20">
                    <Link href="/Configurator" className="block text-2xl font-bold mt-2 uppercase tracking-wider hover:text-red-600 transition-colors">Электроустановочное</Link>
                    <MenuLink href="/ElektroustnovohneIzdely/Vstraivaemy-series" className="!text-xs !text-gray-500">Встраиваемые серии</MenuLink>
                </div>
            </div>
            
            {/* 5. ИЗОБРАЖЕНИЕ */}
            <div className='absolute bottom-0 top-0 right-0 z-0 pointer-events-none'>
                <div className="relative h-full w-[600px]">
                    <img 
                        className='w-full h-full object-cover object-right-bottom opacity-100' 
                        src='/images/banners/Снимок экрана 2025-11-09 103838.png' 
                        alt='' 
                    />
                    <div className='absolute inset-0 bg-gradient-to-l from-white via-white/10 to-transparent'></div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
