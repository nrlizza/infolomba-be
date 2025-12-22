import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; 
