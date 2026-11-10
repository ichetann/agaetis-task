const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db.js');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: [
    'https://agaetis-task-git-main-chetanchaudhari617-5581s-projects.vercel.app',
    'http://localhost:5173' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/employees', employeeRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});