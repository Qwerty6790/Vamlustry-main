'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ProductI } from '@/types/product';
import { toast, Toaster } from 'sonner';
import { BASE_URL, getImageUrl } from '@/utils/constants';
import Image from 'next/image';

// Список поддерживаемых производителей из бэкенда
const VALID_SOURCES = [
  'OdeonLight',
  'Stluce',
  'Favourite',
  'LightStar',
  'Maytoni',
  'ElektroStandard',
  'Denkirs',
  'Werkel',
  'KinkLight',
  'NovotechLight',
  'Lumion',
  'Artelamp',
  'Sonex',
  'Voltum',
  'ЧТК',
  'Donel',
  'Donellux'
];

// Информация о брендах с путями к логотипам
const BRAND_LOGOS = {
  'OdeonLight': '/images/brands/odeonlightlogo.png',
  'Stlucet': '/images/brands/stlucelogo.webp',
  'Favourite': '/images/brands/favouritelogo.png',
  'LightStar': '/images/brands/lightstarlogo.png',
  'Maytoni': '/images/brands/maytonilogo.png',
  'ElektroStandard': '/images/brands/elektrostandartlogo.png',
  'Denkirs': '/images/brands/denkirslogo.png',
  'Werkel': '/images/brands/werkellogo.png',
  'KinkLight': '/images/brands/kinklightlogo.png',
  'NovotechLight': '/images/brands/novotechlogo.png',
  'Lumion': '/images/brands/lumionlogo.png',
  'Artelamp': '/images/brands/artelamplogo.png',
  'Sonex': '/images/brands/sonexlogo.png',
  'Voltum': '/images/brands/voltumLogo.png',
  'ЧТК': '/images/brands/chtklogo.webp',
  'Donel': '/images/brands/donellogo.svg',
  'Donellux': '/images/brands/donellogo.svg'
};

// Список категорий для рекомендаций из бэкенда
const CATEGORY_SUGGESTIONS = [
  { category: 'Потолочная Люстра', keywords: ['Люстра'] },
  { category: 'Бра', keywords: ['бра'] },
  { category: 'Настольные Лампы', keywords: ['лампа'] },
  { category: 'Светильники', keywords: ['светильник'] },
  { category: 'Трековые светильники', keywords: ['трек'] },
  { category: 'Споты', keywords: ['спот'] },
];

const ITEMS_PER_PAGE = 50; // Количество товаров на странице

// Компонент пагинации
const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Максимальное количество видимых номеров страниц

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === '...' ? (
        <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
      ) : (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-red-700 text-white' : 'bg-[#222] text-gray-300 hover:bg-[#333]'
          } transition-colors`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-[#222] text-gray-300 hover:bg-[#333]'}`}
      >
        Назад
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-[#222] text-gray-300 hover:bg-[#333]'}`}
      >
        Вперед
      </button>
    </div>
  );
};

// Функция обработки URL изображения, как в [article].tsx
const processImageUrl = (url: string | undefined): string => {
  if (!url) return '/placeholder-image.jpg'; // Placeholder image path
  return getImageUrl(url);
};

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(''); // Для отложенного поиска
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ProductI>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Partial<ProductI>>({
    name: '',
    article: '',
    price: 0,
    stock: 0,
    source: '',
    imageAddresses: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // 'all' или название производителя
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0); // Общее количество найденных товаров
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [visibleBrandsStart, setVisibleBrandsStart] = useState<number>(0);
  const brandsPerView = 8; // Количество видимых брендов в карусели

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref для таймаута поиска

  // Функция загрузки товаров с пагинацией, фильтрацией и поиском
  const fetchProducts = useCallback(async (page: number, category: string, search: string) => {
    setLoading(true);
    try {
      // Формируем URL в зависимости от выбранного производителя
      let apiUrl = `${BASE_URL}/api/products`;
      
      // Если выбран конкретный производитель (не 'all'), добавляем его в путь URL
      if (category !== 'all') {
        apiUrl = `${BASE_URL}/api/products/${encodeURIComponent(category)}`;
      }
      
      // Параметры запроса
      const params: Record<string, any> = {
        limit: ITEMS_PER_PAGE,
        page: page,
        showHidden: true, // Всегда запрашиваем скрытые товары в админке
      };

      // Если выбран конкретный производитель (не 'all'), добавляем его также как параметр source
      // для обеспечения совместимости с API
      if (category !== 'all') {
        params.source = category;
      }

      // Добавляем параметр поиска, если он не пустой
      if (search) {
        // Используем 'name' для поиска по имени/артикулу, как в каталоге
        params.name = search;
      }

      console.log('Запрашиваемый URL для админки:', apiUrl);
      console.log('Параметры запроса:', params);

      const response = await axios.get(apiUrl, { params });

      // Проверяем структуру ответа
      if (response.data && response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages || 1);
          setTotalProducts(response.data.totalProducts || 0); // Обновляем общее количество
          console.log('Товары загружены:', response.data.products.length, 'из', response.data.totalProducts);
          console.log('Страниц:', response.data.totalPages);
      } else {
          console.error('Неверный формат ответа API:', response.data);
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
          toast.error('Не удалось обработать ответ сервера');
      }

    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
      // Проверяем статус ошибки
      if (axios.isAxiosError(error) && error.response?.status === 404) {
         // Если 404, возможно, нет товаров по такому запросу
         setProducts([]);
         setTotalPages(1);
         setTotalProducts(0);
         toast.info('Товары по заданным параметрам не найдены');
      } else {
         toast.error('Не удалось загрузить список товаров');
         // Оставляем старые данные или очищаем? Лучше очистить, чтобы не вводить в заблуждение
         setProducts([]);
         setTotalPages(1);
         setTotalProducts(0);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Зависимостей нет, так как все параметры передаются

  // Отложенное обновление поискового запроса для запроса к API
  useEffect(() => {
      if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
          setDebouncedSearchTerm(searchTerm);
          setCurrentPage(1); // Сбрасываем на первую страницу при поиске
      }, 500); // Задержка 500 мс

      return () => {
          if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
          }
      };
  }, [searchTerm]);

  // Загрузка товаров при изменении страницы, категории или поискового запроса
  useEffect(() => {
    fetchProducts(currentPage, selectedCategory, debouncedSearchTerm);
  }, [currentPage, selectedCategory, debouncedSearchTerm, fetchProducts]);

  // Обработчик изменения категории (производителя)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Сброс на первую страницу при смене категории
  };

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Дополнительно можно плавно прокрутить вверх страницы
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Обработчик изменения полей при редактировании
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    // Преобразуем числовые значения
    if (name === 'price' || name === 'stock') {
        // Учитываем возможность ввода пустой строки или нечисловых значений
        parsedValue = value === '' ? '' : parseFloat(value);
        if (isNaN(parsedValue)) {
            parsedValue = ''; // Если не число, сбрасываем
        }
    }

    // Обрабатываем изображения с корректным разделением
    if (name === 'imageAddresses') {
      // Не преобразуем сразу в массив, сохраняем строку для редактирования
      parsedValue = value;
    }

    setEditFormData({
      ...editFormData,
      [name]: parsedValue
    });
  };

  // Обработчик изменения полей при добавлении нового товара
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    // Преобразуем числовые значения
    if (name === 'price' || name === 'stock') {
        parsedValue = value === '' ? '' : parseFloat(value);
         if (isNaN(parsedValue)) {
            parsedValue = ''; // Если не число, сбрасываем
        }
    }

    // Обрабатываем изображения с корректным разделением
    if (name === 'imageAddresses') {
      // Не преобразуем сразу в массив, сохраняем строку для редактирования
      parsedValue = value;
    }

    setNewProduct({
      ...newProduct,
      [name]: parsedValue
    });
  };

  // Обработчик изменения названия товара для предложения категорий
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Обновляем данные нового товара
    setNewProduct({
      ...newProduct,
      [name]: value
    });

    // Если это изменение в поле name, предлагаем категории
    if (name === 'name' && value) {
      const suggestions = CATEGORY_SUGGESTIONS.filter(({ keywords }) =>
        keywords.some(keyword => value.toLowerCase().includes(keyword.toLowerCase()))
      ).map(({ category }) => category);

      setSuggestedCategories(suggestions);
    } else {
         setSuggestedCategories([]); // Очищаем предложения, если поле пустое
    }
  };

  // Функция нормализации URL изображения, упрощенная версия из catalogofsearch.tsx
  const normalizeImageUrl = (originalUrl: string): string | null => {
    if (!originalUrl) return null;
    
    // Проверяем и конвертируем HTTP на HTTPS для предотвращения mixed content
    let url = originalUrl;
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    
    return url;
  };

  // Обработчики для просмотра изображений товара, соответствующие логике в [article].tsx
  const getProductMainImage = (product: ProductI): string | null => {
    if (!product) return null;
    
    // Extract all available images with improved handling
    let allImages: string[] = [];
    
    // Сначала проверяем imageAddress, затем imageAddresses
    if (typeof product.imageAddress === 'string' && product.imageAddress) {
      allImages = [product.imageAddress];
    } else if (Array.isArray(product.imageAddress) && product.imageAddress.length > 0) {
      allImages = product.imageAddress.filter(Boolean);
    } else if (typeof product.imageAddresses === 'string' && product.imageAddresses) {
      allImages = [product.imageAddresses];
    } else if (Array.isArray(product.imageAddresses) && product.imageAddresses.length > 0) {
      allImages = product.imageAddresses.filter(Boolean);
    }
    
    return allImages.length > 0 ? allImages[0] : null;
  };

  // Начать редактирование товара
  const startEdit = (product: ProductI) => {
    setEditProductId(product._id);

    // Определяем значение imageAddresses для отображения в форме
    // Получаем все доступные изображения товара
    let allImages: string[] = [];
    
    // Приоритет логики как в getProductMainImage
    if (typeof product.imageAddress === 'string' && product.imageAddress) {
      allImages = [product.imageAddress];
    } else if (Array.isArray(product.imageAddress) && product.imageAddress.length > 0) {
      allImages = product.imageAddress.filter(Boolean);
    } else if (typeof product.imageAddresses === 'string' && product.imageAddresses) {
      allImages = [product.imageAddresses];
    } else if (Array.isArray(product.imageAddresses) && product.imageAddresses.length > 0) {
      allImages = product.imageAddresses.filter(Boolean);
    }

    setEditFormData({
      ...product,
      imageAddresses: allImages.join(', '),
      // Корректное преобразование price и stock
      price: product.price,
      stock: product.stock
    });
  };

  // Отмена редактирования
  const cancelEdit = () => {
    setEditProductId(null);
    setEditFormData({});
  };

  // Сохранение изменений товара
  const saveProductChanges = async () => {
    setLoading(true);
    try {
      // Преобразование строки imageAddresses в массив
      let imageAddressesArray: string[] = [];
      
      // Только если поле не пустое, обрабатываем его
      if (editFormData.imageAddresses) {
        // Разделяем по запятой, удаляем пробелы и фильтруем пустые значения
        imageAddressesArray = String(editFormData.imageAddresses)
          .split(',')
          .map(url => url.trim())
          .filter(url => url.length > 0)
          .map(url => normalizeImageUrl(url) || url); // Применяем нормализацию URL
      }

      // Корректное преобразование цены и количества для сохранения
      const price = typeof editFormData.price === 'string' 
        ? parseFloat(editFormData.price) || 0 
        : editFormData.price || 0;
        
      const stock = typeof editFormData.stock === 'string' 
        ? parseFloat(editFormData.stock) || 0 
        : editFormData.stock || 0;

      const updatedProduct = {
        ...editFormData,
        imageAddresses: imageAddressesArray,
        // Обеспечиваем, что imageAddress тоже обновляется для совместимости
        imageAddress: imageAddressesArray,
        price: price,
        stock: stock
      };

      // Используем маршрут для обновления товара
      await axios.patch(`${BASE_URL}/api/products/${editProductId}`, updatedProduct);

      // Обновляем локальный список товаров - ЗАГРУЖАЕМ ЗАНОВО ТЕКУЩУЮ СТРАНИЦУ
      await fetchProducts(currentPage, selectedCategory, debouncedSearchTerm);

      setEditProductId(null);
      setEditFormData({});
      toast.success('Товар успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      toast.error('Не удалось обновить товар');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения выбранного файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    // Создаем предпросмотр изображения
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Сброс выбранного файла
  const resetFileInput = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Обновляем метод добавления товара для работы с файлами
  const addProduct = async () => {
    setLoading(true);
    try {
      // Преобразование строки imageAddresses в массив
      let imageAddressesArray: string[] = [];
      
      // Только если поле не пустое, обрабатываем его
      if (newProduct.imageAddresses) {
        // Если строка
        if (typeof newProduct.imageAddresses === 'string') {
          imageAddressesArray = newProduct.imageAddresses
            .split(',')
            .map(url => url.trim())
            .filter(url => url.length > 0)
            .map(url => normalizeImageUrl(url) || url); // Применяем нормализацию URL
        } 
        // Если уже массив
        else if (Array.isArray(newProduct.imageAddresses)) {
          imageAddressesArray = newProduct.imageAddresses
            .filter(url => typeof url === 'string' && url.trim().length > 0)
            .map(url => normalizeImageUrl(url) || url); // Применяем нормализацию URL
        }
      }

      // Корректное преобразование цены и количества для сохранения
      const price = typeof newProduct.price === 'string' 
        ? parseFloat(newProduct.price) || 0 
        : newProduct.price || 0;
        
      const stock = typeof newProduct.stock === 'string' 
        ? parseFloat(newProduct.stock) || 0 
        : newProduct.stock || 0;

      const productToAdd = {
        ...newProduct,
        imageAddresses: imageAddressesArray,
        // Добавляем imageAddress для совместимости
        imageAddress: imageAddressesArray,
        price: price,
        stock: stock
      };

      if (!productToAdd.name || !productToAdd.article || !productToAdd.source || productToAdd.price === undefined || productToAdd.stock === undefined) {
        toast.error('Заполните все обязательные поля (Название, Артикул, Цена, Остаток, Производитель)');
        return;
      }
      if (isNaN(price) || isNaN(stock)) {
        toast.error('Цена и остаток должны быть числовыми значениями.');
        return;
      }

      // Используем маршрут для создания товара
      const formData = new FormData();
      formData.append('name', productToAdd.name.toString());
      formData.append('article', productToAdd.article.toString());
      formData.append('price', price.toString()); // Отправляем числовое значение
      formData.append('stock', stock.toString()); // Отправляем числовое значение
      formData.append('source', productToAdd.source.toString());

      // Если есть выбранный файл, добавляем его в formData
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      // Если есть URL изображений, добавляем их как JSON строку
      else if (imageAddressesArray.length > 0) {
        // Добавляем и imageAddress и imageAddresses для совместимости
        formData.append('imageAddress', JSON.stringify(imageAddressesArray));
        formData.append('imageAddresses', JSON.stringify(imageAddressesArray));
      }

      await axios.post(`${BASE_URL}/api/add-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // После успешного добавления перезагружаем текущую страницу товаров
      await fetchProducts(currentPage, selectedCategory, debouncedSearchTerm);

      setNewProduct({
        name: '',
        article: '',
        price: 0,
        stock: 0,
        source: '',
        imageAddresses: [],
      });
      setShowAddForm(false);
      resetFileInput();
      toast.success('Товар успешно добавлен');
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      toast.error('Не удалось добавить товар');
    } finally {
      setLoading(false);
    }
  };

  // Скрытие/отображение товара (изменение доступности)
  const toggleProductVisibility = async (productId: string, currentStock: string | number) => {
    try {
      // Используем маршрут для обновления видимости товара
      // Если товар в наличии, устанавливаем stock в 0 и visible в false
      // Иначе stock в 10 и visible в true
      const newStock = currentStock === '0' || currentStock === 0 ? 10 : 0;
      const visible = newStock > 0;
      const isHidden = !visible; // isHidden противоположен visible

      // Обновляем видимость (отправляем оба параметра для совместимости)
      await axios.patch(`${BASE_URL}/api/products/${productId}/visibility`, { visible, isHidden });

      // Затем обновляем stock
      await axios.patch(`${BASE_URL}/api/products/${productId}`, { stock: newStock });

      // Обновляем локальный список товаров - ЗАГРУЖАЕМ ЗАНОВО ТЕКУЩУЮ СТРАНИЦУ
      await fetchProducts(currentPage, selectedCategory, debouncedSearchTerm);

      toast.success(`Товар ${newStock === 0 ? 'скрыт' : 'отображается'}`);
    } catch (error) {
      console.error('Ошибка при изменении видимости товара:', error);
      toast.error('Не удалось изменить видимость товара');
    }
  };

  // Удаление товара
  const deleteProduct = async (productId: string) => {
    // Запрашиваем подтверждение перед удалением
    if (typeof window !== 'undefined' && !window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      // Используем маршрут для удаления товара
      await axios.delete(`${BASE_URL}/api/products/${productId}`);

      // После успешного удаления перезагружаем текущую страницу
      // Возможно, стоит перейти на предыдущую страницу, если на текущей больше нет товаров
      await fetchProducts(currentPage, selectedCategory, debouncedSearchTerm);
      // TODO: Добавить логику для перехода на предыдущую страницу, если текущая стала пустой

      toast.success('Товар успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      toast.error('Не удалось удалить товар');
    }
  };

  // Обработчики для карусели брендов
  const handlePrevBrands = () => {
    setVisibleBrandsStart(prev => Math.max(0, prev - brandsPerView));
  };
  
  const handleNextBrands = () => {
    setVisibleBrandsStart(prev => Math.min(VALID_SOURCES.length - brandsPerView, prev + brandsPerView));
  };

  return (
    <div className="max-w-7xl mt-52 mx-auto p-4 md:p-8 text-white">
      <Toaster position="top-center" richColors />

      <h1 className="text-4xl font-bold text-center mb-12 text-white relative">
        <span className="relative">
          Управление товарами
          <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-700"></span>
        </span>
      </h1>

      {/* Навигация */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-wrap gap-4 p-2 rounded-lg border border-red-900/30">
          <Link href="/admin" className="px-6 py-3 bg-[#121212] text-white rounded-lg hover:bg-[#1a1a1a] transition-all">
            Заказы
          </Link>
          <Link href="/admin/products" className="px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-all shadow-lg shadow-red-900/20">
            Управление товарами
          </Link>
          <Link href="/" className="px-6 py-3 bg-[#121212] text-white rounded-lg hover:bg-[#1a1a1a] transition-all">
            На сайт
          </Link>
        </div>
      </div>
      
      {/* Секция брендов с логотипами и карусель */}
      <div className="mb-12 bg-[#0a0a0a] p-6 rounded-lg border border-red-900/30 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white relative inline-block">
            <span className="relative">Бренды</span>
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-700/50"></span>
          </h2>
          
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-all text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Сбросить фильтр
            </button>
          )}
        </div>
        
        <div className="relative">
          {/* Левая стрелка для прокрутки */}
          <button 
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#111] bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center ${
              visibleBrandsStart <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-red-900/50'
            }`}
            onClick={handlePrevBrands}
            disabled={visibleBrandsStart <= 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Карусель брендов */}
          <div className="flex gap-4 overflow-hidden px-12">
            {VALID_SOURCES.slice(visibleBrandsStart, visibleBrandsStart + brandsPerView).map(source => {
              const brandName = source.replace('Product', '');
              const isSelected = selectedCategory === source;
              const logoPath = BRAND_LOGOS[source as keyof typeof BRAND_LOGOS] || '';
              
              return (
                <div 
                  key={source}
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'all' : source);
                    setCurrentPage(1);
                  }}
                  className={`relative flex-shrink-0 flex flex-col items-center justify-center p-4 border ${
                    isSelected ? 'border-red-700 bg-red-900/10' : 'border-[#222] bg-[#0f0f0f]'
                  } rounded-lg cursor-pointer hover:bg-[#151515] transition-all group overflow-hidden min-w-[120px]`}
                >
                  <div className="w-full h-full   mb-2 flex items-center justify-center p-1 overflow-hidden">
                    {/* Если есть логотип, отображаем его, иначе показываем инициалы */}
                    <Image
                      src={logoPath}
                      alt={brandName}
                      width={60}
                      height={60}
                      className="object-contain"
                      onError={(e) => {
                        // Если изображение не найдено, показываем инициалы
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Показываем div с инициалами
                        const parent = target.parentElement;
                        if (parent) {
                          const initialsDiv = document.createElement('div');
                          initialsDiv.className = 'text-sm font-bold text-[#111] uppercase flex items-center justify-center w-full h-full';
                          initialsDiv.textContent = brandName.substring(0, 2);
                          parent.appendChild(initialsDiv);
                        }
                      }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-red-400' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                    {brandName}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-4 h-4 bg-red-700 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Правая стрелка для прокрутки */}
          <button 
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#111] bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center ${
              visibleBrandsStart >= VALID_SOURCES.length - brandsPerView ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-red-900/50'
            }`}
            onClick={handleNextBrands}
            disabled={visibleBrandsStart >= VALID_SOURCES.length - brandsPerView}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-gradient-to-br from-[#0a0a0a] to-[#111] p-6 rounded-lg border border-red-900/30 shadow-lg">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Поиск по названию или артикулу"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 border border-[#222] bg-[#010101] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3 ${showAddForm ? 'bg-gray-700' : 'bg-gradient-to-r from-red-800 to-red-700'} text-white rounded-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-700/50 shadow-lg shadow-red-900/10 flex items-center justify-center`}
        >
          {showAddForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Отменить
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Добавить товар
            </>
          )}
        </button>
      </div>

      {/* Форма добавления нового товара (без изменений) */}
      {showAddForm && (
        <div className="mb-10 p-6 border border-red-900/30 rounded-lg bg-[#0a0a0a] animate-slide-down shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-white relative inline-block">
            <span className="relative">Добавить новый товар</span>
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-700/50"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-gray-300 mb-2 font-medium">Название товара*</label>
              <input
                type="text"
                name="name"
                value={newProduct.name || ''}
                onChange={handleNameChange}
                className="w-full p-3 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                required
              />
              {suggestedCategories.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-400">Рекомендуемые категории: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {suggestedCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-red-900/20 text-red-300 border border-red-700/30 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-2 font-medium">Артикул*</label>
              <input
                type="text"
                name="article"
                value={newProduct.article || ''}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-2 font-medium">Цена*</label>
              <input
                type="number"
                name="price"
                value={newProduct.price || ''}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 appearance-none m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Стили для скрытия стрелок в number input
                step="0.01" // Разрешаем копейки
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-2 font-medium">Остаток*</label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock || ''}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 appearance-none m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="1" // Целые числа для остатка
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-2 font-medium">Производитель/Категория*</label>
              <select
                name="source"
                value={newProduct.source || ''}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                required
              >
                <option value="">Выберите производителя</option>
                {VALID_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source.replace('Product', '')}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 mb-2 font-medium">Ссылки на изображения (через запятую)</label>
              <textarea
                name="imageAddresses"
                value={typeof newProduct.imageAddresses === 'string' 
                  ? newProduct.imageAddresses 
                  : Array.isArray(newProduct.imageAddresses) 
                    ? newProduct.imageAddresses.join(', ') 
                    : ''}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-[#222] bg-[#010101] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                rows={3}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              
              {/* Предпросмотр изображений для добавления */}
              {(() => {
                // Получаем массив URL изображений
                let imageUrls: string[] = [];
                
                if (typeof newProduct.imageAddresses === 'string' && newProduct.imageAddresses) {
                  imageUrls = newProduct.imageAddresses.split(',').map(url => url.trim()).filter(url => url.length > 0);
                } else if (Array.isArray(newProduct.imageAddresses)) {
                  imageUrls = newProduct.imageAddresses.filter(url => url && typeof url === 'string');
                } else if (typeof newProduct.imageAddress === 'string' && newProduct.imageAddress) {
                  imageUrls = [newProduct.imageAddress];
                } else if (Array.isArray(newProduct.imageAddress)) {
                  imageUrls = newProduct.imageAddress.filter(url => url && typeof url === 'string');
                }
                
                if (imageUrls.length > 0) {
                  return (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative h-16 bg-white p-1 rounded border border-[#333]">
                          <Image
                            src={processImageUrl(url)}
                            alt={`Изображение ${index + 1}`}
                            fill={true}
                            className="p-1 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                              target.onerror = null;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Загрузить изображение</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 p-3 border border-dashed border-red-700/30 bg-[#0f0f0f] rounded-lg text-center cursor-pointer hover:bg-[#111] transition-colors">
                  <input
                    type="file"
                    id="fileInput"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center py-3">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span className="text-sm text-gray-400">
                      {selectedFile ? `Выбран файл: ${selectedFile.name}` : 'Перетащите файл или нажмите здесь для загрузки'}
                    </span>
                  </label>
                </div>
                <div className="w-24 h-24 bg-[#0f0f0f] rounded-lg border border-[#222] flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewUrl}
                        alt="Предпросмотр"
                        fill={true}
                        className="object-contain"
                      />
                      <button
                        onClick={resetFileInput}
                        className="absolute top-1 right-1 bg-red-800 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Предпросмотр</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 mr-4 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-all"
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              onClick={addProduct}
              className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Добавление...' : 'Добавить товар'}
            </button>
          </div>
        </div>
      )}

      {/* Список товаров */}
      {loading && products.length === 0 ? ( // Показываем начальную загрузку только если список пуст
        <div className="text-center text-lg py-12 animate-pulse-slow">Загрузка товаров...</div>
      ) : (
        <div className="animate-fade-in">
          {/* Отображаем общее количество найденных товаров */}
          <div className="mb-6 text-gray-300 bg-[#0a0a0a] p-4 rounded-lg border border-red-900/20 inline-block">
            Найдено товаров: <span className="font-medium text-white">{totalProducts}</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-red-900/30 shadow-xl">
            <table className="min-w-full bg-[#010101]">
              <thead>
                <tr className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-left border-b border-red-900/20">
                  <th className="p-4 text-gray-300">Изображение</th>
                  <th className="p-4 text-gray-300">Название</th>
                  <th className="p-4 text-gray-300">Артикул</th>
                  <th className="p-4 text-gray-300">Цена</th>
                  <th className="p-4 text-gray-300">Остаток</th>
                  <th className="p-4 text-gray-300">Категория</th>
                  <th className="p-4 text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody>
                {/* Отображаем спиннер поверх таблицы во время загрузки */}
                {loading && (
                    <tr>
                        <td colSpan={7} className="p-6 text-center relative">
                            <div className="absolute inset-0 bg-[#010101] bg-opacity-70 flex justify-center items-center z-10">
                                <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </td>
                    </tr>
                )}
                {/* Отображаем товары для текущей страницы */}
                {products.map(product => (
                  <tr key={product._id} className={`border-t border-[#222] hover:bg-[#0a0a0a] transition-colors ${loading ? 'opacity-50' : ''}`}>
                    {editProductId === product._id ? (
                      // Режим редактирования (без изменений)
                      <td colSpan={7} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-gray-300 mb-2 font-medium">Название товара</label>
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name || ''}
                              onChange={handleEditChange}
                              className="w-full p-3 border border-[#222] bg-[#111] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-medium">Артикул</label>
                            <input
                              type="text"
                              name="article"
                              value={editFormData.article || ''}
                              onChange={handleEditChange}
                              className="w-full p-3 border border-[#222] bg-[#111] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-medium">Цена</label>
                            <input
                              type="number"
                              name="price"
                              value={editFormData.price || ''}
                              onChange={handleEditChange}
                              className="w-full p-3 border border-[#222] bg-[#111] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 appearance-none m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-medium">Остаток</label>
                            <input
                              type="number"
                              name="stock"
                              value={editFormData.stock || ''}
                              onChange={handleEditChange}
                              className="w-full p-3 border border-[#222] bg-[#111] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700 appearance-none m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              step="1"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-medium">Производитель/Категория</label>
                             <select
                                name="source"
                                value={editFormData.source || ''}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-[#222] bg-[#111] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                             >
                                <option value="">Выберите производителя</option>
                                {VALID_SOURCES.map((source) => (
                                <option key={source} value={source}>
                                    {source.replace('Product', '')}
                                </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2 font-medium">Ссылки на изображения (через запятую)</label>
                            <textarea
                              name="imageAddresses"
                              value={
                                typeof editFormData.imageAddresses === 'string'
                                  ? editFormData.imageAddresses
                                  : Array.isArray(editFormData.imageAddresses)
                                    ? editFormData.imageAddresses.join(', ')
                                    : ''
                              }
                              onChange={handleEditChange}
                              className="w-full p-3 border border-[#222] bg-[#111] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-700/30 focus:border-red-700"
                              rows={3}
                              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            />
                            
                            {/* Предпросмотр текущих изображений */}
                            {(() => {
                              // Получаем массив URL изображений
                              let imageUrls: string[] = [];
                              
                              if (typeof editFormData.imageAddresses === 'string' && editFormData.imageAddresses) {
                                imageUrls = editFormData.imageAddresses.split(',').map(url => url.trim()).filter(url => url.length > 0);
                              } else if (Array.isArray(editFormData.imageAddresses)) {
                                imageUrls = editFormData.imageAddresses.filter(url => url && typeof url === 'string');
                              } else if (typeof editFormData.imageAddress === 'string' && editFormData.imageAddress) {
                                imageUrls = [editFormData.imageAddress];
                              } else if (Array.isArray(editFormData.imageAddress)) {
                                imageUrls = editFormData.imageAddress.filter(url => url && typeof url === 'string');
                              }
                              
                              if (imageUrls.length > 0) {
                                return (
                                  <div className="mt-3 grid grid-cols-4 gap-2">
                                    {imageUrls.map((url, index) => (
                                      <div key={index} className="relative h-16 bg-white p-1 rounded border border-[#333]">
                                        <Image
                                          src={processImageUrl(url)}
                                          alt={`Изображение ${index + 1}`}
                                          fill={true}
                                          className="p-1 object-contain"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-image.jpg';
                                            target.onerror = null;
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 mr-4 bg-[#222] text-white rounded hover:bg-[#333] transition-all"
                            disabled={isSubmitting}
                          >
                            Отмена
                          </button>
                          <button
                            onClick={saveProductChanges}
                            className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-all shadow-md"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                          </button>
                        </div>
                      </td>
                    ) : (
                      // Режим просмотра
                      <>
                        <td className="p-4 w-24">
                          {/* Используем processImageUrl для корректного отображения */}
                           <div className="w-20 h-20 relative overflow-hidden rounded border border-[#222] bg-[#0a0a0a] p-1">
                            {(() => {
                              const imageUrl = getProductMainImage(product);
                              if (imageUrl) {
                                return (
                                  <Image
                                    src={getImageUrl(imageUrl)}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="object-contain p-1"
                                    // Обработчик ошибок, если изображение не загрузится
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-image.jpg';
                                      target.onerror = null;
                                    }}
                                  />
                                );
                              } else {
                                // Отображаем заглушку, если нет изображений
                                return (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400 text-xs">
                                    Нет фото
                                  </div>
                                );
                              }
                            })()}
                            </div>
                        </td>
                        <td className="p-4 font-medium text-white">{product.name}</td>
                        <td className="p-4 text-gray-400">{product.article}</td>
                        <td className="p-4 font-medium">{product.price} ₽</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.stock === 0 || product.stock === '0'
                              ? 'bg-red-900/20 text-red-400 border border-red-700/30'
                              : 'bg-green-900/20 text-green-400 border border-green-700/30'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                         {/* Отображаем чистое имя производителя */}
                        <td className="p-4 text-gray-300">{product.source ? product.source.replace('Product', '') : 'Не указан'}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="px-3 py-1 bg-[#222] text-white rounded hover:bg-[#333] transition-all text-sm"
                            >
                              Редактировать
                            </button>

                            <button
                              onClick={() => toggleProductVisibility(product._id, product.stock)}
                              className={`px-3 py-1 text-sm text-white rounded transition-all ${
                                product.stock === 0 || product.stock === '0'
                                  ? 'bg-green-800 hover:bg-green-700'
                                  : 'bg-red-800 hover:bg-red-700'
                              }`}
                            >
                              {product.stock === 0 || product.stock === '0'
                                ? 'Показать'
                                : 'Скрыть'}
                            </button>

                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="px-3 py-1 bg-red-900 text-white rounded hover:bg-red-800 transition-all text-sm"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {!loading && products.length === 0 && (
            <div className="text-center text-gray-400 py-12 animate-fade-in bg-[#0a0a0a] rounded-lg border border-red-900/20 mt-6">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-lg">Не найдено товаров, соответствующих заданным критериям</p>
              {/* Можно добавить кнопку сброса фильтров */}
              {(selectedCategory !== 'all' || debouncedSearchTerm) && (
                  <button
                      onClick={() => {
                          setSelectedCategory('all');
                          setSearchTerm('');
                          setDebouncedSearchTerm('');
                          setCurrentPage(1);
                      }}
                      className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                      Сбросить фильтры
                  </button>
              )}
            </div>
          )}

          {/* Отображаем пагинацию, если страниц больше одной */}
          {totalPages > 1 && (
             <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 