import React from 'react';

const TermsOfServiceContent: React.FC = () => {
  const lastUpdated = "December 4, 2025";

  return (
    <div className="space-y-6 text-slate-700">
      <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h3>
        <p>
          By accessing or using Glamatron ("the Service"), you agree to be bound by these Terms of 
          Service. If you do not agree to these terms, please do not use the Service.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Description of Service</h3>
        <p className="mb-2">
          Glamatron is an AI-powered image styling tool that allows users to upload photos and 
          apply virtual style transformations including hairstyles, makeup, accessories, and other 
          visual modifications. The Service uses Google's Gemini AI technology to generate styled images.
        </p>
        <p>
          Registered users can save their transformations to a personal gallery, which is stored 
          securely in our cloud database. Users can access, download, and delete their saved 
          transformations at any time.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">3. User Responsibilities</h3>
        <p className="mb-2">By using Glamatron, you agree to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Own or have rights to images:</strong> Only upload photos that you own or have explicit permission to use and modify.</li>
          <li><strong>Respect others' privacy:</strong> Do not upload photos of other people without their consent.</li>
          <li><strong>Use appropriately:</strong> Do not use the Service for illegal, harmful, or malicious purposes.</li>
          <li><strong>No prohibited content:</strong> Do not upload images containing explicit, violent, hateful, or illegal content.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Prohibited Uses</h3>
        <p className="mb-2">You may NOT use Glamatron to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Create deceptive or misleading content (e.g., fake identity documents)</li>
          <li>Generate content intended to harass, defame, or harm others</li>
          <li>Impersonate other individuals without consent</li>
          <li>Create non-consensual intimate imagery</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Attempt to reverse-engineer or exploit the Service</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">5. Intellectual Property</h3>
        <p className="mb-2"><strong>Your Content:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
          <li>You retain ownership of the original images you upload.</li>
          <li>You own the styled images generated from your uploads and may use them for personal or commercial purposes.</li>
          <li>By uploading an image, you grant us a license to process it through our AI system and store it in your personal gallery.</li>
          <li>Stored images are private to your account and not shared with other users or third parties (except as required for AI processing).</li>
        </ul>
        <p className="mb-2"><strong>Our Content:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>The Glamatron name, logo, and Service design are our property.</li>
          <li>The underlying AI technology and algorithms remain the property of their respective owners.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">6. AI-Generated Content Disclaimer</h3>
        <p>
          <strong>Results may vary.</strong> AI-generated images are created by machine learning algorithms 
          and may not always produce perfect or expected results. The Service is provided for entertainment 
          and creative purposes. We make no guarantees about the accuracy, quality, or suitability of 
          generated images for any particular purpose.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">7. Limitation of Liability</h3>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, GLAMATRON AND ITS OPERATORS SHALL NOT BE LIABLE 
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR 
          USE OF THE SERVICE. THIS INCLUDES, BUT IS NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, DATA, 
          OR OTHER INTANGIBLE LOSSES.
        </p>
        <p className="mt-2">
          The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either 
          express or implied.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">8. Indemnification</h3>
        <p>
          You agree to indemnify and hold harmless Glamatron and its operators from any claims, 
          damages, losses, or expenses arising from your use of the Service or violation of these Terms.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">9. Service Availability</h3>
        <p>
          We strive to maintain Service availability but do not guarantee uninterrupted access. We may 
          modify, suspend, or discontinue the Service at any time without notice. We are not liable for 
          any modification, suspension, or discontinuation.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">10. Third-Party Services</h3>
        <p>
          Glamatron uses Google's Gemini AI API. By using our Service, you also agree to comply 
          with Google's Terms of Service and Acceptable Use Policies. We are not responsible for 
          third-party services or their actions.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">11. Age Requirement</h3>
        <p>
          You must be at least 13 years old to use Glamatron. If you are under 18, you should 
          have parental or guardian consent. We reserve the right to terminate accounts that violate 
          this requirement.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">12. Changes to Terms</h3>
        <p>
          We may update these Terms of Service at any time. Continued use of the Service after changes 
          constitutes acceptance of the new Terms. We encourage you to review this page periodically.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">13. Termination</h3>
        <p className="mb-2">
          We reserve the right to terminate or suspend access to the Service immediately, without prior 
          notice, for any reason, including breach of these Terms.
        </p>
        <p>
          Upon account termination, your stored images and transformations may be deleted. You may request 
          a copy of your data before termination by contacting us.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">14. Governing Law</h3>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws, without 
          regard to conflict of law principles.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">15. Contact</h3>
        <p>
          For questions about these Terms of Service, please contact us at{' '}
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

export default TermsOfServiceContent;
