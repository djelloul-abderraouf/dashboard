import React from 'react';
import SalesCard from '../components/Dashboard/SalesCard';
import StatsCard from '../components/Dashboard/StatsCard';
import WorldMap from '../components/Dashboard/WorldMap';
import SocialStats from '../components/Dashboard/SocialStats';
import RatingChart from '../components/Dashboard/RatingChart';
import RecentUsers from '../components/Dashboard/RecentUsers';
import { PieChart, Pie, LineChart, ScatterChart,Cell, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Layout/NavBar';

import { useEffect, useState } from 'react';


const renderCustomizedLabel = ({ percent }) => {
  return `${(percent * 100).toFixed(1)}%`;
};




const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];



const Dashboard = () => {


  //le nombre d'etudiant qui font du sport
  const [sportCount, setSportCount] = useState(0);
  useEffect(() => {
    fetch('http://localhost:3001/api/sport-count')
      .then(res => res.json())
      .then(data => {
        setSportCount(data.sportCount);
      })
      .catch(err => console.error('Erreur lors de la récupération des données sportives :', err));
  }, []);


  //le nombre d'etudiants qui font de la musique

  const [musicCount, setMusicCount] = useState(0);
  useEffect(() => {
    fetch('http://localhost:3001/api/music-count')
      .then(res => res.json())
      .then(data => {
        setMusicCount(data.musicCount);
      })
      .catch(err => console.error('Erreur API music-count :', err));
  }, []);

  //le nombre detudiants qui font du benevolat
  const [volunteeringCount, setVolunteeringCount] = useState(0);
  useEffect(() => {
    fetch('http://localhost:3001/api/volunteering-count')
      .then(res => res.json())
      .then(data => {
        setVolunteeringCount(data.volunteeringCount);
      })
      .catch(err => console.error('Erreur API volunteering-count :', err));
  }, []);

  //graphe gpa et gradclass
  const [gpaByClass, setGpaByClass] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/average-gpa-by-class')
      .then(res => res.json())
      .then(data => {
        setGpaByClass(data);
      })
      .catch(err => console.error('Erreur GPA/GradeClass :', err));
  }, []);


  // le nombre de fille et de garcon
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
  useEffect(() => {
    fetch('http://localhost:3001/api/gender-distribution')
      .then(res => res.json())
      .then(data => {
        setGenderStats(data);
      })
      .catch(err => console.error('Erreur API gender-distribution:', err));
  }, []);


  //nuage de point temps d'etude et gpa
  const [studyData, setStudyData] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/study-vs-gpa')
      .then(res => res.json())
      .then(data => setStudyData(data))
      .catch(err => console.error('Erreur API study-vs-gpa:', err));
  }, []);


  //piechart des activities
  const [activityData, setActivityData] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/activities-distribution')
      .then(res => res.json())
      .then(data => setActivityData(data))
      .catch(err => console.error('Erreur API activités :', err));
  }, []);
// piechart taux d'absence par classe
const [absenceData, setAbsenceData] = useState([]);
useEffect(() => {
  fetch('http://localhost:3001/api/absences-by-class')
    .then(res => res.json())
    .then(data => setAbsenceData(data))
    .catch(err => console.error('Erreur API absences :', err));
}, []);

//piechart taux de temps d'etude par classe
const [studyTimeData, setStudyTimeData] = useState([]);
useEffect(() => {
  fetch('http://localhost:3001/api/studytime-by-class')
    .then(res => res.json())
    .then(data => setStudyTimeData(data))
    .catch(err => console.error('Erreur API studytime:', err));
}, []);

//piechart moyenne d'age par classe
const [averageAgeData, setAverageAgeData] = useState([]);
useEffect(() => {
  fetch('http://localhost:3001/api/average-age-by-class')
    .then(res => res.json())
    .then(data => setAverageAgeData(data))
    .catch(err => console.error('Erreur API moyenne d\'âge:', err));
}, []);

//piechart moyenne gpa par classe
const [gpaByClassData, setGpaByClassData] = useState([]);
useEffect(() => {
  fetch('http://localhost:3001/api/average-gpa-by-class')
    .then(res => res.json())
    .then(data => setGpaByClassData(data))
    .catch(err => console.error("Erreur API GPA :", err));
}, []);









  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SalesCard
            title="Étudiants sportifs"
            amount={sportCount.toString()}
            percentage={20}
            trend="up"
          />

          <SalesCard
            title="Étudiants musiciens"
            amount={musicCount.toString()}
            percentage={45}
            trend="up"
          />

          <SalesCard
            title="Étudiants bénévoles"
            amount={volunteeringCount.toString()}
            percentage={52}
            trend="up"
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-semibold mb-4">Corrélation : Temps d’étude vs GPA</h2>
              <div className="h-[470px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="studyTime"
                      name="Temps d'étude (h/semaine)"
                      label={{ value: 'Temps d’étude', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="gpa"
                      name="GPA"
                      label={{ value: 'GPA', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Étudiants" data={studyData} fill="#06b6d4" />
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
                      data={activityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#06b6d4"
                      label={renderCustomizedLabel} // 🎯 ici
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>


            </div>



            <StatsCard
              title="Garçons"
              value={genderStats.male.toString()}
              description="Étudiants de genre masculin"
            />
            <StatsCard
              title="Filles"
              value={genderStats.female.toString()}
              description="Étudiantes de genre féminin"
            />

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
  <h2 className="text-md font-semibold mb-4 text-center">Absences par classe</h2>
  <div className="h-[200px]"> {/* 🟢 Hauteur augmentée */}
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={Array.isArray(absenceData) ? absenceData : []}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80} // 🟢 Plus grand rayon
          fill="#06b6d4"
          
        >
          {absenceData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                ['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][
                  index % 5
                ]
              }
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>



<div className="bg-white p-6 rounded-lg shadow-md h-full">
  <h2 className="text-md font-semibold mb-4 text-center">Heures d’étude par classe</h2>
  <div className="h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={Array.isArray(studyTimeData) ? studyTimeData : []}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#06b6d4"
          
        >
          {studyTimeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                ['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][
                  index % 5
                ]
              }
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

          
          
<div className="bg-white p-6 rounded-lg shadow-md h-full">
  <h2 className="text-md font-semibold mb-4 text-center">Âge moyen par classe</h2>
  <div className="h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={averageAgeData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#06b6d4"
          
        >
          {averageAgeData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                ['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][
                  index % 5
                ]
              }
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="bg-white p-6 rounded-lg shadow-md h-full">
  <h2 className="text-md font-semibold mb-4 text-center">GPA moyen par classe</h2>
  <div className="h-[200px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={gpaByClassData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#06b6d4"
          
        >
          {gpaByClassData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                ['#99f6e4', '#2dd4bf', '#06b6d4', '#0e7490', '#164e63'][
                  index % 5
                ]
              }
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RatingChart />
          <RecentUsers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;