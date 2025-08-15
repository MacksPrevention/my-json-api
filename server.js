const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Чтение JSON и отдача клиенту
function getData() {
  try {
    const rawData = fs.readFileSync('./data.json', 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Ошибка чтения файла:', err);
    return { error: 'Ошибка чтения файла' };
  }
}

// Корневой маршрут
app.get('/', (req, res) => {
  res.json(getData());
});

// API-эндпоинт
app.get('/api/requests', (req, res) => {
  res.json(getData());
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
