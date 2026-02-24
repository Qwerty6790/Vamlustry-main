
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaUser, FaHeart, FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { FiChevronDown, FiChevronRight, FiArrowRight, FiX } from 'react-icons/fi';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

// --- СПИСОК КАТЕГОРИЙ (ДЛЯ ПОИСКА) ---
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

  const textColorClass = currentTextColor === 'white' ? 'text-white' : 'text-[#4a4a4a]'; 
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
    if (href === '/') {
        e.preventDefault();
        const scrollToMap = () => {
            const target = document.getElementById('');
            if (target) {
                setMobileMenuOpen(false);
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        };
        if (pathname === '/') scrollToMap();
        else router.push('/');
    } else {
        setMobileMenuOpen(false);
    }
  };

  // --- MENU ITEMS ---
  const menuItems = [
    { title: 'Каталог', key: 'products', href: '/catalog/chandeliers' },
    { title: 'Где купить', key: 'shops', href: '/map' }, 
    { title: 'Производство', key: 'custom', href: '/about' },
    { title: 'Сотрудничество', key: 'partners', href: '/about' },
    { title: 'О компании', key: 'about', href: '/about' },
  ];

  // --- MINIMALISTIC MENU UI COMPONENTS ---
  const MenuLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="block text-[14px] leading-relaxed text-black hover:text-black transition-colors py-[2px]">
        {children}
    </Link>
  );
  const CategoryTitle = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="text-[15px] font-medium text-gray-900 hover:text-gray-500 transition-colors block mb-2">
        {children}
    </Link>
  );
  const MenuHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[19px] font-semibold text-black uppercase tracking-widest mb-6">{children}</h3>
  );
  
  // Mobile UI
  const MobileSubLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
    <Link href={href} onClick={onClick} className="block text-[14px] text-gray-500 hover:text-black py-1.5 transition-colors">
        {children}
    </Link>
  );
  const MobileSectionHeader = ({ children }: { children: React.ReactNode }) => (
     <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mt-8 mb-4">{children}</div>
  );
  const MobileCategoryTitle = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
     <Link href={href} onClick={onClick} className="font-medium text-gray-900 block mb-1 text-[15px]">
        {children}
     </Link>
  );

  const iconItemClass = `group flex flex-col items-center justify-center gap-[2px] cursor-pointer transition-opacity hover:opacity-70 ${textColorClass}`;

  const getFeaturedProduct = () => {
    if (searchResults.length > 0) return searchResults[0];
    if (defaultProducts.length > 0) return defaultProducts[0];
    return null;
  };
  const featuredProduct = getFeaturedProduct();

  return (
    <>
      <header 
        ref={headerRef} 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isHeaderActive 
            ? 'py-3 sm:py-5 shadow-sm bg-white/95 backdrop-blur-sm border-gray-100' 
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
                            className={`text-[13px] font-medium uppercase tracking-[0.1em] transition-colors relative group py-4 ${currentTextColor === 'white' ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-500'}`}
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
                
                {/* Mobile/Tablet View */}
                <div className="flex xl:hidden gap-5 items-center">
                    <button onClick={() => setShowSearch(true)} className={`${textColorClass} hover:opacity-70 transition-opacity`}>
                        <FaSearch size={22} />
                    </button>
                    <Link href="/cart" className={`relative ${textColorClass} hover:opacity-70 transition-opacity`}>
                         <FaShoppingCart size={22} />
                         {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                     <button onClick={() => setMobileMenuOpen(true)} className={`${textColorClass} hover:opacity-70 transition-opacity`}>
                        <FaBars size={22} />
                    </button>
                </div>

                {/* Desktop View */}
                <div className="hidden xl:flex items-center gap-7">
                    <button onClick={() => setShowSearch(true)} className={iconItemClass}>
                        <FaSearch size={20} />
                    </button>
                    <Link href="/auth/register" className={iconItemClass}>
                        <FaUser size={20} />
                    </Link>
                    <Link href="/liked" className={iconItemClass}>
                        <FaHeart size={20} />
                    </Link>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 min-h-[400px]">
                    {/* LEFT COLUMN: PRODUCTS LIST */}
                    <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
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
                                <div className="py-10 text-gray-300 font-light">Загрузка...</div>
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
                                            <div className="w-[120px] h-[120px] flex-shrink-0 bg-white border border-transparent group-hover:border-gray-100 rounded-sm overflow-hidden flex items-center justify-center transition-colors">
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-50" />
                                                )}
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-[12px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
                                                    {product.article ? `Арт. ${product.article}` : ''}
                                                </span>
                                                <span className="text-[15px] leading-tight text-gray-800 group-hover:text-black transition-colors mb-2">
                                                    {product.name}
                                                </span>
                                                <span className="text-sm font-medium text-black">
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

                    {/* RIGHT COLUMN: CATEGORIES OR BIG CARD */}
                    <div className="hidden md:block">
                        {foundCategories.length > 0 ? (
                            <>
                                <div className="border-b border-gray-100 pb-3 mb-6">
                                    <span className="text-xl md:text-2xl text-gray-800 font-light">
                                        {foundCategories.length} категорий
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {foundCategories.map((cat, idx) => {
                                        if (cat.type !== 'category') return null;
                                        return (
                                            <div 
                                                key={idx} 
                                                onClick={() => handleCategoryClick(cat.href)}
                                                className="cursor-pointer group flex items-center justify-between py-3 px-3 -mx-3 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="text-[15px] text-gray-600 group-hover:text-black font-medium transition-colors">
                                                    {cat.name}
                                                </span>
                                                <FiArrowRight className="text-gray-300 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            featuredProduct && (
                                <div className='h-full flex flex-col pb-6 pl-10'>
                                     <div className="border-b border-transparent pb-3 mb-6">
                                        <span className="text-xl text-gray-400 font-light">
                                            {searchQuery ? 'Лучший результат' : 'Популярный товар'}
                                        </span>
                                    </div>
                                    <Link 
                                        href={`/products/${featuredProduct.source}/${featuredProduct.article}`}
                                        onClick={() => setShowSearch(false)}
                                        className="flex-1 rounded-lg p-8 flex flex-col items-center justify-center text-center group hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
                                    >
                                        <div className="w-full h-[250px] flex items-center justify-center mb-6">
                                             {getImgUrl(featuredProduct) ? (
                                                <img 
                                                    src={getImgUrl(featuredProduct)!} 
                                                    alt={featuredProduct.name} 
                                                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                                                />
                                             ) : (
                                                <div className="w-full h-full bg-gray-50 rounded-md" />
                                             )}
                                        </div>
                                        <div className="max-w-[80%]">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                                                {featuredProduct.article}
                                            </p>
                                            <h4 className="text-[17px] font-medium text-gray-900 mb-3 leading-snug group-hover:text-black transition-colors">
                                                {featuredProduct.name}
                                            </h4>
                                            <p className="text-xl font-semibold text-black">
                                                {featuredProduct.price ? `${Number(featuredProduct.price).toLocaleString('ru-RU')} ₽` : 'Цена по запросу'}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
          </div>
      </div>
      
      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-[60] xl:hidden pointer-events-none`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 left-0 w-[85%] sm:w-[350px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 pb-4">
                    <span className="font-semibold text-[13px] text-gray-400 uppercase tracking-[0.15em]">Меню</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="flex-1 px-6 pb-10 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-6 mt-2">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                {item.key === 'products' ? (
                                    <div>
                                        <div onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)} className="flex items-center justify-between w-full text-[14px] font-medium text-gray-900 cursor-pointer group">
                                            <span className="uppercase tracking-[0.1em]">{item.title}</span>
                                            <span className="text-gray-400 group-hover:text-black transition-colors">
                                                {mobileCatalogOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                                            </span>
                                        </div>
                                        <div className={`overflow-hidden transition-all duration-300 ${mobileCatalogOpen ? 'max-h-[3000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                            
                                            {/* --- ДЕКОРАТИВНОЕ --- */}
                                            <MobileSectionHeader>Декоративное</MobileSectionHeader>
                                            
                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/catalog/chandeliers" onClick={() => setMobileMenuOpen(false)}>Люстры</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/chandeliers/ceiling-chandeliers">Люстры потолочные</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/chandeliers/pendant-chandeliers">Люстры подвесные</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/chandeliers/rod-chandeliers">Люстры на штанге</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/chandeliers/cascade-chandeliers">Люстры каскадные</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/catalog/lights/track-lights" onClick={() => setMobileMenuOpen(false)}>Трековые светильники</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/lights/magnit-track-lights">Магнитные трековые</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/lights/track-lights/smart">Умные трековые</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/lights/track-lights/outdoor">Уличные трековые</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/catalog/lights/pendant-lights" onClick={() => setMobileMenuOpen(false)}>Подвесные светильники</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/lights/recessed-lights">Встраиваемые светильники</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/lights/surface-mounted-light">Накладные светильники</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/catalog/lights/wall-lights" onClick={() => setMobileMenuOpen(false)}>Бра</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/lights/wall-lights">Настенные светильники</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-5"><MobileCategoryTitle href="/catalog/floor-lamps" onClick={() => setMobileMenuOpen(false)}>Торшеры</MobileCategoryTitle></div>
                                            <div className="mb-5"><MobileCategoryTitle href="/catalog/table-lamps" onClick={() => setMobileMenuOpen(false)}>Настольные лампы</MobileCategoryTitle></div>

                                            {/* --- ФУНКЦИОНАЛЬНОЕ --- */}
                                            <MobileSectionHeader>Функциональное</MobileSectionHeader>
                                            
                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/catalog/led-strips" onClick={() => setMobileMenuOpen(false)}>Светодиодные ленты</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/led-lamp">Лампа и LED</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/accessories">Аксессуары</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/led-strip-profiles">Профили разных типов</MobileSubLink>
                                                </div>
                                            </div>

                                            {/* --- УЛИЧНОЕ --- */}
                                            <MobileSectionHeader>Уличное</MobileSectionHeader>

                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/catalog/outdoor-lights" onClick={() => setMobileMenuOpen(false)}>Уличные светильники</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/outdoor-lights/landscape-lights">Ландшафтные</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/outdoor-lights/park-lights">Парковые</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/outdoor-lights/ground-lights">Грунтовые светильники</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/catalog/outdoor-lights/outdoor-wall-lights">Настенно-уличные</MobileSubLink>
                                                </div>
                                            </div>

                                            {/* --- ЭЛЕКТРОУСТАНОВОЧНОЕ --- */}
                                            <MobileSectionHeader>Электроустановочное</MobileSectionHeader>

                                            <div className="mb-5">
                                                <MobileCategoryTitle href="/ElektroustnovohneIzdely/Vstraivaemy-series" onClick={() => setMobileMenuOpen(false)}>Встраиваемые серии</MobileCategoryTitle>
                                                <div className="space-y-1">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/ElektroustnovohneIzdely/Werkel/Gallant">Серия Gallant</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/ElektroustnovohneIzdely/Werkel/Retro">Серия Retro</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/ElektroustnovohneIzdely/Werkel/Vintage">Серия Vintage</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/ElektroustnovohneIzdely/Donel/W55">Влагозащитная серия</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/ElektroustnovohneIzdely/VidviznoyBlock">Выдвижные лючки</MobileSubLink>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <Link 
                                        href={item.href}
                                        onClick={(e) => handleLinkClick(e, item.href)}
                                        className="block text-[14px] font-medium uppercase tracking-[0.1em] text-gray-900 hover:text-gray-500 transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
              
            </div>
        </div>
      </div>

      {/* --- DESKTOP CATALOG MEGA MENU --- */}
      <div 
        ref={dropdownRef}
        onMouseLeave={() => setShowDropdown(null)}
        className={`hidden xl:block fixed top-[70px] left-0 w-full bg-white text-black z-40 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border-t border-gray-100 transition-all duration-300 ease-in-out
        ${showDropdown === 'products' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      >
        <div className="container mx-auto px-20 pt-10 pb-16 relative overflow-hidden h-auto">
            <div className="grid grid-cols-4 gap-x-12 gap-y-10 relative z-10">
                {/* COLUMN 1 */}
                <div>
                    <div className="mb-8">
                        <MenuHeader>Декоративное</MenuHeader>
                        <div className="space-y-6"> 
                            <div>
                                <CategoryTitle href="/catalog/chandeliers">Люстры</CategoryTitle>
                                <div className='space-y-1'>
                                    <MenuLink href="/catalog/chandeliers/ceiling-chandeliers">Люстры потолочные</MenuLink>
                                    <MenuLink href="/catalog/chandeliers/pendant-chandeliers">Люстры подвесные</MenuLink>
                                    <MenuLink href="/catalog/chandeliers/rod-chandeliers">Люстры на штанге</MenuLink>
                                    <MenuLink href="/catalog/chandeliers/cascade-chandeliers">Люстры каскадные</MenuLink>
                                </div>
                            </div>
                            <div>
                                <CategoryTitle href="/catalog/lights/pendant-lights">Подвесные светильники</CategoryTitle>
                                <div className="space-y-1">
                                    <MenuLink href="/catalog/lights/recessed-lights">Встраиваемые светильники</MenuLink>
                                    <MenuLink href="/catalog/lights/surface-mounted-light">Накладные светильники</MenuLink>
                                </div>
                            </div>
                            <div>
                                <CategoryTitle href="/catalog/lights/wall-lights">Бра</CategoryTitle>
                                <div className="space-y-1">
                                    <MenuLink href="/catalog/lights/wall-lights">Настенные светильники</MenuLink>
                                </div>
                            </div>
                            <div><CategoryTitle href="/catalog/floor-lamps">Торшеры</CategoryTitle></div>
                            <div><CategoryTitle href="/catalog/table-lamps">Настольные лампы</CategoryTitle></div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2 */}
                <div>
                    <MenuHeader>Функциональное</MenuHeader>
                    <div className="space-y-6">
                        <div>
                            <CategoryTitle href="/catalog/led-strips">Светодиодные ленты</CategoryTitle>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/led-lamp">Лампа и LED</MenuLink>
                                <MenuLink href="/catalog/accessories">Аксессуары</MenuLink>
                                <MenuLink href="/catalog/led-strip-profiles">Профили разных типов</MenuLink>
                            </div>                 
                        </div>
                        <div>
                            <CategoryTitle href="/catalog/lights/track-lights">Трековые светильники</CategoryTitle>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/lights/magnit-track-lights">Магнитные трековые</MenuLink>
                                <MenuLink href="/catalog/lights/track-lights/smart">Умные трековые</MenuLink>
                                <MenuLink href="/catalog/lights/track-lights/outdoor">Уличные трековые</MenuLink>
                                <MenuLink href="/catalog?category=Акцентный+светильник&page=1">Акцентный светильник</MenuLink>
                                <MenuLink href="/catalog?category=Линейный+светильник&page=1">Линейный светильник</MenuLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 3 */}
                <div>
                    <MenuHeader>Уличное</MenuHeader>
                    <div className="space-y-6">
                        <div>
                            <CategoryTitle href="/catalog/outdoor-lights">Уличные светильники</CategoryTitle>
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
                    <MenuHeader>Электроустановочное</MenuHeader>
                    <div className="space-y-6">
                        <div>
                            <CategoryTitle href="/ElektroustnovohneIzdely/Vstraivaemy-series">Встраиваемые серии</CategoryTitle>
                            <div className="space-y-1">
                                <MenuLink href="/ElektroustnovohneIzdely/Werkel/Gallant">Серия Gallant</MenuLink>
                                <MenuLink href="/ElektroustnovohneIzdely/Werkel/Retro">Серия Retro</MenuLink>
                                <MenuLink href="/ElektroustnovohneIzdely/Werkel/Vintage">Серия Vintage</MenuLink>
                                <MenuLink href="/ElektroustnovohneIzdely/Donel/W55">Влагозащитная серия</MenuLink>
                                <MenuLink href="/ElektroustnovohneIzdely/VidviznoyBlock">Выдвижные лючки</MenuLink>
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
