
"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiX, FiMenu } from 'react-icons/fi';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
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

  // 🔥 ИЗМЕНЕНИЕ 1: Создаем переменную, которая активна при скролле ИЛИ при открытом меню
  const isHeaderActive = scrolled || showDropdown !== null;

  // 🔥 ИЗМЕНЕНИЕ 2: Используем isHeaderActive вместо scrolled во всех стилях
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
        searchInputRef.current.focus();
    }
  }, [showSearch]);

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
    { title: 'Каталог', key: 'products', href: '/catalog/chandeliers' },
    { title: 'Серии', key: 'series', href: '/about' },
    { title: 'Производство', key: 'custom', href: '//about' },
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
        // 🔥 ИЗМЕНЕНИЕ 3: Здесь тоже используем isHeaderActive
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
            isHeaderActive 
            ? 'py-5 shadow-sm bg-white/95 backdrop-blur-sm border-gray-100' 
            : 'py-5 border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8 max-w-[1920px]">
          <div className="flex items-center justify-between">
            
            {/* 1. LOGO */}
            <div className="flex-shrink-0 z-20">
              <Link href="/">
                <div className={`flex flex-col items-center justify-center leading-none transition-colors duration-300 ${textColorClass}`}>
                   <h1 className='flex font-bold text-2xl tracking-[0.15em]'>ВАМЛЮСТРА</h1>
                </div>
              </Link>
            </div>

            {/* 2. NAVIGATION */}
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
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl transition-all duration-300 ${showSearch ? 'opacity-100 visible top-[14px]' : 'opacity-0 invisible top-[10px]'}`}>
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Поиск..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-transparent py-2 text-lg outline-none text-start font-light ${searchInputClass}`}
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

            {/* 4. ICONS */}
            <div className={`flex items-center gap-6 z-20 transition-colors duration-300 ${textColorClass}`}>
                <button className={`xl:hidden p-1 ${hoverColorClass}`}><FiMenu size={22} /></button>
                <Link href="/profile" className={`hidden md:block p-1 ${hoverColorClass}`}><FiUser size={22} /></Link>
                <button onClick={() => setShowSearch(!showSearch)} className={`p-1 ${hoverColorClass} ${showSearch ? 'opacity-100' : 'opacity-100'}`}><FiSearch size={22} /></button>
                <div ref={cartIconRef} className={`relative p-1 cursor-pointer ${hoverColorClass}`}>
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

      {/* --- CATALOG MEGA MENU --- */}
      <div 
        ref={dropdownRef}
        onMouseLeave={() => setShowDropdown(null)}
        className={`fixed top-[70px] left-0 w-full bg-white text-black z-40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out border-t border-gray-100
        ${showDropdown === 'products' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}
      >
        {/* Остальная часть меню без изменений */}
        <div className="container mx-auto px-8 py-10 relative overflow-hidden min-h-[600px]">
            
            <div className="grid grid-cols-4 gap-x-12 gap-y-10 relative z-10">
                {/* 1. Декоративное */}
                <div>
                    <div className="mb-10">
                        <MenuHeader className=''>Декоративное</MenuHeader>
                        <div className="space-y-1">
                        <Link href="/catalog/chandeliers" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Люстры</Link>
                        <div className='pl-3 space-y-1 border-l border-gray-100'>
                            <MenuLink href="/catalog/barra-adapters" className="!text-xs !text-gray-500">Люстры потолочные</MenuLink>
                            <MenuLink href="/catalog/barra-adapters" className="!text-xs !text-gray-500">Люстры подвесные</MenuLink>
                            <MenuLink href="/catalog/barra-adapters" className="!text-xs !text-gray-500">Люстры на штанге</MenuLink>
                            <MenuLink href="/catalog/barra-adapters" className="!text-xs !text-gray-500">Люстры каскадные</MenuLink>
                        </div>
                          
                        <div>
                            <Link href="/catalog/barra" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Трековый светильники</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/barra-adapters" className="!text-xs !text-gray-500">Магнитный трековый светильник</MenuLink>
                                <MenuLink href="/catalog/barra-lights" className="!text-xs !text-gray-500">Умный трековый светильник</MenuLink>
                                <MenuLink href="/catalog/barra-bus" className="!text-xs !text-gray-500">Уличный трековый светильник</MenuLink>
                            </div>
                        </div>

                        <div>
                            <Link href="/catalog/due" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Подвесные светильники</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/due-lights" className="!text-xs !text-gray-500">Встраиваемые светильники</MenuLink>
                                <MenuLink href="/catalog/due-accessories" className="!text-xs !text-gray-500">Накладные светиильники</MenuLink>
                            </div>
                        </div>

                        <div>
                            <Link href="/catalog/due" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Бра</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/due-lights" className="!text-xs !text-gray-500">Настенные светильники</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/due" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Торшеры</Link>
                        </div>
                        <div>
                            <Link href="/catalog/due" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Настольные лампы</Link>
                        </div>
                        </div>
                    </div>
                </div>

                {/* 2. Функциональное */}
                <div>
                    <MenuHeader>Функциональное</MenuHeader>
                    <div className="space-y-5">
                    <div>
                            <Link href="/catalog/uno" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Светодиодные ленты</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/uno-lights" className="!text-xs !text-gray-500">Трековые светильники</MenuLink>
                                <MenuLink href="/catalog/uno-bus" className="!text-xs !text-gray-500">Шинопровод и аксессуары</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/uno" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Лампа и LED</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/uno-lights" className="!text-xs !text-gray-500">Трековые светильники</MenuLink>
                                <MenuLink href="/catalog/uno-bus" className="!text-xs !text-gray-500">Шинопровод и аксессуары</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/uno" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Аксессуары</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/uno-lights" className="!text-xs !text-gray-500">Трековые светильники</MenuLink>
                                <MenuLink href="/catalog/uno-bus" className="!text-xs !text-gray-500">Шинопровод и аксессуары</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/uno" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Профили</Link>
                            <div className="pl-3 space-y-1 border-l border-gray-100">
                                <MenuLink href="/catalog/uno-lights" className="!text-xs !text-gray-500">Трековые светильники</MenuLink>
                                <MenuLink href="/catalog/uno-bus" className="!text-xs !text-gray-500">Шинопровод и аксессуары</MenuLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Уличное */}
                <div>
                    <MenuHeader>Уличное</MenuHeader>
                    <div>
                        <Link href="/catalog/uno" className="text-[13px] font-bold text-gray-800 hover:text-black block mb-1">Уличные светильники</Link>
                        <div className="pl-3 space-y-1 border-l border-gray-100">
                            <MenuLink href="/catalog/uno-lights" className="!text-xs !text-gray-500">Ландшафтные светильники</MenuLink>
                        </div>
                    </div>     
                </div>

                {/* 4. Ссылки Sale/New */}
                <div className="flex flex-col items-start z-20">
                    <Link href="/new" className="block text-2xl font-bold mt-2 uppercase tracking-wider hover:text-red-600 transition-colors">Новинки</Link>
                    <Link href="/coming-soon" className="block text-xl mt-2 font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">В пути</Link>
                    <Link href="/sale" className="block text-2xl mt-2 font-bold uppercase tracking-wider text-red-600 hover:text-black transition-colors">Sale</Link>
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
        {/* 
            ГРАДИЕНТ:
            absolute inset-0 -> растягивает блок на всю картинку
            bg-gradient-to-l -> направление "налево" (то есть белый начинается СПРАВА)
            from-white -> начало градиента (белый)
            via-white/20 -> промежуточный цвет (легкая белизна)
            to-transparent -> конец градиента (прозрачный)
        */}
        <div className='absolute inset-0 bg-gradient-to-l from-white via-white/10 to-transparent'></div>
        
        {/* Если вы имели в виду плавный переход изображения в белый фон МЕНЮ (слева),
            то замените bg-gradient-to-l на bg-gradient-to-r */}
    </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Header;