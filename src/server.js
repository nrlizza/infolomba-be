import app from './app.js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const port = process.env.PORT || 3001;
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; 
