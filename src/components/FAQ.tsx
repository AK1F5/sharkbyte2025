import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface FAQItemProps {
  num: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

function FAQItem({ num, question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`faq-item ${isOpen ? 'faq-active' : ''}`}>
      <h3 onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <span className="num">{num}.</span> <span>{question}</span>
      </h3>
      <div className="faq-content" style={{ display: isOpen ? 'block' : 'none' }}>
        <p>{answer}</p>
      </div>
      <ChevronRight 
        className={`faq-toggle transition-transform ${isOpen ? 'rotate-90' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="faq section">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <div className="content px-xl-5">
              <h3>
                <span>Frequently Asked </span>
                <strong>Questions</strong>
              </h3>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="faq-container">
              <FAQItem 
                num="1"
                question="What inspired you to create KeenKloud?"
                answer="I wanted a place to document and showcase my journey in cloud security beyond just certifications. KeenKloud highlights hands-on projects where I turn theory into practice and share solutions that are scalable, secure, and real-world ready."
                defaultOpen
              />

              <FAQItem 
                num="2"
                question="Who is KeenKloud for?"
                answer="KeenKloud was intentionally created as an extension of my resume, something recruiters can explore beyond a PDF. But it's also for students, aspiring cloud and security professionals, and potential clients who want help bringing their digital ideas to life, whether for business or personal brand."
              />

              <FAQItem 
                num="3"
                question="What kind of projects can I find here?"
                answer="Projects focused on AWS, cloud security, and automation, ranging from secure static site deployments to monitoring, CI/CD, and defense-in-depth architectures. I'll also be expanding into Capture the Flag challenges and penetration testing in the near future."
              />

              <FAQItem 
                num="4"
                question="How do these projects differ from tutorials online?"
                answer="These projects are built from my own creativity and network, not copy-and-paste labs. They're designed with real-world use cases in mind, showing how I approach security, scalability, and automation from a practitioner's perspective."
              />

              <FAQItem 
                num="5"
                question="Where are you heading next with KeenKloud?"
                answer="I'll continue expanding into advanced cloud security projects, including Zero Trust architectures, SOC workflows, and incident response in AWS. I also plan to share more Capture the Flag and penetration testing work, documenting the process as I grow as a security engineer."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
