// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  try {
    // Forward request to the Python inference server
    const pyRes = await axios.post(process.env.PY_SERVER_URL + '/infer', { prompt }, {
      headers: {
        ...(process.env.NODE_ENV === 'production' && req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
    });
    const { imageBase64 } = pyRes.data;
    res.status(200).json({ imageBase64 });
  } catch (e) {
    console.error('Generation error', e);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
