
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

    if (!inviteCode.trim()) {
      setError('Введите инвайт-код.');
      setIsLoading(false);
      return;
    }

    const codeValidation = validateInviteCode(inviteCode);
    if (!codeValidation.isValid) {
      setError(codeValidation.error || 'Код недействителен.');
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
            role: 'designer'
        });
        
        markCodeAsUsed(inviteCode, { username, email });
        
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
            setError(err.response.data.error || 'Ошибка регистрации.');
        } else {
            setError('Что-то пошло не так.');
        }
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Регистрация - Вамлюстра Pro</title>
        <meta name="description" content="Портал для профессионалов." />
      </Head>

      <div className="  max-w-[1420px] mx-auto bg-white text-black flex font-sans selection:bg-black selection:text-white">
        
        {/* Левая часть - Визуал (Архитектурный стиль) */}
        <div className="hidden lg:flex w-5/12 bg-[#F2F2F2] flex-col justify-between p-12 relative overflow-hidden border-r border-gray-200">
          {/* Декоративная сетка */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }}></div>

          <div className="relative mt-20 z-10">
            <h1 className="text-6xl font-light leading-tight tracking-tighter">
              Дизайн<br />
              Ты<br />
              Воплощение<br />
              <span className="font-serif italic">Красота в твоем доме.</span>
            </h1>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="border-t border-gray-300 pt-6">
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                Закрытая платформа для архитекторов и студий. Доступ к базе 3D-моделей, спецификациям и оптовым ценам.
              </p>
            </div>
            <div className="flex gap-4 text-xs font-bold tracking-widest uppercase">
              <a href="#" className="border-b border-black pb-0.5 hover:text-gray-600 transition-colors">Связаться</a>
              <a href="#" className="border-b border-black pb-0.5 hover:text-gray-600 transition-colors">О проекте</a>
            </div>
          </div>
        </div>

        {/* Правая часть - Форма (Минимализм) */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-8 lg:p-24 bg-white relative">
          
          <div className="w-full max-w-lg">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-medium mb-2 tracking-tight">Регистрация</h2>
              <p className="text-gray-500 text-sm">Заполните анкету партнера.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 text-red-600 text-sm">
                <span className="font-bold mr-2">Ошибка:</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Блок с Инвайт-кодом */}
              <div className="relative group">
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="block py-3 px-0 w-full text-xl text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer uppercase tracking-widest font-mono"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="inviteCode" 
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 uppercase tracking-wider font-bold"
                >
                  Инвайт-код *
                </label>
                <p className="mt-2 text-xs text-gray-400">Код доступа, полученный от менеджера</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Имя */}
                <div className="relative z-0 w-full group">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">
                    Имя и Фамилия
                  </label>
                </div>

                {/* Телефон */}
                <div className="relative z-0 w-full group">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="phone" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">
                    Телефон
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Email */}
                <div className="relative z-0 w-full group">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">
                    Email
                  </label>
                </div>

                {/* Компания */}
                <div className="relative z-0 w-full group">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                  />
                  <label htmlFor="company" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">
                    Название студии
                  </label>
                </div>
              </div>

              {/* Пароль */}
              <div className="relative z-0 w-full group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                  placeholder=" "
                  required
                  minLength={6}
                />
                <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">
                  Пароль (мин. 6 символов)
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold tracking-[0.2em] uppercase text-white bg-black hover:bg-gray-800 focus:outline-none transition-all duration-200 disabled:bg-gray-400"
                >
                  {isLoading ? 'Обработка...' : 'Создать аккаунт'}
                  
                  {/* Декоративная линия при наведении */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></div>
                </button>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mt-6">
                <a href="/auth/login" className="hover:text-black hover:underline transition-colors">
                  Уже зарегистрированы?
                </a>
                <a href="/auth/request-invite" className="hover:text-black hover:underline transition-colors">
                  Нет кода?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
