import React from 'react';

const WorldMap = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Users From United States</h2>
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?auto=format&fit=crop&w=1200&q=80"
          alt="World Map"
          className="w-full h-[431px] object-cover rounded-lg opacity-25"
        />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-cyan-400 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-400 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-cyan-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default WorldMap;