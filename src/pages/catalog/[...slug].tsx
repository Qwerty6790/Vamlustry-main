import type { GetServerSideProps } from 'next';
import CatalogIndex, { getServerSideProps as originalGetServerSideProps } from './index';

export default CatalogIndex;

const brandSlugToName: Record<string, string> = {
  lightstar: 'LightStar',
  maytoni: 'Maytoni',
  novotech: 'Novotech',
  lumion: 'Lumion',
  artelamp: 'Artelamp',
  denkirs: 'Denkirs',
  stluce: 'Stluce',
  kinklight: 'KinkLight',
  sonex: 'Sonex',
  odeonlight: 'OdeonLight',
  elektrostandart: 'ElektroStandard',
  favourite: 'Favourite',
  donel: 'Donel',

};

const categorySlugToName: Record<string, string> = {
  'chandeliers': 'Люстра',
  'chandeliers/pendant-chandeliers': 'Подвесная люстра',
  'chandeliers/ceiling-chandeliers': 'Потолочная люстра',
  'chandeliers/rod-chandeliers': 'Люстра на штанге',
  'chandeliers/cascade-chandeliers': 'Люстра каскадная',
  'chandeliers/crystal-chandeliers': 'хрусталь Люстра',
  'ceiling-fans': 'Люстра вентилятор',
  'lights': 'Светильники',
  'lights/ceiling-lights': 'Потолочный светильник',
  'lights/pendant-lights': 'Подвесной светильник',
  'lights/wall-lights': 'Настенный светильник',
  'lights/recessed-lights': 'Светильник встраиваемый',
  'lights/surface-mounted-lights': 'Светильник накладной',
  'lights/track-lights': 'трековый светильник',
  'lights/spot-lights': 'Точечный светильник',
  'wall-sconces': 'Настенный светильник',
  'floor-lamps': 'Торшер',
  'table-lamps': 'Настольная лампа',
  'led-strip-profiles': 'Профиль',
  'led-strips': 'Светодиодная лента',
  'led-lamp': 'Светодиодная лампа',
  'outdoor-lights': 'Уличный светильник',
  'outdoor-lights/outdoor-wall-lights': 'Настенный уличный светильник',
  'outdoor-lights/ground-lights': 'Грунтовый светильник',
  'outdoor-lights/landscape-lights': 'Ландшафтный светильник',
  'outdoor-lights/park-lights': 'Парковый светильник',
  'accessories': 'Комплектующие',
  'accessories/connectors': 'Коннектор',
  'accessories/cords': 'Шнур',
  'accessories/power-supplies': 'Блок питания',
  'accessories/lamp-holders': 'Патрон',
  'accessories/mounting': 'Крепление для светильников',
  'accessories/lampshades': 'Плафон',
  'accessories/controllers': 'Контроллер для светодиодной ленты'
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slugParam = ctx.params?.slug;
  const slugArray = Array.isArray(slugParam) ? slugParam as string[] : [];

  // Локальный resolve для стабильного определения brand/category на SSR
  const resolveSlugLocal = (arr: string[]): { source?: string; category?: string } => {
    if (!arr || arr.length === 0) return {};
    const first = arr[0];
    const joined = arr.join('/');

    // Приоритет: полный путь
    if (joined && categorySlugToName[joined]) {
      return { category: categorySlugToName[joined] };
    }

    // Если первый сегмент — бренд
    if (brandSlugToName[first]) {
      const brandName = brandSlugToName[first];
      const rest = arr.slice(1).join('/');
      if (rest && categorySlugToName[rest]) {
        return { source: brandName, category: categorySlugToName[rest] };
      }
      return { source: brandName };
    }

    // Если первый сегмент сам по себе — категория
    if (categorySlugToName[first]) {
      return { category: categorySlugToName[first] };
    }

    return {};
  };

  // Логи для отладки SSR на докер/таймвеб
  try {
    console.log('SSR catalog slug:', slugParam, 'asArray:', slugArray);
  } catch (e) {}

  let source: string | undefined;
  let category: string | undefined;

  if (slugArray.length > 0) {
    const resolved = resolveSlugLocal(slugArray);
    source = resolved.source;
    category = resolved.category;

    try {
      console.log('SSR resolved source/category:', source, category);
    } catch (e) {}
  }

  const nextCtx = {
    ...ctx,
    query: {
      ...ctx.query,
      ...(source ? { source } : {}),
      ...(category ? { category } : {})
    }
  } as Parameters<typeof originalGetServerSideProps>[0];

  return originalGetServerSideProps(nextCtx);
};


