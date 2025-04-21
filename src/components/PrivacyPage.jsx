import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="intro">
          At OWL App, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our application. By using OWL App, you agree to the practices described in this policy.
        </p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect the following types of information to provide and improve our services:
          </p>
          <ul>
            <strong>Account Information:</strong> When you register, we collect your email address, name, and a securely hashed password. Your role (e.g., admin or user) is also stored to manage access permissions.
            <strong>Subscription Information:</strong> If you subscribe to premium features, we store your subscription details, including start and end dates and status (e.g., active or expired).
            <strong>Project and Task Data:</strong> You may create projects, boards, columns, and tasks within the app. We store project titles, descriptions, deadlines, priorities, links, and task content to enable project management functionality.
            <strong>Usage Information:</strong> We log your login times, IP addresses, and account creation/last login timestamps to monitor account activity and ensure security.
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul>
            Authenticate your account and provide access to the OWL App.
            Manage your subscriptions and deliver premium features.
            Enable you to create, organize, and track projects, boards, and tasks.
            Monitor account activity to detect and prevent unauthorized access.
            Improve our services by analyzing usage patterns (in aggregated, anonymized form).
          </ul>
        </section>

        <section>
          <h2>3. How We Protect Your Information</h2>
          <p>
            We take the following measures to safeguard your data:
          </p>
          <ul>
            <strong>Password Security:</strong> Your password is stored as a secure hash, making it unreadable even to us.
            <strong>Encrypted Communication:</strong> API requests between the app and our servers are encrypted using HTTPS.
            <strong>Access Controls:</strong> Only authorized personnel have access to our servers, and user data is restricted based on roles.
            <strong>Regular Audits:</strong> We conduct security audits to identify and address vulnerabilities.
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>
            We do not share your personal information with third parties, except in the following cases:
          </p>
          <ul>
            With your explicit consent.
            To comply with legal obligations or respond to lawful requests from authorities.
            
              With service providers acting on our behalf (e.g., hosting providers), who are contractually obligated to protect your data.
            
          </ul>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>
            You have the following rights regarding your data:
          </p>
          <ul>
            <strong>Access:</strong> You can request a copy of your personal data stored in the OWL App.
            <strong>Correction:</strong> You can update your account information (e.g., name, email) via the app settings.
            <strong>Deletion:</strong> You can request deletion of your account and associated data by contacting us.
            <strong>Opt-Out:</strong> You can manage your subscription preferences to stop receiving premium services.
          </ul>
          <p className="contact">
            To exercise these rights, please contact us at <a href="mailto:privacy@owlapp.com">privacy@owlapp.com</a>.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data from our servers, except where retention is required by law (e.g., for audit purposes). Project and task data may be retained in anonymized form for analytics.
          </p>
        </section>

        <section>
          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via the OWL App or by email. The updated policy will be effective upon posting.
          </p>
        </section>

        <p className="last-updated">
          Last updated: April 21, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
