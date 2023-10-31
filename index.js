const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = 'database.json';

let data = {};

if (fs.existsSync(DB_FILE)) {
  const jsonData = fs.readFileSync(DB_FILE, 'utf8');
  if (jsonData) {
    try {
      data = JSON.parse(jsonData);
    } catch (error) {
      console.error(error);
    }
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/shorten', async (req, res) => {
  let nanoid = (await import('nanoid')).nanoid;
  const { url } = req.body;
  const id = nanoid(8); // Gera um ID com 8 caracteres
  data[id] = url;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.send(`Shortened URL: http://localhost:${PORT}/${id}`);
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  if (data[id]) {
    res.redirect(data[id]);
  } else {
    res.status(404).send('URL não encontrada');
  }
});

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
