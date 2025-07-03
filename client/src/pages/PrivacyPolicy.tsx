import { Card } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            How we collect, use, and protect your information at PyOnline
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <Card className="bg-purple-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Data We Collect</h2>
            <p className="text-slate-700">
              PyOnline collects basic account data such as your name, email, and progress when you create an account. If you're not logged in, we temporarily store your code and progress in your browser.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How We Use Your Data</h2>
            <p className="text-slate-700">
              We use your data to save your progress, personalize your learning experience, and improve the platform. We do not sell or share your personal information with third parties.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Local Storage Use</h2>
            <p className="text-slate-700">
              For users who are not logged in, local storage is used to store your code and progress temporarily. This data stays in your browser and is cleared if you clear your site data or cache.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Account Security</h2>
            <p className="text-slate-700">
              We take reasonable steps to protect your account data, but it is your responsibility to use a secure password and keep your login credentials private.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Changes to This Policy</h2>
            <p className="text-slate-700">
              We may update this Privacy Policy from time to time. When we do, we’ll post the updated version on this page.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Contact</h2>
            <p className="text-slate-700">
              If you have questions about this Privacy Policy, please reach out via our{" "}
              <a
                href="/contact"
                className="text-blue-600 no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                contact
              </a> page.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}