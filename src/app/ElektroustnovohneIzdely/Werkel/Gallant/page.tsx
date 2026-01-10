
'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// --- Data ---
const gallantData = {
  id: 'gallant',
  name: 'Gallant',
  description: 'Премиальная коллекция в стиле арт-деко. Эталон немецкого качества и элегантного дизайна.',
  colors: [
    { id: 'graphite-corrugated', name: 'Графит рифленый', image: '/images/colors/графитрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-graphite-corrugated' },
    { id: 'black-chrome', name: 'Черный хром', image: '/images/colors/черныйхромGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-black-chrome' },
    { id: 'ivory', name: 'Слоновая кость', image: '/images/colors/слоноваякостьGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-ivory' },
    { id: 'silver', name: 'Серебряный', image: '/images/colors/серебряныйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-silver' },
    { id: 'white', name: 'Белый', image: '/images/colors/белыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-white' },
    { id: 'champagne-corrugated', name: 'Шампань рифленый', image: '/images/colors/шампаньрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-champagne-corrugated' },
  ],
};

export default function WerkelGallantPage() {
  return (
    // Добавил bg-neutral-900 и text-white, так как внутренние стили (border-white/5) рассчитаны на темный фон
    <div className="min-h-screen  text-black pt-24 lg:pt-0">
      <Head>
        <title>Werkel Gallant — Elektromos</title>
        <meta name="description" content="Минимализм и качество. Серия Gallant." />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: Fixed Info */}
        <div className="lg:w-5/12 lg:h-screen lg:sticky lg:top-0 px-6 py-12 lg:p-16 xl:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 z-10">
          <div className="max-w-md">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">Коллекция</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              {gallantData.name}
            </h1>
            
            <div className="space-y-6 text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
               <p>{gallantData.description}</p>
               <p>Выберите цвет для создания идеальной комбинации вашего интерьера.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Colors Gallery */}
        <div className="lg:w-7/12 min-h-screen px-6 py-12 lg:p-16 xl:p-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
              {gallantData.colors.map((color) => (
                <Link key={color.id} href={color.url} className="group block">
                  <div className="relative aspect-square bg-transparent rounded-sm flex items-center justify-center mb-4 transition-all duration-500  border border-white/5 ">
                    <Image
                      src={color.image}
                      alt={color.name}
                      width={300}
                      height={300}
                      className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-zinc-400 group-hover:text-black/10 transition-colors duration-300 font-light">
                      {color.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
