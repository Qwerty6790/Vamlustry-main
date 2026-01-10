
'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// --- Data ---
const w55Data = {
  id: 'w55',
  name: 'Donel W55',
  description: 'Влагозащищенная серия W55 со степенью защиты IP55. Идеальное решение для террас, гаражей, складских помещений и ванных комнат.',
  items: [
    { 
      id: 'surface', 
      name: 'Накладной монтаж', 
      image: '/images/seris/w55.png', 
      url: '/ElektroustnovohneIzdely/Donel/W55-nakladnoy' 
    },
    { 
      id: 'flush', 
      name: 'Встроенный монтаж', 
      image: '/images/seris/w55vstrony.png', 
      url: '/ElektroustnovohneIzdely/Donel/W55-vstroeniy' 
    },
  ],
};

export default function DonelW55Page() {
  return (
    <div className="min-h-screen text-black pt-24 lg:pt-0">
      <Head>
        <title>Donel W55 — Влагозащищенная серия — Elektromos</title>
        <meta name="description" content="Купить влагозащищенные розетки и выключатели Donel W55 (IP55)." />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: Fixed Info */}
        <div className="lg:w-5/12 lg:h-screen lg:sticky lg:top-0 px-6 py-12 lg:p-16 xl:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 z-10">
          <div className="max-w-md">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">Серия</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              {w55Data.name}
            </h1>
            
            <div className="space-y-6 text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
               <p>{w55Data.description}</p>
               <p>
                 Высокая ударопрочность, защита от пыли и влаги, устойчивость к ультрафиолету. 
                 Выберите тип монтажа, подходящий для вашего проекта.
               </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Gallery Grid */}
        <div className="lg:w-7/12 min-h-screen px-6 py-12 lg:p-16 xl:p-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-12">
              {w55Data.items.map((item) => (
                <Link key={item.id} href={item.url} className="group block">
                  <div className="relative aspect-square bg-transparent rounded-sm flex items-center justify-center mb-6 transition-all duration-500 border border-white/5 ">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={400}
                      className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl text-zinc-300 group-hover:text-black transition-colors duration-300 font-light mb-2">
                      {item.name}
                    </h3>
                    <span className="text-xs text-zinc-600 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full group-hover:border-zinc-600 transition-colors">
                      Смотреть каталог
                    </span>
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