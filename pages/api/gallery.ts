// pages/api/gallery.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: './db/images.db',
    driver: sqlite3.Database,
  });
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT id, prompt, image_base64 AS imageBase64, created_at FROM images ORDER BY created_at DESC');
    await db.close();
    res.status(200).json(rows);
  } catch (e) {
    console.error('Gallery error', e);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}
