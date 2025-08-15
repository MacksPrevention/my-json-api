const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // для POST-запросов

function getData() {
  try {
    const rawData = fs.readFileSync('./data.json', 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Ошибка чтения файла:', err);
    return { error: 'Ошибка чтения файла' };
  }
}

app.get('/', (req, res) => res.json(getData()));

app.get('/api/requests', (req, res) => res.json(getData()));

app.post('/api/requests', (req, res) => {
  const newRequest = req.body;
  try {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    data.requests.push(newRequest);
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Ошибка при добавлении заявки:', err);
    res.status(500).json({ error: 'Не удалось сохранить заявку' });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
