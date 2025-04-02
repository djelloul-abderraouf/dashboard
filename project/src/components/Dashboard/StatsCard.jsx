import React from 'react';
import { MapPin, Zap } from 'lucide-react';

const StatsCard = ({ title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-1">
        {title === 'TOTAL DEALS' ? <Zap className="text-cyan-400" /> : <MapPin className="text-cyan-400" />}
        <h3 className="text-gray-500 uppercase text-sm">{title}</h3>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default StatsCard;