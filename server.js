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

app.delete('/api/requests/:id', (req, res) => {
  const { id } = req.params;

  try {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    const index = data.requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    const deleted = data.requests.splice(index, 1)[0]; // удаляем
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

    res.json({ message: 'Заявка удалена', deleted });
  } catch (err) {
    console.error('Ошибка при удалении заявки:', err);
    res.status(500).json({ error: 'Не удалось удалить заявку' });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

