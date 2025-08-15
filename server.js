const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Чтение data.json
function readData() {
  try {
    const rawData = fs.readFileSync('./data.json', 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Ошибка чтения файла:', err);
    return { requests: [] };
  }
}

// Запись в data.json
function writeData(data) {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

// GET /api/requests
app.get('/api/requests', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST /api/requests — добавление заявки с уникальным id
app.post('/api/requests', (req, res) => {
  try {
    const data = readData();
    const newRequest = { ...req.body, id: uuidv4() };
    data.requests.push(newRequest);
    writeData(data);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Ошибка при добавлении заявки:', err);
    res.status(500).json({ error: 'Не удалось сохранить заявку' });
  }
});

// PUT /api/requests/:id — редактирование заявки
app.put('/api/requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const index = data.requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    // Обновляем поля заявки
    data.requests[index] = { ...data.requests[index], ...req.body, id };
    writeData(data);

    res.json({ message: 'Заявка обновлена', updated: data.requests[index] });
  } catch (err) {
    console.error('Ошибка при обновлении заявки:', err);
    res.status(500).json({ error: 'Не удалось обновить заявку' });
  }
});

// DELETE /api/requests/:id
app.delete('/api/requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readData();
    const index = data.requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    const deleted = data.requests.splice(index, 1)[0];
    writeData(data);
    res.json({ message: 'Заявка удалена', deleted });
  } catch (err) {
    console.error('Ошибка при удалении заявки:', err);
    res.status(500).json({ error: 'Не удалось удалить заявку' });
  }
});

// Запуск сервера
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
