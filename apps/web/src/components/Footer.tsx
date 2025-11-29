import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-400 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <span className="text-2xl font-bold text-white tracking-tight">GigSafeHub</span>
        <p className="mt-4 max-w-xs text-sm">Empowering the gig economy with transparent financial data and safety tools.</p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Platform</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white">Reviews</a></li>
          <li><a href="#" className="hover:text-white">Comparisons</a></li>
          <li><a href="#" className="hover:text-white">Methodology</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Legal</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-xs text-center">
      &copy; 2024 GigSafeHub. All rights reserved. Demo Version.
    </div>
  </footer>
);

export default Footer;

