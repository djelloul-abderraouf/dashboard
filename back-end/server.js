const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); // Autorise le front (React) à appeler ce serveur

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

// 📌 Route API pour compter les étudiants qui font du benevolat
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
  
//graphe gpa et gradclass

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
          { name: 'Bénévolat', value: volunteering }
        ]);
      })
      .on('error', (err) => {
        console.error('Erreur lecture activités:', err);
        res.status(500).json({ error: 'Erreur de lecture du fichier CSV' });
      });
  });
  
  
  //calculer le nombre de fille et de garcon 
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
          female: femaleCount
        });
      })
      .on('error', (err) => {
        console.error('Erreur lecture Gender:', err);
        res.status(500).json({ error: 'Erreur lors de la lecture du fichier CSV' });
      });
  });
  
//nuage de point entre temps d'etude et gpa
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
  
// piechart taux d'absence par classe 
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
          value
        }));
        res.json(result);
      })
      .on('error', (err) => {
        console.error('Erreur CSV (absences par classe):', err);
        res.status(500).json({ error: 'Erreur lecture CSV' });
      });
  });
  //piechart taux de temps d'etude par classe
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
  //piechart moyenne d'age par classe
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
          value: +(stats.total / stats.count).toFixed(2)
        }));
        res.json(result);
      })
      .on('error', (err) => {
        console.error('Erreur CSV (age par classe):', err);
        res.status(500).json({ error: 'Erreur lecture fichier CSV' });
      });
  });
  //piechart moyenne de gpa par classe
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
          value: +(stats.total / stats.count).toFixed(2)
        }));
  
        res.json(result);
      })
      .on('error', (err) => {
        console.error('Erreur lecture GPA:', err);
        res.status(500).json({ error: 'Erreur lecture fichier CSV' });
      });
  });
  //classement des etudiants par gpa et leurs claases
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
  
































// 🚀 Lancer le serveur
app.listen(port, () => {
  console.log(`✅ Serveur API opérationnel sur http://localhost:${port}`);
});
