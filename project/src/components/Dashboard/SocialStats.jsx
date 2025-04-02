import React from 'react';
import { Facebook, Twitter } from 'lucide-react';

const SocialStats = ({ platform, likes, target, duration }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="text-blue-600" />;
      case 'twitter':
        return <Twitter className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        {getIcon()}
        <div>
          <div className="text-2xl font-bold">{likes.toLocaleString()}</div>
          <div className="text-gray-500">Total Likes</div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Target</span>
            <span>{target.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${(likes/target) * 100}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Duration</span>
            <span>{duration}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-purple-400 rounded-full" 
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialStats;