import { Link } from 'react-router';

export function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-amber-900 border-t border-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Copyright Text */}
          <div className="text-amber-200 text-sm text-center md:text-left">
            <p>
              © {currentYear} <span className="font-semibold text-amber-100">Cricket Sphere</span>. All rights reserved.
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-amber-200">
            <Link to="/pages/contact" className="hover:text-yellow-400 transition-colors no-underline">
              Contact Us
            </Link>
            <span className="text-amber-700">•</span>
            <Link to="/pages/about" className="hover:text-yellow-400 transition-colors no-underline">
              About Us
            </Link>
            <span className="text-amber-700">•</span>
            <Link to="/pages/faq" className="hover:text-yellow-400 transition-colors no-underline">
              FAQ
            </Link>
            <span className="text-amber-700">•</span>
            <Link to="/pages/support" className="hover:text-yellow-400 transition-colors no-underline">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
