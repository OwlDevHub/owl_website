import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="privacy-page">
      <header className="header" style={{ width: "calc(100% - 10px - 10px)", padding: "10px", margin: "0px", display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" className='navbar_button' style={{ width: "auto", padding: "0px 20px 0px 20px" }}>
          ← Back to Home
        </Link>
      </header>
      <div className='sspacer' style={{ height: "100px" }}></div>
      <div className="privacy-container">
        <h1>Terms of Service</h1>
        
        <section>
          <h2>1. General Provisions</h2>
          <p>1.1. These Terms of Service (hereinafter "Terms") govern the relationship between users (hereinafter "User") and the operator of the service (hereinafter "Service"), provided through the web platform, mobile applications, or API.</p>
          <p>1.2. By using the Service, the User fully and unconditionally agrees to these Terms.</p>
          <p>1.3. The Service reserves the right to amend these Terms at any time. We will notify Users of significant changes via email at least 30 days before they take effect. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2>2. Registration and Account</h2>
          <p>2.1. To access the full functionality of the Service, the User must register by providing accurate information (e.g., name, email address, password).</p>
          <p>2.2. The User is responsible for maintaining the confidentiality of their account credentials. The Service is not liable for unauthorized access to the User's account due to loss of credentials.</p>
          <p>2.3. The Service is available to Users of all ages. Users under 16 years of age must obtain parental consent to use the Service in accordance with GDPR requirements.</p>
          <p>2.4. The Service reserves the right to refuse registration or suspend an account without explanation if the User's actions violate these Terms.</p>
        </section>

        <section>
          <h2>3. Use of the Service</h2>
          <p>3.1. The User agrees to use the Service only for lawful purposes and in compliance with the laws of their jurisdiction.</p>
          <p>3.2. The following actions are prohibited:</p>
          <ul>
            <li>Using the Service to distribute malware, spam, or other illegal content</li>
            <li>Attempting to gain unauthorized access to the Service's systems or other Users' data</li>
            <li>Copying, modifying, or distributing the Service's software or content without written permission from the operator</li>
          </ul>
          <p>3.3. Some features of the Service may only be available with a paid subscription or upon meeting specific conditions.</p>
        </section>

        <section>
          <h2>4. Paid Services</h2>
          <p>4.1. The Service offers both free and paid features. Information about the cost of paid services is available on the Service's website or application.</p>
          <p>4.2. Payments are processed through designated payment systems. The User must provide accurate payment information.</p>
          <p>4.3. All payments for subscription services are final and non-refundable, except where required by applicable law.</p>
          <p>4.4. The Service is not responsible for disruptions in payment systems or banking services.</p>
        </section>

        <section>
          <h2>5. Privacy and Data Protection</h2>
          <p>5.1. The Service collects, processes, and stores the User's personal data in accordance with the Privacy Policy available on the website and in compliance with GDPR requirements.</p>
          <p>5.2. The User consents to the processing of their data for the purposes of providing services, analytics, and improving the Service.</p>
          <p>5.3. The Service implements appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including protection against unauthorized or unlawful processing and against accidental loss.</p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>6.1. All materials on the Service (text, images, software, etc.) are the intellectual property of the Service or its partners.</p>
          <p>6.2. The User may use the Service's materials solely for personal, non-commercial purposes.</p>
          <p>6.3. The User may upload content to the Service, granting the Service a non-exclusive license to use it for the purpose of providing services.</p>
        </section>

        <section>
          <h2>7. Liability</h2>
          <p>7.1. The Service is provided "as is." The operator does not guarantee uninterrupted operation or compatibility with the User's devices.</p>
          <p>7.2. The Service is not liable for any losses arising from the use or inability to use the Service, to the maximum extent permitted by applicable law.</p>
          <p>7.3. The User is fully responsible for their actions on the Service, including posting content that may infringe on third-party rights.</p>
        </section>

        <section>
          <h2>8. Termination of Access</h2>
          <p>8.1. The Service may suspend or terminate a User's access for violating these Terms.</p>
          <p>8.2. The User may stop using the Service at any time by deleting their account as per the instructions provided in the settings. Upon account deletion, personal data will be processed in accordance with our Privacy Policy and GDPR requirements.</p>
        </section>

        <section>
          <h2>9. Dispute Resolution</h2>
          <p>9.1. Any disputes related to the use of the Service will be resolved in accordance with the laws of the jurisdiction where the Service operator is registered.</p>
          <p>9.2. The User and the Service agree to attempt to resolve disputes through negotiation before resorting to legal action.</p>
          <p>9.3. Users have the right to lodge a complaint with a supervisory authority in the European Union if they believe their data protection rights have been violated.</p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>10.1. For questions related to the Service or to exercise your data protection rights under GDPR, please contact us at <a href="mailto:night3098games@gmail.com">night3098games@gmail.com</a>.</p>
          <p>10.2. We will respond to all legitimate requests within 30 days as required by GDPR.</p>
        </section>

        <section>
          <h2>11. Final Provisions</h2>
          <p>11.1. These Terms constitute the entire agreement between the User and the Service.</p>
          <p>11.2. If any provision of these Terms is deemed invalid, the remaining provisions remain in effect.</p>
          <p>11.3. These Terms are drafted in English. In case of translation into other languages, the English version prevails.</p>
        </section>

        <p className="last-updated">Last updated: May 22, 2025</p>
      </div>
    </div>
  );
};

export default TermsOfService;
