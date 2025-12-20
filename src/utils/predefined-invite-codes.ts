// Предустановленные инвайт-коды для тестирования системы регистрации дизайнеров
// В продакшене эти коды должны храниться в базе данных

export const PREDEFINED_INVITE_CODES: { [key: string]: {
  id: string;
  code: string;
  note: string;
  maxUses: number;
  currentUses: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string | null;
} } = {
  // Тестовые коды для разработки
  'DESIGN2024TEST': {
    id: 'test-1',
    code: 'DESIGN2024TEST',
    note: 'Тестовый код для разработки',
    maxUses: 999,
    currentUses: 0,
    isUsed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    expiresAt: null,
  },
  
  'ELEKTROMOS-VIP': {
    id: 'vip-1',
    code: 'ELEKTROMOS-VIP',
    note: 'VIP код для премиум дизайнеров',
    maxUses: 10,
    currentUses: 0,
    isUsed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    expiresAt: null,
  },

  'STUDIO2024PRO': {
    id: 'studio-1',
    code: 'STUDIO2024PRO',
    note: 'Код для дизайн-студий',
    maxUses: 5,
    currentUses: 0,
    isUsed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    expiresAt: null,
  },

  'FREELANCE-DES': {
    id: 'freelance-1',
    code: 'FREELANCE-DES',
    note: 'Код для фрилансеров',
    maxUses: 1,
    currentUses: 0,
    isUsed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    expiresAt: null,
  },

  'PARTNER-2024': {
    id: 'partner-1',
    code: 'PARTNER-2024',
    note: 'Партнерский код',
    maxUses: 3,
    currentUses: 0,
    isUsed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    expiresAt: null,
  }
};

// Функция для проверки валидности инвайт-кода
export const validateInviteCode = (code: string): {
  isValid: boolean;
  codeData?: any;
  error?: string;
} => {
  const upperCode = code.toUpperCase().trim();
  
  // Проверяем в предустановленных кодах
  const predefinedCode = PREDEFINED_INVITE_CODES[upperCode];
  
  if (predefinedCode) {
    // Проверяем, не превышен ли лимит использований
    if (predefinedCode.currentUses >= predefinedCode.maxUses) {
      return {
        isValid: false,
        error: 'Код исчерпал лимит использований'
      };
    }

    // Проверяем срок действия
    if (predefinedCode.expiresAt && new Date(predefinedCode.expiresAt) < new Date()) {
      return {
        isValid: false,
        error: 'Срок действия кода истек'
      };
    }

    return {
      isValid: true,
      codeData: predefinedCode
    };
  }

  return {
    isValid: false,
    error: 'Недействительный инвайт-код'
  };
};

// Функция для отметки кода как использованного
export const markCodeAsUsed = (code: string, userInfo: {
  username: string;
  email: string;
}): boolean => {
  const upperCode = code.toUpperCase().trim();
  const predefinedCode = PREDEFINED_INVITE_CODES[upperCode];
  
  if (predefinedCode && predefinedCode.currentUses < predefinedCode.maxUses) {
    // В реальном приложении здесь будет обновление базы данных
    predefinedCode.currentUses += 1;
    
    if (predefinedCode.currentUses >= predefinedCode.maxUses) {
      predefinedCode.isUsed = true;
    }
    
    return true;
  }
  
  return false;
};

// Получить все коды (для админки)
export const getAllInviteCodes = () => {
  return Object.values(PREDEFINED_INVITE_CODES).map(code => ({
    ...code,
    designerName: undefined, // Здесь может быть информация о зарегистрированном дизайнере
    designerEmail: undefined,
    usedAt: code.currentUses > 0 ? new Date().toISOString() : undefined,
    usedBy: undefined, // Информация о том, кто использовал код
  }));
}; 