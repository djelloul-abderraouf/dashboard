import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Users, BarChart2, Bitcoin, Folder, LogIn, TrendingUp, UserPlus , Database} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-[#2A3042] text-white f-screen p-4 shadow-black">
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
        <Link to="/ecommerce" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <ShoppingCart size={20} />
          <span>E-Commerce</span>
        </Link>
        <Link to="/students" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Database size={20} />
          <span>Students Data</span>
        </Link>
        <Link to="/crm" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Users size={20} />
          <span>CRM</span>
        </Link>
        <Link to="/analytics" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <BarChart2 size={20} />
          <span>Analytics</span>
        </Link>
        <Link to="/crypto" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Bitcoin size={20} />
          <span>Crypto</span>
        </Link>
        <Link to="/projects" className="flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded">
          <Folder size={20} />
          <span>Projects</span>
        </Link>

        <div className="text-gray-400 text-sm mt-4 mb-2">ACCOUNT</div>
        <button 
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded"
        >
          <LogIn size={20} />
          <span>Login</span>
        </button>
        <button 
          onClick={() => navigate('/register')}
          className="w-full flex items-center gap-3 p-2 hover:bg-[#333B4E] rounded"
        >
          <UserPlus size={20} />
          <span>Register</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;