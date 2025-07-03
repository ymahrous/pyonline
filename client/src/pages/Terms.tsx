import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-slate-600">
            Please read these terms carefully before using PyOnline
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <Card className="bg-red-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700">
              By using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Account Registration</h2>
            <p className="text-slate-700">
              Creating an account is required for tracking your progress and accessing personalized features. You are responsible for maintaining the confidentiality of your account credentials and all activity that occurs under your account.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Use of Local Storage</h2>
            <p className="text-slate-700">
              For users not logged in, PyOnline uses browser to temporarily save your code and progress. This data is stored only on your device and may be lost if you clear your browser data.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Use of the Service</h2>
            <p className="text-slate-700">
              PyOnline is intended for educational purposes only. You agree not to use the service for any illegal or harmful activities, including uploading malicious code. Violations may result in suspension or termination of your account.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Service Availability</h2>
            <p className="text-slate-700">
              The service may occasionally be unavailable due to maintenance, updates, or technical issues. PyOnline is provided “as is” without warranties of any kind.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Modifications to Terms</h2>
            <p className="text-slate-700">
              We reserve the right to modify these Terms and Conditions at any time. Continued use of the service after changes constitutes acceptance of the updated terms.
            </p>
          </Card>

          <Card className="bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Contact</h2>
            <p className="text-slate-700">
              If you have any questions about these terms, please visit our{" "}
              <a
                href="https://pythononline.up.railway.app/contact"
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