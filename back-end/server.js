const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');

// Configure multer for different destinations based on upload purpose
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./${destination}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      // For uploaded datasets in dashboard, always save as new_dataset.csv
      if (destination === 'uploadeddataset') {
        cb(null, 'new_dataset.csv'); // Changed from dataset.csv to new_dataset.csv
      } else {
        cb(null, file.originalname);
      }
    },
  });
};

// Create separate multer instances for different purposes
const predictionUpload = multer({ storage: createStorage('predictions') });
const dashboardUpload = multer({ storage: createStorage('uploadeddataset') });
const upload = multer({ storage: createStorage('uploadeddataset') }); // Definition moved up

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for React frontend
app.use(express.json());

// Original upload route - This is kept for compatibility with the prediction page
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Aucun fichier téléchargé' });
  }

  const filePath = path.join(__dirname, 'uploadeddataset', req.file.filename);

  // Send the file to Flask backend for prediction
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  axios
    .post('http://localhost:5001/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
    .then((response) => {
      res.json(response.data); // Send Flask's response back to the client
    })
    .catch((error) => {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi au backend Flask' });
    });
});

// Route for prediction page uploads - saves to 'predictions' folder and sends to Flask
app.post('/upload/prediction', predictionUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Aucun fichier téléchargé' });
  }

  const filePath = path.join(__dirname, 'predictions', req.file.filename);

  // Send the file to Flask backend for prediction
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  axios
    .post('http://localhost:5001/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
    .then((response) => {
      res.json(response.data); // Send Flask's response back to the client
    })
    .catch((error) => {
      console.error('Erreur:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi au backend Flask' });
    });
});

// Route for dashboard page uploads - saves to 'uploadeddataset' folder as new_dataset.csv
app.post('/upload/dashboard', dashboardUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Aucun fichier téléchargé' });
  }

  const filePath = path.join(__dirname, 'uploadeddataset', 'new_dataset.csv'); // Changed to new_dataset.csv
  
  // Return success response with file info
  res.json({ 
    message: 'Fichier téléchargé avec succès et défini comme dataset actif',
    filename: 'new_dataset.csv', // Changed to new_dataset.csv
    path: filePath
  });
});

// NEW ROUTE: Reset dataset - delete uploaded dataset and revert to default
app.post('/api/reset-dataset', (req, res) => {
  const uploadedDatasetPath = path.join(__dirname, 'uploadeddataset', 'new_dataset.csv'); // Changed to new_dataset.csv
  
  try {
    // Check if uploaded dataset exists
    if (fs.existsSync(uploadedDatasetPath)) {
      // Delete the uploaded dataset file
      fs.unlinkSync(uploadedDatasetPath);
      
      // Return success message
      res.json({ 
        success: true, 
        message: 'Dataset réinitialisé avec succès. Le dataset par défaut est maintenant utilisé.', 
        activeDataset: 'dataset.csv' 
      });
    } else {
      // If there's no uploaded dataset, just inform that default is already active
      res.json({ 
        success: true, 
        message: 'Aucun dataset personnalisé à supprimer. Le dataset par défaut est déjà utilisé.', 
        activeDataset: 'dataset.csv' 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du dataset:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la réinitialisation du dataset' 
    });
  }
});

// Get the active dataset path - prioritize uploaded dataset if it exists
function getActiveDatasetPath() {
  const uploadedDatasetPath = path.join(__dirname, 'uploadeddataset', 'new_dataset.csv'); // Changed to new_dataset.csv
  const defaultDatasetPath = path.join(__dirname, 'dataset.csv');
  
  if (fs.existsSync(uploadedDatasetPath)) {
    return uploadedDatasetPath;
  }
  
  return defaultDatasetPath;
}

// Route API to read all CSV data (always uses the active dataset)
app.get('/api/data', (req, res) => {
  const datasetPath = getActiveDatasetPath();
  const results = [];
  
  fs.createReadStream(datasetPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Erreur CSV:', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

// Route PUT to modify CSV data (always modifies the active dataset)
app.put('/api/data/:studentId', (req, res) => {
  const { studentId } = req.params;
  const updatedData = req.body;
  const datasetPath = getActiveDatasetPath();
  const results = [];
  
  fs.createReadStream(datasetPath)
    .pipe(csv())
    .on('data', (data) => {
      if (data.StudentID === studentId) {
        results.push({ ...data, ...updatedData });
      } else {
        results.push(data);
      }
    })
    .on('end', () => {
      const headers = Object.keys(results[0]);
      const csvContent = [
        headers.join(','),
        ...results.map((row) => headers.map((h) => row[h]).join(',')),
      ].join('\n');
      
      fs.writeFile(datasetPath, csvContent, 'utf8', (err) => {
        if (err) {
          console.error('Erreur lors de l\'écriture du CSV :', err);
          return res.status(500).json({ error: 'Erreur de sauvegarde des données' });
        }
        res.json({ message: 'Données mises à jour dans le fichier CSV' });
      });
    })
    .on('error', (err) => {
      console.error('Erreur lecture CSV :', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier CSV' });
    });
});

// Update the Dataset Status API to include the last modified time
app.get('/api/dataset-status', (req, res) => {
  const uploadedDatasetPath = path.join(__dirname, 'uploadeddataset', 'new_dataset.csv'); // Changed to new_dataset.csv
  const defaultDatasetPath = path.join(__dirname, 'dataset.csv');
  
  const isUploaded = fs.existsSync(uploadedDatasetPath);
  const activeDataset = isUploaded ? uploadedDatasetPath : defaultDatasetPath;
  
  res.json({
    activeDataset: path.basename(activeDataset),
    isUploaded: isUploaded,
    lastModified: fs.statSync(activeDataset).mtime,
    path: activeDataset
  });
});

// All statistical routes now use the active dataset automatically
app.get('/api/sport-count', (req, res) => {
  let count = 0;
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      if (row['Sports'] && row['Sports'].trim() === '1') {
        count++;
      }
    })
    .on('end', () => {
      res.json({ sportCount: count });
    })
    .on('error', (err) => {
      console.error('Erreur CSV:', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

app.get('/api/music-count', (req, res) => {
  let count = 0;
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      if (row['Music'] && row['Music'].trim() === '1') {
        count++;
      }
    })
    .on('end', () => {
      res.json({ musicCount: count });
    })
    .on('error', (err) => {
      console.error('Erreur CSV (music):', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

app.get('/api/volunteering-count', (req, res) => {
  let count = 0;
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      if (row['Volunteering'] && row['Volunteering'].trim() === '1') {
        count++;
      }
    })
    .on('end', () => {
      res.json({ volunteeringCount: count });
    })
    .on('error', (err) => {
      console.error('Erreur CSV (volunteering):', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

app.get('/api/activities-distribution', (req, res) => {
  let sports = 0;
  let music = 0;
  let volunteering = 0;
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      if (row['Sports']?.trim() === '1') sports++;
      if (row['Music']?.trim() === '1') music++;
      if (row['Volunteering']?.trim() === '1') volunteering++;
    })
    .on('end', () => {
      res.json([
        { name: 'Sport', value: sports },
        { name: 'Musique', value: music },
        { name: 'Bénévolat', value: volunteering },
      ]);
    })
    .on('error', (err) => {
      console.error('Erreur lecture activités:', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

app.get('/api/gender-distribution', (req, res) => {
  let maleCount = 0;
  let femaleCount = 0;
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      const gender = row['Gender']?.trim();
      if (gender === '1') {
        maleCount++;
      } else if (gender === '0') {
        femaleCount++;
      }
    })
    .on('end', () => {
      res.json({
        male: maleCount,
        female: femaleCount,
      });
    })
    .on('error', (err) => {
      console.error('Erreur lecture Gender:', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier CSV' });
    });
});

app.get('/api/average-age-by-class', (req, res) => {
  const ageByClass = {};
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      const rawClass = row['GradeClass'];
      const age = parseFloat(row['Age']);
      if (!isNaN(rawClass) && !isNaN(age)) {
        const classKey = `Classe ${parseInt(rawClass) + 1}`;
        if (!ageByClass[classKey]) {
          ageByClass[classKey] = { total: 0, count: 0 };
        }
        ageByClass[classKey].total += age;
        ageByClass[classKey].count += 1;
      }
    })
    .on('end', () => {
      const result = Object.entries(ageByClass).map(([name, stats]) => ({
        name,
        value: +(stats.total / stats.count).toFixed(2),
      }));
      res.json(result);
    })
    .on('error', (err) => {
      console.error('Erreur CSV (âge par classe):', err);
      res.status(500).json({ error: 'Erreur lecture fichier CSV' });
    });
});

app.get('/api/study-vs-gpa', (req, res) => {
  const results = [];
  const maxRows = 100;
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      if (results.length >= maxRows) return;
      const study = parseFloat(row['StudyTimeWeekly']);
      const gpa = parseFloat(row['GPA']);
      if (!isNaN(study) && !isNaN(gpa)) {
        results.push({ studyTime: study, gpa: gpa });
      }
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Erreur lecture CSV (limite 100):', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier CSV' });
    });
});

app.get('/api/absences-by-class', (req, res) => {
  const classAbsences = {};
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      const gradeRaw = row['GradeClass'];
      const absences = parseInt(row['Absences']);
      if (!isNaN(gradeRaw) && !isNaN(absences)) {
        const grade = parseInt(gradeRaw) + 1;
        const gradeKey = `Classe ${grade}`;
        if (!classAbsences[gradeKey]) {
          classAbsences[gradeKey] = 0;
        }
        classAbsences[gradeKey] += absences;
      }
    })
    .on('end', () => {
      const result = Object.entries(classAbsences).map(([name, value]) => ({
        name,
        value,
      }));
      res.json(result);
    })
    .on('error', (err) => {
      console.error('Erreur CSV (absences par classe):', err);
      res.status(500).json({ error: 'Erreur lecture CSV' });
    });
});

app.get('/api/studytime-by-class', (req, res) => {
  const studyTimeByClass = {};
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      const classRaw = row['GradeClass'];
      const studyTime = parseFloat(row['StudyTimeWeekly']);
      if (!isNaN(classRaw) && !isNaN(studyTime)) {
        const classId = `Classe ${parseInt(classRaw) + 1}`;
        if (!studyTimeByClass[classId]) {
          studyTimeByClass[classId] = 0;
        }
        studyTimeByClass[classId] += studyTime;
      }
    })
    .on('end', () => {
      const result = Object.entries(studyTimeByClass).map(([name, value]) => ({
        name,
        value,
      }));
      res.json(result);
    })
    .on('error', (err) => {
      console.error('Erreur lecture StudyTime:', err);
      res.status(500).json({ error: 'Erreur lecture fichier CSV' });
    });
});

app.get('/api/average-gpa-by-class', (req, res) => {
  const classGpa = {};
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      const grade = parseInt(row['GradeClass']);
      const gpa = parseFloat(row['GPA']);
      if (!isNaN(grade) && !isNaN(gpa)) {
        const classKey = `Classe ${grade + 1}`;
        if (!classGpa[classKey]) {
          classGpa[classKey] = { total: 0, count: 0 };
        }
        classGpa[classKey].total += gpa;
        classGpa[classKey].count += 1;
      }
    })
    .on('end', () => {
      const result = Object.entries(classGpa).map(([name, stats]) => ({
        name,
        value: +(stats.total / stats.count).toFixed(2),
      }));
      res.json(result);
    })
    .on('error', (err) => {
      console.error('Erreur lecture GPA:', err);
      res.status(500).json({ error: 'Erreur lecture fichier CSV' });
    });
});

app.get('/api/top-students/:classId', (req, res) => {
  const classId = parseInt(req.params.classId) - 1;
  const students = [];
  fs.createReadStream(getActiveDatasetPath())
    .pipe(csv())
    .on('data', (row) => {
      const grade = parseInt(row['GradeClass']);
      const gpa = parseFloat(row['GPA']);
      if (!isNaN(grade) && grade === classId && !isNaN(gpa)) {
        students.push({
          name: row['StudentID'] || 'ID inconnu',
          gpa: gpa,
          age: row['Age'],
        });
      }
    })
    .on('end', () => {
      const topStudents = students
        .sort((a, b) => b.gpa - a.gpa)
        .slice(0, 5);
      res.json(topStudents);
    })
    .on('error', (err) => {
      console.error('Erreur lecture top étudiants:', err);
      res.status(500).json({ error: 'Erreur lecture CSV' });
    });
});
  //classement des etudiants par gpa et leurs claases
app.get('/api/top-students/:classId', (req, res) => {
    const classId = parseInt(getActiveDatasetPath()) - 1; // car dans CSV les classes sont 0-indexées
    const students = [];
  
    fs.createReadStream('dataset.csv')
      .pipe(csv())
      .on('data', (row) => {
        const grade = parseInt(row['GradeClass']);
        const gpa = parseFloat(row['GPA']);
  
        if (!isNaN(grade) && grade === classId && !isNaN(gpa)) {
          students.push({
            name: row['StudentID'] || 'ID inconnu',
            gpa: gpa,
            age: row['Age'],
          });
        }
      })
      .on('end', () => {
        const topStudents = students
          .sort((a, b) => b.gpa - a.gpa)
          .slice(0, 5);
  
        res.json(topStudents);
      })
      .on('error', (err) => {
        console.error('Erreur lecture top étudiants:', err);
        res.status(500).json({ error: 'Erreur lecture CSV' });
      });
  });
// Get dataset status (which one is active) - removed duplicate route

// Route to force refresh data (useful after file upload)
app.post('/api/refresh-data', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Cache cleared, data will be refreshed',
    activeDataset: path.basename(getActiveDatasetPath())
  });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Serveur API opérationnel sur http://localhost:${port}`);
});