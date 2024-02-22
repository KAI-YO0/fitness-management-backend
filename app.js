const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: ['p'],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/v1/users', require('./routes/userRoutes'));

app.use('/api/v1/admins', require('./routes/adminRoutes'));

app.listen(8080, () => {
  console.log('Backend is connected...');
});
