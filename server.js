const express = require('express');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/data', (req, res) => {
    const filePath = path.join(__dirname, 'js', 'test.csv');
    const readStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let data = [];
    let isFirstLine = true;
    rl.on('line', (line) => {
        if (isFirstLine) {
            // Skip header line
            isFirstLine = false;
        } else {
            data.push(line.split(','));
        }
    });

    rl.on('close', () => {
        res.json(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});