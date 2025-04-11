const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios'); // Pour envoyer la requête vers Flask
const path = require('path');
const FormData = require('form-data');

// Configure multer to save files in the "data" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './data';
    // Check if the "data" folder exists; if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); // Save files in the "data" folder
  },
  filename: (req, file, cb) => {
    // Use the original file name for saving
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for React frontend

// 📌 Route API for uploading a file and saving it in the "data" folder
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Aucun fichier téléchargé' });
  }

  // File is already saved in the "data" folder by multer
  const filePath = path.join(__dirname, 'data', req.file.filename);

  // Optionally, send the file to the Flask backend for prediction
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath)); // Read the saved file

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

// 📌 Route API pour lire toutes les données CSV
app.get('/api/data', (req, res) => {
  const results = [];
  fs.createReadStream('dataset.csv') // le fichier est dans le même dossier
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results); // Renvoie toutes les données en JSON
    })
    .on('error', (err) => {
      console.error('Erreur CSV:', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

// ✅ Route PUT qui modifie directement le fichier CSV
app.put('/api/data/:studentId', express.json(), (req, res) => {
  const { studentId } = req.params;
  const updatedData = req.body;
  const results = [];
  fs.createReadStream('dataset.csv')
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
      fs.writeFile('dataset.csv', csvContent, 'utf8', (err) => {
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

// 📌 Route API pour compter les étudiants qui font du sport (sports === '1')
app.get('/api/sport-count', (req, res) => {
  let count = 0;
  fs.createReadStream('dataset.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row['Sports'] && row['Sports'].trim() === '1') {
        count++;
      }
    })
    .on('end', () => {
      res.json({ sportCount: count }); // Renvoie le nombre d'étudiants sportifs
    })
    .on('error', (err) => {
      console.error('Erreur CSV:', err);
      res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
    });
});

// 📌 Route API pour compter les étudiants qui font de la musique (Music === '1')
app.get('/api/music-count', (req, res) => {
  let count = 0;
  fs.createReadStream('dataset.csv')
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

// 📌 Route API pour compter les étudiants qui font du bénévolat
app.get('/api/volunteering-count', (req, res) => {
  let count = 0;
  fs.createReadStream('dataset.csv')
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

// Graphe GPA et GradeClass
app.get('/api/activities-distribution', (req, res) => {
  let sports = 0;
  let music = 0;
  let volunteering = 0;
  fs.createReadStream('dataset.csv')
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

// Calculer le nombre de filles et de garçons
app.get('/api/gender-distribution', (req, res) => {
  let maleCount = 0;
  let femaleCount = 0;
  fs.createReadStream('dataset.csv')
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

// Nuage de points entre temps d'étude et GPA
app.get('/api/study-vs-gpa', (req, res) => {
  const results = [];
  const maxRows = 100; // 🔢 Limite à 100 lignes
  fs.createReadStream('dataset.csv')
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

// Pie chart: Taux d'absence par classe
app.get('/api/absences-by-class', (req, res) => {
  const classAbsences = {};
  fs.createReadStream('dataset.csv')
    .pipe(csv())
    .on('data', (row) => {
      const gradeRaw = row['GradeClass'];
      const absences = parseInt(row['Absences']);
      if (!isNaN(gradeRaw) && !isNaN(absences)) {
        const grade = parseInt(gradeRaw) + 1; // 🔢 Ajouter 1 à chaque classe
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

// Pie chart: Taux de temps d'étude par classe
app.get('/api/studytime-by-class', (req, res) => {
  const studyTimeByClass = {};
  fs.createReadStream('dataset.csv')
    .pipe(csv())
    .on('data', (row) => {
      const classRaw = row['GradeClass'];
      const studyTime = parseFloat(row['StudyTimeWeekly']);
      if (!isNaN(classRaw) && !isNaN(studyTime)) {
        const classId = `Classe ${parseInt(classRaw) + 1}`; // ➕ ajout 1
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

// Pie chart: Moyenne d'âge par classe
app.get('/api/average-age-by-class', (req, res) => {
  const ageByClass = {};
  fs.createReadStream('dataset.csv')
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

// Pie chart: Moyenne de GPA par classe
app.get('/api/average-gpa-by-class', (req, res) => {
  const classGpa = {};
  fs.createReadStream('dataset.csv')
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

// Classement des étudiants par GPA et leurs classes
app.get('/api/top-students/:classId', (req, res) => {
  const classId = parseInt(req.params.classId) - 1; // car dans CSV les classes sont 0-indexées
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

// 🚀 Start the server
app.listen(port, () => {
  console.log(`✅ Serveur API opérationnel sur http://localhost:${port}`);
});