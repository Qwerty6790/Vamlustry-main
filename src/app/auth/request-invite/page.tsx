"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiUsers, FiShield, FiCheckCircle, FiCopy } from "react-icons/fi";
import { PREDEFINED_INVITE_CODES } from "@/utils/predefined-invite-codes";

export default function RequestInvitePage() {
  const [showTestCodes, setShowTestCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const testCodes = Object.values(PREDEFINED_INVITE_CODES);

  return (
    <div className="min-h-screen bg-[#101010] pt-48">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-32">
          <h1 className="text-4xl font-bold text-white mb-4">
            Получение инвайт-кода дизайнера
          </h1>
          <p className="text-xl text-gray-300">
            Присоединяйтесь к сообществу профессиональных дизайнеров
          </p>
        </div>

       

        {/* Как получить код */}
        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Как получить инвайт-код?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Свяжитесь с нашим менеджером</h3>
                <p className="text-gray-400 mb-4">
                  Отправьте заявку на получение инвайт-кода с указанием информации о себе или своей студии
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="mailto:infoelektromosru@gmail.com" 
                    className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <FiMail size={16} />
                    infoelektromosru@gmail.com
                  </a>
                  <a 
                    href="tel:+7XXXXXXXXX" 
                    className="flex items-center gap-2  text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <FiPhone size={16} />
                    +7 (903) 797-06-99
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Предоставьте портфолио</h3>
                <p className="text-gray-400">
                  Покажите свои работы, сертификаты или информацию о компании для подтверждения статуса дизайнера
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Получите персональный код</h3>
                <p className="text-gray-400">
                  После проверки вы получите уникальный инвайт-код для регистрации в течение 1-2 рабочих дней
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Требования */}
        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Требования к кандидатам</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Индивидуальные дизайнеры</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">          
                  Профильное образование или опыт от 2 лет
                </li>
                <li className="flex items-center gap-2">
                  Портфолио выполненных проектов
                </li>
                <li className="flex items-center gap-2">
                  Сертификаты или дипломы (при наличии)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Дизайн-студии</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  Официальная регистрация компании
                </li>
                <li className="flex items-center gap-2">
                  Сайт с примерами работ
                </li>
                <li className="flex items-center gap-2">
                  Рекомендации клиентов
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* CTA */}
        <div className="text-center">
          <a
            href="/auth/register"
            className="inline-block bg-red-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg"
          >
            Зарегистрироваться с инвайт-кодом
          </a>
        </div>
      </div>
    </div>
  );
} 