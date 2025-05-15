interface PrivacyPolicyProps {
  companyName: string;
  companyType: string;
  state: string;
  contactEmail: string;
}

export function PrivacyPolicy({
  companyName,
  companyType,
  state,
  contactEmail,
}: PrivacyPolicyProps) {
  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6">
        <p>
          This Privacy Policy describes how {companyName} {companyType} ("{companyName}") 
          collects, uses, and protects your personal information when you use our AI-powered 
          video creation services. We are committed to ensuring that your privacy is protected.
        </p>

        <section>
          <h2 className="text-xl font-semibold mt-8">1. Information We Collect</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              <span className="font-medium">Account Information:</span> Email address, name, and payment details
            </li>
            <li>
              <span className="font-medium">Service Usage Data:</span> Prompts, preferences, and interaction with our platform
            </li>
            <li>
              <span className="font-medium">Generated Content:</span> Videos and images created using our Services
            </li>
            <li>
              <span className="font-medium">Technical Data:</span> IP address, browser type, device information
            </li>
            <li>
              <span className="font-medium">Authentication Data:</span>
              <ul className="list-disc pl-6 mt-2">
                <li>Google account email address</li>
                <li>Google profile name</li>
                <li>Google profile picture (if available)</li>
                <li>Google account ID (for authentication purposes)</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>To provide and improve our AI video generation services</li>
            <li>To process your payments and manage your account</li>
            <li>To communicate with you about service updates and changes</li>
            <li>To analyze usage patterns and optimize our platform</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">3. Authentication and Third-Party Services</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              <span className="font-medium">Google Authentication:</span>
              <ul className="list-disc pl-6 mt-2">
                <li>We use Google OAuth 2.0 for secure user authentication</li>
                <li>We only request basic profile information necessary for account creation</li>
                <li>We do not have access to your Google password</li>
                <li>You can revoke our access to your Google account at any time through your Google Account settings</li>
              </ul>
            </li>
            <li>We use third-party AI services (like Midjourney) to process your content</li>
            <li>Payment processing is handled by secure payment providers</li>
            <li>Cloud storage services may be used to store your data</li>
            <li>Analytics tools help us improve our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">4. Data Storage and Security</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>We implement appropriate security measures to protect your data</li>
            <li>Data is stored on secure servers with encryption</li>
            <li>We retain your data only as long as necessary</li>
            <li>Generated content is stored according to your subscription terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">5. Your Rights</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>Access and download your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (where applicable)</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability rights (where applicable)</li>
            <li>
              <span className="font-medium">Authentication Controls:</span>
              <ul className="list-disc pl-6 mt-2">
                <li>Disconnect your Google account from our service</li>
                <li>Request deletion of data associated with your Google account</li>
                <li>Change your authentication method (if alternative methods are available)</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">6. International Data Transfers</h2>
          <p className="mt-4">
            Your data may be transferred to and processed in countries outside India. We ensure 
            appropriate safeguards are in place for such transfers in compliance with applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">7. Cookies and Tracking</h2>
          <p className="mt-4">
            We use cookies and similar technologies to improve user experience and analyze platform usage. 
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">8. Children's Privacy</h2>
          <p className="mt-4">
            Our services are not intended for users under 13 years of age. We do not knowingly 
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">9. Changes to Privacy Policy</h2>
          <p className="mt-4">
            We may update this policy periodically. We will notify you of any material changes 
            via email or through our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">10. Contact Us</h2>
          <p className="mt-4">
            For any privacy-related questions or concerns, please contact us at:{" "}
            <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
              {contactEmail}
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">11. Account Deletion</h2>
          <p className="mt-4">
            When you delete your account:
          </p>
          <ul className="list-disc pl-6 mt-4">
            <li>Your Google authentication link will be removed</li>
            <li>Your personal information will be deleted from our active databases</li>
            <li>Some information may be retained in backups for legal compliance</li>
            <li>Generated content will be handled according to our retention policy</li>
          </ul>
        </section>

        <footer className="mt-12 pt-8 border-t border-border/60">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {companyName} {companyType}, {state}, India
          </p>
        </footer>
      </div>
    </div>
  );
}
