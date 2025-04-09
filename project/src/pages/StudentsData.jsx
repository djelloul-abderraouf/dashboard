import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const StudentsData = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentsPerPage = 10;
  const modalRef = useRef();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/data');
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
  
    const filtered = students.filter((student) => {
      return (
        student.StudentID.toLowerCase().includes(term) ||
        student.Age.toString().includes(term) ||
        (student.Gender === '1' ? 'homme' : 'femme').includes(term) ||
        student.GPA.toString().includes(term) ||
        (`classe ${parseInt(student.GradeClass) + 1}`).includes(term)
      );
    });
  
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);
  

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/data/${editingStudent.StudentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStudent),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      const updatedStudents = students.map(student =>
        student.StudentID === editingStudent.StudentID ? editingStudent : student
      );
      setStudents(updatedStudents);
      setEditingStudent(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setEditingStudent(null);
  };

  const handleChange = (e, field) => {
    setEditingStudent({
      ...editingStudent,
      [field]: e.target.value
    });
  };

  // ✨ Fermer la modale en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setEditingStudent(null);
      }
    };
    if (editingStudent) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingStudent]);

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Données des Étudiants</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des étudiants..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.map((student) => (
                    <tr key={student.StudentID}>
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{student.StudentID}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.Age}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.Gender === '1' ? 'Homme' : 'Femme'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.GPA}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{parseInt(student.GradeClass) + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-white bg-cyan-400 px-3 py-1 rounded hover:bg-cyan-500"
                          >
                            Modifier
                          </button>
                        </td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Affichage de {indexOfFirstStudent + 1} à {Math.min(indexOfLastStudent, filteredStudents.length)} sur {filteredStudents.length} entrées
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 rounded-lg bg-gray-100">
                  {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🌟 Modale d'édition */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modifier l'étudiant {editingStudent.StudentID}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Âge</label>
                <input
                  type="number"
                  value={editingStudent.Age}
                  onChange={(e) => handleChange(e, 'Age')}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <select
                  value={editingStudent.Gender}
                  onChange={(e) => handleChange(e, 'Gender')}
                  className="mt-1 block w-full border rounded px-3 py-2"
                >
                  <option value="1">Homme</option>
                  <option value="0">Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingStudent.GPA}
                  onChange={(e) => handleChange(e, 'GPA')}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Classe</label>
                <input
                  type="number"
                  value={editingStudent.GradeClass}
                  onChange={(e) => handleChange(e, 'GradeClass')}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
              >
                Enregistrer
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsData;
