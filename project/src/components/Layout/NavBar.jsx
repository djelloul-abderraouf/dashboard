import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl">Home</div>
          <div className="text-gray-400 text-sm hidden md:flex items-center gap-2">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Home</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-cyan-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <button className="relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <User size={20} className="text-gray-600" />
            </button>
            <UserDropdown isOpen={isUserDropdownOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;