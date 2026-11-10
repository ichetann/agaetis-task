const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db.js');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/employees', employeeRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});