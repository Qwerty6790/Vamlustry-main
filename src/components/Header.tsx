
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
// Используем Fa иконки для залитого стиля (как на картинке)
import { FaUser, FaHeart, FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { FiChevronDown, FiChevronRight, FiArrowRight, FiX } from 'react-icons/fi';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

// --- СПИСОК КАТЕГОРИЙ ---
const categoriesList = [
  { name: 'Люстра', href: '/catalog/chandeliers' },
  { name: 'Люстра потолочные', href: '/catalog/chandeliers/ceiling-chandeliers' },
  { name: 'Люстра подвесные', href: '/catalog/chandeliers/pendant-chandeliers' },
  { name: 'Люстра на штанге', href: '/catalog/chandeliers/rod-chandeliers' },
  { name: 'Люстра каскадные', href: '/catalog/chandeliers/cascade-chandeliers' },
  { name: 'Трековый светильник', href: '/catalog/lights/track-lights' },
  { name: 'Магнитный трековый светильник ', href: '/catalog/lights/magnit-track-lights' },
  { name: 'Умный трековый светильник', href: '/catalog/lights/track-lights/smart' },
  { name: 'Уличные трековые', href: '/catalog/lights/track-lights/outdoor' },
  { name: 'Подвесные светильники', href: '/catalog/lights/pendant-lights' },
  { name: 'Встраиваемые светильники', href: '/catalog/lights/recessed-lights' },
  { name: 'Накладные светильники', href: '/catalog/lights/surface-mounted-light' },
  { name: 'Бра', href: '/catalog/lights/wall-lights' },
  { name: 'Настенные светильники', href: '/catalog/lights/wall-lights' },
  { name: 'Торшеры', href: '/catalog/floor-lamps' },
  { name: 'Настольные лампы', href: '/catalog/table-lamps' },
  { name: 'Светодиодные ленты', href: '/catalog/led-strips' },
  { name: 'Лампа и LED', href: '/catalog/led-lamp' },
  { name: 'Аксессуары', href: '/catalog/accessories' },
  { name: 'Профили для ленты', href: '/catalog/led-strip-profiles' },
  { name: 'Уличные светильники', href: '/catalog/outdoor-lights?page=1' },
  { name: 'Ландшафтные светильники', href: '/catalog/outdoor-lights/landscape-lights' },
  { name: 'Парковые светильники', href: '/catalog/outdoor-lights/park-lights' },
  { name: 'Грунтовые светильники', href: '/catalog/outdoor-lights/ground-lights' },
  { name: 'Настенно-уличные', href: '/catalog/outdoor-lights/outdoor-wall-lights' },
  { name: 'Электроустановочные изделия', href: '/ElektroustnovohneIzdely/Vstraivaemy-series' },
];

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

type SuggestionItem = 
  | { type: 'category'; name: string; href: string }
  | { type: 'keyword'; name: string };

const Header = () => {
  // UI State
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [foundCategories, setFoundCategories] = useState<SuggestionItem[]>([]);
  const [defaultProducts, setDefaultProducts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Cart State
  const [cartCount, setCartCount] = useState(0);

  // Dynamic Color
  const [dynamicColor, setDynamicColor] = useState<'black' | 'white'>('white');
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  
  const router = useRouter();
  const pathname = usePathname();

  // --- STYLE CALCULATION ---
  const isMainPage = pathname === '/';
  const isHeaderActive = scrolled || showDropdown !== null || showSearch || mobileMenuOpen;
  const isTransparentMode = isMainPage && !isHeaderActive;
  const currentTextColor = isTransparentMode ? 'white' : 'black';

  const textColorClass = currentTextColor === 'white' ? 'text-white' : 'text-[#4a4a4a]'; // Чуть более серый для иконок на белом
  const hoverColorClass = currentTextColor === 'white' ? 'hover:text-gray-300' : 'hover:text-black';
  const logoColorClass = currentTextColor === 'white' ? 'text-white' : 'text-black';
  const underlineColorClass = currentTextColor === 'white' ? 'bg-white' : 'bg-black';
  const searchInputClass = 'text-black placeholder:text-gray-300 border-b border-gray-200 focus:border-black transition-colors';

  // --- EFFECTS ---
  useEffect(() => {
    const handleHeaderColorChange = (e: any) => {
        if (e.detail && e.detail.color) setDynamicColor(e.detail.color);
    };
    window.addEventListener('headerColorChange', handleHeaderColorChange);
    return () => window.removeEventListener('headerColorChange', handleHeaderColorChange);
  }, []);

  useEffect(() => {
    if (!isMainPage) setDynamicColor('black');
  }, [isMainPage]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            setCartCount(cart?.products?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0);
        }
    } catch {}
    const handleCartUpdate = (e: any) => setCartCount(e.detail.count);
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // RANDOM PRODUCTS LOADER
  useEffect(() => {
    const fetchDefaultProducts = async () => {
        try {
            const keywords = ['Люстра', 'Бра', 'Торшер'];
            const randomIndexes: number[] = [];
            while(randomIndexes.length < 1) {
                const r = Math.floor(Math.random() * keywords.length);
                if(randomIndexes.indexOf(r) === -1) randomIndexes.push(r);
            }
            const promises = randomIndexes.map(idx => 
                fetch(`${NEXT_PUBLIC_API_URL}/api/products/search?name=${encodeURIComponent(keywords[idx])}`).then(res => res.json())
            );
            const results = await Promise.all(promises);
            let combinedProducts: any[] = [];
            results.forEach(data => {
                if(data.products && Array.isArray(data.products)) {
                    combinedProducts = [...combinedProducts, ...data.products];
                }
            });
            const uniqueProducts = Array.from(new Map(combinedProducts.map(item => [item._id || item.id, item])).values());
            setDefaultProducts(uniqueProducts.sort(() => 0.5 - Math.random()).slice(0, 4));
        } catch (error) {
            console.error("Error fetching default products:", error);
        }
    };
    fetchDefaultProducts();
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 100);
    else if (!showSearch) { setSearchQuery(''); }
  }, [showSearch]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen || showSearch) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [mobileMenuOpen, showSearch]);

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    const lowerQuery = trimmedQuery.toLowerCase();
    if (!trimmedQuery) {
        setFoundCategories([]);
    } else {
        const matchedCats = categoriesList
            .filter(c => c.name.toLowerCase().includes(lowerQuery))
            .slice(0, 5)
            .map(c => ({ type: 'category' as const, ...c }));
        setFoundCategories(matchedCats);
    }
    if (!trimmedQuery) { 
        setSearchResults(defaultProducts); 
        setIsSearching(false); 
        return; 
    }
    const id = setTimeout(async () => {
      if (searchAbortRef.current) searchAbortRef.current.abort();
      const ac = new AbortController();
      searchAbortRef.current = ac;
      setIsSearching(true);
      try {
        const resp = await fetch(`${NEXT_PUBLIC_API_URL}/api/products/search?name=${encodeURIComponent(trimmedQuery)}`, { signal: ac.signal });
        if (resp.ok) {
           const data = await resp.json();
           const rawProducts = data.products || [];
           const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 0);
           const strictFilteredProducts = rawProducts.filter((p: any) => {
               const name = p.name ? p.name.toString().toLowerCase() : '';
               const article = p.article ? p.article.toString().toLowerCase() : '';
               return queryWords.every(word => name.includes(word)) || article.startsWith(lowerQuery);
           });
           setSearchResults(strictFilteredProducts.slice(0, 6)); 
        }
      } catch (e: any) {
          if (e.name !== 'AbortError') console.error("Search error:", e);
      } finally {
          if (!searchAbortRef.current?.signal.aborted) setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, defaultProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { router.push(`/search/${encodeURIComponent(searchQuery.trim())}`); setShowSearch(false); }
  };

  const handleCategoryClick = (href: string) => {
      router.push(href);
      setShowSearch(false);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/#where-to-buy') {
        e.preventDefault();
        const scrollToMap = () => {
            const target = document.getElementById('where-to-buy');
            if (target) {
                setMobileMenuOpen(false);
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        };
        if (pathname === '/') scrollToMap();
        else router.push('/#where-to-buy');
    }
  };

  // --- MENU ITEMS ---
  const menuItems = [
    { title: 'Каталог', key: 'products', href: '/catalog/chandeliers' },
    { title: 'Где купить', key: 'shops', href: '/#where-to-buy' }, 
    { title: 'Производство', key: 'custom', href: '/about' },
    { title: 'Сотрудничество', key: 'partners', href: '/about' },
    { title: 'О компании', key: 'about', href: '/about' },
  ];

  const MenuLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="block text-[17px] leading-12 pl-1 text-black hover:text-black hover:translate-x-1 transition-all duration-200">{children}</Link>
  );
  const MenuHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-bold text-[25px] uppercase tracking-wide text-black mb-6">{children}</h3>
  );
  const MobileSubLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="block text-[20px] text-black hover:text-black py-1">{children}</Link>
  );

  // Стили для элемента меню (Иконка + Текст)
  const iconItemClass = `group flex flex-col items-center justify-center gap-[2px] cursor-pointer transition-opacity hover:opacity-70 ${textColorClass}`;
  const iconTextClass = "text-[11px] font-medium leading-none mt-1 whitespace-nowrap";

  return (
    <>
      <header 
        ref={headerRef} 
        className={`fixed top-0 left-0   w-full z-50 transition-all duration-300  ${
            isHeaderActive 
            ? 'py-3 sm:py-5 shadow-sm  bg-white/95 backdrop-blur-sm border-gray-100' 
             : 'py-4 sm:py-5'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8 max-w-[1420px]">
          <div className="flex items-center justify-between relative">
            
            {/* LOGO */}
            <div className={`flex-shrink-0 z-20 transition-opacity duration-300 ${showSearch ? 'opacity-0 md:opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <Link href="/">
                <div className={`flex flex-col items-center justify-center leading-none transition-colors duration-300 ${logoColorClass}`}>
                   <h1 className='flex font-bold text-xl sm:text-2xl tracking-[0.15em]'>ВАМЛЮСТРА</h1>
                </div>
              </Link>
            </div>

            {/* NAVIGATION (Desktop) */}
            <div className={`hidden xl:flex items-center justify-center absolute left-0 right-0 mx-auto w-auto transition-opacity duration-300 ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <nav className="flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.key} 
                            href={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className={`text-[13px] font-bold uppercase tracking-[0.1em] transition-colors relative group py-4 ${currentTextColor === 'white' ? 'text-white hover:text-gray-300' : 'text-black hover:text-neutral-600'}`}
                            onMouseEnter={() => setShowDropdown(item.key === 'products' ? 'products' : null)}
                        >
                            {item.title}
                            <span className={`absolute bottom-3 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 ${underlineColorClass}`}></span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* RIGHT ICONS AREA */}
            <div className={`flex items-center z-20 transition-all duration-300 ml-auto ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Mobile/Tablet View (Simplified) */}
                <div className="flex xl:hidden gap-5 items-center">
                    <button onClick={() => setShowSearch(true)} className={`${textColorClass} hover:opacity-70`}>
                        <FaSearch size={22} />
                    </button>
                    <Link href="/cart" className={`relative ${textColorClass} hover:opacity-70`}>
                         <FaShoppingCart size={22} />
                         {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                     <button onClick={() => setMobileMenuOpen(true)} className={`${textColorClass} hover:opacity-70`}>
                        <FaBars size={22} />
                    </button>
                </div>

                {/* Desktop View (Full Style like Image) */}
                <div className="hidden xl:flex items-center gap-7">
                    
                    {/* Поиск */}
                    <button onClick={() => setShowSearch(true)} className={iconItemClass}>
                        <FaSearch size={20} />
                        
                    </button>

                    {/* Войти */}
                    <Link href="#" className={iconItemClass}>
                        <FaUser size={20} />
                        
                    </Link>

                    {/* Избранное */}
                    <Link href="#" className={iconItemClass}>
                        <FaHeart size={20} />
                        
                    </Link>

                    {/* Мой заказ (Корзина) */}
                    <Link href="/cart" className={iconItemClass}>
                        <div className="relative">
                            <FaShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className={`
                                    absolute -top-2 -right-2 
                                    flex items-center justify-center 
                                    h-[16px] min-w-[16px] px-[2px]
                                    text-[9px] font-bold leading-none
                                    rounded-full border-2 
                                    ${currentTextColor === 'white' 
                                        ? 'bg-white text-black ' 
                                        : 'bg-[#D62828] text-white border-white'
                                    }
                                `}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        
                    </Link>

                </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- SEARCH OVERLAY --- */}
      <div className={`fixed inset-0 bg-white z-[100] transition-all duration-300 flex flex-col pt-[30px] sm:pt-[20px] px-4 ${showSearch ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="container mx-auto max-w-[1400px] h-full flex flex-col relative">
            <div className="flex items-center justify-between mb-8 flex-shrink-0 relative">
                 <button onClick={() => setShowSearch(false)} className="absolute -right-2 -top-2 p-2 text-gray-400 hover:text-black transition-colors z-50">
                    <FiX size={32} />
                 </button>
                 <form onSubmit={handleSearchSubmit} className="w-full mr-12">
                      <div className="relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
                           <FaSearch size={22} />
                        </div>
                        <input 
                            ref={searchInputRef} 
                            type="text" 
                            placeholder="Найти товары..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className={`w-full bg-transparent text-black py-4 pl-12 pr-4 text-2xl outline-none font-light ${searchInputClass}`} 
                        />
                      </div>
                 </form>
            </div>
            <div className={`w-full flex-1 overflow-y-auto pb-10 transition-all duration-500 ease-out custom-scrollbar ${showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                    <div>
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
                            <span className="text-xl md:text-2xl text-gray-800 font-light">
                                {isSearching ? 'Поиск...' : `${searchResults.length} товара`}
                            </span>
                            {searchQuery && searchResults.length > 0 && (
                                <Link href={`/search/${encodeURIComponent(searchQuery)}`} className="text-sm font-medium text-gray-800 hover:text-black flex items-center gap-1">
                                    Показать все <FiChevronRight />
                                </Link>
                            )}
                        </div>
                        <div className="flex flex-col gap-6">
                             {isSearching ? (
                                <div className="py-10 text-gray-300">Загрузка...</div>
                             ) : searchResults.length > 0 ? (
                                searchResults.map((product) => {
                                    const imgUrl = getImgUrl(product);
                                    return (
                                        <Link 
                                            key={product._id || product.id}
                                            href={`/products/${product.source}/${product.article}`} 
                                            onClick={() => setShowSearch(false)}
                                            className="group flex items-start gap-4"
                                        >
                                            <div className="w-[120px] h-[120px] flex-shrink-0 bg-white border border-transparent group-hover:border-gray-100 rounded-sm overflow-hidden flex items-center justify-center">
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-50" />
                                                )}
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-[12px] text-gray-400 font-medium mb-1 uppercase tracking-wide">
                                                    {product.article ? `Арт. ${product.article}` : ''}
                                                </span>
                                                <span className="text-[15px] leading-tight text-gray-800 group-hover:text-black transition-colors mb-2">
                                                    {product.name}
                                                </span>
                                                <span className="text-sm font-bold text-black">
                                                    {product.price ? `${Number(product.price).toLocaleString('ru-RU')} ₽` : 'Цена по запросу'}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })
                             ) : (
                                <div className="text-gray-400 font-light">Ничего не найдено</div>
                             )}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="border-b border-gray-200 pb-3 mb-6">
                            <span className="text-xl md:text-2xl text-gray-800 font-light">
                                {foundCategories.length} категорий
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {foundCategories.length > 0 ? (
                                foundCategories.map((cat, idx) => {
                                    if (cat.type !== 'category') return null;
                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => handleCategoryClick(cat.href)}
                                            className="cursor-pointer group flex items-center justify-between py-2 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
                                        >
                                            <span className="text-lg text-gray-600 group-hover:text-black font-light">
                                                {cat.name}
                                            </span>
                                            <FiArrowRight className="text-gray-300 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-gray-400 font-light py-2">
                                    {searchQuery ? 'Категории не найдены' : 'Начните ввод для поиска категорий'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-[60] xl:hidden pointer-events-none`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 left-0 w-[85%] sm:w-[350px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="font-bold text-lg uppercase tracking-wider">Меню</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes size={22} /></button>
                </div>
                <div className="flex-1 py-6 px-6 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                {item.key === 'products' ? (
                                    <div>
                                        <div onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)} className="flex items-center justify-between w-full text-lg font-bold text-black cursor-pointer">
                                            <span className="uppercase tracking-widest">{item.title}</span>{mobileCatalogOpen ? <FiChevronDown /> : <FiChevronRight />}
                                        </div>
                                        <div className={`mt-2 ml-2 overflow-hidden transition-all duration-300 ${mobileCatalogOpen ? 'max-h-[2000px] opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                                            <div className="mb-5">
                                                <Link href="/catalog/chandeliers" className="font-bold text-gray-800 block mb-2 text-base">Люстры</Link>
                                                <div className="space-y-1">
                                                    <MobileSubLink href="/catalog/chandeliers/ceiling-chandeliers">Люстры потолочные</MobileSubLink>
                                                    <MobileSubLink href="/catalog/chandeliers/pendant-chandeliers">Люстры подвесные</MobileSubLink>
                                                    <MobileSubLink href="/catalog/chandeliers/rod-chandeliers">Люстры на штанге</MobileSubLink>
                                                    <MobileSubLink href="/catalog/chandeliers/cascade-chandeliers">Люстры каскадные</MobileSubLink>
                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <Link href="/catalog/lights/track-lights" className="font-bold text-gray-800 block mb-2 text-base">Трековые светильники</Link>
                                                <div className="space-y-1">
                                                    <MobileSubLink href="/catalog/lights/magnit-track-lights">Магнитные трековые</MobileSubLink>
                                                    <MobileSubLink href="/catalog/lights/track-lights/smart">Умные трековые</MobileSubLink>
                                                    <MobileSubLink href="/catalog/lights/track-lights/outdoor">Уличные трековые</MobileSubLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link 
                                        href={item.href}
                                        onClick={(e) => handleLinkClick(e, item.href)}
                                        className="block text-lg font-bold uppercase tracking-widest text-black hover:text-gray-600"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Mobile Menu Footer Links */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-4">
                   <Link href="#" className="flex flex-col items-center gap-2 text-gray-600">
                      <FaUser size={20} /> <span className="text-xs">Войти</span>
                   </Link>
                   <Link href="#" className="flex flex-col items-center gap-2 text-gray-600">
                      <FaHeart size={20} /> <span className="text-xs">Избранное</span>
                   </Link>
                </div>
            </div>
        </div>
      </div>

      {/* --- DESKTOP CATALOG MEGA MENU --- */}
      <div 
        ref={dropdownRef}
        onMouseLeave={() => setShowDropdown(null)}
        className={`hidden xl:block fixed top-[70px] left-0 w-full bg-white text-black z-40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border-t border-gray-100
        ${showDropdown === 'products' ? 'visible' : 'invisible'}`}
      >
        <div className="container mx-auto px-20 py-10 relative overflow-hidden min-h-[800px]">
            <div className="grid grid-cols-4 gap-x-5 gap-y-10 relative z-10">
                {/* COLUMN 1 */}
                <div>
                    <div className="mb-10">
                        <MenuHeader>Декоративное</MenuHeader>
                        <div className="space-y-4"> 
                        <div>
                            <Link href="/catalog/chandeliers" className="text-[17px] font-bold text-black hover:text-black block mb-2">Люстры</Link>
                            <div className='space-y-1'>
                                <MenuLink href="/catalog/chandeliers/ceiling-chandeliers">Люстры потолочные</MenuLink>
                                <MenuLink href="/catalog/chandeliers/pendant-chandeliers">Люстры подвесные</MenuLink>
                                <MenuLink href="/catalog/chandeliers/rod-chandeliers">Люстры на штанге</MenuLink>
                                <MenuLink href="/catalog/chandeliers/cascade-chandeliers">Люстры каскадные</MenuLink>
                            </div>
                        </div>
                         <div>
                            <Link href="/catalog/lights/track-lights" className="text-[17px] font-bold text-blackhover:text-black block mb-2">Трековые светильники</Link>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/lights/magnit-track-lights">Магнитные трековые</MenuLink>
                                <MenuLink href="/catalog/lights/track-lights/smart">Умные трековые</MenuLink>
                                <MenuLink href="/catalog/lights/track-lights/outdoor">Уличные трековые</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/lights/pendant-lights" className="text-[17px] font-bold text-black hover:text-black block mb-2">Подвесные светильники</Link>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/lights/recessed-lights">Встраиваемые светильники</MenuLink>
                                <MenuLink href="/catalog/lights/surface-mounted-light">Накладные светильники</MenuLink>
                            </div>
                        </div>
                        <div>
                            <Link href="/catalog/lights/wall-lights" className="text-[17px] font-bold text-black hover:text-black block mb-2">Бра</Link>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/lights/wall-lights">Настенные светильники</MenuLink>
                            </div>
                        </div>
                        <div><Link href="/catalog/floor-lamps" className="text-[17px]] font-bold text-black hover:text-black block mb-1">Торшеры</Link></div>
                        <div><Link href="/catalog/table-lamps" className="text-[17px] font-bold text-black hover:text-black block mb-1">Настольные лампы</Link></div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2 */}
                <div>
                    <MenuHeader>Функциональное</MenuHeader>
                    <div className="space-y-5">
                        <div>
                            <Link href="/catalog/led-strips" className="text-[17px] font-bold text-black hover:text-black block mb-2">Светодиодные ленты</Link>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/led-lamp">Лампа и LED</MenuLink>
                                <MenuLink href="/catalog/accessories">Аксессуары</MenuLink>
                                <MenuLink href="/catalog/led-strip-profiles">Профили разных типов</MenuLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 3 */}
                <div>
                    <MenuHeader>Уличное</MenuHeader>
                    <div className="space-y-5">
                        <div>
                            <Link href="/catalog/outdoor-lights" className="text-[17px] font-bold text-blackhover:text-black block mb-2">Уличные светильники</Link>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/outdoor-lights/landscape-lights">Ландшафтные</MenuLink>
                                <MenuLink href="/catalog/outdoor-lights/park-lights">Парковые</MenuLink>
                                <MenuLink href="/catalog/outdoor-lights/ground-lights">Грунтовые светильники</MenuLink>
                                <MenuLink href="/catalog/outdoor-lights/outdoor-wall-lights">Настенно-уличные</MenuLink>
                            </div>
                        </div>
                    </div>  
                </div>

                {/* COLUMN 4 */}
                <div>
                    <div>
                        <MenuHeader>Электроустановочное</MenuHeader>
                        <div className="space-y-5">
                        <div>
                        <Link className='text-[17px] font-bold text-blackhover:text-black block mb-2' href="/ElektroustnovohneIzdely/Vstraivaemy-series" >Встраиваемые серии</Link>
                        <div className="space-y-1">
                        <MenuLink href="/ElektroustnovohneIzdely/Werkel/Gallant" >Серия Gallant</MenuLink>
                        <MenuLink href="/ElektroustnovohneIzdely/Werkel/Retro" >Серия Retro</MenuLink>
                        <MenuLink href="/ElektroustnovohneIzdely/Werkel/Vintage" >Серия Vintage</MenuLink>
                        <MenuLink href="/ElektroustnovohneIzdely/Donel/W55" >Влагозащитная серия</MenuLink>
                        <MenuLink href="/ElektroustnovohneIzdely/VidviznoyBlock" >Выдвижные лючки</MenuLink>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;