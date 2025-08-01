const connectToMongo = require('./db')
connectToMongo();

const express = require('express')
const session = require('express-session');
const app = express()
const port = 3001

const cors = require('cors')
const router = require('./Routes/router')

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true
}));
app.use(express.json());

const path = require('path');

// Serve static files from frontend public folder
app.use(express.static(path.join(__dirname, '../Frontend/inventory_management_system/public')));

app.use(session({
  secret: 'your_secret_key', // replace with a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true if using https
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Serve login.html at /login.html route
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/inventory_management_system/public/login.html'));
});

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


