import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
  type?: string;
  image?: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    type: string;
    image: string;
    site_name: string;
  };
  jsonLd?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  url,
  type,
  image = '/images/favicon.ico',
  openGraph,
  jsonLd
}) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Elektromos",
    "alternateName": "Купить светильники, теплые полы, ЧТК, обогрев и электроустановочные изделия в Москве",
    "url": "https://elektromos.ru",
    "logo": "https://elektromos.ru/images/logo.webp",
    "description": "Интернет-магазин светильников, люстр, розеток, выключателей и электроустановочных изделий. Купить светильники, люстры, розетки, выключатели Elektromos с доставкой по России.Интернет-магазин: ЧТК маты и кабели, маты МНД/МНФ, кабельный теплый пол, обогрев кровли и площадок, специальный греющий кабель, термостаты и электроустановочные изделия Donel, Werkel, Voltum. Доставка по России.ЧТК, маты нагревательыне  МНД, МНФ, кабельный теплый пол, обогрев кровли, греющий кабель, термостаты, Donel A07, Donel R98, Werkel встроенные серии, Voltum S70, теплые полы купить, электроустановочные изделия купить",
    "sameAs": [
      "https://vk.com/elektromos",
      "https://t.me/elektromos",
      "https://wa.me/elektromos"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7 (495) 133-58-92",
      "contactType": "customer service",
      "areaServed": ["RU", "Москва", "Россия"],
      "availableLanguage": "Russian"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressCountry": "RU",
      "postalCode": "121601",
      "streetAddress": "Филёвский б-р, д. 10 к. 3, этаж 2"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Каталог светильников и электроустановочных изделий",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Светильники"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Люстры"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Розетки"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Выключатели"
          }
        }
      ]
    }
  };

  // Обновляем все URL на elektromos.ru
  const domain = 'https://elektromos.ru';
  const fullUrl = url.startsWith('http') ? url : `${domain}${url}`;


  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="application-name" content="Elektromos" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      
      {/* Базовые мета-теги */}
      <meta name="author" content="Elektromos" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="yandex" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type || "website"} />
      <meta property="og:title" content={openGraph?.title || title} />
      <meta property="og:description" content={openGraph?.description || description} />
      <meta property="og:site_name" content="Elektromos" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="business:contact_data:street_address" content="Филёвский б-р, д. 10 к. 3" />
      <meta property="business:contact_data:locality" content="Москва" />
      <meta property="business:contact_data:postal_code" content="121601" />
      <meta property="business:contact_data:country_name" content="Россия" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || '/images/favicon.ico'} />
      
      {/* Дополнительные мета-теги */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Микроразметка */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(organizationSchema) 
        }} 
      />
      
      {/* // Возвращаем этот блок */}
      {jsonLd && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(jsonLd) 
          }} 
        />
      )}
    </Head>
  );
};

export default SEO; 