import { useEffect } from 'react';

interface CriticalPreloaderProps {
  products: any[];
}

export default function CriticalPreloader({ products }: CriticalPreloaderProps) {
  useEffect(() => {
    // Принудительная предзагрузка первых 6 изображений для LCP
    if (products && products.length > 0) {
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
          
          // Создаем link preload
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
          
          // Принудительная загрузка изображения
          const img = new Image();
          img.src = url;
          img.onload = () => {
            console.log('Critical image preloaded:', url);
          };
          img.onerror = () => {
            console.warn('Failed to preload critical image:', url);
          };
        }
      });
    }
  }, [products]);

  return null; // Этот компонент не рендерит ничего
} 