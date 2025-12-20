
'use client';

import { useState, useEffect, useRef } from 'react';

// --- Interfaces ---
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

interface OrderForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// --- Data Constants ---
const backgroundColors = [
  { id: 'black', name: 'Черный', color: '#101010' },
  { id: 'darkgray', name: 'Темно-серый', color: '#1F2937' },
  { id: 'gray', name: 'Серый', color: '#374151' },
  { id: 'lightgray', name: 'Светло-серый', color: '#6B7280' },
  { id: 'white', name: 'Белый', color: '#FFFFFF' },
  { id: 'lightbeige', name: 'Светло-бежевый', color: '#F5F5DC' },
  { id: 'beige', name: 'Бежевый', color: '#D2B48C' },
  { id: 'brown', name: 'Коричневый', color: '#8B4513' },
  { id: 'mauve', name: 'Лиловый', color: '#B19CD9' },
  { id: 'lightblue', name: 'Светло-голубой', color: '#E6F3FF' },
  { id: 'blue', name: 'Голубой', color: '#87CEEB' },
  { id: 'darkblue', name: 'Темно-синий', color: '#1E3A8A' },
  { id: 'lightgreen', name: 'Светло-зеленый', color: '#E6FFE6' },
  { id: 'emerald', name: 'Изумрудный', color: '#047857' },
  { id: 'chocolate', name: 'Шоколадный', color: '#3E2723' },
  { id: 'coral', name: 'Коралловый', color: '#FF7F50' },
];

const ConfiguratorPage = () => {
  // --- Data Options ---
  const frameOptions: FrameOption[] = [
    { id: 'matyovyi-koral', name: 'Матовый коралл', color: 'border-zinc-300', image: '/images/colors/матовыйкораллрамкаDonel.webp', seriesId: 'r98' },
    { id: 'matyovyi-shokolad', name: 'Матовый шоколад', color: 'border-zinc-300', image: '/images/colors/матовыйшоколадрамкаDonel.webp', seriesId: 'r98' },
    { id: 'matyovyi-korbon', name: 'Матовый корбон', color: 'border-zinc-300', image: '/images/colors/матовыйкарбонрамкаDonel.webp', seriesId: 'r98' },
    { id: 'matyovyi-emirald', name: 'Матовый изумруд', color: 'border-zinc-300', image: '/images/colors/матовыйизумрудрамкаDonel.webp', seriesId: 'r98' },
    { id: 'matyovyi-seriy', name: 'Матовый серый', color: 'border-zinc-300', image: '/images/colors/матовыйсерыйрамкаDonel.webp', seriesId: 'r98' },
    { id: 'white', name: 'Белый', color: 'border-stone-100', image: '/images/colors/белыйрамкаобычнаяDonel.webp', seriesId: 'r98' },
    { id: 'matte-white', name: 'Матовый белый', color: 'border-stone-200', image: '/images/colors/белыйрамкаобычнаяDonel.webp', seriesId: 'r98' },
    { id: 'matte-emerald', name: 'Матовый изумруд', color: 'border-emerald-700', image: '/images/colors/матовыйизумрудрамкаDonel.webp', seriesId: 'r98' },
    { id: 'matte-carbon', name: 'Матовый карбон', color: 'border-zinc-900', image: '/images/colors/матовыйалюминийрамкаDonel.webp', seriesId: 'r98' },
    { id: 'matte-cashmere', name: 'Матовый кашемир', color: 'border-stone-300', image: '/images/colors/матовыйкашемиррамкаDonel.webp', seriesId: 'r98' },
    { id: 'brass-frame', name: 'Рамка Латунь', color: 'border-yellow-700', image: '/images/colors/R98Metalлатуньрамка.webp', seriesId: 'r98-metal' },
    { id: 'nickel-frame', name: 'Рамка Никель', color: 'border-gray-400', image: '/images/colors/R98Metalникелрамка.webp', seriesId: 'r98-metal' },
    { id: 'voronenay-stali-frame', name: 'Рамка Вороненая сталь', color: 'border-gray-900', image: '/images/colors/R98Metalвороненаястальрамка.webp', seriesId: 'r98-metal' },
    { id: 'blagodarnaya-stali-frame', name: 'Рамка Благородная сталь', color: 'border-gray-500', image: '/images/colors/R98Metalблагодарнаястальрамка.webp', seriesId: 'r98-metal' },
  ];

  const getMechanismOptions = (seriesId: string): MechanismOption[] => {
    switch (seriesId) {
      case 'r98':
        return [
          { id: 'black', name: 'Черный', image: '/images/colors/черныйR98.webp' },
          { id: 'stali', name: 'Сталь', image: '/images/colors/стальR98.png' },
          { id: 'matyovyi-shokolad', name: 'Матовый шоколад', image: '/images/colors/матовыйшоколадR98.webp' },
          { id: 'matyovyi-seriy', name: 'Матовый серый', image: '/images/colors/матовыйсерыйR98.webp' },
          { id: 'matyovyi-korbon', name: 'Матовый корбон', image: '/images/colors/матовыйкарбонR98.png' },
          { id: 'matyovyi-koral', name: 'Матовый коралл', image: '/images/colors/матовыйкораллR98.png' },
          { id: 'matyovyi-kashmir', name: 'Матовый кашмир', image: '/images/colors/матовыйкашемирR98.png' },
          { id: 'matyovyi-beliy', name: 'Матовый белый', image: '/images/colors/матовыйбелыйR98.png' },
          { id: 'matyovyi-emirald', name: 'Матовый изумрудный', image: '/images/colors/МатовыйИзумрудR98.png' },
          { id: 'white', name: 'Белый', image: '/images/colors/белыйR98.png' },
        ];
      case 'r98-metal':
        return [
          { id: 'brass', name: 'Латунь', image: '/images/colors/R98metalлатунь.png' },
          { id: 'nickel', name: 'Никель', image: '/images/colors/r98metalникел.png' },
          { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/R98metalвороненаясталь.png' },
          { id: 'blagodarnaya-stali', name: 'Благородная сталь', image: '/images/colors/R98metalблагороданясталь.png' },
          { id: 'matovoy-gold', name: 'Матовое золото', image: '/images/colors/R98metalзолотоматовое.png' },
        ];
      case 'r98-trendy':
        return [
          { id: 'trendy-duna', name: 'Дюна', image: '/images/colors/R98_Trendy_Colors_Duna.png' },
          { id: 'trendy-ehliybluy', name: 'Эшли блю', image: '/images/colors/R98_Trendy_Colors_Ehliybluy.png' },
          { id: 'trendy-fiesta', name: 'Фиеста', image: '/images/colors/R98_Trendy_Colors_Fiesta.png' },
          { id: 'trendy-kaslrok', name: 'Каслрок', image: '/images/colors/R98_Trendy_Colors_Kaslrok.png' },
          { id: 'trendy-ynaternokorihnevy', name: 'Янатро коричневый', image: '/images/colors/R98_Trendy_Colors_Ynaternokorihnevy.png' },
        ];
      case 'n96':
        return [
          { id: 'black', name: 'Черный', image: '/images/colors/черныйN96.png' },
          { id: 'white', name: 'Белый', image: '/images/colors/белыйn96.png' },
          { id: 'nickel', name: 'Никель', image: '/images/colors/никельn96.png' },
          { id: 'brass', name: 'Латунь', image: '/images/colors/латуньn96.png' },
          { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/вороненаястальn96.png' },
        ];
      default:
        return [
          { id: 'aluminum', name: 'Алюминий', image: '/images/colors/матовыйалюминийR98.png' },
        ];
    }
  };

  const seriesOptions: SeriesOption[] = [
    { 
      id: 'r98', 
      name: 'R98', 
      image: '/images/черныйR98.webp', 
      brandId: 'donel',
      colors: [
        { id: 'default', name: 'Стандартная', image: '/images/colors/черныйR98.webp', url: '/configurator?series=r98' }
      ]
    },
    { 
      id: 'r98-metal', 
      name: 'R98 METAL', 
      image: '/images/ЛатуньR98METAL.png', 
      brandId: 'donel',
      colors: [
        { id: 'brass', name: 'Латунь', image: '/images/colors/R98metalлатунь', url: '/configurator?series=r98-metal&color=brass' },
        { id: 'nickel', name: 'Никель', image: '/images/colors/R98metalникель.png', url: '/configurator?series=r98-metal&color=nickel' },
        { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/R98metalвороненаясталь.png', url: '/configurator?series=r98-metal&color=voronenay-stali' },
        { id: 'blagodarnaya-stali', name: 'Благородная сталь', image: '/images/colors/R98metalблагороданясталь.png', url: '/configurator?series=r98-metal&color=blagodarnaya-stali' },
        { id: 'matovoy-gold', name: 'Матовое золото', image: '/images/colors/R98metalзолотоматовое.png', url: '/configurator?series=r98-metal&color=matovoy-gold' },
      ]
    },
    { 
      id: 'r98-trendy', 
      name: 'R98 Trendy Colors', 
      image: '/images/матовыйкораллR98.png', 
      brandId: 'donel',
      colors: [
        { id: 'coral', name: 'Коралловый', image: '/images/colors/матовыйкораллR98.png', url: '/configurator?series=r98-trendy&color=coral' },
        { id: 'emerald', name: 'Изумрудный', image: '/images/colors/МатовыйИзумрудR98.png', url: '/configurator?series=r98-trendy&color=emerald' },
        { id: 'cashmere', name: 'Кашемир', image: '/images/матовыйкашемирR98.png', url: '/configurator?series=r98-trendy&color=cashmere' },
        { id: 'carbon', name: 'Карбон', image: '/images/colors/матовыйкарбонR98.png', url: '/configurator?series=r98-trendy&color=carbon' },
        { id: 'grey', name: 'Серый', image: '/images/colors/матовыйсерыйR98.webp', url: '/configurator?series=r98-trendy&color=grey' },
        { id: 'white', name: 'Матовый белый', image: '/images/colors/матовыйбелыйR98.png', url: '/configurator?series=r98-trendy&color=white' },
      ]
    },
    { 
      id: 'n96', 
      name: 'N96', 
      image: '/images/черныйN96.png', 
      brandId: 'donel',
      colors: [
        { id: 'black', name: 'Черный', image: '/images/colors/черныйN96.png', url: '/configurator?series=n96&color=black' },
        { id: 'white', name: 'Белый', image: '/images/colors/белыйn96.png', url: '/configurator?series=n96&color=white' },
        { id: 'nickel', name: 'Никель', image: '/images/colors/никельn96.png', url: '/configurator?series=n96&color=nickel' },
        { id: 'brass', name: 'Латунь', image: '/images/colors/латуньn96.png', url: '/configurator?series=n96&color=brass' },
        { id: 'voronenay-stali', name: 'Вороненая сталь', image: '/images/colors/вороненаястальn96.png', url: '/configurator?series=n96&color=voronenay-stali' },
      ]
    },
  ];

  // --- State and Hooks ---
  const [selectedSeries, setSelectedSeries] = useState<string>('r98');
  const [selectedFrame, setSelectedFrame] = useState<string>('aluminum');
  const [selectedMechanism, setSelectedMechanism] = useState<string>('aluminum');
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>('black');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const seriesParam = params.get('series');
      const frameParam = params.get('frame');
      const mechParam = params.get('mech');
      const bgParam = params.get('bg');
      if (seriesParam) setSelectedSeries(seriesParam);
      if (frameParam) setSelectedFrame(frameParam);
      if (mechParam) setSelectedMechanism(mechParam);
      if (bgParam) setSelectedBackgroundColor(bgParam);
    }
  }, []);

  useEffect(() => {
    const newMechanisms = getMechanismOptions(selectedSeries);
    if (!newMechanisms.some(m => m.id === selectedMechanism)) {
      setSelectedMechanism(newMechanisms[0]?.id || '');
    }
    const newFrames = frameOptions.filter(f => f.seriesId === selectedSeries);
    if (!newFrames.some(f => f.id === selectedFrame)) {
      setSelectedFrame(newFrames[0]?.id || '');
    }
  }, [selectedSeries, selectedMechanism, selectedFrame]);

  // --- Helper Functions ---
  const resetConfig = () => {
    setSelectedSeries('r98');
    setSelectedFrame('aluminum');
    setSelectedMechanism('aluminum');
    setSelectedBackgroundColor('black');
  };

  const copyShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('series', selectedSeries);
    url.searchParams.set('frame', selectedFrame);
    url.searchParams.set('mech', selectedMechanism);
    url.searchParams.set('bg', selectedBackgroundColor);
    
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- Computed Values ---
  const currentSeries = seriesOptions.find(s => s.id === selectedSeries) || seriesOptions[0];
  const isClassicSeries = selectedSeries === 'r98';
  const isMetalSeries = selectedSeries === 'r98-metal';
  const isN96Series = selectedSeries === 'n96';
  const isTrendySeries = selectedSeries === 'r98-trendy';
  
  const filteredFrames = frameOptions.filter(f => f.seriesId === selectedSeries);
  const frame = filteredFrames.find(f => f.id === selectedFrame) || filteredFrames[0];
  const mechanismOptions = getMechanismOptions(selectedSeries);
  const mech = mechanismOptions.find(m => m.id === selectedMechanism) || mechanismOptions[0];
  const bgColor = backgroundColors.find(bg => bg.id === selectedBackgroundColor)!;

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-[#101010] text-neutral-200 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-44">
        {/* === Компактное Видео === */}
        <div className="mb-12 flex justify-center">
          <video
            className="rounded-lg w-full max-w-3xl shadow-2xl"
            autoPlay
            muted
            playsInline // Атрибут для лучшего воспроизведения на мобильных устройствах
          >
            {/* Замените на путь к вашему видео файлу */}
            <source src="/images/banners/bannersdonelconfigurator.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* === Заголовок === */}
        <div className="mb-20 text-center">
          <h1 className="text-5xl md:text-8xl font-light tracking-tight text-white mb-4">
            Конфигуратор
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Создайте свой уникальный дизайн, комбинируя серии, рамки и механизмы.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* === Левая панель: Фон === */}
          <div className="lg:col-span-2">
            <div className="lg:sticky top-20">
              <h2 className="text-sm font-medium tracking-wider uppercase text-neutral-500 mb-6">Фон</h2>
              <div className="grid grid-cols-4 lg:grid-cols-3 gap-3">
                {backgroundColors.map((color) => (
                  <button
                    key={color.id}
                    title={color.name}
                    onClick={() => setSelectedBackgroundColor(color.id)}
                    className={`w-full aspect-square rounded-full transition-transform duration-200 ${
                      selectedBackgroundColor === color.id 
                        ? 'ring-2 ring-offset-2 ring-offset-[#101010] ring-white scale-110' 
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* === Центральная панель: Настройки === */}
          <div className="lg:col-span-6">
            {/* --- Выбор Серии --- */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 text-lg font-bold text-white">01</span>
                <h3 className="text-base font-medium tracking-wider uppercase text-neutral-300">Серия</h3>
                <div className="w-full h-px bg-neutral-800"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                {seriesOptions.map((series) => (
                  <button
                    key={series.id}
                    onClick={() => setSelectedSeries(series.id)}
                    className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                      selectedSeries === series.id
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {series.name}
                  </button>
                ))}
              </div>
            </div>

            {/* --- Выбор Рамки --- */}
            {(isClassicSeries || isMetalSeries) && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 text-lg font-bold text-white">02</span>
                  <h3 className="text-base font-medium tracking-wider uppercase text-neutral-300">Рамка</h3>
                  <div className="w-full h-px bg-neutral-800"></div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {filteredFrames.map((frameOpt) => (
                    <div key={frameOpt.id} className="text-center">
                      <button 
                        onClick={() => setSelectedFrame(frameOpt.id)}
                        className={`w-full aspect-square border rounded-lg transition-all duration-200 p-2 flex items-center justify-center ${
                          selectedFrame === frameOpt.id ? 'border-white border-2 scale-105' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-600'
                        }`}
                      >
                        <img src={frameOpt.image} alt={frameOpt.name} className="w-full h-full object-contain" />
                      </button>
                      <p className="text-xs text-neutral-400 mt-2">{frameOpt.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Выбор Механизма --- */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex-shrink-0 text-lg font-bold text-white">03</span>
                <h3 className="text-base font-medium tracking-wider uppercase text-neutral-300">Механизм</h3>
                <div className="w-full h-px bg-neutral-800"></div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {mechanismOptions.map((mechOpt) => (
                  <div key={mechOpt.id} className="text-center">
                    <button 
                      onClick={() => setSelectedMechanism(mechOpt.id)}
                      className={`w-full aspect-square border rounded-lg transition-all duration-200 p-2 flex items-center justify-center ${
                        selectedMechanism === mechOpt.id ? 'border-white border-2 scale-105' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-600'
                      }`}
                    >
                      <img src={mechOpt.image} alt={mechOpt.name} className="w-full h-full object-contain" />
                    </button>
                    <p className="text-xs text-neutral-400 mt-2">{mechOpt.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === Правая панель: Превью === */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 bg-[#181818] border border-neutral-800 rounded-xl p-6">
              <h2 className="text-sm font-medium tracking-wider uppercase text-neutral-500 mb-6">Превью</h2>
              
              <div 
                className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden transition-colors duration-300"
                style={{ backgroundColor: bgColor.color }}
              >
                {/* --- Логика отображения изображений --- */}
                {(isClassicSeries || isMetalSeries) && frame && mech && (
                  <>
                    <img src={frame.image} alt={frame.name} className="absolute inset-0 w-full h-full object-contain p-5" />
                    <img src={mech.image} alt={mech.name} className="absolute inset-0 w-full h-full object-contain -left-[2px] p-9" />
                  </>
                )}
                {(isN96Series || isTrendySeries) && mech && (
                  <img src={mech.image} alt={mech.name} className="absolute inset-0 w-full h-full object-contain p-10" />
                )}
              </div>

              {/* --- Информация о конфигурации --- */}
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Серия</span>
                  <span className="text-white font-medium">{currentSeries.name}</span>
                </div>
                {(isClassicSeries || isMetalSeries) && (
                  <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Рамка</span>
                    <span className="text-white font-medium">{frame?.name || '...'}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Механизм</span>
                  <span className="text-white font-medium">{mech?.name || '...'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-400">Фон</span>
                  <span className="text-white font-medium">{bgColor.name}</span>
                </div>
              </div>

              {/* --- Кнопки действий --- */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-white hover:bg-neutral-200 text-black py-3 px-6 rounded-md text-sm font-semibold transition-colors duration-200"
                >
                  Оформить заказ
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={resetConfig} 
                    className="flex-1 px-4 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800 text-sm text-neutral-300 transition-colors duration-200"
                  >
                    Сброс
                  </button>
                  <button 
                    onClick={copyShareLink} 
                    className="flex-1 px-4 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800 text-sm text-neutral-300 transition-colors duration-200"
                  >
                    {copied ? '✓ Скопировано' : 'Поделиться'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Модальное окно заказа === */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl max-w-sm w-full relative">
            <button 
              onClick={() => setShowOrderForm(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl text-center font-light text-white mb-4">Оформление заказа</h2>
            <p className="text-neutral-400 text-center mb-6">
              Для оформления заказа, пожалуйста, свяжитесь с нами по телефону.
            </p>
            <a 
              href="tel:+79037970699" 
              className="block text-center w-full bg-white hover:bg-neutral-200 text-black py-3 px-6 rounded-md text-lg font-semibold transition-colors duration-200"
            >
              +7 (903) 797-06-99
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguratorPage;