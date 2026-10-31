import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Replace src with your own images: PNG with transparent background,
// full-body model or product cutout, taller than wide (about 0.6 : 1).
const IMAGES = [
  { name: 'The Linen Set',   src: '/looks/1.png', bg: '#C9805F', panel: '#D89A7C' },
  { name: 'The Wool Coat',   src: '/looks/2.png', bg: '#6F8F72', panel: '#86A489' },
  { name: 'The Silk Dress',  src: '/looks/3.png', bg: '#B9738F', panel: '#C98DA4' },
  { name: 'The Denim Jacket', src: '/looks/4.png', bg: '#5F86B8', panel: '#7C9CC7' },
];

const EASE = 'cubic-bezier(0.4,0,0.2,1)';
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>")`;

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(font);
    IMAGES.forEach(i => { const img = new Image(); img.src = i.src; });
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); font.remove(); };
  }, []);

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(p => (dir === 'next' ? (p + 1) % 4 : (p + 3) % 4));
    setTimeout(() => setIsAnimating(false), 650);
  };

  const roles = {
    center: activeIndex,
    left: (activeIndex + 3) % 4,
    right: (activeIndex + 1) % 4,
    back: (activeIndex + 2) % 4,
  };

  const styleFor = (i: number): React.CSSProperties => {
    const m = isMobile;
    const base = { translate: '-50%' } as const;
    if (i === roles.center) return { transform: `translateX(-50%) scale(${m ? 1.25 : 1.68})`, filter: 'blur(0px)', opacity: 1, zIndex: 20, left: '50%', height: m ? '60%' : '92%', bottom: m ? '22%' : 0 };
    if (i === roles.left)   return { transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: m ? '20%' : '30%', height: m ? '16%' : '28%', bottom: m ? '32%' : '12%' };
    if (i === roles.right)  return { transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: m ? '80%' : '70%', height: m ? '16%' : '28%', bottom: m ? '32%' : '12%' };
    void base;
    return { transform: 'translateX(-50%) scale(1)', filter: 'blur(4px)', opacity: 1, zIndex: 5, left: '50%', height: m ? '13%' : '22%', bottom: m ? '32%' : '12%' };
  };

  const circleBtn = 'w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white text-white grid place-items-center bg-transparent hover:scale-[1.08] hover:bg-white/12 cursor-pointer';

  return (
    <div className="relative w-full overflow-hidden"
      style={{ backgroundColor: IMAGES[activeIndex].bg, transition: `background-color 650ms ${EASE}`, fontFamily: 'Inter, sans-serif' }}>
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50, opacity: 0.4, backgroundImage: GRAIN, backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />

        {/* Ghost text */}
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 2, top: '18%' }}>
          <span style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900, color: '#fff', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>SS/26</span>
        </div>

        {/* Brand */}
        <div className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white" style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em' }}>VESTRA</div>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((img, i) => (
            <div key={img.src} className="absolute" style={{
              aspectRatio: '0.6 / 1', willChange: 'transform, filter, opacity',
              transition: `transform 650ms ${EASE}, filter 650ms ${EASE}, opacity 650ms ${EASE}, left 650ms ${EASE}`,
              ...styleFor(i),
            }}>
              <img src={img.src} alt={img.name} draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
            </div>
          ))}
        </div>

        {/* Bottom-left */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24" style={{ zIndex: 60, maxWidth: 320 }}>
          <p className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px] text-white" style={{ opacity: 0.95, letterSpacing: '0.02em' }}>
            {IMAGES[activeIndex].name}
          </p>
          <p className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5" style={{ opacity: 0.85, lineHeight: 1.6 }}>
            Timeless silhouettes in ethically sourced fabrics. Tailored to move with you, made to last beyond the season. Shop the full collection.
          </p>
          <div className="flex gap-3">
            <button aria-label="Previous look" className={circleBtn} style={{ transition: 'transform 150ms, background-color 150ms' }} onClick={() => navigate('prev')}>
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button aria-label="Next look" className={circleBtn} style={{ transition: 'transform 150ms, background-color 150ms' }} onClick={() => navigate('next')}>
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
          <a href="#shop" className="flex items-center text-white uppercase no-underline opacity-95 hover:opacity-100"
            style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(20px, 4vw, 56px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, transition: 'opacity 200ms' }}>
            SHOP NOW
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 ml-2" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  );
}