import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  LineChart,
  ScatterChart,
  Cell,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../components/Layout/NavBar';
import SalesCard from '../components/Dashboard/SalesCard';
import StatsCard from '../components/Dashboard/StatsCard';

const renderCustomizedLabel = ({ percent }) => {
  return `${(percent * 100).toFixed(1)}%`;
};

const Dashboard = () => {
  // State to store all dashboard data
  const [data, setData] = useState({
    sportCount: 0,
    musicCount: 0,
    volunteeringCount: 0,
    genderStats: { male: 0, female: 0 },
    studyData: [],
    activityData: [],
    absenceData: [],
    studyTimeData: [],
    averageAgeData: [],
    gpaByClassData: [],
  });

  // State to track loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      if (loading) {
        // Initial load
        setLoading(true);
      } else {
        // Subsequent refreshes
        setRefreshing(true);
      }
      setError('');

      // Fetch all data in parallel
      const [
        sportCountRes,
        musicCountRes,
        volunteeringCountRes,
        genderStatsRes,
        studyDataRes,
        activityDataRes,
        absenceDataRes,
        studyTimeDataRes,
        averageAgeDataRes,
        gpaByClassDataRes,
      ] = await Promise.all([
        fetch('http://localhost:3001/api/sport-count').then((res) => res.json()),
        fetch('http://localhost:3001/api/music-count').then((res) => res.json()),
        fetch('http://localhost:3001/api/volunteering-count').then((res) => res.json()),
        fetch('http://localhost:3001/api/gender-distribution').then((res) => res.json()),
        fetch('http://localhost:3001/api/study-vs-gpa').then((res) => res.json()),
        fetch('http://localhost:3001/api/activities-distribution').then((res) => res.json()),
        fetch('http://localhost:3001/api/absences-by-class').then((res) => res.json()),
        fetch('http://localhost:3001/api/studytime-by-class').then((res) => res.json()),
        fetch('http://localhost:3001/api/average-age-by-class').then((res) => res.json()),
        fetch('http://localhost:3001/api/average-gpa-by-class').then((res) => res.json()),
      ]);

      // Update state with fetched data
      setData({
        sportCount: sportCountRes.sportCount,
        musicCount: musicCountRes.musicCount,
        volunteeringCount: volunteeringCountRes.volunteeringCount,
        genderStats: genderStatsRes,
        studyData: studyDataRes,
        activityData: activityDataRes,
        absenceData: absenceDataRes,
        studyTimeData: studyTimeDataRes,
        averageAgeData: averageAgeDataRes,
        gpaByClassData: gpaByClassDataRes,
      });
      
      console.log('Dashboard data refreshed successfully');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Listen for dataset changes via custom event from NavBar
  useEffect(() => {
    const handleDatasetChanged = () => {
      console.log('Dataset changed event received, refreshing data...');
      fetchData();
    };
    
    window.addEventListener('datasetChanged', handleDatasetChanged);
    
    // Clean up
    return () => {
      window.removeEventListener('datasetChanged', handleDatasetChanged);
    };
  }, []);

  // Poll for dataset changes as a backup
  useEffect(() => {
    let previousDataset = null;
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dataset-status');
        const data = await response.json();
        const activeDataset = data.activeDataset;
        
        // Only re-fetch if the dataset changed
        if (previousDataset !== null && previousDataset !== activeDataset) {
          console.log('Dataset changed detected via polling, refreshing data...');
          fetchData();
        }
        
        previousDataset = activeDataset;
      } catch (err) {
        console.error('Error checking dataset status:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
      {refreshing && (
        <div className="fixed top-4 right-4 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-lg shadow z-50">
          Refreshing data...
        </div>
      )}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SalesCard
            title="Étudiants sportifs"
            amount={data.sportCount.toString()}
            percentage={20}
            trend="up"
          />
          <SalesCard
            title="Étudiants musiciens"
            amount={data.musicCount.toString()}
            percentage={45}
            trend="up"
          />
          <SalesCard
            title="Étudiants bénévoles"
            amount={data.volunteeringCount.toString()}
            percentage={52}
            trend="up"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-semibold mb-4">Corrélation : Temps d'étude vs GPA</h2>
              <div className="h-[470px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="studyTime"
                      name="Temps d'étude (h/semaine)"
                      label={{ value: 'Temps détude', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="gpa"
                      name="GPA"
                      label={{ value: 'GPA', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Étudiants" data={data.studyData} fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Répartition des activités</h2>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.activityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#06b6d4"
                      label={renderCustomizedLabel}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <StatsCard
              title="Garçons"
              value={data.genderStats.male.toString()}
              description="Étudiants de genre masculin"
            />
            <StatsCard
              title="Filles"
              value={data.genderStats.female.toString()}
              description="Étudiantes de genre féminin"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Absences par classe */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-md font-semibold mb-4 text-center">Absences par classe</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.absenceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#06b6d4"
                  >
                    {data.absenceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Heures d'étude par classe */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-md font-semibold mb-4 text-center">Heures d'étude par classe</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.studyTimeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#06b6d4"
                  >
                    {data.studyTimeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Âge moyen par classe */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-md font-semibold mb-4 text-center">Âge moyen par classe</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.averageAgeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#06b6d4"
                  >
                    {data.averageAgeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* GPA moyen par classe */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-md font-semibold mb-4 text-center">GPA moyen par classe</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.gpaByClassData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#06b6d4"
                  >
                    {data.gpaByClassData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;