import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import "@/App.css";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChevronDown, ChevronLeft, ChevronRight, Download, Phone, Mail, MapPin, Building2, Wrench, Award, ArrowUp, Menu, X } from 'lucide-react';

// Header component
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="font-heading text-xl md:text-2xl font-bold text-white hover:text-[#FF5F1F] transition-colors" data-testid="logo-link">
            БелВекторСтрой
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              data-testid="nav-home"
              className={`text-sm uppercase tracking-wider transition-colors ${location.pathname === '/' ? 'text-[#FF5F1F]' : 'text-zinc-400 hover:text-white'}`}
            >
              Главная
            </Link>
            <Link 
              to="/plaster" 
              data-testid="nav-plaster"
              className={`text-sm uppercase tracking-wider transition-colors ${location.pathname === '/plaster' ? 'text-[#FF5F1F]' : 'text-zinc-400 hover:text-white'}`}
            >
              Штукатурка
            </Link>
          </nav>

          {/* Contact info */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="tel:+79031677900" className="flex items-center gap-2 text-zinc-400 hover:text-[#FF5F1F] transition-colors" data-testid="header-phone">
              <Phone size={16} />
              <span className="text-sm">8-903-167-79-00</span>
            </a>
            <a href="mailto:stroyblagoaero@mail.ru" className="flex items-center gap-2 text-zinc-400 hover:text-[#FF5F1F] transition-colors" data-testid="header-email">
              <Mail size={16} />
              <span className="text-sm">stroyblagoaero@mail.ru</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-wider ${location.pathname === '/' ? 'text-[#FF5F1F]' : 'text-zinc-400'}`}
              >
                Главная
              </Link>
              <Link 
                to="/plaster" 
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-wider ${location.pathname === '/plaster' ? 'text-[#FF5F1F]' : 'text-zinc-400'}`}
              >
                Штукатурка
              </Link>
              <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
                <a href="tel:+79031677900" className="flex items-center gap-2 text-zinc-400">
                  <Phone size={16} />
                  <span className="text-sm">8-903-167-79-00</span>
                </a>
                <a href="mailto:stroyblagoaero@mail.ru" className="flex items-center gap-2 text-zinc-400">
                  <Mail size={16} />
                  <span className="text-sm">stroyblagoaero@mail.ru</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => (
  <section data-testid="section-hero" className="relative min-h-screen flex items-center justify-center pt-20 bg-[#0A0A0A]">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/hero.jpg')`,
        backgroundColor: '#1C1C1C',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
    
    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF5F1F]/20" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }} />
    
    <div className="relative z-10 text-center px-6 max-w-5xl">
      <p className="text-sm md:text-base tracking-[0.3em] uppercase text-[#FF5F1F] mb-4 animate-fade-in font-medium">
        Строительная компания
      </p>
      <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight mb-6 animate-slide-up">
        БелВекторСтрой
      </h1>
      <p className="text-xl md:text-2xl text-zinc-300 mb-8 animate-slide-up delay-200">
        Строим масштабные объекты по всей России
      </p>
      <div className="flex flex-wrap justify-center gap-8 text-zinc-400 animate-fade-in delay-300">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-[#FF5F1F]" />
          <span>10+ лет опыта</span>
        </div>
        <div className="flex items-center gap-2">
          <Award size={20} className="text-[#FF5F1F]" />
          <span>50+ проектов</span>
        </div>
        <div className="flex items-center gap-2">
          <Wrench size={20} className="text-[#FF5F1F]" />
          <span>Полный цикл работ</span>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <ChevronDown size={32} className="text-[#FF5F1F]" />
    </div>
  </section>
);

// About Section
const AboutSection = () => (
  <section data-testid="section-about" className="bg-[#0A0A0A] py-20 px-6 md:px-12 lg:px-20">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">О компании</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
            Наши компетенции
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Выполняем полный спектр общестроительных работ: от монтажа перегородок 
            до установки декоративных элементов премиум-класса. Работаем с крупнейшими 
            заказчиками России.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Перегородки КНАУФ', desc: 'Сертифицированный монтаж' },
              { label: 'Декоративные панели', desc: 'Латунь, дерево, металл' },
              { label: 'Фасадные работы', desc: 'Вентилируемые фасады' },
              { label: 'Интерьеры', desc: 'Отделка премиум-класса' },
            ].map((item, i) => (
              <div key={i} className="stat-border pl-4 py-2">
                <p className="font-bold text-white">{item.label}</p>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1C] p-8 industrial-border">
            <p className="font-heading text-5xl md:text-6xl font-bold text-[#FF5F1F]">31K+</p>
            <p className="text-zinc-400 mt-2">м² выполненных работ</p>
          </div>
          <div className="bg-[#1C1C1C] p-8 industrial-border">
            <p className="font-heading text-5xl md:text-6xl font-bold text-[#FF5F1F]">15+</p>
            <p className="text-zinc-400 mt-2">крупных объектов</p>
          </div>
          <div className="bg-[#1C1C1C] p-8 industrial-border col-span-2">
            <p className="font-heading text-4xl md:text-5xl font-bold text-white">Газпром, Росавиация</p>
            <p className="text-zinc-400 mt-2">Наши ключевые заказчики</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Airport Section with Gallery
const AirportSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const airportImages = [
    '/images/airport1.jpg',
    '/images/airport2.jpg',
    '/images/airport3.jpg',
    '/images/airport4.jpg',
    '/images/airport5.jpg',
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % airportImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + airportImages.length) % airportImages.length);

  return (
    <section data-testid="section-airport" className="relative py-20 px-6 md:px-12 lg:px-20">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/airport.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/85" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Проект</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4">
            Аэропорт Благовещенск
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Строительство нового терминала аэропорта. Выполнены работы по монтажу 
            внутренних перегородок по системе КНАУФ, отделка помещений.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative">
            <div className="relative aspect-video overflow-hidden industrial-border">
              <img 
                src={airportImages[currentImage]} 
                alt={`Аэропорт Благовещенск ${currentImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <button 
                onClick={prevImage}
                data-testid="airport-prev-btn"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#FF5F1F] p-3 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                data-testid="airport-next-btn"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#FF5F1F] p-3 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-2 text-sm">
                {currentImage + 1} / {airportImages.length}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {airportImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  data-testid={`airport-thumb-${idx}`}
                  className={`flex-1 aspect-video overflow-hidden border-2 transition-all ${
                    currentImage === idx ? 'border-[#FF5F1F]' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#1C1C1C] p-6 industrial-border">
              <p className="font-heading text-5xl font-bold text-[#FF5F1F]">26 000</p>
              <p className="text-zinc-400 mt-2">м² перегородок ГКЛВ</p>
            </div>
            <div className="bg-[#1C1C1C] p-6 industrial-border">
              <p className="font-heading text-3xl font-bold text-white">КНАУФ</p>
              <p className="text-zinc-400 mt-2">Сертифицированная система</p>
            </div>
            <div className="bg-[#1C1C1C] p-6 industrial-border flex-1">
              <p className="text-zinc-500 text-sm uppercase tracking-wider mb-3">Виды работ</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-zinc-800 text-sm">Общестрой</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Перегородки</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Отделка</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Фасады</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Winery Crimea Section with Gallery
const WineryCrimeaSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const wineryImages = [
    '/images/winery1.jpg',
    '/images/winery2.jpg',
    '/images/winery3.jpg',
    '/images/winery4.jpg',
    '/images/winery5.jpg',
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % wineryImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + wineryImages.length) % wineryImages.length);

  return (
    <section data-testid="section-winery-crimea" className="relative py-20 px-6 md:px-12 lg:px-20">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/winery.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/85" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Проект</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4">
            Винный парк Крым
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Строительство уникального винодельческого комплекса в районе Понизовка-Оползневое. 
            Архитектурный шедевр с интеграцией в ландшафт.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative">
            <div className="relative aspect-video overflow-hidden industrial-border">
              <img 
                src={wineryImages[currentImage]} 
                alt={`Винный парк Крым ${currentImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <button 
                onClick={prevImage}
                data-testid="winery-prev-btn"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#FF5F1F] p-3 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                data-testid="winery-next-btn"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#FF5F1F] p-3 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-2 text-sm">
                {currentImage + 1} / {wineryImages.length}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {wineryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  data-testid={`winery-thumb-${idx}`}
                  className={`flex-1 aspect-video overflow-hidden border-2 transition-all ${
                    currentImage === idx ? 'border-[#FF5F1F]' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#1C1C1C] p-6 industrial-border">
              <p className="font-heading text-3xl font-bold text-[#FF5F1F]">Понизовка</p>
              <p className="text-zinc-400 mt-2">Оползневое, Крым</p>
            </div>
            <div className="bg-[#1C1C1C] p-6 industrial-border">
              <p className="font-heading text-3xl font-bold text-white">Премиум</p>
              <p className="text-zinc-400 mt-2">Класс объекта</p>
            </div>
            <div className="bg-[#1C1C1C] p-6 industrial-border flex-1">
              <p className="text-zinc-500 text-sm uppercase tracking-wider mb-3">Виды работ</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-zinc-800 text-sm">Ландшафт</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Архитектура</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Бетон</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Отделка</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Panels Section
const PanelsSection = () => (
  <section data-testid="section-panels" className="bg-[#0A0A0A] py-20 px-6 md:px-12 lg:px-20">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Проект</p>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-6">
          Декоративные панели
        </h2>
        <p className="text-zinc-400 text-xl max-w-3xl mx-auto">
          Монтаж подсистемы и декоративных панелей из латуни для Газпром Банка
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1C1C1C] industrial-border overflow-hidden group">
          <div 
            className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('/images/panels1.jpg')` }}
          />
          <div className="p-6">
            <p className="font-heading text-2xl font-bold uppercase mb-2">Латунные панели</p>
            <p className="text-zinc-400">Монтаж подсистемы и облицовка</p>
          </div>
        </div>
        
        <div className="bg-[#1C1C1C] industrial-border overflow-hidden group">
          <div 
            className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('/images/panels2.jpg')` }}
          />
          <div className="p-6">
            <p className="font-heading text-2xl font-bold uppercase mb-2">Газпром Банк</p>
            <p className="text-zinc-400">Декоративные элементы интерьера</p>
          </div>
        </div>
        
        <div className="bg-[#1C1C1C] industrial-border flex flex-col justify-center p-8">
          <p className="font-heading text-6xl md:text-7xl font-bold text-[#FF5F1F]">5 000</p>
          <p className="text-zinc-400 text-xl mt-2">м² декоративных панелей</p>
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-zinc-500">Материалы:</p>
            <p className="text-white font-medium">Латунь, дерево, рейки</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Gelendzhik Section
const GelendzhikSection = () => (
  <section data-testid="section-gelendzhik" className="relative py-20 px-6 md:px-12 lg:px-20">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url('/images/gelendzhik_bg.jpg')` }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
    
    <div className="relative z-10 max-w-7xl mx-auto min-h-[60vh] flex items-end pb-12">
      <div className="max-w-4xl">
        <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Проект</p>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-6">
          Винный парк<br/>Геленджик
        </h2>
        <p className="text-zinc-300 text-lg leading-relaxed mb-8 max-w-2xl">
          Сборка и монтаж образцов декоративных конструкций для нового винодельческого 
          комплекса в Геленджике. Уникальные архитектурные формы.
        </p>
        
        <div className="flex gap-6 flex-wrap">
          <div className="glass-panel px-8 py-4">
            <p className="text-zinc-400 text-sm">Локация</p>
            <p className="font-heading text-xl font-bold">Геленджик</p>
          </div>
          <div className="glass-panel px-8 py-4">
            <p className="text-zinc-400 text-sm">Тип работ</p>
            <p className="font-heading text-xl font-bold">Образцы конструкций</p>
          </div>
          <div className="glass-panel px-8 py-4">
            <p className="text-zinc-400 text-sm">Материалы</p>
            <p className="font-heading text-xl font-bold">Металл, дерево</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Floor Installation Section with Gallery
const FloorSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const floorImages = [
    '/images/floor1.jpg',
    '/images/floor2.jpg',
    '/images/floor3.jpg',
    '/images/floor4.jpg',
    '/images/floor5.jpg',
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % floorImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + floorImages.length) % floorImages.length);

  return (
    <section data-testid="section-floors" className="relative py-20 px-6 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-[#111]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5F1F]/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Услуга</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4">
            Устройство полов
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Профессиональная укладка напольных покрытий любой сложности. 
            Паркет, ламинат, инженерная доска — укладка ёлочкой и другими рисунками.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative">
            <div className="relative aspect-video overflow-hidden industrial-border">
              <img 
                src={floorImages[currentImage]} 
                alt={`Устройство полов ${currentImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <button 
                onClick={prevImage}
                data-testid="floor-prev-btn"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#FF5F1F] p-3 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                data-testid="floor-next-btn"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#FF5F1F] p-3 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-2 text-sm">
                {currentImage + 1} / {floorImages.length}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {floorImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  data-testid={`floor-thumb-${idx}`}
                  className={`flex-1 aspect-video overflow-hidden border-2 transition-all ${
                    currentImage === idx ? 'border-[#FF5F1F]' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#1C1C1C] p-6 industrial-border">
              <p className="font-heading text-3xl font-bold text-[#FF5F1F]">Паркет</p>
              <p className="text-zinc-400 mt-2">Укладка ёлочкой и палубой</p>
            </div>
            <div className="bg-[#1C1C1C] p-6 industrial-border">
              <p className="font-heading text-3xl font-bold text-white">Премиум</p>
              <p className="text-zinc-400 mt-2">Качество исполнения</p>
            </div>
            <div className="bg-[#1C1C1C] p-6 industrial-border flex-1">
              <p className="text-zinc-500 text-sm uppercase tracking-wider mb-3">Виды покрытий</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-zinc-800 text-sm">Паркет</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Ламинат</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Инженерная доска</span>
                <span className="px-3 py-1 bg-zinc-800 text-sm">Плитка</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = ({ onExport, isExporting }) => (
  <section data-testid="section-contacts" className="bg-[#0A0A0A] py-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Связаться с нами</p>
      <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-8">
        Контакты
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1C1C1C] p-8 industrial-border">
          <Phone size={32} className="text-[#FF5F1F] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm mb-2">Телефон</p>
          <a href="tel:+79031677900" className="font-heading text-xl font-bold hover:text-[#FF5F1F] transition-colors">
            8-903-167-79-00
          </a>
        </div>
        <div className="bg-[#1C1C1C] p-8 industrial-border">
          <Mail size={32} className="text-[#FF5F1F] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm mb-2">Email</p>
          <a href="mailto:stroyblagoaero@mail.ru" className="font-heading text-lg font-bold hover:text-[#FF5F1F] transition-colors">
            stroyblagoaero@mail.ru
          </a>
        </div>
        <div className="bg-[#1C1C1C] p-8 industrial-border">
          <MapPin size={32} className="text-[#FF5F1F] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm mb-2">Офис</p>
          <p className="font-heading text-xl font-bold">Россия</p>
        </div>
      </div>
      
      <button
        data-testid="export-pdf-btn"
        onClick={onExport}
        disabled={isExporting}
        className="bg-[#FF5F1F] text-white hover:bg-[#E04F16] px-12 py-5 font-bold uppercase tracking-wider transition-all inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={24} />
        {isExporting ? 'Создание PDF...' : 'Скачать PDF'}
      </button>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="bg-[#0A0A0A] border-t border-zinc-800 py-8 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-zinc-600 text-sm">
        © 2024 БелВекторСтрой. Все права защищены.
      </p>
      <div className="flex gap-6">
        <Link to="/" className="text-zinc-500 hover:text-[#FF5F1F] text-sm transition-colors">Главная</Link>
        <Link to="/plaster" className="text-zinc-500 hover:text-[#FF5F1F] text-sm transition-colors">Штукатурка</Link>
      </div>
    </div>
  </footer>
);

// Home Page
const HomePage = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const sections = document.querySelectorAll('section[data-testid]');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        section.scrollIntoView();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0A0A0A',
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save('БелВекторСтрой_Презентация.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <AirportSection />
      <WineryCrimeaSection />
      <PanelsSection />
      <GelendzhikSection />
      <FloorSection />
      <ContactSection onExport={exportToPDF} isExporting={isExporting} />
      <Footer />
    </main>
  );
};

// Plaster Page (Штукатурка)
const PlasterPage = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const workSteps = [
    { num: '01', title: 'Заявка', desc: 'По телефону или через форму обратной связи' },
    { num: '02', title: 'Замер', desc: 'Бесплатный выезд специалиста на объект' },
    { num: '03', title: 'Договор', desc: 'Заключение договора с фиксированной ценой' },
    { num: '04', title: 'Поставка материалов', desc: 'Оплата материалов по факту поставки' },
    { num: '05', title: 'Заезд бригады', desc: 'Прибытие специалистов на объект' },
    { num: '06', title: 'Штукатурные работы', desc: 'Выполнение работ согласно договору' },
    { num: '07', title: 'Приёмка работы', desc: 'Проверка качества выполненных работ' },
    { num: '08', title: 'Подписание акта', desc: 'Оформление акта выполненных работ' },
    { num: '09', title: 'Оплата работ', desc: 'Оплата после подписания акта' },
  ];

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Услуги</p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-6">
            Штукатурные работы<br/>
            <span className="text-[#FF5F1F]">в Москве и МО</span>
          </h1>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto mb-8">
            Профессиональное выполнение штукатурных работ любой сложности. 
            Работаем с коммерческими и жилыми объектами.
          </p>
          
          {/* Price & Phone */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-[#FF5F1F] px-8 py-4">
              <p className="text-white text-sm uppercase tracking-wider">Стоимость работ</p>
              <p className="font-heading text-3xl font-bold text-white">от 450 ₽/м²</p>
            </div>
            <a href="tel:+79257590903" className="bg-[#1C1C1C] border-2 border-[#FF5F1F] px-8 py-4 hover:bg-[#FF5F1F] transition-colors group">
              <p className="text-zinc-400 text-sm uppercase tracking-wider group-hover:text-white">Телефон</p>
              <p className="font-heading text-2xl font-bold text-white">8 925 759 09 03</p>
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#0A0A0A] py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-12 text-center">
            Наши услуги
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Машинная штукатурка', desc: 'Быстрое и качественное нанесение штукатурки с помощью современного оборудования', icon: '🏗️' },
              { title: 'Ручная штукатурка', desc: 'Традиционный метод для сложных участков и декоративных элементов', icon: '🔨' },
              { title: 'Гипсовая штукатурка', desc: 'Идеально ровные стены под покраску или обои', icon: '📐' },
              { title: 'Цементная штукатурка', desc: 'Для фасадов и помещений с повышенной влажностью', icon: '🧱' },
              { title: 'Декоративная штукатурка', desc: 'Создание уникальных текстур и фактур на стенах', icon: '🎨' },
              { title: 'Фасадная штукатурка', desc: 'Защита и отделка наружных стен здания', icon: '🏢' },
            ].map((service, i) => (
              <div key={i} className="bg-[#1C1C1C] p-8 industrial-border hover:border-[#FF5F1F] transition-colors">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-heading text-xl font-bold uppercase mb-3">{service.title}</h3>
                <p className="text-zinc-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="bg-[#1C1C1C] py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-4 text-center">
            Как мы работаем
          </h2>
          <p className="text-zinc-400 text-center mb-12 text-lg">Алгоритм сотрудничества</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {workSteps.map((step, i) => (
              <div key={i} className="relative bg-[#0A0A0A] p-6 industrial-border hover:border-[#FF5F1F] transition-colors">
                <div className="absolute -top-4 -left-2 bg-[#FF5F1F] px-3 py-1">
                  <span className="font-heading text-lg font-bold">{step.num}</span>
                </div>
                <h3 className="font-heading text-xl font-bold uppercase mt-2 mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-[#0A0A0A] py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-12 text-center">
            Почему мы
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'лет опыта' },
              { value: '500+', label: 'выполненных объектов' },
              { value: '100%', label: 'гарантия качества' },
              { value: '450₽', label: 'от за м²' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-heading text-5xl md:text-6xl font-bold text-[#FF5F1F]">{stat.value}</p>
                <p className="text-zinc-400 mt-2 uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#1C1C1C] py-20 px-6" data-testid="contact-form-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-4 text-center">
            Заказать расчёт
          </h2>
          <p className="text-zinc-400 text-center mb-12 text-lg">
            Оставьте заявку или свяжитесь с нами удобным способом
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Форма обратной связи */}
            <div className="bg-[#0A0A0A] p-8 industrial-border">
              <h3 className="font-heading text-2xl font-bold uppercase mb-6 text-center">
                Перезвоните мне
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Ваше имя</label>
                  <input
                    type="text"
                    required
                    data-testid="input-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1C1C1C] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none transition-colors"
                    placeholder="Введите имя"
                  />
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Телефон</label>
                  <input
                    type="tel"
                    required
                    data-testid="input-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#1C1C1C] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="submit-btn"
                  className="w-full bg-[#FF5F1F] text-white hover:bg-[#E04F16] px-6 py-4 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Отправка...' : 'Перезвоните мне'}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-900/50 border border-green-500 text-green-400 px-4 py-3 text-center text-sm">
                    Заявка отправлена! Мы скоро перезвоним.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 text-center text-sm">
                    Ошибка. Позвоните: 8 925 759 09 03
                  </div>
                )}
              </form>
            </div>
            
            {/* Контакты */}
            <div className="flex flex-col gap-4">
              <a 
                href="https://t.me/+79257590903"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="telegram-btn"
                className="bg-[#0088cc] text-white hover:bg-[#006da3] px-8 py-5 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram
              </a>
              
              <a 
                href="tel:+79257590903"
                data-testid="call-btn"
                className="bg-[#FF5F1F] text-white hover:bg-[#E04F16] px-8 py-5 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3"
              >
                <Phone size={24} />
                Позвонить
              </a>
              
              <div className="bg-[#0A0A0A] p-6 industrial-border flex-1 flex flex-col justify-center">
                <p className="text-zinc-400 text-sm mb-2">Телефон</p>
                <a href="tel:+79257590903" className="font-heading text-2xl font-bold text-white hover:text-[#FF5F1F] transition-colors mb-4">
                  8 925 759 09 03
                </a>
                <p className="text-zinc-400 text-sm mb-2">Email</p>
                <a href="mailto:stroyblagoaero@mail.ru" className="text-[#FF5F1F] hover:underline">
                  stroyblagoaero@mail.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

// Scroll to top on route change
const ScrollToTopOnNav = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Main App
function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNav />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plaster" element={<PlasterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
