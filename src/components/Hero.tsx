import { useEffect, useRef } from 'react';

export function Hero() {
  const typedTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const items = [
      "Cloud Architect",
      "Cloud Engineer",
      "Cloud Security",
      "Cloud Enthusiast"
    ];
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentText = items[currentIndex];
      
      if (typedTextRef.current) {
        if (isDeleting) {
          typedTextRef.current.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typedTextRef.current.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
          typeSpeed = 2000; // Pause at end
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % items.length;
          typeSpeed = 500; // Pause before next word
        }

        timeout = setTimeout(type, typeSpeed);
      }
    };

    type();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="hero" className="hero section dark-background">
      <img 
        src="https://images.unsplash.com/photo-1665652475985-37e285aeff53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2MjIyNjE4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
        alt="Hero background" 
      />

      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h2>Joaquin Porter Jr</h2>
        <p>
          <span ref={typedTextRef} className="typed"></span>
        </p>
      </div>
    </section>
  );
}
