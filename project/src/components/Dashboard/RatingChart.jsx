import React from 'react';
import { Star } from 'lucide-react';

const RatingChart = () => {
  const ratings = [
    { stars: 5, count: 384 },
    { stars: 4, count: 145 },
    { stars: 3, count: 24 },
    { stars: 2, count: 1 },
    { stars: 1, count: 0 }
  ];

  const maxCount = Math.max(...ratings.map(r => r.count));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl font-bold">4.7</div>
        <Star className="text-yellow-400 fill-yellow-400" size={24} />
      </div>
      
      {ratings.map(({ stars, count }) => (
        <div key={stars} className="flex items-center gap-2 mb-2">
          <div className="w-4">{stars}</div>
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${(count/maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 text-right text-gray-500">{count}</div>
        </div>
      ))}
    </div>
  );
};

export default RatingChart;