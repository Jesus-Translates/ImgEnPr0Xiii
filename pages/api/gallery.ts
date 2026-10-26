// pages/api/gallery.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
// @ts-ignore
const sqlite3 = require('sqlite3');
// @ts-ignore
const { open } = require('sqlite');

async function getDb() {
  const dbPath = path.resolve('./db/images.db');
  // Ensure the DB file exists; if not, create it with the schema.
  if (!fs.existsSync(dbPath)) {
    const schema = `CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      image_base64 TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`;
    const tempDb = await open({ filename: dbPath, driver: sqlite3.Database });
    await tempDb.exec(schema);
    await tempDb.close();
  }
  return open({ filename: dbPath, driver: sqlite3.Database });
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT id, prompt, image_base64 AS imageBase64, created_at FROM images ORDER BY created_at DESC');
    await db.close();
    // Return empty array if no rows.
    res.status(200).json(rows || []);
  } catch (e) {
    console.error('Gallery error', e);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}
