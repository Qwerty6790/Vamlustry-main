
'use client'
import MainPage from '@/components/Hero';
import SEO from '@/components/SEO';

const Home = () => {
  return (
    <>
      <SEO
        title="Купить люстры, светильники, споты, бра, теплые полы и электрику в Москве | ВамЛюстра"
        description="Интернет-магазин ВамЛюстра: огромный выбор освещения (люстры, потолочные и настенные светильники, споты, бра). Также в каталоге теплые полы, нагревательные маты, греющий кабель, розетки и выключатели (Donel, Werkel, Voltum). Доставка по России."
        keywords="купить люстру, светильники москва, споты, бра, торшеры, трековое освещение, кабельный теплый пол, греющий кабель, термостаты, Donel, Werkel, Voltum, теплые полы купить, электроустановочные изделия"
        url="/"
        type="website"
        image="/images/logo.webp"
        openGraph={{
          title: "Люстры, светильники, споты, бра и теплые полы | ВамЛюстра",
          description: "Огромный выбор освещения для дома и улицы. Нагревательные маты , кабельный теплый пол, обогрев кровли — а также розетки и выключатели Donel, Werkel, Voltum.",
          url: "https://вамлюстра.рф",
          type: "website",
          image: "/images/logo.webp",
          site_name: "ВамЛюстра"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Интернет-магазин света и электрики ВамЛюстра",
          "description": "Продажа осветительного оборудования (люстры, светильники, споты, бра), нагревательных матов и кабелей, кабельных теплых полов, обогрева кровли и площадок, термостатов и электроустановочных изделий Donel, Werkel, Voltum",
          "url": "https://вамлюстра.рф",
          "telephone": "+7 (966) 033-31-11",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Москва, 25-км МКАД, ТК Конструктор, Главный корпус, 2 этаж, пав. 2.42., 2.19. Линия В, пав. 1.11",
            "addressLocality": "Москва",
            "postalCode": "121601",
            "addressCountry": "RU"
          },
          "hasOfferCatalog": [
            {
              "@type": "OfferCatalog",
              "name": "Освещение и светильники",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Люстры",
                    "category": "Освещение"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Потолочные и настенные светильники",
                    "category": "Освещение"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Споты и трековые системы",
                    "category": "Освещение"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Бра",
                    "category": "Освещение"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Торшеры и настольные лампы",
                    "category": "Освещение"
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Нагревательные маты",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Маты для теплого пола",
                    "category": "Теплые полы"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Маты МНД",
                    "category": "Теплые полы"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Маты МНФ",
                    "category": "Теплые полы"
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Кабельный теплый пол и греющие кабели",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Кабельный теплый пол",
                    "category": "Теплые полы"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Специальный греющий кабель (обогрев кровли и площадок)",
                    "category": "Наружный обогрев"
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Термостаты и регуляторы",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Термостаты для теплого пола",
                    "category": "Управление отоплением"
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Электроустановочные изделия",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Donel A07",
                    "category": "Розетки и механизмы"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Donel R98",
                    "category": "Розетки и механизмы"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Werkel Встраиваемые серии",
                    "category": "Выключатели и рамки"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Voltum S70",
                    "category": "Розетки и механизмы"
                  }
                }
              ]
            }
          ],
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://вамлюстра.рф/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <div className="w-full">
        <MainPage />
      </div>
    </>
  );
};

export default Home;
