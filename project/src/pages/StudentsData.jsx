import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

const StudentsData = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGpaFilter, setShowGpaFilter] = useState(false);
  const [gpaFilter, setGpaFilter] = useState('');
  const [filterOperation, setFilterOperation] = useState('equal'); // 'equal', 'above', 'below'
  const studentsPerPage = 10;
  const modalRef = useRef();
  const filterRef = useRef();

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
    let filtered = students.filter((student) => {
      // Text search filter - removed GPA from search criteria
      return (
        student.StudentID.toLowerCase().includes(term) ||
        student.Age.toString().includes(term) ||
        (student.Gender === '1' ? 'homme' : 'femme').includes(term) ||
        (`classe ${parseInt(student.GradeClass) + 1}`).includes(term)
      );
    });

    // Apply GPA filter separately if it exists
    if (gpaFilter !== '') {
      const gpaValue = Number(gpaFilter); // Convert to number
      if (!isNaN(gpaValue)) {
        filtered = filtered.filter((student) => {
          const studentGpa = Number(student.GPA); // Ensure consistent data type
          switch (filterOperation) {
            case 'above':
              return studentGpa >= gpaValue;
            case 'below':
              return studentGpa <= gpaValue;
            case 'equal':
            default:
              // Use a small tolerance for floating-point comparison
              const tolerance = 0.001;
              return Math.abs(studentGpa - gpaValue) < tolerance;
          }
        });
      }
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students, gpaFilter, filterOperation]);

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
      const updatedStudents = students.map((student) =>
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
      [field]: e.target.value,
    });
  };

  const clearGpaFilter = () => {
    setGpaFilter('');
    setFilterOperation('equal');
  };

  // Close the modal when clicking outside
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

  // Close the filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowGpaFilter(false);
      }
    };
    if (showGpaFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGpaFilter]);

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Check if GPA filter is active
  const isGpaFilterActive = gpaFilter !== '';

  // Get filter operation text for display
  const getFilterOperationText = () => {
    switch (filterOperation) {
      case 'above':
        return '≥';
      case 'below':
        return '≤';
      case 'equal':
      default:
        return '=';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Données des Étudiants</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des étudiants..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 w-64"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                      <div className="flex items-center">
                        GPA
                        <div className="relative ml-2" ref={filterRef}>
                          <button
                            onClick={() => setShowGpaFilter(!showGpaFilter)}
                            className={`p-1 rounded-full hover:bg-gray-200 ${
                              isGpaFilterActive ? 'bg-cyan-100 text-cyan-600' : ''
                            }`}
                          >
                            <Filter size={16} />
                          </button>
                          {/* GPA Filter Dropdown */}
                          {showGpaFilter && (
                            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-10 w-64 border border-gray-200">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-gray-700">Filtrer par GPA</h3>
                                {isGpaFilterActive && (
                                  <button
                                    onClick={clearGpaFilter}
                                    className="text-xs text-red-500 hover:text-red-700 flex items-center"
                                  >
                                    <X size={14} className="mr-1" />
                                    Réinitialiser
                                  </button>
                                )}
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <select
                                    value={filterOperation}
                                    onChange={(e) => setFilterOperation(e.target.value)}
                                    className="p-2 text-sm border rounded"
                                  >
                                    <option value="equal">Égal à</option>
                                    <option value="above">Supérieur ou égal à</option>
                                    <option value="below">Inférieur ou égal à</option>
                                  </select>
                                  <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Valeur GPA"
                                    value={gpaFilter}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '' || !isNaN(Number(value))) {
                                        setGpaFilter(value);
                                      }
                                    }}
                                    className="w-full p-2 text-sm border rounded text-base"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.map((student) => (
                    <tr key={student.StudentID} className="hover:bg-gray-50">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* No results message */}
            {filteredStudents.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                Aucun étudiant ne correspond aux critères de recherche
              </div>
            )}
            {filteredStudents.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Affichage de {indexOfFirstStudent + 1} à{' '}
                  {Math.min(indexOfLastStudent, filteredStudents.length)} sur {filteredStudents.length} entrées
                  {isGpaFilterActive && (
                    <span className="ml-2">
                      (GPA {getFilterOperationText()} {gpaFilter})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="px-4 py-2 rounded-lg bg-gray-100">
                    {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Modale d'édition */}
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
                  className="mt-1 block w-full border rounded px-3 py-2 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <select
                  value={editingStudent.Gender}
                  onChange={(e) => handleChange(e, 'Gender')}
                  className="mt-1 block w-full border rounded px-3 py-2 text-base"
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
                  className="mt-1 block w-full border rounded px-3 py-2 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Classe</label>
                <input
                  type="number"
                  value={editingStudent.GradeClass}
                  onChange={(e) => handleChange(e, 'GradeClass')}
                  className="mt-1 block w-full border rounded px-3 py-2 text-base"
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