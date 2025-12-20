export interface ProductI {
  imageAddress?: any;
  _id: string;
  article: string;
  name: string;
  price: number;
  stock: string | number;
  imageAddresses: string[] | string;
  source: string;
  visible?: boolean; // Видимость товара для админки
  isHidden?: boolean; // Альтернативный вариант visible (для совместимости с API)
  power?: number;
  voltage?: number;
  bulbType?: string;
  socket?: string;
  bulbCount?: number;
  lampPower?: number;
  material?: string;
  color?: string;
  style?: string;
  direction?: string;
  shape?: string;
  collection?: string; // Название коллекции, если оно есть в данных
} 