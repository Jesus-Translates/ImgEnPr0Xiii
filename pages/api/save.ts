// pages/api/save.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
const sqlite3 = require('sqlite3');
// @ts-ignore
const { open } = require('sqlite');

async function getDb() {
  return open({
    filename: './db/images.db',
    driver: sqlite3.Database,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt, imageBase64 } = req.body;
  if (!prompt || !imageBase64) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const db = await getDb();
    await db.run(
      'INSERT INTO images (prompt, image_base64, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      prompt,
      imageBase64
    );
    await db.close();
    res.status(200).json({ success: true });
  } catch (e) {
    console.error('Save error', e);
    res.status(500).json({ error: 'Failed to save image' });
  }
}
