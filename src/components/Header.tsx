
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
// Используем только тонкие современные иконки Feather Icons (Fi)
import { FiChevronDown, FiChevronRight, FiArrowRight, FiX, FiHeart, FiShoppingCart, FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { NEXT_PUBLIC_API_URL } from '@/utils/constants';

// --- СПИСОК КАТЕГОРИЙ ---
const categoriesList = [
  { name: 'Люстра', href: '/search/Люстра' },
  { name: 'Люстра потолочная', href: '/search/Потолочная люстра' },
  { name: 'Потолочная люстра', href: '/search/Потолочная люстра' },
  { name: 'Люстра подвесная', href: '/search/Подвесная люстра' },
  { name: 'Подвесная люстра', href: '/search/Подвесная люстра' },
  { name: 'Люстра на штанге', href: '/search/Люстра на штанге' },
  { name: 'На штанге люстра', href: '/search/Люстра на штанге' },
  { name: 'Люстра каскадная', href: '/search/Каскадная люстра' },
  { name: 'Каскадная люстра', href: '/search/Каскадная люстра' },
  { name: 'светильник', href: '/search/светильники' },
  { name: 'Подвесной светильник', href: '/search/Подвесной светильник' },
  { name: 'Потолочеый светильник', href: '/search/Потолочный светильник' },
  { name: 'Светильник подвесной', href: '/search/Подвесной светильник' },
  { name: 'Встраиваемый светильник', href: '/search/Встраиваемый светильник' },
  { name: 'Светильник встраиваемый', href: '/search/Встраиваемый светильник' },
  { name: 'Бра', href: '/search/Бра' },
  { name: 'Настенный светильник', href: '/search/Настенный светильник' },
  { name: 'Светильник настенный', href: '/search/Настенный светильник' },
  { name: 'Торшер', href: '/search/Торшер' },
  { name: 'Настольная лампа', href: '/search/Настольная лампа' },
  { name: 'Лампа настольная', href: '/search/Настольная лампа' },
  { name: 'Светодиодная лента', href: '/search/Светодиодная лента' },
  { name: 'Лента светодиодная', href: '/search/Светодиодная лента' },
  { name: 'Светодиодная лампа', href: '/search/Светодиодная лампа' },
  { name: 'Лампа светодиодная', href: '/search/Светодиодная лампа' },
  { name: 'Аксессуары', href: '/search/Аксессуары' },
  { name: 'Профиль для ленты', href: '/search/Профиль для ленты' },
  { name: 'Лента профиль', href: '/search/Профиль для ленты' },
  { name: 'Трековый светильник', href: '/search/Трековый светильник' },
  { name: 'Светильник трековый', href: '/search/Трековый светильник' },
  { name: 'Магнитный трековый светильник', href: '/search/Магнитный трековый светильник' },
  { name: 'Трековый светильник магнитный', href: '/search/Магнитный трековый светильник' },
  { name: 'Умный трековый светильник', href: '/search/Умный трековый светильник' },
  { name: 'Трековый светильник умный', href: '/search/Умный трековый светильник' },
  { name: 'Уличный трековый светильник', href: '/search/Уличный трековый светильник' },
  { name: 'Трековый светильник уличный', href: '/search/Уличный трековый светильник' },
  { name: 'Акцентный светильник', href: '/search/Акцентный светильник' },
  { name: 'Светильник акцентный', href: '/search/Акцентный светильник' },
  { name: 'Линейный светильник', href: '/search/Линейный светильник' },
  { name: 'Светильник линейный', href: '/search/Линейный светильник' },
  { name: 'Уличный светильник', href: '/search/Уличный светильник' },
  { name: 'Светильник уличный', href: '/search/Уличный светильник' },
  { name: 'Ландшафтный светильник', href: '/search/Ландшафтный светильник' },
  { name: 'Светильник ландшафтный', href: '/search/Ландшафтный светильник' },
  { name: 'Парковый светильник', href: '/search/Парковый светильник' },
  { name: 'Светильник парковый', href: '/search/Парковый светильник' },
  { name: 'Грунтовый светильник', href: '/search/Грунтовый светильник' },
  { name: 'Светильник грунтовый', href: '/search/Грунтовый светильник' },
  { name: 'Настенно-уличный светильник', href: '/search/Настенно-уличный светильник' },
  { name: 'Уличный настенный светильник', href: '/search/Настенно-уличный светильник' },
  { name: 'Встраиваемые серии', href: '/search/Встраиваемая серия' },
  { name: 'Серия Gallant', href: '/search/Gallant' },
  { name: 'Серия Retro', href: '/search/Retro' },
  { name: 'Серия Vintage', href: '/search/Vintage' },
  { name: 'Влагозащитная серия', href: '/search/Влагозащитная серия' },
  { name: 'Выдвижной лючок', href: '/search/Выдвижной лючок' },
  { name: 'Лючок выдвижной', href: '/search/Выдвижной лючок' },
];

// --- UTILS ---
const getImgUrl = (product: any): string => {
    if (typeof product.imageAddresses === 'string') return product.imageAddresses;
    if (Array.isArray(product.imageAddresses) && product.imageAddresses.length > 0) return product.imageAddresses[0];
    if (typeof product.imageAddress === 'string') return product.imageAddress;
    if (Array.isArray(product.imageAddress) && product.imageAddress.length > 0) return product.imageAddress[0];
    if (product.imageUrl) return product.imageUrl;
    return '/placeholder.jpg';
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
  
  // Cart & Liked State
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [likedCount, setLikedCount] = useState(0);
  const [likedItems, setLikedItems] = useState<any[]>([]);

  // Dynamic Color
  const [dynamicColor, setDynamicColor] = useState<'black' | 'white'>('white');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  
  const router = useRouter();
  const pathname = usePathname();

  const isMainPage = pathname === '/';
  const isHeaderActive = scrolled || showDropdown !== null || showSearch || mobileMenuOpen;
  const isTransparentMode = isMainPage && !isHeaderActive;
  
  const currentTextColor = isTransparentMode ? 'white' : 'black';
  const textColorClass = currentTextColor === 'white' ? 'text-white' : 'text-[#1a1a1a]'; 
  const logoColorClass = currentTextColor === 'white' ? 'text-white' : 'text-black';
  const borderColorClass = currentTextColor === 'white' ? 'border-white/40 hover:border-white' : 'border-gray-300 hover:border-black';
  const headerBgClass = isHeaderActive ? 'bg-white/95 backdrop-blur-md border-b border-gray-100' : 'bg-transparent border-b border-transparent';
  
  const fetchFullProductData = async (localItems: any[]) => {
      if (!localItems || localItems.length === 0) return [];
      if (localItems.some(p => p.name)) return localItems;

      try {
          const res = await fetch(`${NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/list`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ products: localItems })
          });
          
          if (res.ok) {
              const data = await res.json();
              return data.products.map((p: any) => {
                  const localMatch = localItems.find((lp: any) => lp.productId === p._id || lp._id === p._id || lp.id === p._id);
                  return { ...p, quantity: localMatch?.quantity || 1 };
              });
          }
      } catch (err) {
          console.error("Ошибка:", err);
      }
      return localItems;
  };

  useEffect(() => {
    const updateCartData = async () => {
        try {
            const cartData = localStorage.getItem('cart');
            if (cartData) {
                const cart = JSON.parse(cartData);
                const rawProducts = Array.isArray(cart) ? cart : (cart.products || []);
                const count = rawProducts.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
                setCartCount(count);
                const fullProducts = await fetchFullProductData(rawProducts);
                setCartItems(fullProducts);
            } else { setCartCount(0); setCartItems([]); }
        } catch {}
    };
    updateCartData();
    window.addEventListener('cartUpdated', updateCartData);
    return () => window.removeEventListener('cartUpdated', updateCartData);
  }, []);

  useEffect(() => {
    const updateLikedData = async () => {
      try {
        const likedData = localStorage.getItem('liked');
        if (likedData) {
          const liked = JSON.parse(likedData);
          const rawProducts = Array.isArray(liked) ? liked : (liked.products || []);
          setLikedCount(rawProducts.length);
          const fullProducts = await fetchFullProductData(rawProducts);
          setLikedItems(fullProducts);
        } else { setLikedCount(0); setLikedItems([]); }
      } catch {}
    };
    updateLikedData();
    window.addEventListener('likedUpdated', updateLikedData);
    return () => window.removeEventListener('likedUpdated', updateLikedData);
  }, []);

  useEffect(() => {
    const handleHeaderColorChange = (e: any) => { if (e.detail && e.detail.color) setDynamicColor(e.detail.color); };
    window.addEventListener('headerColorChange', handleHeaderColorChange);
    return () => window.removeEventListener('headerColorChange', handleHeaderColorChange);
  }, []);

  useEffect(() => { if (!isMainPage) setDynamicColor('black'); }, [isMainPage]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchDefaultProducts = async () => {
        try {
            const keywords = ['Люстра', 'Светильник'];
            const promises = keywords.map(k => fetch(`${NEXT_PUBLIC_API_URL}/api/products/search?name=${encodeURIComponent(k)}`).then(res => res.json()));
            const results = await Promise.all(promises);
            let combinedProducts: any[] = [];
            results.forEach(data => { if(data.products && Array.isArray(data.products)) combinedProducts = [...combinedProducts, ...data.products]; });
            const uniqueProducts = Array.from(new Map(combinedProducts.map(item => [item._id || item.id, item])).values());
            setDefaultProducts(uniqueProducts.sort(() => 0.5 - Math.random()).slice(0, 4));
        } catch (error) {}
    };
    fetchDefaultProducts();
  }, []);

  useEffect(() => { if (showSearch && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 100); }, [showSearch, showDropdown]);
  useEffect(() => { setMobileMenuOpen(false); setShowSearch(false); setShowDropdown(null); }, [pathname]);
  useEffect(() => {
    if (mobileMenuOpen || (showSearch && window.innerWidth < 1280)) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [mobileMenuOpen, showSearch]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    const lowerQuery = trimmedQuery.toLowerCase();
    
    if (!trimmedQuery) setFoundCategories([]);
    else {
        setFoundCategories(categoriesList
            .filter(c => c.name.toLowerCase().includes(lowerQuery))
            .slice(0, 5)
            .map(c => ({ type: 'category' as const, ...c })));
    }

    if (!trimmedQuery) { setSearchResults(defaultProducts); setIsSearching(false); return; }

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
           setSearchResults(strictFilteredProducts.sort(() => 0.5 - Math.random()).slice(0, 4)); 
        }
      } catch (e: any) {} finally { if (!searchAbortRef.current?.signal.aborted) setIsSearching(false); }
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, defaultProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { router.push(`/search/${encodeURIComponent(searchQuery.trim())}`); closeMenus(); }
  };

  const handleCategoryClick = (href: string) => { router.push(href); closeMenus(); };
  const closeMenus = () => { setShowSearch(false); setShowDropdown(null); setSearchQuery(''); };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/') {
        e.preventDefault();
        const scrollToMap = () => {
            const target = document.getElementById('');
            if (target) {
                setMobileMenuOpen(false);
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
            }
        };
        if (pathname === '/') scrollToMap(); else router.push('/');
    } else { setMobileMenuOpen(false); }
  };

  const menuItems = [
    { title: 'Каталог', key: 'products', href: '/search/Люстра' },
    { title: 'Где купить', key: 'shops', href: '/map' }, 
    { title: 'Производство', key: 'custom', href: '/about' },
    { title: 'Сотрудничество', key: 'partners', href: '/about' },
  ];

  const MenuLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="block text-[14px] leading-relaxed text-gray-500 hover:text-black transition-colors py-[2px]">{children}</Link>
  );
  const CategoryTitle = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="text-[15px] font-medium text-gray-900 hover:text-black transition-colors block mb-2">{children}</Link>
  );
  const MenuHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[14px] font-semibold text-black uppercase tracking-widest mb-6">{children}</h3>
  );
  const MobileSubLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
    <Link href={href} onClick={onClick} className="block text-[14px] text-gray-500 hover:text-black py-2 transition-colors">{children}</Link>
  );
  const MobileSectionHeader = ({ children }: { children: React.ReactNode }) => (
     <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mt-8 mb-4">{children}</div>
  );
  const MobileCategoryTitle = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
     <Link href={href} onClick={onClick} className="font-medium text-gray-900 block py-1 mb-1 text-[15px]">{children}</Link>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${headerBgClass}`}>
        <div className="container mx-auto px-4 sm:px-8 max-w-[1600px]">
          
          <div className="flex items-center justify-between h-[70px] sm:h-[90px] relative">
            
            {/* LEFT: Menu Button (Mobile) & Links (Desktop) */}
            <div className={`flex items-center justify-start z-10 transition-opacity duration-300 ${textColorClass} w-1/4 xl:w-auto`}>
              
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className={`xl:hidden flex items-center justify-center w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] border transition-colors hover:bg-black/5 ${borderColorClass}`}
              >
                <FiMenu size={20} strokeWidth={1.5} />
              </button>

              <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
                {menuItems.map((item) => (
                    <Link 
                        key={item.key} href={item.href} onClick={(e) => handleLinkClick(e, item.href)}
                        className="text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-60 relative py-4 whitespace-nowrap"
                        onMouseEnter={() => {
                            if (item.key === 'products') { setShowDropdown('products'); setShowSearch(false); } 
                            else { setShowDropdown(null); }
                        }}
                    >
                        {item.title}
                    </Link>
                ))}
              </nav>
            </div>

            {/* CENTER: LOGO (Абсолютное центрирование) */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex justify-center transition-opacity duration-300 ${logoColorClass} w-1/2 xl:w-auto text-center`}>
              <Link href="/">
                <div className="flex flex-col items-center justify-center leading-none transition-colors duration-300">
                   {/* Адаптивный размер шрифта для мобилок */}
                   <h1 className='font-extrabold text-[15px] -ml-20 min-[375px]:text-[17px] sm:text-2xl lg:text-3xl tracking-[0.1em] sm:tracking-[0.2em] uppercase whitespace-nowrap'>
                      ВАМЛЮСТРА
                   </h1>
                </div>
              </Link>
            </div>

            {/* RIGHT: Search, User, Icons & Cart Button */}
            <div className={`flex items-center justify-end gap-3 sm:gap-6 2xl:gap-8 z-10 transition-all duration-300 ${textColorClass} w-1/4 xl:w-auto`}>
                
                {/* Search */}
                <button 
                    onClick={() => {
                        if (showDropdown === 'products' && showSearch) closeMenus();
                        else { setShowDropdown('products'); setShowSearch(true); }
                    }} 
                    className="flex items-center gap-2 hover:opacity-60 transition-opacity p-1 sm:p-0"
                >
                    <FiSearch size={20} strokeWidth={1.5} />
                    <span className="hidden xl:block text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-widest whitespace-nowrap">Поиск</span>
                </button>
                
                {/* User */}
                <Link href="/auth/register" className="hidden lg:block hover:opacity-60 transition-opacity p-1 sm:p-0">
                    <FiUser size={20} strokeWidth={1.5} />
                </Link>

                {/* Liked */}
                <Link href="/liked" className="relative hover:opacity-60 transition-opacity p-1 sm:p-0">
                    <FiHeart size={20} strokeWidth={1.5} />
                    {likedCount > 0 && (
                        <span className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-2 flex items-center justify-center h-[14px] min-w-[14px] px-[2px] text-[8px] font-bold leading-none rounded-full ${currentTextColor === 'white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            {likedCount}
                        </span>
                    )}
                </Link>

                {/* Cart */}
                <div className="relative group flex items-center">
                    <Link 
                        href="/cart" 
                        className={`hidden md:flex h-[45px] px-4 2xl:px-6 items-center justify-center border gap-3 transition-colors hover:bg-black/5 ${borderColorClass}`}
                    >
                        <span className="text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-widest mt-[1px] whitespace-nowrap">В Корзину</span>
                        <div className="relative">
                            <FiShoppingCart size={18} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className={`absolute -top-1.5 -right-2 flex items-center justify-center h-[14px] min-w-[14px] px-[2px] text-[8px] font-bold leading-none rounded-full ${currentTextColor === 'white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>
                    
                    <Link href="/cart" className="md:hidden relative hover:opacity-60 transition-opacity p-1">
                        <FiShoppingCart size={20} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-2 flex items-center justify-center h-[14px] min-w-[14px] px-[2px] text-[8px] font-bold leading-none rounded-full ${currentTextColor === 'white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart Dropdown Hover (Desktop Only) */}
                    <div className="hidden md:block absolute top-full right-0 pt-4 w-[380px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div className="bg-white border border-gray-100 shadow-2xl p-6 text-black cursor-default">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
                                <FiShoppingCart className="text-black" size={18} />
                                <h4 className="text-[14px] font-semibold uppercase tracking-widest text-black">В корзине</h4>
                                <span className="text-[14px] font-medium text-gray-400">{cartCount}</span>
                            </div>
                            {cartItems.length > 0 ? (
                                <>
                                    <div className="flex flex-col gap-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                                        {cartItems.slice(0, 4).map((item, idx) => {
                                            const imgUrl = getImgUrl(item);
                                            return (
                                                <Link href={`/products/${item.source}/${item.article}`} key={idx} className="flex gap-5 items-center group/item transition-colors">
                                                    <div className="w-[80px] h-[80px] flex-shrink-0 bg-[#F5F5F5] flex items-center justify-center overflow-hidden border border-gray-100">
                                                        {imgUrl !== '/placeholder.jpg' ? (
                                                            <img src={imgUrl} alt={item.name} className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply" />
                                                        ) : <div className="w-full h-full" />}
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-wider leading-[1.4] text-black mb-1 group-hover/item:opacity-70 transition-opacity">
                                                            {item.name || 'Загрузка...'}
                                                        </span>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-[12px] font-medium text-gray-500">{item.quantity} шт.</span>
                                                            <span className="text-[14px] font-bold text-black">
                                                                {item.price ? `${Number(item.price).toLocaleString('ru-RU')} ₽` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="border-t border-gray-100 pt-5">
                                        <div className="flex justify-between items-end mb-5">
                                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-widest">Итого:</span>
                                            <span className="text-[18px] font-bold text-black leading-none">
                                                {cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0).toLocaleString('ru-RU')} ₽
                                            </span>
                                        </div>
                                        <Link href="/cart" className="flex items-center justify-center w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
                                            Оформить заказ
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 flex items-center justify-center gap-2 text-[13px] font-medium text-gray-400 uppercase tracking-widest">
                                <img 
                                  src="/images/banners/bannersvamlustra.png" 
                                  alt="Icon" 
                                  className="w-25 h-25 object-cover opacity-100" 
                                />
                              </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </header>

      {/* --- DESKTOP CATALOG MEGA MENU --- */}
      <div 
        ref={dropdownRef}
        onMouseLeave={closeMenus}
        className={`hidden xl:block fixed top-[90px] left-0 w-full bg-white text-black z-40 shadow-2xl border-t border-gray-100 transition-all duration-500 ease-in-out
        ${showDropdown === 'products' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      >
        <div className="container mx-auto px-10 pt-10 pb-16 relative max-h-[90vh] custom-scrollbar">
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden flex justify-center ${showSearch ? 'max-h-[100px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
                <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl relative group">
                    <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={24} />
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="ПОИСК ПО КАТАЛОГУ..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full bg-transparent text-black py-3 pl-10 pr-12 text-xl tracking-widest border-b-2 border-gray-200 focus:border-black outline-none font-light transition-colors placeholder:text-gray-300"
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors">
                            <FiX size={24} />
                        </button>
                    )}
                </form>
            </div>

            <div className="relative w-full transition-all duration-300">
                <div className={`transition-all duration-500 ${searchQuery ? 'hidden opacity-0' : 'block opacity-100'}`}>
                    <div className="grid grid-cols-4 gap-x-12 gap-y-10 relative z-10 px-10">
                        {/* COLUMN 1 */}
                        <div>
                            <div className="mb-8">
                                <MenuHeader>Декоративное</MenuHeader>
                                <div className="space-y-8"> 
                                    <div>
                                        <CategoryTitle href="/search/Люстра">Люстры</CategoryTitle>
                                        <div className='space-y-1'>
                                            <MenuLink href="/search/Потолочная люстра">Люстры потолочные</MenuLink>
                                            <MenuLink href="/search/Подвесная люстра">Люстры подвесные</MenuLink>
                                            <MenuLink href="/search/Люстра на штанге">Люстры на штанге</MenuLink>
                                            <MenuLink href="/search/Каскадная">Люстры каскадные</MenuLink>
                                        </div>
                                    </div>
                                    <div>
                                        <CategoryTitle href="/search/Светильник">Светильники</CategoryTitle>
                                        <div className="space-y-1">
                                        <MenuLink href="/search/Накладной светильник">Накладные светильники</MenuLink>
                                        <MenuLink href="/search/Потолочный светильник">Потолочный светильники</MenuLink>
                                        <MenuLink href="/search/Подвесной светильник">Подвесные светильники</MenuLink>
                                        <MenuLink href="/search/Встраиваемый светильник">Встраиваемые светильники</MenuLink>
                                        </div>
                                    </div>
                                    <div>
                                        <CategoryTitle href="/search/Бра">Бра</CategoryTitle>
                                        <div className="space-y-1">
                                            <MenuLink href="/search/Настенный светильник">Настенные светильники</MenuLink>
                                        </div>
                                    </div>
                                    <div><CategoryTitle href="/search/Торшер">Торшеры</CategoryTitle></div>
                                    <div><CategoryTitle href="/search/Настольная лампа">Настольные лампы</CategoryTitle></div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2 */}
                        <div>
                            <MenuHeader>Функциональное</MenuHeader>
                            <div className="space-y-6">
                                <div>
                                    <CategoryTitle href="/search/Светодиодная лента">Светодиодные ленты</CategoryTitle>
                                    <div className="space-y-1">
                                        <MenuLink href="/search/Светодиодная лампа">Лампа и LED</MenuLink>
                                        <MenuLink href="/search/Аксессуары">Аксессуары</MenuLink>
                                        <MenuLink href="/search/Профиль для ленты">Профили разных типов</MenuLink>
                                    </div>                 
                                </div>
                                <div>
                                    <CategoryTitle href="/search/Трековый светильник">Трековые светильники</CategoryTitle>
                                    <div className="space-y-1">
                                        <MenuLink href="/search/Магнитный трековый светильник">Магнитные трековые</MenuLink>
                                        <MenuLink href="/search/Умный трековый светильник">Умные трековые</MenuLink>
                                        <MenuLink href="/search/Уличный трековый светильник">Уличные трековые</MenuLink>
                                        <MenuLink href="/search/Акцентный светильник">Акцентный светильник</MenuLink>
                                        <MenuLink href="/search/Линейный светильник">Линейный светильник</MenuLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3 */}
                        <div>
                            <MenuHeader>Уличное</MenuHeader>
                            <div className="space-y-6">
                                <div>
                                    <CategoryTitle href="/search/Уличный светильник">Уличные светильники</CategoryTitle>
                                    <div className="space-y-1">
                                        <MenuLink href="/search/Ландшафтный светильник">Ландшафтные</MenuLink>
                                        <MenuLink href="/search/Парковый светильник">Парковые</MenuLink>
                                        <MenuLink href="/search/Грунтовый светильник">Грунтовые светильники</MenuLink>
                                        <MenuLink href="/search/Настенно-уличный светильник">Настенно-уличные</MenuLink>
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
                                        <MenuLink href="/ElektroustnovohneIzdely/Retro">Серия Retro</MenuLink>
                                        <MenuLink href="/ElektroustnovohneIzdely/Vintage">Серия Vintage</MenuLink>
                                        <MenuLink href="/ElektroustnovohneIzdely/Configurator">Конфигуратор</MenuLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH RESULTS MEGA MENU */}
                <div className={`transition-all duration-500 max-w-6xl mx-auto ${searchQuery ? 'block opacity-100' : 'hidden opacity-0'}`}>
                    <div className="grid grid-cols-2 gap-16 pt-2">
                        <div>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                                <span className="text-xl text-gray-800 font-light">
                                    {isSearching ? 'ПОИСК...' : `НАЙДЕНО ${searchResults.length} ТОВАРА`}
                                </span>
                                {searchQuery && searchResults.length > 0 && (
                                    <Link href={`/search/${encodeURIComponent(searchQuery)}`} onClick={closeMenus} className="text-xs uppercase tracking-widest font-semibold text-gray-800 hover:text-black flex items-center gap-1">
                                        Показать все <FiChevronRight />
                                    </Link>
                                )}
                            </div>
                            <div className="flex flex-col gap-6">
                                {isSearching ? (
                                    <div className="py-10 text-gray-300 font-light uppercase tracking-widest">Ищем...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((product) => {
                                        const imgUrl = getImgUrl(product);
                                        return (
                                            <Link 
                                                key={product._id || product.id}
                                                href={`/products/${product.source}/${product.article}`} 
                                                onClick={closeMenus}
                                                className="group flex items-start gap-5"
                                            >
                                                <div className="w-[90px] h-[90px] flex-shrink-0 bg-[#fafafa] border border-transparent group-hover:border-gray-200 overflow-hidden flex items-center justify-center transition-colors">
                                                    {imgUrl !== '/placeholder.jpg' ? (
                                                        <img src={imgUrl} alt={product.name} className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply" />
                                                    ) : <div className="w-full h-full bg-gray-50" />}
                                                </div>
                                                <div className="flex flex-col pt-1">
                                                    <span className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
                                                        {product.article ? `Арт. ${product.article}` : ''}
                                                    </span>
                                                    <span className="text-[14px] leading-tight text-gray-800 group-hover:text-black transition-colors mb-2">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-[15px] font-bold text-black">
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

                        <div>
                            {foundCategories.length > 0 ? (
                                <>
                                    <div className="border-b border-gray-100 pb-3 mb-6">
                                        <span className="text-xl text-gray-800 font-light uppercase">
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
                                <div className='h-full flex flex-col pb-6 opacity-60'>
                                    <div className="border-b border-gray-100 pb-3 mb-6">
                                        <span className="text-xl text-gray-800 font-light uppercase">Категории не найдены</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Попробуйте изменить запрос</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH OVERLAY --- */}
      <div className={`xl:hidden fixed inset-0 bg-white z-[100] transition-all duration-300 flex flex-col pt-12 sm:pt-6 px-4 ${showSearch && !showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="container mx-auto max-w-[1400px] h-full flex flex-col relative">
            <div className="flex items-center justify-between mb-6 flex-shrink-0 relative border-b border-gray-100 pb-4 mt-2">
                 <button onClick={closeMenus} className="absolute right-0 top-0 p-2 text-gray-400 hover:text-black transition-colors z-50">
                    <FiX size={28} />
                 </button>
                 <form onSubmit={handleSearchSubmit} className="w-full pr-14">
                      <div className="relative flex items-center">
                        <FiSearch size={22} className="text-gray-400 absolute left-0" />
                        <input 
                            type="text" 
                            placeholder="ПОИСК..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full bg-transparent text-black py-2 pl-10 text-[16px] sm:text-xl outline-none font-light uppercase tracking-widest placeholder:text-gray-300" 
                        />
                      </div>
                 </form>
            </div>
            <div className={`w-full flex-1 overflow-y-auto pb-10 transition-all duration-500 ease-out custom-scrollbar ${showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 min-h-[400px]">
                    <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                            <span className="text-sm md:text-xl text-gray-800 font-light uppercase tracking-widest">
                                {isSearching ? 'ПОИСК...' : `${searchResults.length} ТОВАРА`}
                            </span>
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
                                            onClick={closeMenus}
                                            className="group flex items-start gap-4"
                                        >
                                            <div className="w-[80px] h-[80px] flex-shrink-0 bg-[#fafafa] border border-gray-100 overflow-hidden flex items-center justify-center">
                                                {imgUrl !== '/placeholder.jpg' && <img src={imgUrl} alt={product.name} className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply" />}
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-[12px] leading-tight text-gray-800 mb-2 line-clamp-2">{product.name}</span>
                                                <span className="text-[14px] font-bold text-black">{product.price ? `${Number(product.price).toLocaleString('ru-RU')} ₽` : ''}</span>
                                            </div>
                                        </Link>
                                    );
                                })
                             ) : (
                                <div className="text-gray-400 font-light text-sm">Ничего не найдено</div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>
      
      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-[60] xl:hidden pointer-events-none`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 left-0 w-[85%] sm:w-[400px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full pt-2">
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
                    <span className="font-bold text-[16px] sm:text-[18px] text-black uppercase tracking-[0.2em]">Меню</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="flex-1 px-5 sm:px-6 py-6 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-6">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                {item.key === 'products' ? (
                                    <div>
                                        <div onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)} className="flex items-center justify-between w-full text-[15px] font-semibold text-black cursor-pointer group py-1">
                                            <span className="uppercase tracking-[0.1em]">{item.title}</span>
                                            <span className="text-gray-400 group-hover:text-black transition-colors">
                                                {mobileCatalogOpen ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                            </span>
                                        </div>
                                        <div className={`overflow-hidden transition-all duration-300 ${mobileCatalogOpen ? 'max-h-[3000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                            
                                            <MobileSectionHeader>Декоративное</MobileSectionHeader>
                                            
                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Люстра" onClick={() => setMobileMenuOpen(false)}>Люстры</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Потолочная люстра">Люстры потолочные</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Подвесная люстра">Люстры подвесные</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Люстра на штанге">Люстры на штанге</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Каскадная люстра">Люстры каскадные</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Трековый светильник" onClick={() => setMobileMenuOpen(false)}>Трековые светильники</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Магнитный трековый светильник">Магнитные трековые</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Умный трековый светильник">Умные трековые</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Уличный трековый светильник">Уличные трековые</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Подвесной светильник" onClick={() => setMobileMenuOpen(false)}>Подвесные светильники</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Встраиваемый светильник">Встраиваемые светильники</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Бра" onClick={() => setMobileMenuOpen(false)}>Бра</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Настенный светильник">Настенные светильники</MobileSubLink>
                                                </div>
                                            </div>

                                            <div className="mb-6"><MobileCategoryTitle href="/search/Торшер" onClick={() => setMobileMenuOpen(false)}>Торшеры</MobileCategoryTitle></div>
                                            <div className="mb-6"><MobileCategoryTitle href="/search/Настольная лампа" onClick={() => setMobileMenuOpen(false)}>Настольные лампы</MobileCategoryTitle></div>

                                            <MobileSectionHeader>Функциональное</MobileSectionHeader>
                                            
                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Светодиодная лента" onClick={() => setMobileMenuOpen(false)}>Светодиодные ленты</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Светодиодная лампа">Лампа и LED</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Аксессуары">Аксессуары</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Профиль для ленты">Профили разных типов</MobileSubLink>
                                                </div>
                                            </div>

                                            <MobileSectionHeader>Уличное</MobileSectionHeader>

                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Уличный светильник" onClick={() => setMobileMenuOpen(false)}>Уличные светильники</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Ландшафтный светильник">Ландшафтные</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Парковый светильник">Парковые</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Грунтовый светильник">Грунтовые светильники</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Настенно-уличный светильник">Настенно-уличные</MobileSubLink>
                                                </div>
                                            </div>

                                            <MobileSectionHeader>Электроустановочное</MobileSectionHeader>

                                            <div className="mb-6">
                                                <MobileCategoryTitle href="/search/Встраиваемая серия" onClick={() => setMobileMenuOpen(false)}>Встраиваемые серии</MobileCategoryTitle>
                                                <div className="space-y-1 pl-2 border-l border-gray-100 ml-1 mt-2">
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Gallant">Серия Gallant</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Retro">Серия Retro</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Vintage">Серия Vintage</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Влагозащитная серия">Влагозащитная серия</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/search/Выдвижной лючок">Выдвижные лючки</MobileSubLink>
                                                    <MobileSubLink onClick={() => setMobileMenuOpen(false)} href="/ElektroustnovohneIzdely/Configurator">Конфигуратор</MobileSubLink>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <Link 
                                        href={item.href}
                                        onClick={(e) => handleLinkClick(e, item.href)}
                                        className="block text-[15px] font-semibold uppercase tracking-[0.1em] text-black hover:text-gray-500 transition-colors py-1"
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
    </>
  );
};
 
export default Header;
