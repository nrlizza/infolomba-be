import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; // wajib diekspor agar Vercel tidak error
