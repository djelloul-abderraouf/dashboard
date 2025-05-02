import React, { useEffect, useState } from 'react';

const RecentUsers = () => {
  const [selectedClass, setSelectedClass] = useState(1);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/top-students/${selectedClass}`)
      .then((res) => res.json())
      .then((data) => setTopStudents(data))
      .catch((err) => console.error('Erreur API top étudiants :', err));
  }, [selectedClass]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Top 5 Étudiants</h2>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[1, 2, 3, 4, 5].map((cls) => (
            <option key={cls} value={cls}>
              Classe {cls}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {topStudents.map((student, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${student.name}`}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover bg-gray-100"
            />
            <div className="flex-1">
              <h3 className="font-medium">Étudiant {student.name}</h3>
              <p className="text-gray-500 text-sm">GPA : {student.gpa}</p>
            </div>
            <div className="text-gray-500 text-sm">{student.age} ans</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
