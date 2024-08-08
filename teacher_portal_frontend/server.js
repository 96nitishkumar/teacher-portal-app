// server.js
const express = require('express');
const path = require('path');
const app = express();

const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home.html', (req, res) => {
  const token = req.query.token; // Assuming the token is passed as a query parameter
  if (token === 'someAuthToken') { // Simulate token validation
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
