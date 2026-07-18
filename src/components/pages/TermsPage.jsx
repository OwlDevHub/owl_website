import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="spacer" style={{ height: "100px" }}></div>
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back to Home
        </button>
        <h1>Terms of Service</h1>

        <section>
          <h2>1. General Provisions</h2>
          <p>
            1.1. These Terms of Service (hereinafter "Terms") govern the
            relationship between users (hereinafter "User") and the operator of
            the service (hereinafter "OWL" or "Service"), provided through the
            web platform, CLI tools, and API.
          </p>
          <p>
            1.2. By using the Service, the User fully and unconditionally agrees
            to these Terms.
          </p>
          <p>
            1.3. The Service reserves the right to amend these Terms at any
            time. We will notify Users of significant changes via email at least
            30 days before they take effect. Continued use of the Service after
            changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2>2. Registration and Account</h2>
          <p>
            2.1. To access the full functionality of the Service, the User must
            register by providing accurate information (name, email address,
            password). A password hash is stored securely — the Service never
            stores plain-text passwords.
          </p>
          <p>
            2.2. The User is responsible for maintaining the confidentiality of
            their account credentials. The Service is not liable for
            unauthorized access to the User's account due to loss of
            credentials.
          </p>
          <p>
            2.3. The Service is available to Users of all ages. Users under 16
            years of age must obtain parental consent to use the Service in
            accordance with GDPR requirements.
          </p>
          <p>
            2.4. Upon registration, a Free subscription plan is automatically
            assigned to the User. The Service reserves the right to refuse
            registration or suspend an account without explanation if the User's
            actions violate these Terms.
          </p>
        </section>

        <section>
          <h2>3. Use of the Service</h2>
          <p>
            3.1. OWL provides project and task management features including
            kanban boards, columns, tasks, project collaboration, and CLI
            integration. The User agrees to use the Service only for lawful
            purposes and in compliance with the laws of their jurisdiction.
          </p>
          <p>3.2. The following actions are prohibited:</p>
          <ul>
            <li>
              Using the Service to distribute malware, spam, or other illegal
              content
            </li>
            <li>
              Attempting to gain unauthorized access to the Service's systems or
              other Users' data
            </li>
            <li>
              Copying, modifying, reverse-engineering, or distributing the
              Service's software or content without written permission from the
              operator
            </li>
          </ul>
          <p>
            3.3. Some features of the Service may only be available with a paid
            subscription (Pro or Premium plans) or upon meeting specific
            conditions.
          </p>
        </section>

        <section>
          <h2>4. Paid Services</h2>
          <p>4.1. The Service offers three subscription plans:</p>
          <ul>
            <li>
              <strong>Free</strong> — $0.00/30 days: Basic access to core
              features with limits on usage and data volume.
            </li>
            <li>
              <strong>Pro</strong> — $5.90/30 days: Enhanced features for
              professional users, including prioritized support and increased
              limits.
            </li>
            <li>
              <strong>Premium</strong> — $8.90/30 days: Full access to all app
              features, including exclusive content and personalized settings.
            </li>
          </ul>
          <p>
            4.2. Payments are processed through designated payment systems. The
            User must provide accurate payment information.
          </p>
          <p>
            4.3. All payments for subscription services are final and
            non-refundable, except where required by applicable law.
            Subscription status can be "active" or "inactive".
          </p>
          <p>
            4.4. The Service is not responsible for disruptions in payment
            systems or banking services.
          </p>
        </section>

        <section>
          <h2>5. Privacy and Data Protection</h2>
          <p>
            5.1. The Service collects, processes, and stores the User's personal
            data in accordance with the Privacy Policy available on the website
            and in compliance with GDPR requirements.
          </p>
          <p>
            5.2. The User consents to the processing of their data for the
            purposes of providing services, analytics, and improving the
            Service.
          </p>
          <p>
            5.3. The Service implements appropriate technical and organizational
            measures to ensure a level of security appropriate to the risk,
            including protection against unauthorized or unlawful processing and
            against accidental loss.
          </p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            6.1. All materials on the Service (text, images, software, etc.) are
            the intellectual property of the Service or its partners.
          </p>
          <p>
            6.2. The User may use the Service's materials solely for personal,
            non-commercial purposes.
          </p>
          <p>
            6.3. The User may upload content to the Service, granting the
            Service a non-exclusive license to use it for the purpose of
            providing services.
          </p>
        </section>

        <section>
          <h2>7. Liability</h2>
          <p>
            7.1. The Service is provided "as is." The operator does not
            guarantee uninterrupted operation or compatibility with the User's
            devices.
          </p>
          <p>
            7.2. The Service is not liable for any losses arising from the use
            or inability to use the Service, to the maximum extent permitted by
            applicable law.
          </p>
          <p>
             7.3. The User is fully responsible for their actions on the Service,
             including posting content that may infringe on third-party rights.
           </p>
           <p>
             7.4. To the maximum extent permitted by applicable law, the total
             aggregate liability of the Service (including its affiliates,
             officers, and employees) to the User for any claims arising out of
             or relating to these Terms or the Service shall not exceed the total
             amount paid by the User to the Service in the 3 (three) months
             immediately preceding the event giving rise to the liability. If no
             payments have been made, liability is limited to €50 (fifty Euros).
           </p>
         </section>

        <section>
          <h2>8. Termination of Access</h2>
          <p>
            8.1. The Service may suspend or terminate a User's access for
            violating these Terms. Banned users are marked with the{" "}
            <code>is_banned</code> flag and lose access to all data.
          </p>
          <p>
             8.2. The User may stop using the Service at any time by deleting
             their account as per the instructions provided in the settings. Upon
             account deletion, personal data will be processed in accordance with
             our Privacy Policy and GDPR requirements.
           </p>
           <p>
             8.3. For banned Users, the Service will delete or irreversibly
             anonymize all personal data within 30 (thirty) calendar days from
             the date of the ban. Only essential records required by applicable
             law (e.g., for tax or audit purposes) may be retained beyond this
             period.
           </p>
         </section>

        <section>
          <h2>9. Dispute Resolution</h2>
          <p>
            9.1. Any disputes related to the use of the Service will be resolved
            in accordance with the laws of the jurisdiction where the Service
            operator is registered.
          </p>
          <p>
            9.2. The User and the Service agree to attempt to resolve disputes
            through negotiation before resorting to legal action.
          </p>
          <p>
            9.3. Users have the right to lodge a complaint with a supervisory
            authority in the European Union if they believe their data
            protection rights have been violated.
          </p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>
            10.1. For questions related to the Service or to exercise your data
            protection rights under GDPR, please contact us at{" "}
            <a href="mailto:night3098games@gmail.com">
              night3098games@gmail.com
            </a>
            .
          </p>
          <p>
            10.2. We will respond to all legitimate requests within 30 days as
            required by GDPR.
          </p>
        </section>

        <section>
          <h2>11. Final Provisions</h2>
          <p>
            11.1. These Terms constitute the entire agreement between the User
            and the Service.
          </p>
          <p>
            11.2. If any provision of these Terms is deemed invalid, the
            remaining provisions remain in effect.
          </p>
          <p>
            11.3. These Terms are drafted in English. In case of translation
            into other languages, the English version prevails.
          </p>
        </section>

        <section>
           <h2>12. Take-Down Notice</h2>
           <p>
             12.1. If you believe that content available on the Service
             infringes your copyright or other intellectual property rights, you
             may submit a Take-Down Notice to us at{" "}
             <a href="mailto:night3098games@gmail.com">
               night3098games@gmail.com
             </a>{" "}
             with the following:
           </p>
           <ul>
             <li>
               (a) Identification of the copyrighted work claimed to be
               infringed;
             </li>
             <li>
               (b) Identification of the infringing material and its location
               on the Service;
             </li>
             <li>
               (c) Your contact information (name, address, email, phone);
             </li>
             <li>
               (d) A statement that you have a good faith belief that the use
               is not authorized by the rights owner;
             </li>
             <li>
               (e) A statement, under penalty of perjury, that the information
               is accurate and that you are the rights owner or authorized to
               act on their behalf.
             </li>
           </ul>
           <p>
             12.2. Upon receipt of a valid notice, we will promptly remove or
             disable access to the allegedly infringing content and notify the
             User who posted it.
           </p>
           <p>
             12.3. The User who posted the content may submit a counter-notice
             within 14 days. If we receive a valid counter-notice, we may
             restore the content unless the rights owner files a court action.
           </p>
           <p>
             12.4. Users who submit false or misleading notices are liable for
             all damages (including costs and attorneys' fees) incurred by the
             Service or the affected user as a result of the removal.
           </p>
         </section>

         <p className="last-updated">Last updated: June 8, 2026</p>
        <div
          className="spacer"
          style={{ height: "100px", minHeight: "100px" }}
        ></div>
      </div>
      <button className="back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </div>
  );
};

export default TermsOfService;
