import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#2A3042] text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-xl font-semibold">Datta Able</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/documentation" className="hover:text-cyan-400">Documentation</Link>
            <Link to="/components" className="hover:text-cyan-400">Components</Link>
            <Link to="/dashboard" className="bg-cyan-400 text-white px-4 py-2 rounded hover:bg-cyan-500">
              Live Preview
            </Link>
            <Link to="#" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
              Purchase Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Explore One of the{' '}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
              Featured Dashboard
            </span>
          </h1>
          <h2 className="text-4xl font-bold mb-8">Template in Codedthemes</h2>
          <p className="text-gray-400 text-lg mb-12">
            Datta able is the one of the featured admin dashboard template in Envato Marketplace and used by over 2.5K+ Customers wordwide.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              Explore Components
            </button>
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-cyan-400 rounded-lg hover:bg-cyan-500 transition-colors"
            >
              Live Preview
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="container mx-auto px-6 pb-20">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          alt="Dashboard Preview"
          className="rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Landing;