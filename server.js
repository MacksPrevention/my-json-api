const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/requests', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка чтения файла' });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
