'use client'
import MainPage from '@/components/Hero';
import SEO from '@/components/SEO';

const Home = () => {
  return (
    <>
      <SEO
        title="Купить светильники, теплые полы, ЧТК, обогрев и электроустановочные изделия в Москве"
        description="Интернет-магазин : ЧТК маты и кабели, маты МНД/МНФ, кабельный теплый пол, обогрев кровли и площадок, специальный греющий кабель, термостаты и электроустановочные изделия Donel, Werkel, Voltum. Доставка по России."
        keywords="ЧТК маты, маты МНД, МНФ, кабельный теплый пол, обогрев кровли, греющий кабель, термостаты, Donel A07, Donel R98, Werkel встроенные серии, Voltum S70, теплые полы купить, электроустановочные изделия купить"
        url="/"
        type="website"
        image="/images/logo.webp"
        openGraph={{
          title: "Купить ЧТК, маты МНД/МНФ, теплые полы и электроустановочные изделия elektromos",
          description: "ЧТК маты, нагревательные маты МНД и МНФ, кабельный теплый пол, обогрев кровли и площадок, специальный греющий кабель — а также розетки и выключатели Donel, Werkel, Voltum",
          url: "https://elektromos.ru",
          type: "website",
          image: "/images/logo.webp",
          site_name: "Elektromos"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Интернет-магазин электрики и отопления",
          "description": "Продажа ЧТК матов и кабелей, МНД и МНФ матов нагревательных, кабельных теплых полов, обогрева кровли и площадок, греющих кабелей, термостатов и электроустановочных изделий Donel, Werkel, Voltum",
          "url": "https://elektromos.ru",
          "telephone": "+7 (499) 288-80-78",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Филёвский б-р, д. 10 к. 3",
            "addressLocality": "Москва",
            "postalCode": "121601",
            "addressCountry": "RU"
          },
          "hasOfferCatalog": [
            {
              "@type": "OfferCatalog",
              "name": "ЧТК и нагревательные маты",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "ЧТК маты",
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
            "target": "https://elektromos.ru/search?q={search_term_string}",
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