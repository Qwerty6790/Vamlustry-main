
'use client';

import { useState, useEffect } from 'react';
import { Share2, RotateCcw, Phone, X, Check } from 'lucide-react'; // Рекомендую добавить иконки для минимализма (npm install lucide-react)

// --- Interfaces (Без изменений) ---
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

// --- Data Constants (Без изменений) ---
const backgroundColors = [
  { id: 'white', name: 'Белый', color: '#F3F4F6' }, // Изменил белый на светло-серый для контраста в светлой теме
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
  { id: 'coral', name: 'Коралловый', color: '#FF7F50' },
];

const ConfiguratorPage = () => {
  // --- Data Options (Ваши данные) ---
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
    { id: 'r98', name: 'R98', image: '/images/черныйR98.webp', brandId: 'donel', colors: [] },
    { id: 'r98-metal', name: 'R98 METAL', image: '/images/ЛатуньR98METAL.png', brandId: 'donel', colors: [] },
    { id: 'r98-trendy', name: 'R98 TRENDY', image: '/images/матовыйкораллR98.png', brandId: 'donel', colors: [] },
    { id: 'n96', name: 'N96', image: '/images/черныйN96.png', brandId: 'donel', colors: [] },
  ];

  // --- State and Hooks ---
  const [selectedSeries, setSelectedSeries] = useState<string>('r98');
  const [selectedFrame, setSelectedFrame] = useState<string>('aluminum');
  const [selectedMechanism, setSelectedMechanism] = useState<string>('aluminum');
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>('white');
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

  // --- Logic ---
  const resetConfig = () => {
    setSelectedSeries('r98');
    setSelectedFrame('aluminum');
    setSelectedMechanism('aluminum');
    setSelectedBackgroundColor('white');
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

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      
      {/* Grid Layout: Left (Sticky Preview) / Right (Scrollable Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* === LEFT COLUMN: PREVIEW === */}
        <div className="relative h-[50vh] lg:h-screen lg:sticky lg:top-0 bg-zinc-50 flex flex-col justify-center items-center overflow-hidden transition-colors duration-500"
             style={{ backgroundColor: bgColor.color }}>
          
          {/* Brand / Logo Area */}
          <div className="absolute top-6 left-6 lg:top-20 lg:left-10 z-10">
            <span className="text-xl font-bold text-neutral-500 tracking-tighter uppercase">Donel</span>
            <span className="text-xs text-zinc-400 block tracking-widest mt-1">Configurator</span>
          </div>

          {/* Product Image Composition */}
          <div className="relative w-full max-w-md aspect-square p-8 animate-fade-in">
            <div className="relative w-full h-full drop-shadow-2xl">
               {(isClassicSeries || isMetalSeries) && frame && mech && (
                  <>
                    <img src={frame.image} alt={frame.name} className="absolute inset-0 w-full h-full object-contain z-0" />
                    <img src={mech.image} alt={mech.name} className="absolute inset-0 w-full h-full -left-[0.7%] object-contain z-10 scale-[0.84]" />
                  </>
                )}
                {(isN96Series || isTrendySeries) && mech && (
                  <img src={mech.image} alt={mech.name} className="absolute inset-0 w-full h-full object-contain z-10" />
                )}
            </div>
          </div>

          {/* Bottom Toolbar (Mobile friendly) */}
          <div className="absolute bottom-6 flex gap-4 px-6 w-full justify-between items-end z-20">
             <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-xs font-medium shadow-sm border border-zinc-100 hidden sm:block">
               {currentSeries.name} / {frame?.name || 'Без рамки'} / {mech?.name}
             </div>
             
             {/* Background Selector - Minimalist */}
             <div className="flex -space-x-2 overflow-hidden bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-sm hover:space-x-1 transition-all">
                {backgroundColors.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackgroundColor(bg.id)}
                    className={`w-6 h-6 rounded-full border border-zinc-200 shadow-inner transition-transform ${selectedBackgroundColor === bg.id ? 'scale-125 z-10 ring-2 ring-black' : 'hover:scale-110'}`}
                    style={{ backgroundColor: bg.color }}
                    title={bg.name}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: CONTROLS === */}
        <div className="p-6 lg:p-20 xl:p-24 overflow-y-auto bg-white">
          
          <div className="max-w-xl mx-auto space-y-16">
            
            {/* Header */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-zinc-900 mb-4">Настройка</h1>
              <p className="text-zinc-400 font-light text-lg leading-relaxed">
                Выберите серию, цвет рамки и наполнение, чтобы создать идеальное сочетание для вашего интерьера.
              </p>
            </div>

            {/* Section 1: Series */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">01. Серия</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {seriesOptions.map((series) => (
                  <button
                    key={series.id}
                    onClick={() => setSelectedSeries(series.id)}
                    className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                      selectedSeries === series.id
                        ? 'border-black bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-400 bg-white'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${selectedSeries === series.id ? 'text-black' : 'text-zinc-500'}`}>{series.name}</span>
                    {selectedSeries === series.id && <Check className="absolute top-4 right-4 w-4 h-4 text-black" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Frames */}
            {(isClassicSeries || isMetalSeries) && (
              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                   <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">02. Рамка</span>
                   <span className="text-sm text-zinc-800">{frame?.name}</span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                  {filteredFrames.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedFrame(option.id)}
                      className={`relative aspect-square rounded-full transition-all duration-300 group flex items-center justify-center`}
                    >
                      <div className={`w-full h-full  overflow-hidden p-1 border transition-all ${
                         selectedFrame === option.id ? 'border-black p-[2px]' : 'border-transparent group-hover:scale-110'
                      }`}>
                         <img src={option.image} alt={option.name} className="w-full h-full object-contain  bg-zinc-100" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Mechanism */}
            <div className="space-y-6">
              <div className="flex justify-between items-baseline">
                   <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">03. Механизм</span>
                   <span className="text-sm text-zinc-800">{mech?.name}</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                {mechanismOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedMechanism(option.id)}
                    className={`relative aspect-square rounded-lg transition-all duration-300 group`}
                  >
                    <div className={`w-full h-full rounded-lg overflow-hidden border transition-all ${
                         selectedMechanism === option.id ? 'border-black ring-1 ring-black' : 'border-zinc-100 bg-zinc-50 group-hover:border-zinc-300'
                      }`}>
                       <img src={option.image} alt={option.name} className="w-full h-full object-contain p-2" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary & Actions */}
            <div className="pt-10 border-t border-zinc-100 space-y-4">
               <div className="flex gap-4">
                  <button 
                    onClick={() => setShowOrderForm(true)}
                    className="flex-1 bg-zinc-900 text-white hover:bg-black h-14 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Запросить цену</span>
                    <Phone size={16} />
                  </button>
                  
                  <button 
                    onClick={copyShareLink} 
                    className="w-14 h-14 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:border-black hover:text-black transition-colors"
                    title="Поделиться"
                  >
                    {copied ? <Check size={20} /> : <Share2 size={20} />}
                  </button>
                  
                  <button 
                    onClick={resetConfig} 
                    className="w-14 h-14 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
                    title="Сбросить"
                  >
                    <RotateCcw size={20} />
                  </button>
               </div>
               <p className="text-xs text-zinc-400 text-center">
                 Конфигурация является предварительной визуализацией.
               </p>
            </div>

          </div>
        </div>
      </div>

      {/* === Modal Order Form === */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowOrderForm(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-900">
                <Phone size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Свяжитесь с нами</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Менеджер проверит наличие компонентов вашей конфигурации и оформит заказ.
              </p>
              
              <a 
                href="tel:+790000000" 
                className="block w-full bg-zinc-900 text-white hover:bg-black py-4 rounded-xl text-lg font-medium transition-transform hover:scale-[1.02]"
              >
                +7 (900) 000-00-00
              </a>
              <button 
                onClick={() => setShowOrderForm(false)}
                className="mt-4 text-sm text-zinc-400 hover:text-zinc-600 underline decoration-zinc-200 underline-offset-4"
              >
                Вернуться к выбору
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguratorPage;