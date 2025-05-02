import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, Users, BarChart2, Bitcoin, Folder, TrendingUp, Database } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react'; // ✅ import Clerk UserButton

const Sidebar = () => {
  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-[#2A3042] text-white p-4 shadow-black flex flex-col justify-between">

      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-xl font-semibold">Datta Able</span>
        </div>

        <div className="space-y-2">
          <div className="text-gray-400 text-sm mb-2">NAVIGATION</div>
          <Link to="/dashboard" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <div className="text-gray-400 text-sm mt-4 mb-2">FEATURES</div>
          {/* <Link to="/ecommerce" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <ShoppingCart size={20} />
            <span>E-Commerce</span>
          </Link> */}
          <Link to="/students" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <Database size={20} />
            <span>Students Data</span>
          </Link>
          {/* <Link to="/crm" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <Users size={20} />
            <span>CRM</span>
          </Link> */}
          <Link to="/predictions" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <BarChart2 size={20} />
            <span>Predictions</span>
          </Link>
          {/* <Link to="/crypto" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <Bitcoin size={20} />
            <span>Crypto</span>
          </Link> */}
          {/* <Link to="/projects" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
            <Folder size={20} />
            <span>Projects</span>
          </Link> */}
        </div>
      </div>

      {/* ✅ Zone Clerk UserButton en bas */}
      
    </div>
  );
};

export default Sidebar;
