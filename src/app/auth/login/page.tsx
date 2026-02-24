
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            email,
            password,
        });

        const token = response.data.token; 
        localStorage.setItem('token', token); 

        const username = response.data.username; 
        localStorage.setItem('username', username);

        // Получаем роль, если она есть в ответе, или определяем логику редиректа
        // Если это дизайнер, обычно перенаправляем в его кабинет
        router.push('/profile'); 

    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            setError(err.response.data.error || 'Неверные учетные данные');
        } else {
            setError('Ошибка подключения. Попробуйте позже.');
        }
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Вход - Вамлюстра Pro</title>
        <meta name="description" content="Авторизация для партнеров и дизайнеров Вамлюстра." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="  max-w-[1420px] mx-auto bg-white text-black flex font-sans selection:bg-black selection:text-white">
        
        {/* Левая часть - Визуал (Архитектурный стиль) */}
        <div className="hidden lg:flex w-5/12 bg-[#F2F2F2] flex-col justify-between p-12 relative overflow-hidden border-r border-gray-200">
          {/* Декоративная сетка */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }}></div>

          <div className="relative mt-20 z-10">
            <h1 className="text-6xl font-light leading-tight tracking-tighter">
              Свет<br />
              Якрость<br />
              Форма<br />
              <span className="font-serif italic text-gray-400">Функциональная система дизайна.</span>
            </h1>
          </div>

         
        </div>
  
        {/* Правая часть - Форма авторизации */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-8 lg:p-24 bg-white relative">
          
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-medium mb-2 tracking-tight">Вход в систему</h2>
              <p className="text-gray-500 text-sm">Введите данные вашего аккаунта.</p>
            </div>
            
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 text-red-600 text-sm flex items-center">
                <span className="mr-2 font-bold">!</span> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Email */}
              <div className="relative z-0 w-full group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block py-3 px-0 w-full text-lg text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6"
                >
                  Email адрес
                </label>
              </div>
      
              {/* Пароль */}
              <div className="relative z-0 w-full group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block py-3 px-0 w-full text-lg text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6"
                >
                  Пароль
                </label>
              </div>
      
              {/* Ссылки и кнопка */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold tracking-[0.2em] uppercase text-white bg-black hover:bg-gray-800 focus:outline-none transition-all duration-200 disabled:bg-gray-400"
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                  {/* Декоративная линия при наведении */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-gray-100">
                <a
                  className="text-xs text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
                  href="/auth/register"
                >
                  Нет аккаунта? <span className="text-black border-b border-black pb-0.5 ml-1">Регистрация</span>
                </a>
                
                <a
                  className="text-xs text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
                  href="/auth/forgot-password" // Предполагаемый путь
                >
                  Забыли пароль?
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;