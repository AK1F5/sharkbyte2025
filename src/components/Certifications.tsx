import { Shield, Award, Lock } from 'lucide-react';

export function Certifications() {
  return (
    <section id="Certifications" className="services section">
      <div className="container mx-auto px-4 section-title">
        <h2>Certifications</h2>
        <p>
          <a 
            href="https://www.credly.com/users/joaquin-porter-jr" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            Credly
          </a>
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
          <div className="service-item relative">
            <div className="icon aws-badge flex items-center justify-center bg-transparent">
              <Award size={100} strokeWidth={1.5} className="text-blue-500" />
            </div>
            <a href="#" className="stretched-link">
              <h3>AWS Cloud Practitioner</h3>
            </a>
            <p>Fluent in AWS fundamentals with the ability to identify and apply essential services, setting the stage for scalable and secure cloud projects.</p>
          </div>

          <div className="service-item relative">
            <div className="icon aws-badge flex items-center justify-center bg-transparent">
              <Shield size={100} strokeWidth={1.5} className="text-orange-500" />
            </div>
            <a href="#" className="stretched-link">
              <h3>AWS Solutions Architect</h3>
            </a>
            <p>Advanced expertise in designing scalable, highly available, and cost-efficient AWS architectures aligned to business requirements.</p>
          </div>

          <div className="service-item relative">
            <div className="icon aws-badge flex items-center justify-center bg-transparent">
              <Lock size={100} strokeWidth={1.5} className="text-red-500" />
            </div>
            <a href="#" className="stretched-link">
              <h3>CompTIA Security+</h3>
            </a>
            <p>Experienced in identifying and addressing threats, attacks, and vulnerabilities, leveraging risk management frameworks, mitigation strategies, and intrusion detection techniques to safeguard systems and data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
