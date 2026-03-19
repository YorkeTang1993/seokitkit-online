import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}. Learn how we handle your data.`,
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 14, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Introduction</h2>
          <p>
            Welcome to {SITE_NAME}. We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Data We Collect</h2>
          <p>
            <strong>We do not collect any personal data.</strong> All tools on {SITE_NAME} run entirely in your browser.
            Your input data is never sent to our servers or any third party. We do not require registration, login, or
            any personal information to use our tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Analytics</h2>
          <p>
            We use Google Analytics to collect anonymous usage data such as page views, browser type, device type,
            and geographic region. This helps us understand how visitors use our site and improve the user experience.
            Google Analytics uses cookies to collect this information. You can opt out by using a browser extension
            or disabling cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Advertising</h2>
          <p>
            We may display advertisements through Google AdSense. Google AdSense may use cookies and web beacons
            to serve ads based on your prior visits to our website or other websites. You can opt out of personalized
            advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Cookies</h2>
          <p>
            Our website uses cookies only for analytics and advertising purposes as described above.
            We do not use cookies to track personal information or store any user data.
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices
            or content of these external sites. We encourage you to review the privacy policies of any third-party
            sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly collect personal information
            from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on this page
            with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-blue-600 hover:underline">
              {siteConfig.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
