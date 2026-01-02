
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiX, FiMenu, FiChevronDown, FiChevronRight, FiGrid, FiArrowRight, FiCornerDownRight } from 'react-icons/fi';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

// --- СПИСОК КАТЕГОРИЙ (С ССЫЛКАМИ) ---
const categoriesList = [
  { name: 'Люстры', href: '/catalog/chandeliers' },
  { name: 'Люстры потолочные', href: '/catalog/chandeliers/ceiling-chandeliers' },
  { name: 'Люстры подвесные', href: '/catalog/chandeliers/pendant-chandeliers' },
  { name: 'Люстры на штанге', href: '/catalog/chandeliers/rod-chandeliers' },
  { name: 'Люстры каскадные', href: '/catalog/chandeliers/cascade-chandeliers' },
  { name: 'Трековые светильники', href: '/catalog/lights/track-lights' },
  { name: 'Магнитные трековые', href: '/catalog/lights/magnit-track-lights' },
  { name: 'Умные трековые', href: '/catalog/lights/track-lights/smart' },
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
  { name: 'Уличные светильники', href: '/catalog/outdoor-light' },
  { name: 'Ландшафтные светильники', href: '/catalog/outdoor-lights/landscape-lights' },
  { name: 'Парковые светильники', href: '/catalog/outdoor-lights/park-lights' },
  { name: 'Грунтовые светильники', href: '/catalog/outdoor-lights/ground-lights' },
  { name: 'Настенно-уличные', href: '/catalog/outdoor-lights/outdoor-wall-lights' },
  { name: 'Электроустановочные изделия', href: '/ElektroustnovohneIzdely/Vstraivaemy-series' },
];

// --- ОБЫЧНЫЕ ЗАПРОСЫ (ТЕГИ) ---
const searchKeywords = [
  'Люстра хрустальная',
];

// --- СПИСОК БРЕНДОВ ---
const brandsList = [
  { name: 'Artelamp', slug: 'artelamp' },
  { name: 'Denkirs', slug: 'denkirs' },
  { name: 'Donel', slug: 'donel' },
  { name: 'Favourite', slug: 'favourite' },
  { name: 'KinkLight', slug: 'kinklight' },
  { name: 'LightStar', slug: 'lightstar' },
  { name: 'Lumion', slug: 'lumion' },
  { name: 'Maytoni', slug: 'maytoni' },
  { name: 'Novotech', slug: 'novotech' },
  { name: 'OdeonLight', slug: 'odeonlight' },
  { name: 'Sonex', slug: 'sonex' },
  { name: 'StLuce', slug: 'stluce' },
];

// --- UTILS FOR IMAGES ---
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

// Тип для подсказки
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
  
  // !!! NEW STATE: Товары по умолчанию (для показа без ввода)
  const [defaultProducts, setDefaultProducts] = useState<any[]>([]);

  const [filteredSuggestions, setFilteredSuggestions] = useState<SuggestionItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Cart State
  const [cartCount, setCartCount] = useState(0);

  // --- DYNAMIC COLOR STATE ---
  const [dynamicColor, setDynamicColor] = useState<'black' | 'white'>('black');
  
  // --- REFS ---
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  
  const router = useRouter();
  const pathname = usePathname();

  // --- STYLE CALCULATION ---
  const isMainPage = pathname === '/';
  const isHeaderActive = scrolled || showDropdown !== null || showSearch || mobileMenuOpen;
  const isTransparentMode = isMainPage && !isHeaderActive;
  const currentTextColor = isTransparentMode ? dynamicColor : 'black';

  const textColorClass = currentTextColor === 'white' ? 'text-white' : 'text-black';
  const hoverColorClass = currentTextColor === 'white' ? 'hover:text-gray-300' : 'hover:text-neutral-600';
  const underlineColorClass = currentTextColor === 'white' ? 'bg-white' : 'bg-black';
  const logoColorClass = textColorClass;
  const searchInputClass = 'text-black placeholder:text-gray-400 border-b border-gray-200 focus:border-black';

  // --- LOGIC: GROUP BRANDS BY LETTER ---
  const groupedBrands = React.useMemo(() => {
    return brandsList.reduce((acc, brand) => {
        const letter = brand.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(brand);
        return acc;
    }, {} as Record<string, typeof brandsList>);
  }, []);
  const sortedLetters = Object.keys(groupedBrands).sort();

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

  // !!! NEW EFFECT: Загружаем "Рандомные" товары один раз при старте
  useEffect(() => {
    const fetchDefaultProducts = async () => {
        try {
            // Ищем что-то популярное, например "Люстра" или "Светильник", чтобы наполнить витрину
            // encodeURIComponent('Люстра')
            const resp = await fetch(`${NEXT_PUBLIC_API_URL}/api/products/search?name=%D0%9B%D1%8E%D1%81%D1%82%D1%80%D0%B0`);
            if (resp.ok) {
                const data = await resp.json();
                if(data.products && Array.isArray(data.products)) {
                    // Перемешиваем массив, чтобы было "случайно"
                    const shuffled = data.products.sort(() => 0.5 - Math.random());
                    setDefaultProducts(shuffled.slice(0, 8)); // Берем 4 штуки
                }
            }
        } catch (error) {
            console.error("Error fetching default products:", error);
        }
    };
    fetchDefaultProducts();
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 100);
    // При закрытии сбрасываем, но при открытии defaultProducts подставятся из logic ниже
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

    // 1. Формируем подсказки (категории)
    if (!trimmedQuery) {
        const popularCats = categoriesList.slice(0, 4).map(c => ({ type: 'category' as const, ...c }));
        setFilteredSuggestions([...popularCats]);
    } else {
        const matchedCats = categoriesList
            .filter(c => c.name.toLowerCase().includes(lowerQuery))
            .slice(0, 4)
            .map(c => ({ type: 'category' as const, ...c }));

        const matchedKeys = searchKeywords
            .filter(k => k.toLowerCase().includes(lowerQuery))
            .slice(0, 5)
            .map(k => ({ type: 'keyword' as const, name: k }));
        
        setFilteredSuggestions([...matchedCats, ...matchedKeys]);
    }
    
    // 2. Обработка товаров
    if (!trimmedQuery) { 
        // !!! ИЗМЕНЕНИЕ: Если запрос пустой, показываем товары по умолчанию (рандомные)
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
           setSearchResults(strictFilteredProducts.slice(0, 4));
        }
      } catch (e: any) {
          if (e.name !== 'AbortError') console.error("Search error:", e);
      } finally {
          if (!searchAbortRef.current?.signal.aborted) setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, defaultProducts]); // Добавили defaultProducts в зависимости, чтобы при первом рендере они подтянулись

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { router.push(`/search/${encodeURIComponent(searchQuery.trim())}`); setShowSearch(false); }
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
      if (item.type === 'category') {
          router.push(item.href);
          setShowSearch(false);
      } else {
          setSearchQuery(item.name);
      }
  };

  // --- HELPERS ---
  const menuItems = [
    { title: 'Каталог', key: 'products', href: '/catalog/chandeliers' },
    { title: 'Серии', key: 'series', href: '/about' },
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
                            className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors relative group py-4 ${textColorClass} ${hoverColorClass}`}
                            onMouseEnter={() => setShowDropdown(item.key === 'products' ? 'products' : null)}
                        >
                            {item.title}
                            <span className={`absolute bottom-3 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 ${underlineColorClass}`}></span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ICONS */}
            <div className={`flex items-center gap-4 sm:gap-6 z-20 transition-all duration-300 ml-auto ${textColorClass} ${showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={() => setMobileMenuOpen(true)} className={`xl:hidden p-1 ${hoverColorClass}`}>
                    <FiMenu size={22} />
                </button>
                <Link href="" className={`hidden md:block cursor-not-allowed p-1 ${hoverColorClass}`}><FiUser size={22} /></Link>
                <button onClick={() => setShowSearch(true)} className={`p-1 ${hoverColorClass}`}>
                    <FiSearch size={22} />
                </button>
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

      {/* --- SEARCH OVERLAY --- */}
      <div className={`fixed inset-0 bg-white z-[100] transition-all duration-300 flex flex-col items-center pt-[30px] sm:pt-[20px] px-4 ${showSearch ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <button onClick={() => setShowSearch(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors z-50">
              <FiX size={32} />
          </button>
          <div className="w-full max-w-5xl relative h-full flex flex-col">
              <form onSubmit={handleSearchSubmit} className="relative w-full mb-8 flex-shrink-0">
                  <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-black" size={24} />
                  <input ref={searchInputRef} type="text" placeholder="ВАМЛЮСТРА" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full bg-transparent text-black py-4 pl-10 pr-4 text-2xl outline-none font-medium ${searchInputClass}`} />
              </form>
              <div className={`w-full flex-1  pb-10 transition-all duration-500 ease-out custom-scrollbar ${showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {/* ... SEARCH CONTENT ... */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="md:col-span-4 lg:col-span-3 space-y-8 border-r border-gray-100 pr-4">
                          <div>
                              <h4 className="text-black text-sm font-semibold uppercase tracking-wider mb-4">{searchQuery ? "Возможно вы ищете" : "Популярные запросы"}</h4>
                              <ul className="space-y-3">
                                  {filteredSuggestions.map((item, idx) => (
                                      <li key={idx} className="flex items-center gap-3 text-gray-800 hover:text-black cursor-pointer group" onClick={() => handleSuggestionClick(item)}>
                                          {item.type === 'category' ? (
                                             <span className=" bg-black/10 w-3 h-3 rounded-full " />
                                          ) : (
                                             <FiSearch className="text-gray-300 group-hover:text-black transition-colors" size={16} />
                                          )}
                                          <span className={`text-base ${item.type === 'category' ? 'font-medium' : ''}`}>
                                              {item.name}
                                          </span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                      <div className="md:col-span-8 lg:col-span-9">
                          <h4 className="text-black text-lg font-bold mb-6 flex items-center justify-between">
                              {/* !!! ИЗМЕНЕНИЕ: Заголовок меняется в зависимости от того, есть ли поиск */}
                              <span>{searchQuery ? "Результаты поиска" : "Рекомендуем вам"}</span>
                              {searchQuery && searchResults.length > 0 && <Link href={`/search/${encodeURIComponent(searchQuery)}`} className="text-sm font-normal text-gray-500 hover:text-black flex items-center gap-1">Все результаты <FiArrowRight /></Link>}
                          </h4>
                          
                          {isSearching ? (
                            <div className="flex items-center justify-center py-20 text-gray-400 animate-pulse">Поиск товаров...</div> 
                          ) : searchResults.length > 0 ? (
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                  {searchResults.map((product) => {
                                      const imgUrl = getImgUrl(product);
                                      return (
                                          <Link key={product._id || product.id} href={`/products/${product.source}/${product.article}`} className="group block" onClick={() => setShowSearch(false)}>
                                              <div className="relative aspect-[3/4] bg-[#F5F5F5] rounded-sm overflow-hidden mb-3">
                                                  {imgUrl ? <img src={imgUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 uppercase tracking-widest">No Image</div>}
                                              </div>
                                              <div className="space-y-1">
                                                  <p className="text-sm font-medium text-black line-clamp-2 leading-tight group-hover:text-gray-600 transition-colors">{product.name}</p>
                                                  <div className="flex items-center justify-between"><p className="text-[7px] text-gray-400">Арт: {product.article}</p><p className="text-base font-bold text-black">{Number(product.price).toLocaleString('ru-RU')} ₽</p></div>
                                              </div>
                                          </Link>
                                      );
                                  })}
                              </div>
                          ) : (
                             // Если ничего не найдено совсем (даже дефолтного)
                             <div className="py-10 leading-tight text-black text-[50px]">ВАМЛЮСТРА</div>
                          )}
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
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FiX size={24} /></button>
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
                                ) : <Link href={item.href} className="block text-lg font-bold uppercase tracking-widest text-black hover:text-gray-600">{item.title}</Link>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <Link href="/cart" className="flex items-center gap-3 text-black font-medium mb-4"><FiShoppingCart size={20} /><span>Корзина ({cartCount})</span></Link>
                    <Link href="/profile" className="flex items-center gap-3 text-black font-medium"><FiUser size={20} /><span>Личный кабинет</span></Link>
                </div>
            </div>
        </div>
      </div>

      {/* --- DESKTOP CATALOG MEGA MENU --- */}
      <div 
        ref={dropdownRef}
        onMouseLeave={() => setShowDropdown(null)}
        className={`hidden xl:block fixed top-[70px] left-0 w-full bg-white text-black z-40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out border-t border-gray-100
        ${showDropdown === 'products' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}
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
                            <Link href="/catalog/outdoor-light" className="text-[17px] font-bold text-blackhover:text-black block mb-2">Уличные светильники</Link>
                            <div className="space-y-1">
                                <MenuLink href="/catalog/outdoor-lights/landscape-lights">Ландшафтные</MenuLink>
                                <MenuLink href="/catalog/outdoor-lights/park-lights">Парковые</MenuLink>
                                <MenuLink href="/catalog/outdoor-lights/ground-lights">Грунтовые светильники</MenuLink>
                                <MenuLink href="/catalog/outdoor-lights/outdoor-wall-lights">Настенно-уличные</MenuLink>
                            </div>
                        </div>
                    </div>  
                </div>

                {/* COLUMN 4 (С БРЕНДАМИ) */}
                <div>
                    <div>
                        <MenuHeader>Электроустановочное</MenuHeader>
                        <MenuLink href="/ElektroustnovohneIzdely/Vstraivaemy-series" >Встраиваемые серии</MenuLink>
                    </div>

                    {/* БЛОК БРЕНДОВ В СТИЛЕ "БУКВА - СПИСОК" (ЗАТЕМНЕН И "СКОРО") */}
                    <div className="mt-10 pt-6 border-t border-gray-100 relative">
                        <MenuHeader>Бренды</MenuHeader>
                        
                        {/* OVERLAY С ТЕКСТОМ "СКОРО" */}
                        <div className="absolute inset-0 top-[60px] z-10 flex items-center justify-center">
                             <div className="bg-black text-white px-5 py-3 rounded-md shadow-2xl">
                                <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">Скоро раздел будет доступным</span>
                             </div>
                        </div>

                        {/* СПИСОК (DIMMED & DISABLED) */}
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 opacity-25 blur-[1px] pointer-events-none grayscale select-none">
                            {sortedLetters.map((letter) => (
                                <div key={letter} className="flex flex-row items-start gap-3">
                                     <span className="text-5xl font-bold text-gray-300 leading-[0.8]">{letter}</span>
                                     <div className="flex flex-col space-y-1 pt-1">
                                         {groupedBrands[letter].map((brand) => (
                                             <span 
                                                key={brand.slug} 
                                                className="text-[15px] font-medium text-black"
                                             >
                                                {brand.name}
                                             </span>
                                         ))}
                                     </div>
                                </div>
                            ))}
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