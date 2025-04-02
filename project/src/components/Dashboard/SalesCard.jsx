import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const SalesCard = ({ title, amount, percentage, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 mb-2">{title}</h3>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold">${amount}</span>
        <span className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {percentage}%
        </span>
      </div>
      <div className="mt-4 h-1 bg-gray-200 rounded">
        <div 
          className={`h-full rounded ${trend === 'up' ? 'bg-cyan-400' : 'bg-purple-400'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SalesCard;