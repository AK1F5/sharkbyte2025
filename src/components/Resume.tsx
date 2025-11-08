export function Resume() {
  return (
    <section id="resume" className="resume section">
      <div className="container mx-auto px-4 section-title">
        <h2>Resume</h2>
        <p>
          <a 
            href="https://www.linkedin.com/in/jporter924" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            LinkedIn
          </a>
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="resume-title">Summary</h3>

            <div className="resume-item pb-0">
              <h4>Joaquin Porter Jr</h4>
              <p>
                <em>AWS Solutions Architect - Associate and CompTIA Security+ certified student pursuing a B.A. in Computer Science. Team lead with hands-on experience in cloud security, IAM, vulnerability discovery, SIEM monitoring, and DevSecOps automation. Blends technical depth with leadership and customer-facing skills to deliver secure, scalable solutions.</em>
              </p>
              <ul>
                <li>Miami, Florida</li>
                <li>(305) 988-8253</li>
                <li>JPort081@FIU.edu</li>
              </ul>
            </div>

            <h3 className="resume-title">Education</h3>
            <div className="resume-item">
              <h4>Bachelor of Arts in Computer Science</h4>
              <h5>2025 - 2027</h5>
              <p><em>Florida International University - Miami, FL</em></p>
              <p>Currently pursuing a B.A. in Computer Science at FIU, with a focus on cloud security and scalable infrastructure.</p>
            </div>

            <div className="resume-item">
              <h4>Associate of Arts in Business Administration</h4>
              <h5>2018 - 2020</h5>
              <p><em>Miami-Dade College - Miami, FL</em></p>
              <p>After earning my Associate's in Business, I pursued entrepreneurship through day trading in the stock market and wholesaling real estate during mornings, nights, and weekends. Knocking on doors, cold calling leads, and analyzing markets wasn't glamorous, but it taught me grit and resilience through the school of hard knocks. Those same lessons in perseverance, discipline, and consistency are exactly what I bring into cloud security and infrastructure.</p>
            </div>
          </div>

          <div>
            <h3 className="resume-title">Professional Experience</h3>
            <div className="resume-item">
              <h4 className="flex justify-between items-center flex-wrap">
                <span>INIT @ FIU</span>
                <span style={{ fontSize: '0.9em', fontWeight: 'normal', color: '#6c757d' }}>September 2025 - Present</span>
              </h4>
              <p><em>Cybersecurity Team Lead | Miami, FL</em></p>
              <ul>
                <li>Leading a student team project on an IAM Security Misconfiguration Dashboard to detect and remediate cloud risks.</li>
                <li>Coordinating roles, timelines, and deliverables to keep the project on track and teammates focused on strengths.</li>
                <li>Introducing DevSecOps workflows (OPA, Checkov, Gitleaks) and guiding peers in integrating security checks.</li>
                <li>Mentoring teammates through challenges, fostering collaboration and knowledge-sharing throughout the project.</li>
              </ul>
            </div>

            <div className="resume-item">
              <h4 className="flex justify-between items-center flex-wrap">
                <span>AWS Cloud Clubs</span>
                <span style={{ fontSize: '0.9em', fontWeight: 'normal', color: '#6c757d' }}>November 2025 - Present</span>
              </h4>
              <p><em>Cloud Club Captain - FIU | Miami, FL</em></p>
              <ul>
                <li>Launching the AWS Cloud Club at FIU to build a student community focused on cloud computing and DevOps.</li>
                <li>Hosting workshops and certification study sessions to strengthen members' technical skills and AWS career readiness.</li>
                <li>Collaborating with AWS mentors and fellow Captains to align initiatives with AWS's global education mission.</li>
              </ul>
            </div>

            <div className="resume-item">
              <h4 className="flex justify-between items-center flex-wrap">
                <span>T-Mobile</span>
                <span style={{ fontSize: '0.9em', fontWeight: 'normal', color: '#6c757d' }}>July 2019 - May 2025</span>
              </h4>
              <p><em>Mobile Expert - Key Holder | Miami, FL</em></p>
              <ul>
                <li>Communicated complex technical information clearly while assisting customers with network troubleshooting.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
