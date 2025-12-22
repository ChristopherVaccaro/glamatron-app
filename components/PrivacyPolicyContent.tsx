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
          This Privacy Policy explains how we collect, access, use, store, share, and protect your information 
          when you use our AI-powered image styling service, including when you sign in using Google.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Information We Collect</h3>
        
        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Google Account Data (via Google Sign-In)</h4>
        <p className="mb-2">If you choose to sign in using Google, we access the following Google user data through OAuth:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Email address</li>
          <li>Display name</li>
          <li>Profile photo</li>
          <li>Google Account unique identifier (OAuth user ID)</li>
        </ul>
        <p className="mt-2">We access only the minimum data required to authenticate you and create your account.</p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Account Information</h4>
        <p className="mb-2">When you create an account with Glamatron, we may collect:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Email address</li>
          <li>Name</li>
          <li>Account identifiers</li>
          <li>Authentication metadata</li>
        </ul>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Images and Generated Content</h4>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Photos you upload for AI styling</li>
          <li>AI-generated images created from your uploads</li>
        </ul>
        <p className="mt-2">For registered users, this content may be saved to your personal gallery.</p>

        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Usage and Technical Data</h4>
        <p className="mb-2">We may collect limited, non-identifying technical data such as:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Feature usage (aggregated and anonymous)</li>
          <li>Browser type and device information</li>
          <li>IP address (used for security and abuse prevention)</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">How We Use Your Information</h3>
        <p className="mb-3">We use collected data strictly to operate and improve Glamatron:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Authentication and account access:</strong> Google account data is used solely for login, account creation, and identity verification.</li>
          <li><strong>Image processing:</strong> Uploaded images are processed using Google's Gemini AI API to generate styled results.</li>
          <li><strong>Image storage:</strong> Registered users may store original and generated images securely to access their transformation history.</li>
          <li><strong>Service improvement:</strong> Anonymous usage data helps us improve performance, reliability, and user experience.</li>
          <li><strong>Security and operations:</strong> Data may be used to detect fraud, prevent abuse, and maintain system integrity.</li>
        </ul>
        <p className="mt-3">We do not use Google user data for advertising, marketing, profiling, or resale.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Sharing</h3>
        <p className="mb-3">We do not sell, rent, or trade Google user data.</p>
        <p className="mb-2">Google user data and other personal data are shared only with trusted service providers strictly necessary to operate the service:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Google APIs (Gemini AI) for image processing</li>
          <li>Supabase for secure authentication, database, and file storage infrastructure</li>
        </ul>
        <p className="mt-2">Data is shared solely to provide requested functionality and for no other purpose.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Storage and Security</h3>
        <p className="mb-2">User data is stored using industry-standard security practices, including:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Encrypted data transmission using HTTPS and TLS</li>
          <li>Access controls and role-based permissions</li>
          <li>Secure cloud infrastructure</li>
        </ul>
        <p className="mt-2">
          While we take reasonable measures to protect your data, no online system is completely secure. 
          Please avoid uploading sensitive or highly personal images.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Retention and Deletion</h3>
        <p className="mb-2"><strong>Registered users:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
          <li>Uploaded images and generated content are stored until you delete them or delete your account.</li>
        </ul>
        
        <h4 className="font-semibold text-slate-800 mt-4 mb-2">Deletion Requests</h4>
        <p className="mb-2">You may:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Delete individual images directly from your gallery</li>
          <li>Request full account and data deletion by emailing{' '}
            <a href="mailto:support@glamatron.com" className="text-slate-700 hover:text-slate-900 underline">support@glamatron.com</a>
          </li>
        </ul>
        <p className="mt-2">Deletion requests are processed within a reasonable timeframe.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Cookies and Local Storage</h3>
        <p className="mb-2">Glamatron may use:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Essential cookies for core functionality</li>
          <li>Analytics cookies for aggregated and anonymous insights</li>
          <li>Local browser storage for temporary performance optimization</li>
        </ul>
        <p className="mt-2">You can manage cookies through your browser settings.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Your Rights</h3>
        <p className="mb-2">Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Access the data we hold about you</li>
          <li>Request deletion of your data</li>
          <li>Download your stored images</li>
          <li>Opt out of analytics tracking</li>
          <li>Delete your account at any time</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Children's Privacy</h3>
        <p>
          Glamatron is not intended for children under the age of 13. We do not knowingly collect personal 
          data from children. If you believe a child has provided personal data, please contact us immediately.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Google API Limited Use Disclosure</h3>
        <p>
          Glamatron's use of information received from Google APIs adheres to the{' '}
          <a 
            href="https://developers.google.com/terms/api-services-user-data-policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-900 underline"
          >
            Google API Services User Data Policy
          </a>, including the Limited Use requirements.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Updates will be posted on this page with a 
          revised "Last updated" date.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Contact Us</h3>
        <p className="mb-2">
          If you have questions or requests regarding this Privacy Policy, please contact us at:
        </p>
        <p>
          Email:{' '}
          <a 
            href="mailto:support@glamatron.com" 
            className="text-slate-700 hover:text-slate-900 underline"
          >
            support@glamatron.com
          </a>
        </p>
        <p>
          Website:{' '}
          <a 
            href="https://www.glamatron.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-900 underline"
          >
            https://www.glamatron.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
