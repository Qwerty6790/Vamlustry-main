
"use client";

import React, { useState } from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import { PREDEFINED_INVITE_CODES } from "@/utils/predefined-invite-codes";

export default function RequestInvitePage() {
  // Состояния оставлены для сохранения вашей логики, если она используется
  const [showTestCodes, setShowTestCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Заголовок */}
        <div className="mb-24">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
            Инвайт-код дизайнера
          </h1>
          <p className="text-lg text-gray-500">
            Доступ к закрытому сообществу профессионалов.
          </p>
        </div>

        {/* Как получить код */}
        <div className="mb-24">
          <h2 className="text-xl font-medium mb-8">Как получить код</h2>
          
          <div className="flex flex-col">
            {/* Шаг 1 */}
            <div className="flex gap-6 border-t border-gray-200 py-8">
              <span className="text-sm font-mono text-gray-400 mt-1">01</span>
              <div>
                <h3 className="text-lg font-medium mb-2">Свяжитесь с менеджером</h3>
                <p className="text-gray-500 mb-6">
                  Отправьте заявку с информацией о себе или своей студии
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="mailto:vama1.11@mail.ru" 
                    className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-sm hover:border-black hover:bg-black hover:text-white transition-all text-sm font-medium"
                  >
                    <FiMail size={16} />
                    vama1.11@mail.ru
                  </a>
                  <a 
                    href="tel:+79660333111" 
                    className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-sm hover:border-black hover:bg-black hover:text-white transition-all text-sm font-medium"
                  >
                    <FiPhone size={16} />
                    +7 (966) 033-31-11
                  </a>
                </div>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="flex gap-6 border-t border-gray-200 py-8">
              <span className="text-sm font-mono text-gray-400 mt-1">02</span>
              <div>
                <h3 className="text-lg font-medium mb-2">Предоставьте портфолио</h3>
                <p className="text-gray-500">
                  Покажите свои работы, сертификаты или информацию о компании для подтверждения статуса
                </p>
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="flex gap-6 border-t border-gray-200 py-8">
              <span className="text-sm font-mono text-gray-400 mt-1">03</span>
              <div>
                <h3 className="text-lg font-medium mb-2">Получите код</h3>
                <p className="text-gray-500">
                  После проверки вы получите уникальный инвайт-код в течение 1-2 рабочих дней
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Требования */}
        <div className="mb-20">
          <h2 className="text-xl font-medium mb-8">Требования к кандидатам</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-8">
            <div>
              <h3 className="text-base font-medium mb-4">Индивидуальные дизайнеры</h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex gap-3">          
                  <span className="text-gray-300">—</span>
                  <span>Профильное образование или опыт от 2 лет</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300">—</span>
                  <span>Портфолио выполненных проектов</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300">—</span>
                  <span>Сертификаты или дипломы (при наличии)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-medium mb-4">Дизайн-студии</h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex gap-3">
                  <span className="text-gray-300">—</span>
                  <span>Официальная регистрация компании</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300">—</span>
                  <span>Сайт с примерами работ</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-300">—</span>
                  <span>Рекомендации клиентов</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-gray-200 pt-12">
          <a
            href="/auth/register"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto text-center"
          >
            Зарегистрироваться с кодом
          </a>
        </div>

      </div>
    </div>
  );
}
