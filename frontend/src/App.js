import { useState, useEffect, useRef } from "react";
import "@/App.css";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChevronDown, Download, Phone, Mail, MapPin, Building2, Wrench, Award, ArrowUp } from 'lucide-react';

// Slide components
const TitleSlide = () => (
  <section data-testid="slide-title" className="slide relative flex items-center justify-center">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/hero.jpg')`,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
    
    {/* Diagonal accent */}
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

const AboutSlide = () => (
  <section data-testid="slide-about" className="slide bg-[#0A0A0A] flex items-center py-20 px-6 md:px-12 lg:px-20">
    <div className="max-w-7xl mx-auto w-full">
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

const AirportSlide = () => {
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
    <section data-testid="slide-airport" className="slide bg-[#0A0A0A] py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto h-full min-h-screen flex flex-col justify-center">
        {/* Header */}
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

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main image slider */}
          <div className="lg:col-span-2 relative">
            <div className="relative aspect-video overflow-hidden industrial-border">
              <img 
                src={airportImages[currentImage]} 
                alt={`Аэропорт Благовещенск ${currentImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Navigation arrows */}
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
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-2 text-sm">
                {currentImage + 1} / {airportImages.length}
              </div>
            </div>

            {/* Thumbnails */}
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

          {/* Stats sidebar */}
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

const WinerySlide = () => (
  <section data-testid="slide-winery" className="slide relative">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/winery.jpg')`,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" />
    
    <div className="relative z-10 h-full min-h-screen flex items-center justify-end px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl text-right">
        <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Проект</p>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-6">
          Винный парк<br/>Крым
        </h2>
        <p className="text-zinc-300 text-lg leading-relaxed mb-8">
          Строительство уникального винодельческого комплекса в районе Понизовка-Оползневое. 
          Архитектурный шедевр с интеграцией в ландшафт.
        </p>
        
        <div className="flex justify-end gap-6 mb-8">
          <div className="glass-panel p-6 text-left">
            <p className="font-heading text-3xl font-bold text-[#FF5F1F]">Понизовка</p>
            <p className="text-zinc-400">Оползневое, Крым</p>
          </div>
          <div className="glass-panel p-6 text-left">
            <p className="font-heading text-3xl font-bold text-white">Премиум</p>
            <p className="text-zinc-400">Класс объекта</p>
          </div>
        </div>
        
        <div className="flex gap-4 flex-wrap justify-end">
          <span className="px-4 py-2 bg-zinc-800 text-sm uppercase tracking-wider">Ландшафт</span>
          <span className="px-4 py-2 bg-zinc-800 text-sm uppercase tracking-wider">Архитектура</span>
          <span className="px-4 py-2 bg-zinc-800 text-sm uppercase tracking-wider">Бетон</span>
        </div>
      </div>
    </div>
    
    {/* Diagonal accent */}
    <div className="absolute bottom-0 right-0 w-full h-32 bg-[#0A0A0A]" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
  </section>
);

const PanelsSlide = () => (
  <section data-testid="slide-panels" className="slide bg-[#0A0A0A] py-20 px-6 md:px-12 lg:px-20">
    <div className="max-w-7xl mx-auto h-full min-h-screen flex flex-col justify-center">
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
            style={{
              backgroundImage: `url('/images/panels1.jpg')`,
            }}
          />
          <div className="p-6">
            <p className="font-heading text-2xl font-bold uppercase mb-2">Латунные панели</p>
            <p className="text-zinc-400">Монтаж подсистемы и облицовка</p>
          </div>
        </div>
        
        <div className="bg-[#1C1C1C] industrial-border overflow-hidden group">
          <div 
            className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: `url('/images/panels2.jpg')`,
            }}
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

const GelendzhikSlide = () => (
  <section data-testid="slide-gelendzhik" className="slide relative">
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/gelendzhik.jpg')`,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
    
    <div className="relative z-10 h-full min-h-screen flex items-end pb-24 px-6 md:px-12 lg:px-20">
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

const ContactSlide = ({ onExport, isExporting }) => (
  <section data-testid="slide-contacts" className="slide bg-[#0A0A0A] flex items-center justify-center py-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <p className="text-sm tracking-[0.2em] uppercase text-[#FF5F1F] mb-4 font-bold">Связаться с нами</p>
      <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-8">
        Контакты
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1C1C1C] p-8 industrial-border">
          <Phone size={32} className="text-[#FF5F1F] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm mb-2">Телефон</p>
          <p className="font-heading text-xl font-bold">8-903-167-79-00</p>
        </div>
        <div className="bg-[#1C1C1C] p-8 industrial-border">
          <Mail size={32} className="text-[#FF5F1F] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm mb-2">Email</p>
          <p className="font-heading text-xl font-bold">stroyblagoaero@mail.ru</p>
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
      
      <p className="text-zinc-600 text-sm mt-8">
        © 2024 БелВекторСтрой. Все права защищены.
      </p>
    </div>
  </section>
);

// Navigation dots
const NavigationDots = ({ currentSlide, totalSlides, onNavigate }) => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 no-print">
    {Array.from({ length: totalSlides }).map((_, i) => (
      <button
        key={i}
        data-testid={`nav-dot-${i}`}
        onClick={() => onNavigate(i)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          currentSlide === i 
            ? 'bg-[#FF5F1F] scale-125' 
            : 'bg-zinc-600 hover:bg-zinc-400'
        }`}
        aria-label={`Перейти к слайду ${i + 1}`}
      />
    ))}
  </div>
);

// Scroll to top button
const ScrollToTop = ({ visible, onClick }) => (
  <button
    data-testid="scroll-to-top-btn"
    onClick={onClick}
    className={`fixed bottom-8 left-8 z-50 bg-[#1C1C1C] border border-zinc-700 text-white p-3 transition-all duration-300 no-print hover:border-[#FF5F1F] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
  >
    <ArrowUp size={24} />
  </button>
);

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef(null);
  const totalSlides = 7;
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const slideIndex = Math.round(scrollY / windowHeight);
      setCurrentSlide(Math.min(slideIndex, totalSlides - 1));
      setShowScrollTop(scrollY > windowHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToSlide(Math.min(currentSlide + 1, totalSlides - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToSlide(Math.max(currentSlide - 1, 0));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);
  
  const navigateToSlide = (index) => {
    const slideElement = document.querySelectorAll('.slide')[index];
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
      const slides = document.querySelectorAll('.slide');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Scroll slide into view
        slide.scrollIntoView();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(slide, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0A0A0A',
          windowWidth: 1920,
          windowHeight: 1080,
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save('БелВекторСтрой_Презентация.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Ошибка при создании PDF. Попробуйте снова.');
    } finally {
      setIsExporting(false);
      // Return to first slide
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="App" ref={containerRef} data-testid="presentation-container">
      <NavigationDots 
        currentSlide={currentSlide} 
        totalSlides={totalSlides}
        onNavigate={navigateToSlide}
      />
      
      <ScrollToTop visible={showScrollTop} onClick={scrollToTop} />
      
      <TitleSlide />
      <AboutSlide />
      <AirportSlide />
      <WinerySlide />
      <PanelsSlide />
      <GelendzhikSlide />
      <ContactSlide onExport={exportToPDF} isExporting={isExporting} />
      
      {/* Export button fixed */}
      <button
        data-testid="floating-export-btn"
        onClick={exportToPDF}
        disabled={isExporting}
        className="fixed bottom-8 right-8 z-50 bg-[#FF5F1F] text-white p-4 shadow-2xl hover:scale-105 transition-transform rounded-full no-print disabled:opacity-50"
        title="Скачать PDF"
      >
        <Download size={24} />
      </button>
    </div>
  );
}

export default App;
