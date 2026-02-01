 // --- COMPONENT: MenuContent ---
    const MenuContent = ({ page, pageIndex }) => {
      if (page.type === 'cover' || page.type === 'back') return null;

      const PageNumber = ({ isImage = false }) => {
        if (pageIndex === undefined) return null;
        const textColor = isImage ? 'text-white' : 'text-gray-800';
        const numColor = isImage ? 'text-gold' : 'text-gold-dark';
        const shadowClass = isImage ? 'drop-shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.8)]' : '';

        return (
          <div className={`absolute bottom-[0.5rem] sm:bottom-[1rem] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-[0.5rem] font-serif font-bold text-[0.75rem] sm:text-[1rem] tracking-[0.2em] w-full pointer-events-none ${shadowClass}`}>
            <span className={`${numColor} opacity-70 text-[0.625rem] sm:text-[0.75rem]`}>—</span>
            <span className={textColor}>{pageIndex}</span>
            <span className={`${numColor} opacity-70 text-[0.625rem] sm:text-[0.75rem]`}>—</span>
          </div>
        );
      };

      if (page.type === 'image') {
        return (
          <div className="h-full w-full relative overflow-hidden group bg-zinc-900">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[3500ms] ease-in-out group-hover:scale-110"
              style={{ backgroundImage: `url(${page.imageUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            {page.imageCaption && (
              <div className="absolute bottom-[2rem] sm:bottom-[3.5rem] left-0 right-0 text-center px-[1rem]">
                <h3 className="font-serif text-[1rem] sm:text-[2rem] text-paper tracking-wider sm:tracking-widest uppercase opacity-90 drop-shadow-md px-2 leading-relaxed">
                  {page.imageCaption}
                </h3>
                <div className="w-[4rem] h-[0.125rem] bg-gold mx-auto mt-[0.5rem] shadow-[0_0_0.625rem_rgba(197,160,89,0.8)]"></div>
              </div>
            )}
            <PageNumber isImage={true} />
          </div>
        );
      }

      return (
        <div className="h-full flex flex-col px-[0.5rem] sm:px-[2rem] py-[1rem] sm:py-[1.25rem] text-gray-800 relative z-10">
          <div className="flex-grow space-y-[0.5rem] sm:space-y-[1rem] overflow-y-auto custom-scrollbar pr-[0.1rem] sm:pr-[1rem]">
            {page.sections?.map((section, idx) => (
              <div key={idx} className="space-y-[0.35rem] sm:space-y-[0.75rem]">
                <div className="flex items-center gap-[0.35rem] sm:gap-[0.75rem] border-b border-gold-dark/30 pb-[0.25rem] sm:pb-[0.5rem] mb-[0.5rem] sm:mb-[0.75rem]">
                  <span className="text-gold-dark bg-paper-aged p-[0.25rem] rounded-full border border-gold/30 shadow-sm shrink-0">
                    {React.isValidElement(section.icon) && React.cloneElement(section.icon, { className: "w-[0.85rem] h-[0.85rem] sm:w-[1.25rem] sm:h-[1.25rem]" })}
                  </span>
                  <h3 className="flex-1 min-w-0 font-serif text-[0.75rem] sm:text-[1.25rem] font-bold text-gray-900 tracking-tight uppercase drop-shadow-sm leading-tight">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-[0.35rem] sm:space-y-[0.5rem]">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex justify-between items-baseline text-[0.75rem] sm:text-[1rem] group">
                      <div className="flex flex-col relative pr-[0.25rem]">
                        <span className="font-semibold text-gray-900 transition-colors group-hover:text-gold-dark leading-tight">{item.name}</span>
                        {item.description && (
                          <span className="text-[0.65rem] sm:text-[0.75rem] text-gray-600 italic font-medium mt-[0.1rem] transform origin-left sm:scale-100 leading-tight">{item.description}</span>
                        )}
                      </div>
                      <div className="flex-grow mx-[0.15rem] sm:mx-[0.5rem] border-b border-dotted border-gray-400 opacity-40 relative top-[-0.2rem] min-w-[0.25rem] sm:min-w-[1.25rem]"></div>
                      <span className="font-serif font-bold text-gray-900 whitespace-nowrap bg-paper/50 pl-[0.15rem] rounded text-[0.75rem] sm:text-[1rem]">R$ {item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-[0.5rem] sm:pt-[0.75rem] border-t border-gold/20 flex flex-col items-center justify-center relative mb-[0.5rem] sm:mb-[1rem]">
            {page.footer && (
               <span className="font-serif text-[0.6rem] sm:text-[0.625rem] text-gold-dark/70 tracking-wide uppercase text-center px-1">{page.footer}</span>
            )}
          </div>
          <PageNumber />
        </div>
      );
    };

    // --- COMPONENT: MenuBook ---
    const MenuBook = () => {
      const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
      const totalSheets = Math.ceil(MENU_PAGES.length / 2);

      const handleNext = () => {
        if (currentSheetIndex < totalSheets) setCurrentSheetIndex(prev => prev + 1);
      };

      const handlePrev = () => {
        if (currentSheetIndex > 0) setCurrentSheetIndex(prev => prev - 1);
      };

      useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === 'ArrowRight') handleNext();
          if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [currentSheetIndex]);

      // --- RESPONSIVE ASPECT RATIO ---
      const [aspectRatio, setAspectRatio] = useState('0.95/1'); // Default Square-ish

      useEffect(() => {
        const updateRatio = () => {
          // Mobile: 0.95/1 (Almost square, slightly taller)
          // Desktop: 2.1/1 (Open book = 2 squares side by side)
          setAspectRatio(window.innerWidth < 640 ? '0.95/1' : '2.1/1');
        };
        updateRatio();
        window.addEventListener('resize', updateRatio);
        return () => window.removeEventListener('resize', updateRatio);
      }, []);

      const getZIndex = (index) => {
        if (index < currentSheetIndex) {
          return 50 + index; 
        } else {
          return totalSheets - index;
        }
      };

      return (
        <div 
         className="relative w-[90%] sm:w-full max-w-md sm:max-w-5xl perspective-3000 mx-auto flex justify-center items-center" 
          style={{ aspectRatio }}
        >
          {/* Mobile Touch Zones */}
          <div className="absolute inset-0 z-50 flex justify-between pointer-events-none sm:pointer-events-auto">
               <div onClick={handlePrev} className="w-1/4 h-full pointer-events-auto sm:hidden"></div>
               <div onClick={handleNext} className="w-1/4 h-full pointer-events-auto sm:hidden"></div>
          </div>

          <button onClick={handlePrev} disabled={currentSheetIndex === 0} className="hidden sm:flex absolute -left-16 top-1/2 -translate-y-1/2 z-50 p-[0.75rem] rounded-full bg-leather/90 backdrop-blur-sm border-[0.125rem] border-gold text-gold shadow-[0_0.25rem_1.25rem_rgba(0,0,0,0.6)] hover:bg-leather hover:scale-110 hover:shadow-gold/20 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed group">
            <ArrowLeft className="w-[1.5rem] h-[1.5rem] group-hover:-translate-x-[0.25rem] transition-transform" />
          </button>

          <button onClick={handleNext} disabled={currentSheetIndex === totalSheets} className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 z-50 p-[0.75rem] rounded-full bg-leather/90 backdrop-blur-sm border-[0.125rem] border-gold text-gold shadow-[0_0.25rem_1.25rem_rgba(0,0,0,0.6)] hover:bg-leather hover:scale-110 hover:shadow-gold/20 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed group">
            <ArrowRight className="w-[1.5rem] h-[1.5rem] group-hover:translate-x-[0.25rem] transition-transform" />
          </button>

          <div className="relative w-full h-full flex justify-center items-center transform-style-3d">
            {Array.from({ length: totalSheets }).map((_, sheetIndex) => {
              const frontPageIndex = sheetIndex * 2;
              const backPageIndex = sheetIndex * 2 + 1;
              const frontPage = MENU_PAGES[frontPageIndex];
              const backPage = MENU_PAGES[backPageIndex];
              
              const isFlipped = sheetIndex < currentSheetIndex;

              const frontBgClass = frontPage.type === 'image' ? 'bg-zinc-900 border-zinc-800' : 'bg-paper border-leather-light';
              const backBgClass = (backPage && backPage.type === 'image') ? 'bg-zinc-900 border-zinc-800' : 'bg-paper border-leather-light';

              return (
                <div
                  key={sheetIndex}
                  className={`absolute top-0 w-1/2 h-full transform-style-3d origin-left cursor-pointer group ${isFlipped ? '-rotate-y-180' : 'rotate-y-0'}
                  `}
                  style={{ 
                    zIndex: getZIndex(sheetIndex), 
                    left: '50%',
                    transition: `transform 1500ms cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0ms 750ms`
                  }}
                  onClick={() => { if (isFlipped) handlePrev(); else handleNext(); }}
                >
                  {/* FRENTE DA PÁGINA */}
                  <div className={`absolute inset-0 w-full h-full backface-hidden ${frontBgClass} shadow-page-right rounded-tr-[0.5rem] border-y-[0.25rem] sm:border-y-[0.5rem] border-l border-leather-light overflow-hidden rounded-br-[0.5rem] border-r-[0.25rem] sm:border-r-[0.5rem]`} style={{ transform: 'translateZ(1px)' }}>
                    <div className="absolute inset-0 opacity-20 bg-texture-paper pointer-events-none mix-blend-multiply"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-[2rem] bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-20"></div>
                    
                    {/* Sombra de Profundidade Simples */}
                    <div className={`absolute inset-0 bg-black/5 pointer-events-none z-30`}></div>

                    {/* WRAPPER COM OPACIDADE - EVITA QUE O TEXTO APAREÇA ANTES DA HORA */}
                    <div className={`relative w-full h-full transition-opacity duration-0 delay-[750ms] ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                      {frontPage.type === 'cover' ? (
                        <div className="h-full flex flex-col items-center justify-center bg-leather text-gold border-[0.5rem] sm:border-[1rem] border-double border-gold p-[1rem] sm:p-[2rem] relative shadow-inner">
                          <div className="absolute inset-0 opacity-30 bg-texture-leather pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/40 pointer-events-none"></div>
                          
                          <ChefHat className="w-[3rem] h-[3rem] sm:w-[5rem] sm:h-[5rem] mb-[1rem] text-gold drop-shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.5)]" />
                          <h1 className="font-serif text-[1.5rem] sm:text-[3rem] text-center font-bold tracking-widest mb-[1rem] drop-shadow-md text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-yellow-700 leading-tight">MENU</h1>
                          <div className="w-[3rem] sm:w-[4rem] h-[0.15rem] bg-gradient-to-r from-transparent via-gold to-transparent mb-[1rem]"></div>
                          <p className="font-sans text-[0.75rem] sm:text-[1rem] tracking-[0.3em] uppercase text-yellow-100/80 mb-[2rem] text-center">Bebidas e Porções</p>
                          
                          <div className="absolute bottom-[2rem] animate-bounce opacity-60">
                            <p className="font-serif text-[0.6rem] sm:text-[0.75rem] tracking-widest text-gold">TOQUE PARA ABRIR</p>
                          </div>
                        </div>
                      ) : (
                        <MenuContent page={frontPage} pageIndex={frontPageIndex} />
                      )}
                    </div>
                  </div>

                  {/* VERSO DA PÁGINA */}
                  <div className={`absolute inset-0 w-full h-full backface-hidden ${backBgClass} shadow-page-left rounded-tl-[0.5rem] border-y-[0.25rem] sm:border-y-[0.5rem] border-l-[0.25rem] sm:border-l-[0.5rem] border-r border-leather-light overflow-hidden rounded-bl-[0.5rem]`} style={{ transform: 'translateZ(-1px) rotateY(180deg)' }}>
                    <div className="absolute inset-0 opacity-20 bg-texture-paper pointer-events-none mix-blend-multiply"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-[2rem] bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-20"></div>
                    
                    {/* Sombra de Profundidade Simples */}
                     <div className={`absolute inset-0 bg-black/5 pointer-events-none z-30`}></div>

                     {/* WRAPPER COM OPACIDADE - EVITA QUE O TEXTO APAREÇA ANTES DA HORA */}
                     <div className={`relative w-full h-full transition-opacity duration-0 delay-[750ms] ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                      {backPage && backPage.type === 'back' ? (
                        <div className="h-full flex flex-col items-center justify-center bg-leather text-gold border-[0.5rem] sm:border-[1rem] border-double border-gold p-[2rem] relative shadow-inner">
                        <div className="absolute inset-0 opacity-30 bg-texture-leather pointer-events-none"></div>
                        <h2 className="font-serif text-[1.5rem] sm:text-[3rem] text-center mb-[2rem] drop-shadow-md leading-tight">Volte Sempre</h2>
                        <div className="w-[4rem] h-[0.15rem] bg-gold mb-[3rem]"></div>
                        <Info className="w-[3rem] h-[3rem] sm:w-[4rem] sm:h-[4rem] mb-[1.5rem] opacity-80" />
                        
                        <div className="text-center font-sans space-y-[1rem] opacity-90 tracking-wide text-[0.75rem] sm:text-[0.875rem]">
                          <p className="text-gold-dark">Aberto todos os dias</p>
                          <p className="font-serif text-white text-[0.875rem] sm:text-[1rem] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold">{backPage.footer}</p>
                        </div>
                        
                      </div>
                      ) : backPage ? (
                        <MenuContent page={backPage} pageIndex={backPageIndex} />
                      ) : (
                        <div className="w-full h-full bg-paper" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    // --- COMPONENT: App ---
    // --- COMPONENT: App ---
const App = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1110]">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/40 via-[#1a1110] to-black"></div>
        <div 
          className="absolute inset-0 opacity-40" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E...")`,
            filter: 'sepia(100%) contrast(150%) hue-rotate(-30deg)'
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full flex justify-center pt-4">
        <MenuBook />
      </div>
    </div>
  );
};


    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<App />);
  </script>
