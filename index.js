const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


app.use(express.static('public'));
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});


app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      res.status(500).send('Error reading files');
    } else {
      console.log(files)
      res.json(files);
    }
  });
});

// Route zum Herunterladen von Dateien
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const file = path.join(__dirname, 'uploads', filename);
  res.download(file);
});

// Route zum Umbenennen von Dateien
app.post('/rename', express.json(), (req, res) => {
  const oldName = path.join(__dirname, 'uploads', req.body.oldName);
  const newName = path.join(__dirname, 'uploads', req.body.newName);
  fs.rename(oldName, newName, (err) => {
    if (err) {
      res.status(500).send("Fehler beim Umbenennen der Datei");
    } else {
      res.send("Datei erfolgreich umbenannt");
    }
  });
});


app.post('/create-folder', express.json(), (req, res) => {
  const folderName = path.join(__dirname, 'uploads', req.body.folderName);
  fs.mkdir(folderName, (err) => {
    if (err) {
      res.status(500).send("Fehler beim Erstellen des Ordners");
    } else {
      res.send("Ordner erfolgreich erstellt");
    }
  });
});

app.get('/list', (req, res) => {
  fs.readdir('./uploads', { withFileTypes: true }, (err, items) => {
    if (err) {
      res.status(500).send("Fehler beim Abrufen der Dateien");
    } else {
      res.json(items.map(item => ({ name: item.name, isDirectory: item.isDirectory() })));
    }
  });
});




app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const file = path.join(__dirname, 'uploads', filename);
  fs.unlink(file, (err) => {
    if (err) {
      res.status(500).send("Fehler beim Löschen der Datei");
    } else {
      res.send("Datei erfolgreich gelöscht");
    }
  });
});


app.get('/download/:filename', (req, res) => {
  res.download(path.join(__dirname, 'uploads', req.params.filename));
});

app.listen(80, () => {
  console.log('Server running on port 80');
});