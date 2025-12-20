// В src/utils/api.ts
import axios from 'axios';
import { apiCache } from './cache';
import { NEXT_PUBLIC_API_URL } from './constants';

// Оптимизированные API функции
export const fetchProductsOptimized = async (source: string, filters: any = {}) => {
  const cacheKey = `products-${source}-${JSON.stringify(filters)}`;
  
  // Проверяем кэш
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  try {
    // Параллельные запросы для быстрой загрузки
    const requests = [
      axios.get(`${NEXT_PUBLIC_API_URL}/api/products/${source}`, {
        params: { ...filters, page: 1, limit: 500 },
        timeout: 5000, // Уменьшаем таймаут для быстрой загрузки
        headers: {
          'Cache-Control': 'max-age=300', // 5 минут кэш
        }
      }),
      axios.get(`${NEXT_PUBLIC_API_URL}/api/products/${source}`, {
        params: { ...filters, page: 2, limit: 500 },
        timeout: 5000,
        headers: {
          'Cache-Control': 'max-age=300',
        }
      })
    ];

    const responses = await Promise.all(requests);
    
    // Объединяем результаты
    const allProducts = responses.reduce((acc, response) => {
      return acc.concat(response.data?.products || []);
    }, []);

    // Убираем дубликаты с оптимизацией
    const seenArticles = new Set();
    const uniqueProducts = allProducts.filter((product: any) => {
      if (seenArticles.has(product.article)) return false;
      seenArticles.add(product.article);
      return true;
    });

    // Кэшируем результат
    apiCache.set(cacheKey, uniqueProducts, 5 * 60 * 1000); // 5 минут

    return uniqueProducts;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

// Фильтрация товаров с оптимизацией
export const filterProducts = (products: any[], filterFn: (product: any) => boolean) => {
  return products.filter(filterFn);
};

// Пагинация с мемоизацией
export const paginateProducts = (products: any[], page: number, itemsPerPage: number) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return products.slice(startIndex, endIndex);
};

// Принудительная предзагрузка критических изображений
export const preloadCriticalImages = (products: any[]) => {
  if (!products || products.length === 0) return;
  
  const criticalProducts = products.slice(0, 6);
  
  criticalProducts.forEach((product) => {
    let imageUrl = null;
    
    // Извлекаем URL изображения
    if (typeof product.imageAddresses === 'string') {
      imageUrl = product.imageAddresses;
    } else if (Array.isArray(product.imageAddresses) && product.imageAddresses.length > 0) {
      imageUrl = product.imageAddresses[0];
    } else if (typeof product.imageAddress === 'string') {
      imageUrl = product.imageAddress;
    } else if (Array.isArray(product.imageAddress) && product.imageAddress.length > 0) {
      imageUrl = product.imageAddress[0];
    }
    
    if (imageUrl) {
      // Нормализуем URL
      let url = imageUrl;
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      
      // Принудительная загрузка изображения
      const img = new Image();
      img.src = url;
      img.onload = () => {
        console.log('Critical image preloaded:', url);
      };
    }
  });
};