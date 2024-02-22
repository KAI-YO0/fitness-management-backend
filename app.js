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
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/v1/user', require('./routes/userRoutes'));

app.use('/api/v1/admin', require('./routes/adminRoutes'));

app.listen(8080, () => {
  console.log('Backend is connected...');
});
