import React from 'react';
import { Settings, Share2, Lock, LogOut } from 'lucide-react';

const UserDropdown = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">Carson Darrin</div>
            <div className="text-sm text-gray-500">carson.darrin@company.io</div>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
          <Settings size={18} className="text-gray-500" />
          <span>Settings</span>
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
          <Share2 size={18} className="text-gray-500" />
          <span>Share</span>
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
          <Lock size={18} className="text-gray-500" />
          <span>Change Password</span>
        </button>
      </div>
      
      <div className="border-t border-gray-100 py-2">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-500">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;