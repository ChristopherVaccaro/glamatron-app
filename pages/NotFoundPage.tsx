import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <span 
            className="text-8xl sm:text-9xl font-bold bg-gradient-to-br from-slate-300 to-slate-400 bg-clip-text text-transparent"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            404
          </span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search size={32} className="text-slate-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Home size={18} />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Brand */}
        <div className="mt-12">
          <span 
            className="text-lg tracking-wide text-slate-300" 
            style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}
          >
            GLAMATRON
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
