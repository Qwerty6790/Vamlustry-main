
'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// --- Data ---
const retroData = {
  id: 'retro',
  name: 'Retro',
  description: 'Винтажный стиль для ценителей классической элегантности. Керамика и благородные металлы в сочетании с ретро-формами создают неповторимый шарм.',
  // Объединяем цвета и рамки в один массив для отображения в сетке
  items: [
    { id: 'brown', name: 'Коричневый', image: '/images/colors/ретрокоричневыйWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/retro-black' },
    { id: 'black', name: 'Черный', image: '/images/colors/ретрочерныйWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/retro-ceramic' },
    { id: 'white', name: 'Белый', image: '/images/colors/ретробелыйWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/retro-white' },
    // Рамку добавляем сюда же, чтобы она была доступна сразу
    { id: 'frame-runda', name: 'Рамка Runda', image: '/images/seris/rundWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/ramka-runda' },
  ],
};

export default function WerkelRetroPage() {
  return (
    <div className="min-h-screen  text-black pt-24 lg:pt-0">
      <Head>
        <title>Werkel Retro — Elektromos</title>
        <meta name="description" content="Винтажный стиль и керамика. Серия Retro." />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: Fixed Info */}
        <div className="lg:w-5/12 lg:h-screen lg:sticky lg:top-0 px-6 py-12 lg:p-16 xl:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 z-10">
          <div className="max-w-md">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">Коллекция</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              {retroData.name}
            </h1>
            
            <div className="space-y-6 text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
               <p>{retroData.description}</p>
               <p>
                 Идеальное решение для лофт-интерьеров и деревянных домов. 
                 Выберите цвет механизма или рамку для создания законченного образа.
               </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Gallery Grid */}
        <div className="lg:w-7/12 min-h-screen px-6 py-12 lg:p-16 xl:p-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
              {retroData.items.map((item) => (
                <Link key={item.id} href={item.url} className="group block">
                  <div className="relative aspect-square bg-transparent rounded-sm flex items-center justify-center mb-4 transition-all duration-500  border border-white/5 ">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-zinc-400 group-hover:text-black/10 transition-colors duration-300 font-light">
                      {item.name}
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