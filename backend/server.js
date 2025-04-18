import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cors from 'cors';
import sleepRoutes from './routes/sleeproutes.js';
import authRoutes from './routes/authroutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sleep', sleepRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('REMSync backend is running 🚀');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
