import React from 'react';

const PrivacyPolicyContent: React.FC = () => {
  const lastUpdated = "December 4, 2025";

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
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Third-Party Services</h3>
        <p>
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
            href="mailto:support@cognitav.com" 
            className="text-slate-700 hover:text-slate-900 underline"
          >
            support@cognitav.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
