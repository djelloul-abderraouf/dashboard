import React from 'react';

const RecentUsers = () => {
  const users = [
    {
      name: 'Isabella Christensen',
      description: 'Lorem ipsum is simply dummy',
      time: '11 MAY 12:55',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Mathilde Andersen',
      description: 'Lorem ipsum is simply',
      time: '11 MAY 10:35',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Karla Sorensen',
      description: 'Lorem ipsum is simply dummy',
      time: '9 MAY 17:38',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex items-center gap-4">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-gray-500 text-sm">{user.description}</p>
            </div>
            <div className="text-gray-500 text-sm">{user.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;