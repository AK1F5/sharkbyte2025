import { Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer id="footer" className="footer accent-background">
      <div className="container mx-auto px-4">
        <div className="copyright text-center">
          <p>
            © <span>Copyright</span> <strong className="px-1 sitename">KeenKloud</strong> <span>All Rights Reserved</span>
          </p>
        </div>
        <div className="social-links flex justify-center">
          <a href="https://www.linkedin.com/in/jporter924/" target="_blank" rel="noopener noreferrer">
            <Linkedin size={16} />
          </a>
        </div>
        <div className="credits text-center">
          Designed by{' '}
          <a href="https://www.linkedin.com/in/jporter924/" target="_blank" rel="noopener noreferrer">
            KeenKloud
          </a>
        </div>
      </div>
    </footer>
  );
}
