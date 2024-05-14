import express from 'express';
import dotenv from 'dotenv';
import { getXataClient } from './xata';

dotenv.config();
const { PORT } = process.env || 3000;
const app = express();

app.use(express.json({ limit: '50mb' }));

const client = getXataClient();

app.get('/', async (req, res) => {
  const result = await client.db.sets.getAll();
  res.json({ result: result });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
