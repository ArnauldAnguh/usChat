import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'app up and running' });
});

export default router;
