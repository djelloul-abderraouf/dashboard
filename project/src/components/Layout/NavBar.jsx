import React, { useState, useEffect } from 'react';
import { Bell, User, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUsingUploadedFile, setIsUsingUploadedFile] = useState(false);

  // Check if we're using an uploaded file when component mounts
  useEffect(() => {
    checkDatasetStatus();
  }, []);

  // Function to check which dataset is active
  const checkDatasetStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dataset-status');
      if (response.ok) {
        const data = await response.json();
        setIsUsingUploadedFile(data.isUploaded);
      }
    } catch (error) {
      console.error('Error checking dataset status:', error);
    }
  };

  // Function to trigger dataset change event
  const triggerDatasetChanged = () => {
    const event = new CustomEvent('datasetChanged');
    window.dispatchEvent(event);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setUploadStatus('Uploading...');
     
      // Create a FormData object to send the file in a POST request
      const formData = new FormData();
      formData.append('file', uploadedFile);
     
      // Send the file to the server using the dashboard upload endpoint
      try {
        const response = await fetch('http://localhost:3001/upload/dashboard', {
          method: 'POST',
          body: formData,
        });
       
        if (response.ok) {
          const data = await response.json();
          setUploadStatus('File uploaded successfully!');
          setIsUsingUploadedFile(true);
          
          // Trigger data refresh to update the dashboard
          await fetchDataRefresh();
          
          // Dispatch custom event to notify Dashboard component
          triggerDatasetChanged();
         
          // Clear status after 3 seconds
          setTimeout(() => setUploadStatus(''), 3000);
        } else {
          setUploadStatus('Error uploading file');
          console.error('Error uploading file');
        }
      } catch (error) {
        setUploadStatus('Upload failed');
        console.error('Upload failed:', error);
      }
    }
  };

  // Trigger data refresh after upload
  const fetchDataRefresh = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/refresh-data', {
        method: 'POST',
      });

      if (response.ok) {
        console.log('Data refreshed successfully');
        // Optionally, refetch the dataset here if needed
      } else {
        console.error('Error refreshing data');
      }
    } catch (error) {
      console.error('Data refresh failed:', error);
    }
  };

  // Handle reset to default dataset
  const handleReset = async () => {
    try {
      // Delete the uploaded dataset file and refresh data
      const response = await fetch('http://localhost:3001/api/reset-dataset', {
        method: 'POST',
      });

      if (response.ok) {
        setUploadStatus('Reset to default dataset!');
        setIsUsingUploadedFile(false);
        
        // Trigger data refresh to update the dashboard
        await fetchDataRefresh();
        
        // Dispatch custom event to notify Dashboard component
        triggerDatasetChanged();
         
        // Clear status after 3 seconds
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('Error resetting dataset');
        console.error('Error resetting dataset');
      }
    } catch (error) {
      setUploadStatus('Reset failed');
      console.error('Reset failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl">Home</div>
          <div className="text-gray-400 text-sm hidden md:flex items-center gap-2">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Home</span>
          </div>
        </div>
       
        <div className="flex items-center gap-4">
          {/* File Upload Button */}
          <div className="relative hidden md:flex items-center gap-2">
            <label htmlFor="file-upload" className="cursor-pointer py-2 px-4 bg-cyan-400 text-white rounded-lg">
              Upload File
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            {/* Reset Button - Only show when using uploaded file */}
            {isUsingUploadedFile && (
              <button
                onClick={handleReset}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1"
                title="Reset to default dataset"
              >
                <RefreshCcw size={16} />
                Reset
              </button>
            )}
          </div>
         
          {uploadStatus && (
            <span className="text-sm whitespace-nowrap ml-2">
              {uploadStatus}
            </span>
          )}
         
          <button className="relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>
         
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <User size={20} className="text-gray-600" />
            </button>
            <UserDropdown isOpen={isUserDropdownOpen} />
          </div>
        </div>
      </div>
    </nav>
  ); 
}; 

export default Navbar;