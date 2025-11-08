import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('*');

  const portfolioItems = [
    {
      id: 1,
      title: 'KeenKloud',
      description: 'Showcasing real-world AWS projects – scalable, secure, and cloud-native.',
      image: 'https://images.unsplash.com/photo-1721444127971-b7d0023bbef2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMGFic3RyYWN0fGVufDF8fHx8MTc2MjEzNTE1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'filter-app'
    },
    {
      id: 2,
      title: 'Serverless Stock Market Updater',
      description: 'Event-driven market updater built on AWS with Lambda, EventBridge, and CloudFront, delivering live stock data every 15 minutes with secure CI/CD.',
      image: 'https://images.unsplash.com/photo-1718778449026-fc05939d7650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGRhdGF8ZW58MXx8fHwxNzYyMjE4MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'filter-product'
    }
  ];

  const filters = [
    { label: 'All', value: '*' },
    { label: 'Cloud Security', value: 'filter-app' },
    { label: 'Automation', value: 'filter-product' },
    { label: 'Monitoring', value: 'filter-branding' },
    { label: 'Capture The Flag', value: 'filter-books' }
  ];

  const filteredItems = activeFilter === '*' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container mx-auto px-4 section-title">
        <h2>Portfolio</h2>
        <p>
          <a 
            href="https://github.com/wakeensito" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            GitHub
          </a>
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="isotope-layout">
          <ul className="portfolio-filters isotope-filters">
            {filters.map(filter => (
              <li 
                key={filter.value}
                data-filter={filter.value}
                className={activeFilter === filter.value ? 'filter-active' : ''}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </li>
            ))}
          </ul>

          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 isotope-container">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className={`portfolio-item isotope-item ${item.category}`}
              >
                <img src={item.image} className="w-full" alt={item.title} />
                <div className="portfolio-info">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <a 
                    href={item.image} 
                    title={item.title}
                    className="preview-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ZoomIn size={24} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
