"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiCopy, FiEye, FiEyeOff, FiRefreshCw, FiUsers } from "react-icons/fi";
import { getAllInviteCodes, PREDEFINED_INVITE_CODES } from "@/utils/predefined-invite-codes";

interface InviteCode {
  id: string;
  code: string;
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
  isUsed: boolean;
  designerName?: string;
  designerEmail?: string;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  note?: string;
}

export default function InviteCodesAdmin() {
  const router = useRouter();
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showUsed, setShowUsed] = useState(true);
  
  // Форма создания нового кода
  const [newCode, setNewCode] = useState({
    note: '',
    maxUses: 1,
    expiresAt: '',
  });

  // Загружаем коды сразу без проверки токена
  useEffect(() => {
    loadInviteCodes();
  }, []);

  // Загрузка инвайт-кодов (используем локальные коды для демонстрации)
  const loadInviteCodes = async () => {
    try {
      // Загружаем предустановленные коды
      const localCodes = getAllInviteCodes();
      setInviteCodes(localCodes as unknown as InviteCode[]);
      
      // В продакшене здесь будет запрос к API
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/invite-codes`...
    } catch (error) {
      console.error('Ошибка загрузки инвайт-кодов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Генерация нового инвайт-кода
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Создание нового инвайт-кода (локальная версия без API)
  const createInviteCode = async () => {
    setIsCreating(true);
    try {
      const generatedCode = generateInviteCode();
      
      // Создаем новый код локально
      const newInviteCode: InviteCode = {
        id: `local-${Date.now()}`,
        code: generatedCode,
        createdAt: new Date().toISOString(),
        isUsed: false,
        maxUses: newCode.maxUses,
        currentUses: 0,
        expiresAt: newCode.expiresAt || undefined,
        note: newCode.note,
      };
      
      // Добавляем в список
      setInviteCodes(prev => [...prev, newInviteCode]);
      setNewCode({ note: '', maxUses: 1, expiresAt: '' });
      
      // В продакшене здесь будет запрос к API
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/invite-codes`...
    } catch (error) {
      console.error('Ошибка создания инвайт-кода:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Удаление инвайт-кода (локальная версия)
  const deleteInviteCode = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот инвайт-код?')) return;
    
    try {
      // Удаляем локально
      setInviteCodes(prev => prev.filter(code => code.id !== id));
      
      // В продакшене здесь будет запрос к API
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/invite-codes/${id}`...
    } catch (error) {
      console.error('Ошибка удаления инвайт-кода:', error);
    }
  };

  // Копирование кода в буфер обмена
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Можно добавить toast уведомление
  };

  // Фильтрация кодов
  const filteredCodes = inviteCodes.filter(code => 
    showUsed ? true : !code.isUsed
  );

  const activeCodesCount = inviteCodes.filter(code => !code.isUsed).length;
  const usedCodesCount = inviteCodes.filter(code => code.isUsed).length;
  const totalRegistrations = inviteCodes.reduce((sum, code) => sum + code.currentUses, 0);

  if (loading) {
    return (
      <div className="min-h-screen  bg-[#101010] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] pt-52">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-20">
          <h1 className="text-3xl font-bold text-white mb-2">Управление инвайт-кодами</h1>
          <p className="text-gray-400">Создание и управление кодами регистрации для дизайнеров</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Активные коды</p>
                <p className="text-2xl font-bold text-green-400">{activeCodesCount}</p>
              </div>
              <div className="text-green-400">
                <FiEye size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Использованные: Не известно</p>
                <p className="text-2xl font-bold text-orange-400">{usedCodesCount}</p>
              </div>
              <div className="text-orange-400">

              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Всего кодов</p>
                <p className="text-2xl font-bold text-blue-400">{inviteCodes.length}</p>
              </div>
              <div className="text-blue-400">
                <FiRefreshCw size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Регистраций: Не известно</p>
                <p className="text-2xl font-bold text-purple-400">{totalRegistrations}</p>
              </div>
              <div className="text-purple-400">
                <FiUsers size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Форма создания нового кода */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Создать новый инвайт-код</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заметка (для кого код)
              </label>
              <input
                type="text"
                value={newCode.note}
                onChange={(e) => setNewCode(prev => ({...prev, note: e.target.value}))}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Например: Студия ABC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Максимум использований
              </label>
              <input
                type="number"
                value={newCode.maxUses}
                onChange={(e) => setNewCode(prev => ({...prev, maxUses: parseInt(e.target.value) || 1}))}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Срок действия (опционально)
              </label>
              <input
                type="date"
                value={newCode.expiresAt}
                onChange={(e) => setNewCode(prev => ({...prev, expiresAt: e.target.value}))}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            onClick={createInviteCode}
            disabled={isCreating}
            className="flex items-center gap-2 px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <FiPlus size={16} />
            {isCreating ? 'Создание...' : 'Создать инвайт-код'}
          </button>
        </div>

        {/* Фильтры */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowUsed(!showUsed)}
            className={`px-4 py-2 rounded-md transition-colors ${
              showUsed 
                ? 'bg-red-800 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showUsed ? 'Скрыть использованные' : 'Показать все'}
          </button>

          <button
            onClick={loadInviteCodes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <FiRefreshCw size={16} />
            Обновить
          </button>
        </div>

        {/* Список инвайт-кодов */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
          {filteredCodes.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Нет инвайт-кодов для отображения
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2a2a2a] border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Код
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Заметка
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Использований
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Создан
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {filteredCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded">
                            {code.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Копировать код"
                          >
                            <FiCopy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {code.note || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          code.isUsed 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {code.isUsed ? 'Использован' : 'Активен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {code.currentUses} / {code.maxUses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(code.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteInviteCode(code.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Удалить код"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 