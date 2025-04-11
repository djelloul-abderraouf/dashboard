const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
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
        'Content-Type': 'multipart/form-data',
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

// 🚀 Start the server
app.listen(port, () => {
  console.log(`✅ Serveur API opérationnel sur http://localhost:${port}`);
});