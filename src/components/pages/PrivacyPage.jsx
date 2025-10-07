import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p>
        We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our application. By using our service, you agree to the practices described in this policy.
      </p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          We collect the following types of information to provide and improve our services:
        </p>
        <ul>
          <li><strong>Account Information:</strong> When you register, we collect your email address, name, and a securely hashed password. Your role (e.g., User or Admin) is stored to manage access permissions. We also record your account creation timestamp and last login time.</li>
          <li><strong>Subscription Information:</strong> If you subscribe to a plan (e.g., Free, Pro, Premium), we store details such as the plan name, start and end dates, and subscription status (e.g., active or inactive).</li>
          <li><strong>Project and Task Data:</strong> You may create projects, boards, columns, and tasks. We store project titles, descriptions, deadlines, priorities, links, and board associations, as well as board titles, column titles, colors, task content, completion status, and their respective creation and update timestamps.</li>
          <li><strong>Usage Information:</strong> We log your IP addresses and login times to monitor account activity and ensure security.</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to:
        </p>
        <ul>
          <li>Authenticate your account and provide access to the application.</li>
          <li>Manage your subscriptions and deliver features associated with your plan (e.g., Free, Pro or Premium).</li>
          <li>Enable you to create, organize, and track projects, boards, columns, and tasks.</li>
          <li>Monitor account activity to detect and prevent unauthorized access or suspicious behavior.</li>
          <li>Improve our services by analyzing usage patterns in aggregated, anonymized form.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Protect Your Information</h2>
        <p>
          We implement the following measures to safeguard your data:
        </p>
        <ul>
          <li><strong>Password Security:</strong> Your password is stored as a secure hash, making it unreadable even to us.</li>
          <li><strong>Encrypted Communication:</strong> API requests between the application and our servers are encrypted using HTTPS.</li>
          <li><strong>Access Controls:</strong> Only authorized personnel have access to our servers, and user data access is restricted based on roles (e.g., User or Admin).</li>
          <li><strong>Regular Audits:</strong> We conduct security audits to identify and address potential vulnerabilities.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>
          We do not share your personal information with third parties, except in the following cases:
        </p>
        <ul>
          <li>With your explicit consent.</li>
          <li>To comply with legal obligations or respond to lawful requests from authorities.</li>
          <li>With service providers acting on our behalf (e.g., hosting or payment processing providers), who are contractually obligated to protect your data.</li>
        </ul>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>
          You have the following rights regarding your data:
        </p>
        <ul>
          <li><strong>Access:</strong> You can request a copy of your personal data, including account details, subscriptions, projects, boards, columns, and tasks.</li>
          <li><strong>Correction:</strong> You can update your email address or username via the application settings.</li>
          <li><strong>Deletion:</strong> You can request deletion of your account and associated data (e.g., projects, boards, tasks, and login history) by contacting us.</li>
          <li><strong>Opt-Out:</strong> You can manage your subscription preferences to cancel or change plans (e.g., switch from Pro to Free).</li>
        </ul>
        <p>
          To exercise these rights, please contact us at <a href="mailto:night3098games@gmail.com">night3098games@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2>6. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data, including account information, subscriptions, projects, boards, columns, tasks, and login history, from our servers, except where retention is required by law (e.g., for audit or tax purposes). Anonymized project and task data may be retained for analytical purposes.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via the application or by email. The updated policy will be effective upon posting.
        </p>
      </section>

      <p className="last-updated">
        Last updated: May 22, 2025
      </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
