import { Card } from "@/components/ui/card";

export default function Faq() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">
            Common questions about PyOnline
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">What is PyOnline?</h2>
            <p className="text-slate-700">
              PyOnline is a browser-based platform that helps users learn and practice Python without needing to install anything. It's designed for both beginners and experienced coders.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Do I need an account to use PyOnline?</h2>
            <p className="text-slate-700">
              No account is required to run code, but creating one allows you to save progress, unlock features, and access learning tools.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">What happens if I don't log in?</h2>
            <p className="text-slate-700">
              If you're not logged in, PyOnline saves your code and progress locally using your browser's storage. This data can be lost if you clear browser storage or switch devices.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Is PyOnline free?</h2>
            <p className="text-slate-700">
              Yes! PyOnline is currently free to use. All essential features are accessible without payment.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Can I use PyOnline to build real projects?</h2>
            <p className="text-slate-700">
              Absolutely! PyOnline is a great place to experiment and test ideas. You can build and run small-scale projects directly in your browser.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Is my data safe?</h2>
            <p className="text-slate-700">
              Yes. Logged-in users have their progress securely stored on our servers. For more info, check our{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 no-underline">Privacy Policy</a>.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Who created PyOnline?</h2>
            <p className="text-slate-700">
              PyOnline is developed by a small team of passionate developers focused on making Python fun and accessible. Learn more on the{" "}
              <a href="/about" target="_blank" rel="noopener noreferrer" className="text-blue-600 no-underline">about</a> page.
            </p>
          </Card>

          <Card className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">How do I contact support?</h2>
            <p className="text-slate-700">
              You can reach us anytime via the{" "}
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