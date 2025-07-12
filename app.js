const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','templates','login.html'));
});
app.use((req, res, next) => {
    res.status(404).send('Sorry, we cannot find that!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});