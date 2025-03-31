import { useEffect, useRef } from 'react';

const mountain1Img = 'https://ext.same-assets.com/2675109532/3442963240.png';
const mountain2Img = 'https://ext.same-assets.com/2675109532/3531562096.png';
const mountain3Img = 'https://ext.same-assets.com/2675109532/3407796143.png';

export function FloatingMountains() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountain1Ref = useRef<HTMLDivElement>(null);
  const mountain2Ref = useRef<HTMLDivElement>(null);
  const mountain3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mountain1 = mountain1Ref.current;
    const mountain2 = mountain2Ref.current;
    const mountain3 = mountain3Ref.current;

    if (!container || !mountain1 || !mountain2 || !mountain3) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();

      const xPos = (clientX - left) / width - 0.5;
      const yPos = (clientY - top) / height - 0.5;

      mountain1.style.transform = `translateZ(50px) rotateX(${yPos * -15}deg) rotateY(${xPos * 15}deg) translateX(${xPos * 30}px) translateY(${yPos * 30}px)`;
      mountain2.style.transform = `translateZ(-50px) rotateX(${yPos * -8}deg) rotateY(${xPos * 8}deg) translateX(${xPos * -40}px) translateY(${yPos * -20}px)`;
      mountain3.style.transform = `translateZ(-30px) rotateX(${yPos * -5}deg) rotateY(${xPos * 5}deg) translateX(${xPos * 40}px) translateY(${yPos * -25}px)`;
    };

    const handleMouseLeave = () => {
      mountain1.style.transform = 'translateZ(50px)';
      mountain2.style.transform = 'translateZ(-50px)';
      mountain3.style.transform = 'translateZ(-30px)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 perspective-1200 pointer-events-none"
    >
      <div 
        ref={mountain1Ref}
        className="absolute w-[500px] h-[500px] top-[15%] left-[calc(50%-250px)] z-30 transform-gpu translate-z-50 transition-transform duration-300 ease-out animate-float-slow"
      >
        <img src={mountain1Img} alt="Mountain 1" className="w-full h-auto object-contain filter drop-shadow-lg" />
      </div>
      <div 
        ref={mountain2Ref}
        className="absolute w-[450px] h-[450px] top-[20%] left-[10%] z-10 transform-gpu -translate-z-50 transition-transform duration-300 ease-out animate-float-medium"
      >
        <img src={mountain2Img} alt="Mountain 2" className="w-full h-auto object-contain filter drop-shadow-lg" />
      </div>
      <div 
        ref={mountain3Ref}
        className="absolute w-[450px] h-[450px] top-[20%] right-[10%] z-20 transform-gpu -translate-z-30 transition-transform duration-300 ease-out animate-float-fast"
      >
        <img src={mountain3Img} alt="Mountain 3" className="w-full h-auto object-contain filter drop-shadow-lg" />
      </div>
    </div>
  );
}