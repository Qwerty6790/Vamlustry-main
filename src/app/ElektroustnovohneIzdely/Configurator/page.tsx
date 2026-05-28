'use client';

import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import {
  Share2,
  RotateCcw,
  Phone,
  X,
  Check
} from 'lucide-react';

// ======================================================
// TYPES
// ======================================================

interface FrameOption {
  id: string;
  name: string;
  color: string;
  image: string;
  seriesId: string;
}

interface MechanismOption {
  id: string;
  name: string;
  image: string;
}

interface SeriesOption {
  id: string;
  name: string;
  image: string;
  brandId: string;
  colors: {
    id: string;
    name: string;
    image: string;
    url: string;
  }[];
}

// ======================================================
// SEO
// ======================================================

const seoContent = {
  title:
    'Конфигуратор электроустановочных изделий Donel,',
  description:
    'Онлайн конфигуратор электроустановочных изделий Donel. Подберите рамки, механизмы, розетки и выключатели для современного интерьера.',
  keywords:
    'электроустановочные изделия, donel, werkel, voltum, розетки, выключатели, рамки, механизмы, дизайнерские розетки, конфигуратор электрики, современные выключатели',
  text: `
  Электроустановочные изделия Donel, Werkel и Voltum — это современные дизайнерские решения
  для интерьера. В конфигураторе вы можете подобрать рамки, механизмы, розетки и выключатели
  под любой стиль помещения: минимализм, современный интерьер, loft, classic и premium.

  Каталог включает серии Donel R98, R98 Metal, Trendy и N96.
  Доступны различные цвета механизмов и рамок: латунь, никель, матовый белый,
  графит, карбон, изумруд и другие современные оттенки.

  Конфигуратор помогает визуально подобрать электроустановочные изделия для квартиры,
  дома, офиса, ресторана или коммерческого помещения.
  `
};

// ======================================================
// DATA
// ======================================================

const backgroundColors = [
  { id: 'white', name: 'Белый', color: '#F3F4F6' },
  { id: 'lightbeige', name: 'Светло-бежевый', color: '#F5F5DC' },
  { id: 'gray', name: 'Серый', color: '#E5E7EB' },
  { id: 'darkgray', name: 'Темно-серый', color: '#374151' },
  { id: 'black', name: 'Черный', color: '#18181b' },
  { id: 'beige', name: 'Бежевый', color: '#D2B48C' },
  { id: 'brown', name: 'Коричневый', color: '#8B4513' },
  { id: 'mauve', name: 'Лиловый', color: '#B19CD9' },
  { id: 'lightblue', name: 'Светло-голубой', color: '#E6F3FF' },
  { id: 'blue', name: 'Голубой', color: '#87CEEB' },
  { id: 'darkblue', name: 'Темно-синий', color: '#1E3A8A' },
  { id: 'lightgreen', name: 'Светло-зеленый', color: '#E6FFE6' },
  { id: 'emerald', name: 'Изумрудный', color: '#047857' },
  { id: 'chocolate', name: 'Шоколадный', color: '#3E2723' },
  { id: 'coral', name: 'Коралловый', color: '#FF7F50' }
];

// ======================================================
// COMPONENT
// ======================================================

const ConfiguratorPage = () => {
  // ======================================================
  // DATA
  // ======================================================

  const frameOptions: FrameOption[] = [
    {
      id: 'matyovyi-koral',
      name: 'Матовый коралл',
      color: 'border-zinc-300',
      image: '/images/colors/матовыйкораллрамкаDonel.webp',
      seriesId: 'r98'
    },

    {
      id: 'matyovyi-shokolad',
      name: 'Матовый шоколад',
      color: 'border-zinc-300',
      image: '/images/colors/матовыйшоколадрамкаDonel.webp',
      seriesId: 'r98'
    },

    {
      id: 'white',
      name: 'Белый',
      color: 'border-stone-100',
      image: '/images/colors/белыйрамкаобычнаяDonel.webp',
      seriesId: 'r98'
    },

    {
      id: 'brass-frame',
      name: 'Рамка Латунь',
      color: 'border-yellow-700',
      image: '/images/colors/R98Metalлатуньрамка.webp',
      seriesId: 'r98-metal'
    }
  ];

  const getMechanismOptions = (
    seriesId: string
  ): MechanismOption[] => {
    switch (seriesId) {
      case 'r98':
        return [
          {
            id: 'black',
            name: 'Черный',
            image: '/images/colors/черныйR98.webp'
          },

          {
            id: 'white',
            name: 'Белый',
            image: '/images/colors/белыйR98.png'
          }
        ];

      case 'r98-metal':
        return [
          {
            id: 'brass',
            name: 'Латунь',
            image: '/images/colors/R98metalлатунь.png'
          }
        ];

      default:
        return [
          {
            id: 'aluminum',
            name: 'Алюминий',
            image:
              '/images/colors/матовыйалюминийR98.png'
          }
        ];
    }
  };

  const seriesOptions: SeriesOption[] = [
    {
      id: 'r98',
      name: 'R98',
      image: '/images/черныйR98.webp',
      brandId: 'donel',
      colors: []
    },

    {
      id: 'r98-metal',
      name: 'R98 METAL',
      image: '/images/ЛатуньR98METAL.png',
      brandId: 'donel',
      colors: []
    },

  ];

  // ======================================================
  // STATE
  // ======================================================

  const [selectedSeries, setSelectedSeries] =
    useState<string>('r98');

  const [selectedFrame, setSelectedFrame] =
    useState<string>('white');

  const [selectedMechanism, setSelectedMechanism] =
    useState<string>('white');

  const [selectedBackgroundColor,
    setSelectedBackgroundColor] =
    useState<string>('white');

  const [showOrderForm, setShowOrderForm] =
    useState(false);

  const [copied, setCopied] = useState(false);

  // ======================================================
  // URL PARAMS
  // ======================================================

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(
      window.location.search
    );

    const seriesParam = params.get('series');
    const frameParam = params.get('frame');
    const mechParam = params.get('mech');
    const bgParam = params.get('bg');

    if (seriesParam) setSelectedSeries(seriesParam);

    if (frameParam) setSelectedFrame(frameParam);

    if (mechParam) setSelectedMechanism(mechParam);

    if (bgParam)
      setSelectedBackgroundColor(bgParam);
  }, []);

  // ======================================================
  // MEMO
  // ======================================================

  const currentSeries =
    seriesOptions.find(
      s => s.id === selectedSeries
    ) || seriesOptions[0];

  const filteredFrames = frameOptions.filter(
    f => f.seriesId === selectedSeries
  );

  const frame =
    filteredFrames.find(
      f => f.id === selectedFrame
    ) || filteredFrames[0];

  const mechanismOptions =
    getMechanismOptions(selectedSeries);

  const mech =
    mechanismOptions.find(
      m => m.id === selectedMechanism
    ) || mechanismOptions[0];

  const bgColor =
    backgroundColors.find(
      bg => bg.id === selectedBackgroundColor
    ) || backgroundColors[0];

  // ======================================================
  // ACTIONS
  // ======================================================

  const resetConfig = () => {
    setSelectedSeries('r98');

    setSelectedFrame('white');

    setSelectedMechanism('white');

    setSelectedBackgroundColor('white');
  };

  const copyShareLink = () => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    url.searchParams.set(
      'series',
      selectedSeries
    );

    url.searchParams.set(
      'frame',
      selectedFrame
    );

    url.searchParams.set(
      'mech',
      selectedMechanism
    );

    url.searchParams.set(
      'bg',
      selectedBackgroundColor
    );

    navigator.clipboard
      .writeText(url.toString())
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
  };

  // ======================================================
  // JSON LD
  // ======================================================

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoContent.title,
      description: seoContent.description,
      brand: ['Donel', 'Werkel', 'Voltum']
    }),
    []
  );

  // ======================================================
  // UI
  // ======================================================

  return (
    <>
      <Head>
        <title>{seoContent.title}</title>

        <meta
          name="description"
          content={seoContent.description}
        />

        <meta
          name="keywords"
          content={seoContent.keywords}
        />

        <meta
          property="og:title"
          content={seoContent.title}
        />

        <meta
          property="og:description"
          content={seoContent.description}
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:image"
          content="https://вамлюстра.рф/og-image.jpg"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <link
          rel="canonical"
          href="https://вамлюстра.рф/ElektroustnovohneIzdely/configurator"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </Head>

      <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* LEFT */}

          <div
            className="relative h-[50vh] lg:h-screen lg:sticky lg:top-0 bg-zinc-50 flex flex-col justify-center items-center overflow-hidden transition-colors duration-500"
            style={{
              backgroundColor: bgColor.color
            }}
          >
            <div className="absolute top-6 left-6 lg:top-24 lg:left-10 z-10">
              <span className="text-xl font-bold text-neutral-500 tracking-tighter uppercase">
                Donel
              </span>

              <span className="text-xs text-zinc-400 block tracking-widest mt-1">
                Configurator
              </span>
            </div>

            <div className="relative w-full max-w-md aspect-square p-8">
              <div className="relative w-full h-full drop-shadow-2xl">
                {frame && mech && (
                  <>
                    <img
                      src={frame.image}
                      alt={frame.name}
                      className="absolute inset-0 w-full h-full object-contain z-0"
                    />

                    <img
                      src={mech.image}
                      alt={mech.name}
                      className="absolute inset-0 w-full h-full object-contain z-10 scale-[0.84]"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="absolute bottom-6 flex gap-4 px-6 w-full justify-between items-end z-20">
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-xs font-medium shadow-sm border border-zinc-100 hidden sm:block">
                {currentSeries.name} /{' '}
                {frame?.name} / {mech?.name}
              </div>

              <div className="flex -space-x-2 overflow-hidden bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-sm">
                {backgroundColors.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() =>
                      setSelectedBackgroundColor(
                        bg.id
                      )
                    }
                    className={`w-6 h-6 rounded-full border border-zinc-200 ${
                      selectedBackgroundColor ===
                      bg.id
                        ? 'scale-125 ring-2 ring-black'
                        : ''
                    }`}
                    style={{
                      backgroundColor: bg.color
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="p-6 lg:p-20 xl:p-24 overflow-y-auto bg-white">
            <div className="max-w-xl mx-auto space-y-16">
              <div>
                <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-zinc-900 mb-4">
                  Конфигуратор
                  электроустановочных изделий
                </h1>

                <p className="text-zinc-400 font-light text-lg leading-relaxed">
                  Donel —
                  дизайнерские розетки,
                  выключатели и рамки для
                  современного интерьера.
                </p>
              </div>

              {/* SERIES */}

              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  01. Серия
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {seriesOptions.map(series => (
                    <button
                      key={series.id}
                      onClick={() =>
                        setSelectedSeries(series.id)
                      }
                      className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                        selectedSeries === series.id
                          ? 'border-black bg-zinc-50'
                          : 'border-zinc-200 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      <span className="block text-sm font-medium">
                        {series.name}
                      </span>

                      {selectedSeries ===
                        series.id && (
                        <Check className="absolute top-4 right-4 w-4 h-4 text-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* FRAMES */}

              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    02. Рамка
                  </span>

                  <span className="text-sm text-zinc-800">
                    {frame?.name}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                  {filteredFrames.map(option => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSelectedFrame(option.id)
                      }
                      className="relative aspect-square rounded-full"
                    >
                      <div
                        className={`w-full h-full overflow-hidden p-1 border ${
                          selectedFrame === option.id
                            ? 'border-black'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={option.image}
                          alt={option.name}
                          className="w-full h-full object-contain bg-zinc-100"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* MECHANISMS */}

              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    03. Механизм
                  </span>

                  <span className="text-sm text-zinc-800">
                    {mech?.name}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                  {mechanismOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSelectedMechanism(
                          option.id
                        )
                      }
                      className="relative aspect-square rounded-lg"
                    >
                      <div
                        className={`w-full h-full rounded-lg overflow-hidden border ${
                          selectedMechanism ===
                          option.id
                            ? 'border-black ring-1 ring-black'
                            : 'border-zinc-100 bg-zinc-50'
                        }`}
                      >
                        <img
                          src={option.image}
                          alt={option.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}

              <div className="pt-10 border-t border-zinc-100 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setShowOrderForm(true)
                    }
                    className="flex-1 bg-zinc-900 text-white hover:bg-black h-14 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Запросить цену</span>

                    <Phone size={16} />
                  </button>

                  <button
                    onClick={copyShareLink}
                    className="w-14 h-14 flex items-center justify-center rounded-lg border border-zinc-200"
                  >
                    {copied ? (
                      <Check size={20} />
                    ) : (
                      <Share2 size={20} />
                    )}
                  </button>

                  <button
                    onClick={resetConfig}
                    className="w-14 h-14 flex items-center justify-center rounded-lg border border-zinc-200"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>

  
              
            </div>
          </div>
        </div>

        {/* MODAL */}

        {showOrderForm && (
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-sm w-full relative">
              <button
                onClick={() =>
                  setShowOrderForm(false)
                }
                className="absolute top-6 right-6 text-zinc-400 hover:text-black"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-900">
                  <Phone size={24} />
                </div>

                <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
                  Свяжитесь с нами
                </h2>

                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                  Менеджер поможет подобрать
                  электроустановочные изделия.
                </p>

                <a
                  href="tel:+79660333111"
                  className="block w-full bg-zinc-900 text-white hover:bg-black py-4 rounded-xl text-lg font-medium"
                >
                  +7 (966) 033-31-11
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConfiguratorPage;