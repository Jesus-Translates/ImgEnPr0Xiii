-- db/seed.sql
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT NOT NULL,
    image_base64 TEXT NOT NULL,
    created_at TEXT NOT NULL
);
