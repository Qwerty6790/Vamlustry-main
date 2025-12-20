'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            email,
            password,
        });

        // Сохранение токена и имени пользователя в локальном хранилище
        const token = response.data.token; // Убедитесь, что сервер возвращает токен
        localStorage.setItem('token', token); // Сохраняем токен в локальном хранилище

        // Сохранение имени пользователя в локальном состоянии или хранилище
        const username = response.data.username; // Получаем имя пользователя, если оно возвращается
        localStorage.setItem('username', username); // Сохраняем имя пользователя в локальном хранилище

        // Перенаправление пользователя с использованием App Router
        router.push('/profile'); 

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            // Обрабатываем ответ с ошибкой
            setError(err.response.data.error || 'Неверный email или пароль');
        } else {
            setError('Не удалось войти. Попробуйте еще раз.');
        }
        console.error(err);
    }
};

  return (
    <>
      <Head>
        <title>Вход для дизайнеров - Авторизация | Elektromos</title>
        <meta name="description" content="Вход в личный кабинет дизайнера Elektromos. Авторизация для получения скидок 25% на светильники, люстры, розетки и выключатели." />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Вход для дизайнеров - Elektromos" />
        <meta property="og:description" content="Войдите в личный кабинет дизайнера и получите доступ к специальным ценам на освещение." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://elektromos.ru/auth/login" />
        <meta property="og:image" content="/images/logo.webp" />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-[#101010]">
    <div className="flex flex-col md:flex-row bg-[#101010] rounded-lg overflow-hidden w-full max-w-9xl">
      {/* Левая часть - Приветствие */}
      <div className="md:w-1/2 bg-[#101010] mt-20 p-10 flex items-center justify-center text-white">
        <div>
          <h1 className="sm:text-8xl text-5xl font-bold mb-4 text-center md:text-left">
            Войдите в Elektromos Дизайнером
          </h1>
        </div>
      </div>
  
      {/* Правая часть - Форма авторизации */}
      <div className="md:w-2/4 p-8">
        <h2 className="text-5xl font-bold text-white text-center mb-6">
          Войти
        </h2>
        {error && (
          <div className="text-red-500 mb-4 text-center text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent text-base"
              placeholder="example@mail.com"
              required
            />
          </div>
  
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400"
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-800 focus:border-transparent text-base"
              placeholder="Пароль"
              required
            />
          </div>
  
          <div className="flex items-center justify-between mb-6">
            <a
              className="text-sm text-gray-300 hover:text-white font-bold hover:underline"
              href="/auth/register"
            >
              Нет аккаунта?
            </a>
          </div>
  
          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-800 text-white font-medium rounded-lg shadow-md transition duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  </div>
    </>
  );
};

export default Login;



