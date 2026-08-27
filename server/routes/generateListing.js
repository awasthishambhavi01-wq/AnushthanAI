import { Router } from 'express';

const router = Router();

router.post('/generate-listing', (_request, response) => {
  response.status(501).json({ error: 'Listing generation is not implemented yet' });
});

export default router;
