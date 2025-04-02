import React from 'react';
import SalesCard from '../components/Dashboard/SalesCard';
import StatsCard from '../components/Dashboard/StatsCard';
import WorldMap from '../components/Dashboard/WorldMap';
import SocialStats from '../components/Dashboard/SocialStats';
import RatingChart from '../components/Dashboard/RatingChart';
import RecentUsers from '../components/Dashboard/RecentUsers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SalesCard title="Daily Sales" amount="249.95" percentage={67} trend="up" />
        <SalesCard title="Monthly Sales" amount="2,942.32" percentage={36} trend="down" />
        <SalesCard title="Yearly Sales" amount="8,638.32" percentage={80} trend="up" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <WorldMap />
        </div>
        <div className="space-y-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
          <StatsCard 
            title="TOTAL DEALS"
            value="235"
            description="TOTAL DEALS"
          />
          <StatsCard 
            title="TOTAL LOCATIONS"
            value="26"
            description="TOTAL LOCATIONS"
          />
          
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SocialStats 
          platform="facebook"
          likes={12281}
          target={25098}
          duration="3,539"
        />
        <SocialStats 
          platform="twitter"
          likes={11200}
          target={24185}
          duration="4,567"
        />
        <SocialStats 
          platform="google"
          likes={11200}
          target={24185}
          duration="4,567"
        />
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingChart />
        <RecentUsers />
      </div>
    </div>
  );
};

export default Dashboard;