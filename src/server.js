import dotenv from 'dotenv';
import app from './app.js'; 

dotenv.config();

const port = process.env.PORT || 3001;

app.get(port, () => {
  res.json({ message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
