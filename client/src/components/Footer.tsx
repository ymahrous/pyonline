import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fab fa-python text-2xl text-python-yellow mr-2"></i>
              <span className="text-xl font-bold">PyOnline</span>
            </div>
            <p className="text-slate-400">
              Making Python learning fun and accessible for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href="/lessons"
                  className="hover:text-white transition-colors"
                >
                  Lessons
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="https://discord.com/invite/python" className="hover:text-white transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/Python/" className="hover:text-white transition-colors">
                  Reddit
                </a>
              </li>
              <li>
                <a href="https://stackoverflow.com/questions/tagged/python" className="hover:text-white transition-colors">
                  Stack Overflow
                </a>
              </li>
              <li>
                <a href="https://stackoverflow.com/questions/tagged/python" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="https://github.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              {/* <a
                href="https://linkedin.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a
                href="https://youtube.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-youtube text-xl"></i>
              </a> */}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>
            &copy; 2025 PyOnline. All rights reserved. Made for Python learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
