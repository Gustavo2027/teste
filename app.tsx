
import React, { useState, useMemo, useEffect } from 'react';
import { ChefHat, ArrowLeft, ArrowRight, Home, Info } from 'lucide-react';
import { MENU_PAGES } from './data';
import { MenuPage } from './types';

const PageRenderer: React.FC<{ page: MenuPage; index: number; side: 'front' | 'back' }> = ({ page, index, side }) => {
  const isLeather = page.type === 'cover' || page.type === 'back';
  const shadowClass = side === 'front' ? 'shadow-page-right' : 'shadow-page-left';

  if (page.type === 'cover' || page.type === 'back') {
    return (
      <div className={`h-full w-full flex flex-col items-center justify-center bg-leather text-gold border-[6px] sm:border-[12px] border-double border-gold/50 p-6 relative overflow-hidden ${shadowClass} shadow-inner`}>
        <div className="absolute inset-0 bg-leather-texture opacity-30 pointer-events-none"></div>
        {page.type === 'cover' ? (
          <>
            <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 mb-4 text-gold drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
            <h1 className="font-serif text-3xl sm:text-6xl font-bold tracking-[0.2em] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-yellow-700 drop-shadow-md leading-none">MENU</h1>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mb-4 sm:mb-6"></div>
            <p className="font-sans text-[10px] sm:text-sm tracking-[0.4em] uppercase text-gold/70 mb-8 sm:mb-12">Bar Peruíbe II</p>
            <div className="absolute bottom-10 animate-bounce text-[10px] tracking-widest text-gold/40 font-serif">TOQUE PARA ABRIR</div>
          </>
        ) : (
          <>
            <h2 className="font-serif text-3xl sm:text-4xl text-center mb-6 drop-shadow-md leading-tight">{page.title}</h2>
            <div className="w-12 h-1 bg-gold mb-8"></div>
            <Info className="w-12 h-12 mb-6 opacity-40" />
            <div className="text-center font-sans space-y-4 opacity-90 tracking-wide text-xs">
              <p className="text-gold-dark font-semibold">AFPESP Peruíbe II</p>
              <p className="font-serif text-white/80 uppercase text-[10px] tracking-[0.3em] font-bold">{page.footer}</p>
            </div>
          </>
        )}
      </div>
    );
  }

  const PageNumber = () => (
    <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 font-serif font-bold text-[10px] sm:text-xs tracking-widest pointer-events-none ${page.type === 'image' ? 'text-white drop-shadow-lg' : 'text-gray-800'}`}>
      <span className="text-gold">/</span>
      {index}
      <span className="text-gold">/</span>
    </div>
  );

  if (page.type === 'image') {
    return (
      <div className={`h-full w-full relative overflow-hidden ${shadowClass}`}>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] hover:scale-110"
          style={{ backgroundImage: `url(${page.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {page.imageCaption && (
          <div className="absolute bottom-12 left-0 right-0 text-center px-4">
            <h3 className="font-serif text-xl sm:text-2xl text-paper tracking-widest uppercase drop-shadow-lg leading-tight">
              {page.imageCaption}
            </h3>
            <div className="w-12 h-0.5 bg-gold mx-auto mt-2 shadow-[0_0_10px_rgba(197,160,89,0.8)]"></div>
          </div>
        )}
        <PageNumber />
      </div>
    );
  }

  return (
    <div className={`h-full w-full flex flex-col bg-paper text-leather p-6 sm:p-8 relative ${shadowClass}`}>
      <div className="absolute inset-0 bg-paper-texture opacity-20 pointer-events-none mix-blend-multiply"></div>
      <div className="flex-grow space-y-6 overflow-y-auto custom-scrollbar pr-2 relative z-10">
        {page.sections?.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gold/30 pb-2">
              <span className="text-gold-dark bg-paper-aged p-1.5 rounded-full border border-gold/20 shadow-sm">
                {React.isValidElement(section.icon) ? React.cloneElement(section.icon as React.ReactElement<{ size?: number }>, { size: 18 }) : null}
              </span>
              <h3 className="font-serif text-[11px] sm:text-base font-bold text-gray-900 tracking-tight uppercase leading-tight">{section.title}</h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item, iIdx) => (
                <li key={iIdx} className="flex justify-between items-baseline text-[10px] sm:text-sm group">
                  <div className="flex flex-col pr-2">
                    <span className="font-bold text-gray-900 group-hover:text-gold-dark transition-colors leading-tight">{item.name}</span>
                    {item.description && (
                      <span className="text-[9px] text-gray-500 italic mt-0.5 leading-tight">{item.description}</span>
                    )}
                  </div>
                  <div className="flex-grow mx-2 border-b border-dotted border-gray-400 opacity-30 relative -top-1"></div>
                  <span className="font-serif font-bold text-gray-900 whitespace-nowrap">R$ {item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 relative z-10">
        <PageNumber />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentSheet, setCurrentSheet] = useState(0);
  
  const sheets = useMemo(() => {
    const s = [];
    for (let i = 0; i < MENU_PAGES.length; i += 2) {
      s.push({
        front: MENU_PAGES[i],
        back: MENU_PAGES[i + 1] || null
      });
    }
    return s;
  }, []);

  const totalSheets = sheets.length;

  const nextSheet = () => {
    if (currentSheet < totalSheets) setCurrentSheet(s => s + 1);
  };

  const prevSheet = () => {
    if (currentSheet > 0) setCurrentSheet(s => s - 1);
  };

  const reset = () => setCurrentSheet(0);

  const [aspectRatio, setAspectRatio] = useState('0.8/1');
  useEffect(() => {
    const updateRatio = () => setAspectRatio(window.innerWidth < 640 ? '0.75/1' : '2.1/1');
    updateRatio();
    window.addEventListener('resize', updateRatio);
    return () => window.removeEventListener('resize', updateRatio);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1110] relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_center,_#3e2723_0%,_#1a1110_70%)]"></div>

      <header className="relative z-[100] w-full max-w-5xl flex flex-col items-center py-6 px-4">
        <div className="flex items-center gap-4 sm:gap-6 mb-2">
          <img src="https://i.ibb.co/R4jn242d/afpesp-2.png" alt="Logo AFPESP" className="h-10 sm:h-14 object-contain drop-shadow-xl brightness-110" />
          <div className="flex flex-col">
            <h2 className="font-serif text-gold text-lg sm:text-3xl tracking-[0.2em] font-bold border-b border-gold/40 shadow-sm leading-tight uppercase">AFPESP Peruíbe II</h2>
            <p className="text-white/40 text-[9px] sm:text-[10px] tracking-[0.5em] uppercase mt-1">Cardápio Digital do Bar</p>
          </div>
        </div>
        <button 
          onClick={reset} 
          className="mt-2 p-2 rounded-full bg-leather border border-gold/30 text-gold hover:bg-gold hover:text-leather transition-all shadow-lg active:scale-95"
        >
          <Home size={18} />
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl flex items-center justify-center px-4 mb-8">
        <div className="relative w-full perspective-3000 flex justify-center items-center" style={{ aspectRatio }}>
          
          <button 
            onClick={prevSheet} 
            disabled={currentSheet === 0} 
            className="hidden sm:flex absolute -left-16 top-1/2 -translate-y-1/2 z-[200] p-3 rounded-full bg-leather/80 border border-gold/40 text-gold shadow-2xl disabled:opacity-0 transition-all hover:scale-110"
          >
            <ArrowLeft size={32} />
          </button>
          
          <button 
            onClick={nextSheet} 
            disabled={currentSheet === totalSheets} 
            className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 z-[200] p-3 rounded-full bg-leather/80 border border-gold/40 text-gold shadow-2xl disabled:opacity-0 transition-all hover:scale-110"
          >
            <ArrowRight size={32} />
          </button>

          <div className="relative w-full h-full transform-style-3d">
            {sheets.map((sheet, index) => {
              const flipped = index < currentSheet;
              
              // Lógica de Z-Index corrigida para manter a página atual SEMPRE no topo durante o movimento
              // Flipped: z-index aumenta (mais à esquerda é maior quando fechado)
              // Unflipped: z-index diminui (mais à direita é maior quando fechado)
              const zIndex = flipped 
                ? (10 + index) 
                : (totalSheets + 10 - index);

              return (
                <div 
                  key={index}
                  className={`absolute top-0 w-1/2 h-full transform-style-3d origin-left cursor-pointer transition-transform duration-[1200ms] cubic-bezier(0.645, 0.045, 0.355, 1) ${flipped ? 'rotate-y-180' : 'rotate-y-0'}`}
                  style={{ zIndex, left: '50%' }}
                  onClick={() => flipped ? prevSheet() : nextSheet()}
                >
                  {/* Face Frontal (Visto quando NÃO virado) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden border-y-[2px] sm:border-y-[4px] border-r-[2px] sm:border-r-[4px] border-leather-light overflow-hidden rounded-r-lg" style={{ transform: 'translateZ(1px)' }}>
                    <PageRenderer page={sheet.front} index={index * 2} side="front" />
                  </div>

                  {/* Face Verso (Visto quando VIRADO) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden border-y-[2px] sm:border-y-[4px] border-l-[2px] sm:border-l-[4px] border-leather-light overflow-hidden rounded-l-lg shadow-page-left" style={{ transform: 'rotateY(180deg) translateZ(1px)' }}>
                    {sheet.back ? (
                      <PageRenderer page={sheet.back} index={index * 2 + 1} side="back" />
                    ) : (
                      <div className="w-full h-full bg-leather"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="relative z-[100] pb-8 text-center px-4">
        <div className="flex items-center justify-center gap-6 mb-4 sm:hidden">
          <button onClick={prevSheet} disabled={currentSheet === 0} className="p-3 text-gold disabled:opacity-10">
            <ArrowLeft size={28} />
          </button>
          <div className="text-gold/60 font-serif text-xs tracking-widest uppercase">
            Folha {currentSheet} / {totalSheets}
          </div>
          <button onClick={nextSheet} disabled={currentSheet === totalSheets} className="p-3 text-gold disabled:opacity-10">
            <ArrowRight size={28} />
          </button>
        </div>
        <p className="text-gold/30 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-serif">Folheie tocando nas páginas</p>
      </footer>
    </div>
  );
};

export default App;
