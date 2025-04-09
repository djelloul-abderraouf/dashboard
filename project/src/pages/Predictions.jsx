import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier CSV.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setLoading(true);
      setError(null);
     
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
     
      setResult(response.data);
    } catch (error) {
      console.error('Erreur lors du téléchargement :', error);
      setError("Une erreur s'est produite lors de l'envoi du fichier.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Fonction pour extraire les clés du résultat JSON
  const getResultKeys = () => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      return [];
    }
    return Object.keys(result[0]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Uploader un fichier CSV</h1>
        </div>

        <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="text-white bg-cyan-400 px-4 py-2 rounded hover:bg-cyan-500 flex items-center mr-4"
            >
              <Upload size={18} className="mr-2" />
              Choisir un fichier
            </button>
            {file && (
              <span className="text-gray-600">
                Fichier sélectionné: <span className="font-medium">{file.name}</span>
              </span>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full py-2 rounded font-medium flex justify-center items-center ${
              loading || !file
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-cyan-500 text-white hover:bg-cyan-600'
            }`}
          >
            {loading ? 'Chargement...' : 'Télécharger'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="overflow-hidden">
            <div className="flex items-center mb-4 bg-green-50 p-3 rounded-lg">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <p className="text-green-700 font-medium">Le fichier a été traité avec succès</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Informations sur le fichier</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">{file?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{file?.type || 'CSV'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Traité
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Résultats de la prédiction</h3>
              
              {Array.isArray(result) && result.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        {getResultKeys().map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.map((item, index) => (
                        <tr key={index}>
                          {getResultKeys().map((key) => (
                            <td key={`${index}-${key}`} className="px-6 py-4 whitespace-nowrap">
                              {typeof item[key] === 'object' ? JSON.stringify(item[key]) : String(item[key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    {Array.isArray(result) 
                      ? "Aucun résultat à afficher." 
                      : (
                        <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      )
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;