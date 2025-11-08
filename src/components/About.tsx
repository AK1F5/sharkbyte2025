import { useEffect, useRef } from 'react';

export function About() {
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-bar');
            progressBars.forEach((bar) => {
              const width = bar.getAttribute('aria-valuenow');
              if (width) {
                (bar as HTMLElement).style.width = `${width}%`;
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about section">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="grid lg:grid-cols-12 gap-4 justify-between">
              <div className="lg:col-span-5">
                <img 
                  src="https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGJ1c2luZXNzfGVufDF8fHx8MTc2MjE5MTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  className="w-full" 
                  alt="Profile" 
                />
              </div>
              <div className="lg:col-span-7 about-info">
                <p><strong>Name: </strong> <span>Joaquin Porter Jr</span></p>
                <p><strong>Profile: </strong> <span>Cloud Professional</span></p>
                <p><strong>Email: </strong> <span>JPort081@FIU.edu</span></p>
                <p><strong>Phone: </strong> <span>(305) 988-8253</span></p>
              </div>
            </div>

            <div className="skills-content skills-animation" ref={skillsRef}>
              <h5>Skills</h5>

              <div className="progress">
                <span className="skill">
                  <span>Python, Java, Bash, Go, JavaScript, HTML, CSS</span> 
                  <i className="val">80%</i>
                </span>
                <div className="progress-bar-wrap">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    aria-valuenow={80} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              <div className="progress">
                <span className="skill">
                  <span>AWS, Docker, Terraform, GitHub Actions, CI/CD</span> 
                  <i className="val">80%</i>
                </span>
                <div className="progress-bar-wrap">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    aria-valuenow={80} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              <div className="progress">
                <span className="skill">
                  <span>OPA, Checkov, Gitleaks, IAM, Cloud Security</span> 
                  <i className="val">80%</i>
                </span>
                <div className="progress-bar-wrap">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    aria-valuenow={80} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              <div className="progress">
                <span className="skill">
                  <span>Leadership, Collaboration, Communication, Problem Solving</span> 
                  <i className="val">80%</i>
                </span>
                <div className="progress-bar-wrap">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    aria-valuenow={80} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="about-me">
              <h4>About me</h4>
              <p>
                I'm an AWS Certified Solutions Architect – Associate and Cloud Practitioner, with CompTIA Security+ and a Computer Science degree in progress at FIU. My focus is on cloud security and infrastructure optimization.
              </p>
              <p>
                Before tech, I spent years in sales, knocking on doors, working at T-Mobile and AT&T, and learning how to thrive in rejection. Walking house to house in scorching heat or in the rain, hearing "no" more times than I could count, and still showing up the next morning built the grit and adaptability I bring into my work today.
              </p>
              <p>
                What keeps me moving is curiosity. I love understanding how things work, breaking them down, and making them better, whether that's fine-tuning cloud architectures, locking down security vulnerabilities, or building a portfolio site from scratch. For me, the process is just as rewarding as the outcome.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
