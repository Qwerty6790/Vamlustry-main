
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
  type?: string;
  image?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    image?: string;
    site_name?: string;
  };
  // Делаем поддержку как одного объекта, так и массива объектов (для каталога)
  jsonLd?: Record<string, any> | Record<string, any>[]; 
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  url,
  type = 'website',
  image = '/images/logo.png',
  openGraph,
  jsonLd
}) => {
  const domain = 'https://вамлюстра.рф';
  
  // SEO-ПРАВИЛО: Canonical и картинки для соцсетей ДОЛЖНЫ быть абсолютными ссылками
  const fullUrl = url.startsWith('http') ? url : `${domain}${url}`;
  const ogImage = image.startsWith('http') ? image : `${domain}${image}`;
  const finalOgImage = openGraph?.image?.startsWith('http') ? openGraph.image : (openGraph?.image ? `${domain}${openGraph.image}` : ogImage);

  // 1. Схема локального бизнеса (Лучше для SEO, чем просто Organization)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore", // Идеальный тип для магазина люстр/электрики
    "name": "ВамЛюстра",
    "alternateName": "Купить светильники, люстры, теплые полы, обогрев и электроустановочные изделия в Москве",
    "url": domain,
    "logo": `${domain}/images/logo.png`,
    "image": `${domain}/images/logo.png`,
    "description": "Интернет-магазин светильников, люстр, бра, торшеров, настольных ламп, трековых систем, розеток, выключателей и электроустановочных изделий. Купить светильники, люстры, LED-освещение, теплые полы, нагревательные маты, кабельный теплый пол, греющий кабель, термостаты и системы обогрева кровли с доставкой по России. В наличии продукция Maytoni, Donel, Werkel, Voltum, Freya, Arte Lamp, ST Luce и других брендов. Дизайнерское освещение для дома, квартиры, офиса и коммерческих помещений, современные розетки и выключатели, магнитные трековые системы, электроустановочные изделия премиум-класса.",
    "priceRange": "₽₽",
    "sameAs": [
      "https://vk.com/vamlyustra",
      "https://t.me/vamlyustra",
    ],
    "telephone": "+7 (966) 033-31-11", // ВНИМАНИЕ: Проверьте, чтобы телефон совпадал с контактами на сайте!
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": "Москва",
      "addressCountry": "RU",
      "postalCode": "121601",
      "streetAddress": "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.42., 2.19. Линия В, пав. 1.11" // ВНИМАНИЕ: Проверьте адрес!
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 55.583222, // Замените на точные координаты магазина для Яндекс Карт
      "longitude": 37.710800
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    }
  };

  // 2. Схема веб-сайта (Для появления строки поиска прямо в выдаче Google)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ВамЛюстра",
    "url": domain,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${domain}/catalog?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Head>
      {/* Основные теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#ffffff" /> {/* Цвет шапки браузера на мобилках */}
      
      {/* Индексация */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="yandex" content="index, follow" />
      
      {/* Каноническая ссылка (Спасает от дублей страниц) */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph (ВКонтакте, Telegram, WhatsApp) */}
      <meta property="og:url" content={openGraph?.url || fullUrl} />
      <meta property="og:type" content={openGraph?.type || type} />
      <meta property="og:title" content={openGraph?.title || title} />
      <meta property="og:description" content={openGraph?.description || description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={openGraph?.site_name || "ВамЛюстра"} />
      <meta property="og:locale" content="ru_RU" />

      {/* Данные для Яндекс Бизнеса / Локального SEO */}
      <meta property="business:contact_data:street_address" content="Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.42., 2.19. Линия В, пав. 1.11" />
      <meta property="business:contact_data:locality" content="Москва" />
      <meta property="business:contact_data:postal_code" content="121601" />
      <meta property="business:contact_data:country_name" content="Россия" />
      
      {/* Twitter (X) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* БАЗОВАЯ МИКРОРАЗМЕТКА (Магазин + Поиск) */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify([localBusinessSchema, websiteSchema]) 
        }} 
      />
      
      {/* ДИНАМИЧЕСКАЯ МИКРОРАЗМЕТКА (Переданная со страницы: товары, крошки, статьи) */}
      {jsonLd && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            // Если передан массив, превращаем массив в JSON. Если объект - объект.
            __html: JSON.stringify(jsonLd) 
          }} 
        />
      )}
    </Head>
  );
};

export default SEO;
