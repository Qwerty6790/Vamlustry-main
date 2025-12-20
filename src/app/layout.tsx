import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Купить светильники, люстры, теплые полы ЧТК, розетки Donel, Werkel, Voltum,Donel A07,Voltum S70, выключатели в Москве, Werkel Встраиваемые серии  теплые полы, маты нагревательные, кабельный теплый пол, обогрев кровли и площадок, греющий кабель, термостаты и электроустановочные изделия   | Интернет-магазин электрики',
  description: 'Купить светильники, люстры, розетки, выключатели в Москве. Мат нагревательный ЧТК,Donel,Voltum,Voltum S70 ,Обогрев кровли и площадок, Греющий кабель,МНД,МНФ, Термостаты и электроустановочные изделия Donel, Werkel, Voltum. Доставка по России. Дизайнерам скидки.',
  keywords: 'купить светильники москва, купить люстры, купить розетки выключатели, теплые полы купить, тэн маты нагревательные, электроустановочные изделия, люстры потолочные подвесные, настенные светильники бра, торшеры настольные лампы, розетки выключатели москва, Werkel Donel Voltum, LightStar Maytoni Novotech Artelamp Lumion, магазин светильников люстр, интернет магазин электрики',
  openGraph: {
    title: 'Купить светильники, люстры, розетки, выключатели в Москве',
    description: 'Купить светильники, люстры, розетки, выключатели в Москве.Мат нагревательный ЧТК,Donel,Voltum,Voltum S70 ,Обогрев кровли и площадок, Греющий кабель,МНД,МНФ, Термостаты и электроустановочные изделия Donel, Werkel, Voltum. Доставка по России.',
    url: 'https://elektromos.ru',
    siteName: 'Elektromos',
    images: [
      {
        url: '/images/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Elektromos - Интернет-магазин электрики в Москве',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купить светильники, люстры, розетки, выключатели в Москве   z',
    description: 'Купить светильники, люстры, розетки, выключатели в Москве. Широкий выбор электроустановочных изделий, теплых полов, ЧТК матов.',
    images: ['/images/logo.webp'],
  },
  alternates: {
    canonical: 'https://elektromos.ru',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: '58fa2c0c2f2f331c',
  },
  // Дополнительные мета-теги для Google Business Profile и Яндекс.Карт
  other: {
    'geo.region': 'RU-MOW',
    'geo.placename': 'Москва',
    'geo.position': '55.7558;37.6176',
    'ICBM': '55.7558, 37.6176',
    'business:contact_data:street_address': 'МКАД, 25-й км, 4 стр 1',
    'business:contact_data:locality': 'Москва',
    'business:contact_data:postal_code': '121601',
    'business:contact_data:country_name': 'Россия',
    'business:contact_data:phone_number': '+7 (903) 797-06-99',
    'business:contact_data:email': 'info@elektromos.ru',
    'business:contact_data:website': 'https://elektromos.ru',
    'business:contact_data:hours': 'Mo-Su 10:00-20:00',
    'business:contact_data:category': 'Lighting Equipment',
    // Яндекс.Карты мета-теги
    'yandex-verification': '58fa2c0c2f2f331c',
    'yandex-maps:latitude': '55.7558',
    'yandex-maps:longitude': '37.6176',
    'yandex-maps:zoom': '15',
    'yandex-maps:address': 'МКАД, 25-й км, 4 стр 1, Москва',
    'yandex-maps:name': 'Электромос - Магазин светильников ЧТК теплые полы, маты нагревательные, кабельный теплый пол, обогрев кровли и площадок, греющий кабель, термостаты и электроустановочные изделия Donel, Werkel, Voltum',
    'yandex-maps:phone': '+7 (903) 797-06-99',
    'yandex-maps:working-hours': '10:00-20:00',
    'yandex-maps:category': 'Магазин светильников',
    // Дополнительные SEO мета-теги
    'format-detection': 'telephone=no',
    'theme-color': '#101010',
    'msapplication-TileColor': '#101010',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Elektromos',
    'application-name': 'Elektromos',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileImage': '/images/logo.webp',
    'msapplication-TileImage:width': '144',
    'msapplication-TileImage:height': '144',
    // Open Graph дополнительные теги
    'og:site_name': 'Elektromos',
    'og:locale': 'ru_RU',
    'og:type': 'website',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/webp',
    'og:image:alt': 'Elektromos - Интернет-магазин электрики в Москве',
    // Twitter дополнительные теги
    'twitter:site': '@elektromos',
    'twitter:creator': '@elektromos',
    'twitter:image:alt': 'Elektromos - Интернет-магазин электрики в Москве',
    // Дополнительные SEO теги
    'author': 'Elektromos',
    'copyright': '© 2024 Elektromos. Все права защищены.',
    'language': 'ru',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '1 days',
    'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'googlebot': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'bingbot': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'yandex': 'index, follow',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Критическая оптимизация для LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//elektromos-backand.vercel.app" />
        <link rel="preconnect" href="//elektromos-backand.vercel.app" />
        <link rel="dns-prefetch" href="//mc.yandex.ru" />
        <link rel="preconnect" href="//mc.yandex.ru" />
        
        {/* Предзагрузка критических изображений */}
        <link rel="preload" as="image" href="/logo.webp" />
        
        {/* Критические CSS для предотвращения CLS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Критические стили для LCP и CLS */
            body { 
              margin: 0; 
              font-family: 'Inter', sans-serif; 
              background-color: #101010;
              color: #ffffff;
            }
            .aspect-square { aspect-ratio: 1/1; }
            .lcp-image { 
              width: 100%; 
              height: 100%; 
              object-fit: contain;
              background: #1a1a1a;
            }
            .skeleton { 
              background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%); 
              background-size: 200% 100%; 
              animation: loading 1.5s infinite; 
            }
            @keyframes loading { 
              0% { background-position: 200% 0; } 
              100% { background-position: -200% 0; } 
            }
            /* Фиксированные размеры для предотвращения CLS */
            .product-card { min-height: 400px; }
            .product-image { aspect-ratio: 1/1; min-height: 200px; }
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
              if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(103788201, "init", {
              ssr:true,
              webvisor:true,
              clickmap:true,
              ecommerce:"dataLayer",
              accurateTrackBounce:true,
              trackLinks:true
            });
          `}
        </Script>
        
        {/* Структурированные данные для поисковых систем */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Elektromos",
              "alternateName": "Электромос",
              "url": "https://elektromos.ru",
              "logo": "https://elektromos.ru/images/logo.webp",
              "description": "Интернет-магазин светильников, люстр, розеток, выключателей и электроустановочных изделий. Купить светильники, люстры, розетки, выключатели,выключатели Donel, Werkel, Voltum, Освещение LightStar, Maytoni, Novotech, Artelamp, Lumion, Stluce,ЧТК,Elektrostandart,Denkirs,OdeonLight Elektromos с доставкой по России.Теплые полы ЧТК,Купить Люстры в Москве,Магазин на ТК Конструктор,скидки 15% от 50000 рублей обычным клиентам,Купить Термостаты и Терморегуляторы,Купить Уличное освещение",
              "sameAs": [
                "https://vk.com/elektromos",
                "https://t.me/elektromos"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+7 (903) 797-06-99",
                "contactType": "customer service",
                "areaServed": ["RU", "Москва", "Россия"],
                "availableLanguage": "Russian"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Москва",
                "addressCountry": "RU",
                "postalCode": "121601",
                "streetAddress": "МКАД, 25-й км, 4 стр 1"
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
                      "name": "Уличное освещение"
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
            })
          }}
        />
        
        {/* Google Business Profile структурированные данные */}
        <Script
          id="google-business-profile"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Elektromos",
              "alternateName": "Электромос",
              "description": "Интернет-магазин светильников, люстр, розеток, выключателей и электроустановочных изделий в Москве. Широкий выбор продукции от ведущих брендов: Donel, Werkel, Voltum, LightStar, Maytoni, Novotech, Artelamp, Lumion. Доставка по России.",
              "url": "https://elektromos.ru",
              "logo": "https://elektromos.ru/images/logo.webp",
              "image": "https://elektromos.ru/images/logo.webp",
              "telephone": "+7 (903) 797-06-99",
              "email": "info@elektromos.ru",
              "priceRange": "₽₽₽",
              "currenciesAccepted": "RUB",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer",
              "openingHours": "Mo-Su 10:00-20:00",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "МКАД, 25-й км, 4 стр 1",
                "addressLocality": "Москва",
                "addressRegion": "Москва",
                "postalCode": "121601",
                "addressCountry": "RU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 55.7558,
                "longitude": 37.6176
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Москва"
                },
                {
                  "@type": "Country",
                  "name": "Россия"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Каталог светильников и электроустановочных изделий",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Светильники",
                      "description": "Потолочные, настенные, подвесные светильники"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Люстры",
                      "description": "Потолочные и подвесные люстры"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Розетки и выключатели",
                      "description": "Электроустановочные изделия"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Теплые полы",
                      "description": "Системы обогрева пола"
                    }
                  }
                ]
              },
              "brand": [
                "Donel",
                "Werkel", 
                "Voltum",
                "LightStar",
                "Maytoni",
                "Novotech",
                "Artelamp",
                "Lumion"
              ],
              "category": "Lighting Equipment",
              "serviceType": "Retail Store",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              },
              "review": [
                {
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Александр"
                  },
                  "reviewBody": "Отличный магазин светильников! Большой выбор, качественные товары, быстрая доставка."
                }
              ]
            })
          }}
        />
        
        {/* Яндекс.Карты структурированные данные */}
        <Script
          id="yandex-maps-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Электромос",
              "alternateName": "Elektromos",
              "description": "Магазин светильников и люстр на МКАД, 25-й км. Широкий выбор электроустановочных изделий, теплых полов. Доставка по Москве и России.",
              "url": "https://elektromos.ru",
              "logo": "https://elektromos.ru/images/logo.webp",
              "image": [
                "https://elektromos.ru/images/logo.webp",
                "https://elektromos.ru/images/headerRetro.png",
                "https://elektromos.ru/images/headerVintage.png"
              ],
              "telephone": "+7 (903) 797-06-99",
              "email": "info@elektromos.ru",
              "priceRange": "₽₽₽",
              "currenciesAccepted": "RUB",
              "paymentAccepted": ["Наличные", "Банковские карты", "Безналичный расчет"],
              "openingHours": [
                "Mo-Fr 10:00-20:00",
                "Sa 10:00-20:00",
                "Su 10:00-20:00"
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "МКАД, 25-й км, 4 стр 1",
                "addressLocality": "Москва",
                "addressRegion": "Москва",
                "postalCode": "121601",
                "addressCountry": "RU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 55.7558,
                "longitude": 37.6176
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Москва"
                },
                {
                  "@type": "City",
                  "name": "Санкт-Петербург"
                },
                {
                  "@type": "Country",
                  "name": "Россия"
                }
              ],
              "deliveryArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 55.7558,
                  "longitude": 37.6176
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Каталог светильников и электроустановочных изделий",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Светильники",
                      "description": "Потолочные, настенные, подвесные светильники"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Люстры",
                      "description": "Потолочные и подвесные люстры"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Розетки и выключатели",
                      "description": "Электроустановочные изделия"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Теплые полы",
                      "description": "Системы обогрева пола"
                    }
                  }
                ]
              },
              "brand": [
                "Donel",
                "Werkel", 
                "Voltum",
                "LightStar",
                "Maytoni",
                "Novotech",
                "Artelamp",
                "Lumion"
              ],
              "category": "Lighting Equipment",
              "serviceType": "Retail Store",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "156",
                "bestRating": "5",
                "worstRating": "1"
              },
              "review": [
                {
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Анна Петрова"
                  },
                  "reviewBody": "Отличный магазин! Огромный выбор светильников, качественные товары и быстрая доставка."
                },
                {
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Михаил Иванов"
                  },
                  "reviewBody": "Профессиональные консультанты помогли выбрать идеальную люстру для гостиной."
                }
              ],
              "hasMap": "https://yandex.ru/maps/-/CCUQ4X~X",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+7 (903) 797-06-99",
                "contactType": "customer service",
                "availableLanguage": ["Russian", "English"],
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "10:00",
                  "closes": "20:00"
                }
              }
            })
          }}
        />
        
        {/* WebSite структурированные данные */}
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Elektromos",
              "alternateName": "Электромос",
              "url": "https://elektromos.ru",
              "description": "Интернет-магазин светильников, люстр, розеток, выключателей и электроустановочных изделий",
              "inLanguage": "ru-RU",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://elektromos.ru/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Elektromos",
                "url": "https://elektromos.ru"
              }
            })
          }}
        />
        
        {/* FAQ структурированные данные */}
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Как заказать светильники в Elektromos?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Вы можете заказать светильники через наш сайт, позвонив по телефону +7 (903) 797-06-99 или посетив наш магазин на МКАД, 25-й км, 4 стр 1 в Москве."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Есть ли доставка по России?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Да, мы осуществляем доставку по всей России. Стоимость и сроки доставки зависят от региона и выбранного способа доставки."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Какие бренды светильников представлены в магазине?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "В нашем магазине представлены ведущие бренды: Donel, Werkel, Voltum, LightStar, Maytoni, Novotech, Artelamp, Lumion и другие."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Есть ли скидки для дизайнеров?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Да, мы предоставляем специальные условия и скидки для дизайнеров и архитекторов. Обратитесь к нашим менеджерам для получения подробной информации."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Какие способы оплаты принимаются?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Мы принимаем наличные, банковские карты, безналичный расчет. Возможна оплата при получении товара."
                  }
                }
              ]
            })
          }}
        />
        
        {/* BreadcrumbList структурированные данные */}
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Главная",
                  "item": "https://elektromos.ru"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Каталог",
                  "item": "https://elektromos.ru/catalog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Светильники",
                  "item": "https://elektromos.ru/catalog/svetilniki"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Люстры",
                  "item": "https://elektromos.ru/catalog/lyustry"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "Розетки и выключатели",
                  "item": "https://elektromos.ru/catalog/rozetki-vyklyuchateli"
                },
                {
                  "@type": "ListItem",
                  "position": 6,
                  "name": "Теплые полы",
                  "item": "https://elektromos.ru/catalog/teplye-poly"
                }
              ]
            })
          }}
        />
        
        {/* Product структурированные данные для основных категорий */}
        <Script
          id="product-categories-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Каталог светильников и электроустановочных изделий",
              "description": "Широкий выбор светильников, люстр, розеток, выключателей и теплых полов",
              "url": "https://elektromos.ru/catalog",
              "numberOfItems": 6,
              "itemListElement": [
                {
                  "@type": "Product",
                  "position": 1,
                  "name": "Светильники",
                  "description": "Потолочные, настенные, подвесные светильники для дома и офиса",
                  "url": "https://elektromos.ru/catalog/svetilniki",
                  "image": "https://elektromos.ru/images/lampaheader.png",
                  "brand": {
                    "@type": "Brand",
                    "name": "Elektromos"
                  },
                  "category": "Lighting Equipment",
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                  }
                },
                {
                  "@type": "Product",
                  "position": 2,
                  "name": "Люстры",
                  "description": "Потолочные и подвесные люстры различных стилей",
                  "url": "https://elektromos.ru/catalog/lyustry",
                  "image": "https://elektromos.ru/images/headerRetro.png",
                  "brand": {
                    "@type": "Brand",
                    "name": "Elektromos"
                  },
                  "category": "Lighting Equipment",
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                  }
                },
                {
                  "@type": "Product",
                  "position": 3,
                  "name": "Розетки и выключатели",
                  "description": "Электроустановочные изделия от ведущих брендов",
                  "url": "https://elektromos.ru/catalog/rozetki-vyklyuchateli",
                  "image": "https://elektromos.ru/images/45на45 розетки.webp",
                  "brand": {
                    "@type": "Brand",
                    "name": "Elektromos"
                  },
                  "category": "Electrical Equipment",
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                  }
                },
                {
                  "@type": "Product",
                  "position": 4,
                  "name": "Теплые полы",
                  "description": "Системы обогрева пола для комфорта в доме",
                  "url": "https://elektromos.ru/catalog/teplye-poly",
                  "image": "https://elektromos.ru/images/matnarevatelnyheader.png",
                  "brand": {
                    "@type": "Brand",
                    "name": "Elektromos"
                  },
                  "category": "Heating Equipment",
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "RUB",
                    "availability": "https://schema.org/InStock"
                  }
                }
              ]
            })
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/103788201" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
        
        <main className="min-h-screen bg-background text-foreground"> 
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
