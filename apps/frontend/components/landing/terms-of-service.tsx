interface TermsOfServiceProps {
  companyName: string;
  companyType: string;
  state: string;
}

export function TermsOfService({
  companyName,
  companyType,
  state,
}: TermsOfServiceProps) {
  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service Agreement</h1>

      <div className="space-y-6">
        <p>
          This Terms of Service Agreement ("Agreement") is entered into between{" "}
          {companyName} {companyType} ("{companyName}"), a company incorporated
          under the laws of India and registered in {state}, and the user
          ("User") who intends to use the services offered by {companyName}. By
          accessing or using {companyName}'s services, User acknowledges that
          they have read, understood, and agree to be bound by the terms and
          conditions of this Agreement.
        </p>

        <section>
          <h2 className="text-xl font-semibold mt-8">1. Definitions</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              "Services" refers to the AI-powered video creation and editing
              services offered by {companyName}.
            </li>
            <li>
              "User Content" refers to any prompts, data, information, or other
              content provided by User for processing through the Services.
            </li>
            <li>
              "Generated Content" refers to any videos, images, or other content
              created using the Services.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">2. Use of Services</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              The Services are available to users globally, subject to
              compliance with applicable local laws.
            </li>
            <li>
              User agrees not to generate any content that is infringing,
              defamatory, obscene, or otherwise offensive.
            </li>
            <li>
              User acknowledges that {companyName} uses third-party AI services
              and cannot guarantee specific outcomes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">
            3. Authentication and Account Security
          </h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              We use Google OAuth 2.0 for authentication. By using our service,
              you agree to:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Provide accurate and complete Google account information
                </li>
                <li>Maintain the security of your Google account</li>
                <li>Not share your account access with others</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </li>
            <li>
              You may revoke our access to your Google account at any time, but
              this may affect your ability to use our Services.
            </li>
            <li>
              We reserve the right to suspend or terminate accounts that violate
              these terms or show signs of unauthorized access.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">
            4. Intellectual Property Rights
          </h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              User retains ownership of User Content provided to the Services.
            </li>
            <li>
              User grants {companyName} a worldwide, non-exclusive license to
              use User Content as necessary to provide the Services.
            </li>
            <li>
              Generated Content ownership is subject to the licenses of the AI
              models used in creation.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">5. Payment and Billing</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>All payments are processed in United States Dollars (USD).</li>
            <li>
              Services are provided on a credit-based system as described in the
              pricing section.
            </li>
            <li>
              Users are responsible for all applicable taxes in their
              jurisdiction.
            </li>
            <li>
              Payments are processed through secure international payment
              gateways.
            </li>
            <li>
              Refunds are usually not provided as AI generations are not
              reversible, if there are exceptions, will be processed in USD to
              the original payment method.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">
            6. Data Protection and Privacy
          </h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              <span className="font-medium">Analytics Tracking Data:</span> We
              collect your name and email address to track usage patterns and
              improve our services.
            </li>
            <li>
              We comply with international data protection standards and
              applicable privacy laws.
            </li>
            <li>
              User data is processed in accordance with our Privacy Policy.
            </li>
            <li>
              Data transfer across borders is conducted in compliance with
              applicable regulations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">
            7. Limitation of Liability
          </h2>
          <p className="mt-4">
            To the maximum extent permitted by applicable law, {companyName}'s
            liability shall be limited to the amount paid by User for the
            Services. {companyName} shall not be liable for any indirect,
            incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">
            8. Governing Law and Jurisdiction
          </h2>
          <p className="mt-4">
            This Agreement shall be governed by and construed in accordance with
            the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of courts in {state}, India. However, {companyName} may
            seek injunctive relief in any jurisdiction to protect its
            intellectual property rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">9. International Use</h2>
          <ul className="list-disc pl-6 mt-4">
            <li>
              Users accessing the Services from outside India acknowledge that
              they do so on their own initiative.
            </li>
            <li>
              Users are responsible for compliance with their local laws and
              regulations.
            </li>
            <li>
              The Services may not be available or appropriate for use in
              certain jurisdictions.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8">10. Changes to Terms</h2>
          <p className="mt-4">
            {companyName} reserves the right to modify these terms at any time.
            Users will be notified of any material changes via email or through
            the Services.
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t border-border/60">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            For any legal notices: {companyName} {companyType}, {state}, India
          </p>
        </footer>
      </div>
    </div>
  );
}
