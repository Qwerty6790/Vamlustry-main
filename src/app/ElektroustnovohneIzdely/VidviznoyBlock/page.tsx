
'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// --- Data ---
const blocksData = {
  id: 'retractable-blocks',
  name: 'Выдвижные блоки',
  description: 'Эргономичное решение для организации рабочего пространства. Сочетание функциональности, безопасности и стиля.',
  items: [
    { 
      id: 'donel', 
      name: 'Donel', 
      image: '/images/seris/vidihonyblokDonel.png', 
      url: '/ElektroustnovohneIzdely/VidviznoyBlock/VidihnoyblockDonel' 
    },
    { 
      id: 'werkel', 
      name: 'Werkel', 
      image: '/images/seris/vidihonyblokWerkel.png', 
      url: '/ElektroustnovohneIzdely/VidviznoyBlock/VidihnoyblockWerkel' 
    },
  ],
};

export default function RetractableBlocksPage() {
  return (
    <div className="min-h-screen  text-black pt-24 lg:pt-0">
      <Head>
        <title>Выдвижные блоки, Donel, Werkel — Elektromos</title>
        <meta name="description" content="Купить Выдвижные блоки, Donel, Werkel — Elektromos" />
        <meta property="og:title" content="Выдвижные блоки, Donel, Werkel — Elektromos" />
        <meta property="og:description" content="Купить Выдвижные блоки, Donel, Werkel — Elektromos" />
        <meta property="og:url" content="https://elektromos.uz/ElektroustnovohneIzdely/Vstraivaemy-series" />
        <meta property="og:image" content="/images/seris/vidihonyblokDonel.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: Fixed Info */}
        <div className="lg:w-5/12 lg:h-screen lg:sticky lg:top-0 px-6 py-12 lg:p-16 xl:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 z-10">
          <div className="max-w-md">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">Категория</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              {blocksData.name}
            </h1>
            
            <div className="space-y-6 text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
               <p>
                 Откройте для себя превосходные электроустановочные изделия – эталон качества и элегантного дизайна.
               </p>
               <p>
                 Это не просто электрика, это искусство создания совершенного пространства. 
                 Идеально подходит для кухонных столешниц, офисных столов и переговорных комнат.
               </p>
               <p>Выбирайте качество, выбирайте надежные бренды!</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Gallery Grid */}
        <div className="lg:w-7/12 min-h-screen px-6 py-12 lg:p-16 xl:p-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
              {blocksData.items.map((item) => (
                <Link key={item.id} href={item.url} className="group block">
                  <div className="relative aspect-square bg-transparent rounded-sm flex items-center justify-center mb-4 transition-all duration-500  border border-white/5 ">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={800}
                      height={800}
                      className="object-cover  group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg text-zinc-400 group-hover:text-black transition-colors duration-300 font-light">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 uppercase tracking-wider">Перейти к коллекции</p>
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