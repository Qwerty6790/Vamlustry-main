'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { validateInviteCode, markCodeAsUsed } from '@/utils/predefined-invite-codes';
import Head from 'next/head';

const Register: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Валидация инвайт-кода
    if (!inviteCode.trim()) {
      setError('Инвайт-код обязателен для регистрации дизайнера');
      setIsLoading(false);
      return;
    }

    // Проверяем валидность инвайт-кода
    const codeValidation = validateInviteCode(inviteCode);
    if (!codeValidation.isValid) {
      setError(codeValidation.error || 'Недействительный инвайт-код');
      setIsLoading(false);
      return;
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
            username,
            email,
            password,
            inviteCode,
            company,
            phone,
            role: 'designer' // Явно указываем роль
        });
        
        // Отмечаем код как использованный
        markCodeAsUsed(inviteCode, { username, email });
        
        // Сохранение токена и данных пользователя
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('userProfile', JSON.stringify({
          name: username,
          email: email,
          phone: phone,
          company: company,
          role: 'Дизайнер'
        }));
        
        router.push('/auth/designers');

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            setError(err.response.data.error || 'Регистрация не удалась. Проверьте инвайт-код.');
        } else {
            setError('Регистрация не удалась. Попробуйте снова.');
        }
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Регистрация дизайнера - Стать партнером | Elektromos</title>
        <meta name="description" content="Регистрация дизайнера в Elektromos. Получите инвайт-код и специальные условия: скидка 25% на все товары, персональный менеджер, быстрая обработка заказов." />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Регистрация дизайнера - Elektromos" />
        <meta property="og:description" content="Станьте партнером Elektromos и получите скидку 25% на все товары. Регистрация по инвайт-коду." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://elektromos.ru/auth/register" />
        <meta property="og:image" content="/images/logo.webp" />
      </Head>
      <div className="min-h-screen bg-[#101010] flex items-center justify-center px-6">
    <div className="flex flex-col md:flex-row w-full max-w-9xl mt-40 bg-[#101010] overflow-hidden">
      {/* Левая часть - изображение или декоративный блок */}
      <div className="hidden md:flex md:w-1/2 bg-[#101010] p-12 text-white items-center justify-center">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-snug text-white">
            Регистрация дизайнера
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8">
            Получите доступ к специальным условиям и персональным скидкам для дизайнеров.
          </p>
          <div className="bg-[#101010]  p-6 rounded-lg border border-red-800/30">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Нужен инвайт-код?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Обратитесь к нашему менеджеру для получения персонального кода регистрации.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>Email:infoelektromosru@gmail.com</div>
              <div>Телефон: +7 (903) 797-06-99</div>
            </div>
            <a
              href="/auth/request-invite"
              className="inline-block mt-4 text-red-400 hover:text-red-300 text-sm underline"
            >
              Подробнее о получении кода →
            </a>
          </div>
        </div>
      </div>
  
      {/* Правая часть - форма регистрации */}
      <div className="w-full bg-[#101010] md:w-1/2 py-12 px-8 lg:py-16 lg:px-24">
        <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
          Регистрация дизайнера
        </h1>
  
        {error && (
          <div className="text-red-500 mb-6 text-center text-base md:text-lg font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поле для инвайт-кода */}
          <div className="relative">
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="peer w-full px-4 py-3 bg-neutral-700 rounded-lg text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent uppercase tracking-wider"
              placeholder=" "
              required
              maxLength={20}
            />
            <label
              htmlFor="inviteCode"
              className="absolute left-4 -top-6 text-sm text-red-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-red-500 font-medium"
            >
              Инвайт-код *
            </label> 
          </div>

          {/* Поле для имени пользователя */}
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full px-4 py-3 bg-neutral-700 rounded-lg text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent"
              placeholder=" "
              required
            />
            <label
              htmlFor="username"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-red-500"
            >
              Имя пользователя *
            </label>
          </div>
  
          {/* Поле для email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 py-3 bg-neutral-700 rounded-lg text-white shadow-sm text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-red-500"
            >
              Email *
            </label>
          </div>

          {/* Поле для телефона */}
          <div className="relative">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="peer w-full px-4 py-3 bg-neutral-700 rounded-lg text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent"
              placeholder=" "
              required
            />
            <label
              htmlFor="phone"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-red-500"
            >
              Телефон *
            </label>
          </div>

          {/* Поле для компании */}
          <div className="relative">
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="peer w-full px-4 py-3 bg-neutral-700 rounded-lg text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent"
              placeholder=" "
            />
            <label
              htmlFor="company"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-red-500"
            >
              Компания/Студия
            </label>
          </div>
  
          {/* Поле для пароля */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 py-3 bg-neutral-700 rounded-lg text-white shadow-sm text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent"
              placeholder=" "
              required
              minLength={6}
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-red-500"
            >
              Пароль (мин. 6 символов) *
            </label>
          </div>
  
          <div className="flex flex-wrap justify-between items-center mt-6 text-center">
            <a
              href="/auth/login"
              className="text-gray-300 hover:text-white hover:underline text-sm md:text-base font-medium"
            >
              Уже есть аккаунт?
            </a>
          </div>
  
          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full py-3 bg-red-800 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Регистрация...
              </>
            ) : (
              'Зарегистрироваться как дизайнер'
            )}
          </button>
        </form>

        {/* Информация об инвайт-кодах */}
        <div className="mt-6 p-4 bg-[#101010] rounded-lg ">
          <h3 className="text-sm font-semibold text-white mb-2">Информация об инвайт-кодах</h3>
          <p className="text-xs text-white">
            Инвайт-коды выдаются только проверенным дизайнерам и дизайн-студиям. 
            Для получения кода свяжитесь с нашим менеджером.
          </p>
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default Register;
