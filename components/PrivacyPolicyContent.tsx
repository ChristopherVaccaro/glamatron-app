import React from 'react';

const PrivacyPolicyContent: React.FC = () => {
  const lastUpdated = "December 21, 2025";

  return (
    <div className="space-y-6 text-slate-700">
      <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Introduction</h3>
        <p>
          Welcome to Glamatron. We respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
          AI-powered image styling service.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Information We Collect</h3>
        <p className="mb-2">When you use Glamatron, we may collect:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Account information:</strong> When you create an account, we collect your email address, name, and (if using Google sign-in) your profile picture.</li>
          <li><strong>Images you upload:</strong> Photos you submit for AI styling and the generated results are stored in your personal gallery if you have an account.</li>
          <li><strong>Usage data:</strong> Anonymous information about how you interact with the service (e.g., features used, device type).</li>
          <li><strong>Technical data:</strong> Browser type, IP address, and device information for service optimization.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">How We Use Your Information</h3>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Image processing:</strong> Your uploaded images are sent to Google's Gemini AI API to generate your styled image.</li>
          <li><strong>Image storage:</strong> For registered users, we store your original uploaded images and generated results in our secure cloud database so you can access your transformation history.</li>
          <li><strong>Account management:</strong> Your email and name are used to identify your account and personalize your experience.</li>
          <li><strong>Service improvement:</strong> Anonymous usage data helps us improve the user experience.</li>
          <li><strong>Technical operations:</strong> To maintain security and optimize performance.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Google User Data</h3>
        <p className="mb-3">
          Glamatron uses Google Sign-In to authenticate users. This section specifically describes how we handle 
          data obtained through Google APIs in compliance with the{' '}
          <a 
            href="https://developers.google.com/terms/api-services-user-data-policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-900 underline"
          >
            Google API Services User Data Policy
          </a>, including the Limited Use requirements.
        </p>
        
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-slate-800">
            <strong>Limited Use Disclosure:</strong> Glamatron's use and transfer to any other app of information 
            received from Google APIs will adhere to the{' '}
            <a 
              href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 underline"
            >
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </p>
        </div>

        <div className="ml-2 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Data Accessed</h4>
            <p className="mb-1">When you sign in with Google, Glamatron accesses the following Google user data:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>Email address:</strong> Used to identify your account</li>
              <li><strong>Display name:</strong> Used to personalize your experience</li>
              <li><strong>Profile picture:</strong> Displayed on your account profile</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Data Usage</h4>
            <p className="mb-1">We use your Google user data exclusively for the following purposes:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>Account authentication:</strong> To verify your identity and allow you to sign in</li>
              <li><strong>Account identification:</strong> Your email uniquely identifies your account in our system</li>
              <li><strong>Personalization:</strong> Your name and profile picture are displayed in the app interface</li>
            </ul>
            <p className="mt-2 text-sm text-slate-600">
              We do not use your Google user data for advertising, marketing to third parties, or any purpose 
              unrelated to the core functionality of Glamatron.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Data Sharing</h4>
            <p className="mb-1">Your Google user data is handled as follows:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>We do NOT sell</strong> your Google user data to any third parties</li>
              <li><strong>We do NOT share</strong> your Google user data with third parties for their marketing purposes</li>
              <li><strong>We do NOT use</strong> your Google user data for any form of advertising</li>
            </ul>
            <p className="mt-2">
              Your Google user data is stored securely in our database (Supabase) solely for the purpose of 
              providing the Glamatron service to you. We may share data only if required by law or to protect 
              our legal rights.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Prohibited Uses</h4>
            <p className="mb-1">In compliance with Google's policies, we explicitly do NOT use your Google user data for:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Selling or transferring data to data brokers or information resellers</li>
              <li>Targeted, personalized, retargeted, or interest-based advertising</li>
              <li>Training artificial intelligence or machine learning models</li>
              <li>Determining creditworthiness or for lending purposes</li>
              <li>Creating or supplementing user profiles or databases unrelated to Glamatron's core service</li>
              <li>Any purpose unrelated to providing or improving Glamatron's user-facing features</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Human Access to Data</h4>
            <p>
              Glamatron employees, agents, and contractors do not read your Google user data unless:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
              <li>You have given us your affirmative consent for a specific purpose</li>
              <li>It is necessary for security purposes (e.g., investigating a bug or abuse)</li>
              <li>It is required to comply with applicable law</li>
            </ul>
            <p className="mt-2 text-sm text-slate-600">
              All employees, contractors, and agents who may have access to Google user data are bound to 
              comply with the Google API Services User Data Policy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Data Storage & Protection</h4>
            <p className="mb-1">We implement the following security measures to protect your Google user data:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>Encrypted transmission:</strong> All data is transmitted over HTTPS/TLS encryption</li>
              <li><strong>Secure storage:</strong> Data is stored in Supabase with row-level security policies</li>
              <li><strong>Access controls:</strong> Only authenticated users can access their own data</li>
              <li><strong>No local storage:</strong> Sensitive Google user data is not stored in browser local storage</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Data Retention & Deletion</h4>
            <p className="mb-1">Regarding retention and deletion of your Google user data:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>Retention period:</strong> Your Google user data is retained for as long as your account is active</li>
              <li><strong>Account deletion:</strong> You may request complete deletion of your account and all associated 
                data at any time by contacting us at{' '}
                <a href="mailto:support@glamatron.com" className="text-slate-700 hover:text-slate-900 underline">support@glamatron.com</a>
              </li>
              <li><strong>Revoke access:</strong> You can revoke Glamatron's access to your Google account at any time 
                through your{' '}
                <a 
                  href="https://myaccount.google.com/permissions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-slate-900 underline"
                >
                  Google Account permissions settings
                </a>
              </li>
              <li><strong>Deletion timeline:</strong> Upon account deletion request, all your data including Google user 
                data will be permanently deleted within 30 days</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Third-Party Services</h3>
        <p className="mb-2">
          We use Google's Gemini AI API to process images. When you use Glamatron, your images are 
          transmitted to Google's servers for AI processing. Please review{' '}
          <a 
            href="https://policies.google.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-900 underline"
          >
            Google's Privacy Policy
          </a>{' '}
          for information on how they handle data.
        </p>
        <p>
          <strong>Important:</strong> Images you upload for AI styling are processed by Google's Gemini API but are 
          not associated with your Google account. The AI processing is separate from the Google Sign-In 
          authentication.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Retention</h3>
        <p className="mb-2">
          <strong>For registered users:</strong> Your uploaded images and generated transformations are stored 
          in our secure cloud database (powered by Supabase) indefinitely until you choose to delete them or 
          delete your account. You can delete individual transformations from your gallery at any time.
        </p>
        <p>
          <strong>For anonymous users:</strong> Images are processed in real-time and exist only temporarily 
          during your session. Once you leave the page, the images are no longer accessible.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Cookies & Local Storage</h3>
        <p className="mb-2">Glamatron may use:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Essential cookies:</strong> Required for basic site functionality.</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors use the site (anonymous, aggregated data).</li>
          <li><strong>Local storage:</strong> Your browser may temporarily cache image data for performance; this is cleared when you close the tab.</li>
        </ul>
        <p className="mt-2">
          You can control cookies through your browser settings. Disabling cookies may affect some features.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Your Rights</h3>
        <p className="mb-2">Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Access information we hold about you</li>
          <li>Request deletion of your data and images</li>
          <li>Download your stored images</li>
          <li>Opt out of analytics tracking</li>
          <li>Delete your account entirely</li>
        </ul>
        <p className="mt-2">
          You can delete individual transformations directly from your gallery, or contact us to request 
          complete account deletion.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Children's Privacy</h3>
        <p>
          Glamatron is not intended for children under 13. We do not knowingly collect personal 
          information from children. If you believe a child has provided us with personal data, please 
          contact us immediately.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Security</h3>
        <p>
          We implement appropriate technical measures to protect your data during transmission. However, 
          no internet transmission is 100% secure. We encourage you to avoid uploading sensitive personal 
          images.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by 
          posting the new policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Contact Us</h3>
        <p>
          If you have questions about this Privacy Policy, please contact us through the Contact page 
          or email us at{' '}
          <a 
            href="mailto:support@glamatron.com" 
            className="text-slate-700 hover:text-slate-900 underline"
          >
            support@glamatron.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
