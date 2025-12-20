import axios from 'axios';
import { BASE_URL, NEXT_PUBLIC_API_URL } from './constants';

// Интерфейс для товара
export interface Product {
  _id: string;
  name: string;
  article: string;
  price: number;
  description?: string;
  category?: string;
  source: string;
  imageAddresses: string | string[];
  stock: string;
  isHidden?: boolean;
}

// Интерфейс для бренда
export interface Brand {
  name: string;
  logo?: string;
}

// Получение всех товаров по бренду
export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/products/${encodeURIComponent(brand)}`
    );
    return response.data.products || response.data || [];
  } catch (error) {
    console.error(`Ошибка при получении товаров бренда ${brand}:`, error);
    throw error;
  }
};

// Получение всех брендов
export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/brands`);
    return response.data || [];
  } catch (error) {
    console.error('Ошибка при получении брендов:', error);
    throw error;
  }
};

// Получение всех товаров (собирает товары по всем брендам)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // Сначала получаем все бренды
    const brandsData = await getAllBrands();
    const brandNames = brandsData.map((brand: Brand) => brand.name || '').filter(Boolean);
    
    // Если брендов нет, пытаемся получить все товары напрямую
    if (brandNames.length === 0) {
      const response = await axios.get(`${BASE_URL}/api/products`);
      return response.data.products || response.data || [];
    }
    
    // Иначе собираем товары по каждому бренду
    let allProducts: Product[] = [];
    for (const brand of brandNames) {
      try {
        const brandProducts = await getProductsByBrand(brand);
        allProducts = [...allProducts, ...brandProducts];
      } catch (error) {
        console.error(`Ошибка при получении товаров бренда ${brand}:`, error);
      }
    }
    
    return allProducts;
  } catch (error) {
    console.error('Ошибка при получении всех товаров:', error);
    throw error;
  }
};

// Обновление товара
export const updateProduct = async (productId: string, productData: Partial<Product>) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/products/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении товара ${productId}:`, error);
    throw error;
  }
};

// Изменение видимости товара
export const toggleProductVisibility = async (productId: string, isHidden: boolean) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/products/${productId}/visibility`,
      { isHidden }
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при изменении видимости товара ${productId}:`, error);
    throw error;
  }
};

// Поиск товаров
export const searchProducts = async (query: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/products/search`,
      { params: { q: query } }
    );
    return response.data.products || response.data || [];
  } catch (error) {
    console.error(`Ошибка при поиске товаров по запросу "${query}":`, error);
    throw error;
  }
};

// Добавление товара
export const addProduct = async (productData: Omit<Product, '_id'>) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/products`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    throw error;
  }
};

// Удаление товара
export const deleteProduct = async (productId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении товара ${productId}:`, error);
    throw error;
  }
};

// Загрузка изображения (если API поддерживает)
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${BASE_URL}/api/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.url || response.data;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
};

// Получение списка товаров по ID
export const getProductsByIds = async (productIds: string[]) => {
  try {
    // Используем относительный путь, так как в next.config.js настроен rewrite
    const response = await axios.post(
      '/api/products/list',
      { ids: productIds }
    );
    return response.data.products || response.data || [];
  } catch (error) {
    console.error('Ошибка при получении товаров по ID:', error);
    throw error;
  }
}; 