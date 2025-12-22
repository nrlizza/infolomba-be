import dotenv from 'dotenv';
import app from './app.js'; 

dotenv.config();

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});
