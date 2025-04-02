import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, Users, BarChart2, Bitcoin, Folder, LogIn, Radical, LucideRadical, LucideBook } from 'lucide-react';
import myImage from '../../assets/dashboard.png';
const Sidebar = () => {
  return (
    <div className="w-64 bg-[#2A3042] text-white f-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-cyan-400 rounded"></div>
        <span className="text-xl font-semibold">SKIKDIA</span>
        {/* <img className="text-xl font-semibold" src={myImage} alt="Description de l'image" /> */}
      </div>
      
      <div className="space-y-2">
        <div className="text-gray-400 text-sm mb-2">NAVIGATION</div>
        <Link to="/dashboard" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        
        <div className="text-gray-400 text-sm mt-4 mb-2">PAGES</div>
        <Link to="/login" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <LogIn size={20} />
          <span>LogIn</span>
        </Link>
        <Link to="/sign-up" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Users size={20} />
          <span>Sign Up</span>
        </Link>
        <div className="text-gray-400 text-sm mt-4 mb-2">OTHERS</div>
        <Link to="/statistics" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Radical size={20} />
          <span>Statistics</span>
        </Link>
        <Link to="/predictions" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <LucideRadical size={20} />
          <span>Predictions</span>
        </Link>
        <div className="text-gray-400 text-sm mt-4 mb-2">Documentations</div>
        <Link to="/documentation" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <LucideBook size={20} />
          <span>Documentations</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;