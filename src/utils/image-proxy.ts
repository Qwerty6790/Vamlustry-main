/**
 * Утилита для проксирования внешних изображений через наш API
 * Используется для обхода CORS ограничений
 */

/**
 * Список доменов, которые требуют проксирования
 */
const DOMAINS_REQUIRING_PROXY = [
  'lightstar.ru',
  'stluce.ru',
  'kinklight.ru',
  'favourite-light.com',
  'fandeco.ru',
  'maytoni.de',
  'mais-upload.maytoni.de'
];

/**
 * Домены, которые требуют проксирования из-за CORS
 */
const PROBLEMATIC_DOMAINS = [
  'lightstar.ru',
  'stluce.ru', 
  'kinklight.ru',
  'favourite-light.com',
  'fandeco.ru',
  'maytoni.de',
  'mais-upload.maytoni.de',
  'ftp.favourite-light.com'
];

/**
 * Проверяет, нужно ли проксировать изображение
 */
export function shouldProxyImage(imageUrl: string): boolean {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }

  try {
    const url = new URL(imageUrl);
    return DOMAINS_REQUIRING_PROXY.some(domain => url.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Проверяем, нужно ли проксировать изображение
 */
export function needsProxy(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl);
    return PROBLEMATIC_DOMAINS.some(domain => url.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Возвращает URL для проксирования изображения или оригинальный URL
 */
export function getProxiedImageUrl(imageUrl: string): string {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return '/placeholder-image.svg'; // Fallback изображение
  }

  // Если это уже локальное изображение, возвращаем как есть
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }

  // Если домен не требует проксирования, возвращаем оригинальный URL
  if (!shouldProxyImage(imageUrl)) {
    return imageUrl;
  }

  // Возвращаем проксированный URL
  return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
}

/**
 * Получаем URL для изображения (либо прокси, либо оригинальный)
 */
export function getImageUrl(originalUrl: string): string {
  if (!originalUrl) {
    return '/placeholder-image.svg';
  }

  if (needsProxy(originalUrl)) {
    return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  }

  return originalUrl;
}

/**
 * Получаем placeholder SVG как data URL
 */
export function getPlaceholderDataUrl(): string {
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dy=".3em">Нет изображения</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Обрабатывает ошибку загрузки изображения
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget;
  const originalSrc = img.src;
  
  console.log('Image load error:', originalSrc);
  
  // Если это уже placeholder, не меняем
  if (img.src.includes('placeholder-image.svg') || img.src.startsWith('data:image/svg+xml')) {
    return;
  }
  
  // Устанавливаем placeholder
  img.src = getPlaceholderDataUrl();
} 