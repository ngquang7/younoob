require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'younoob_db',
  waitForConnections: true,
  connectionLimit: 10,
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
}

function getVideoId(video) {
  return typeof video === 'string' ? video : video?.id || video?.id?.videoId;
}

function parseJsonColumn(val) {
  if (!val) return null;
  return typeof val === 'string' ? JSON.parse(val) : val;
}

// --- AUTH ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email.trim(), username.trim()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username.trim())}`;

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      [username.trim(), email.trim(), passwordHash, avatarUrl]
    );

    const user = {
      id: String(result.insertId),
      username: username.trim(),
      email: email.trim(),
      avatarUrl,
    };

    return res.status(201).json({ token: signToken(result.insertId), user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT id, username, email, password_hash, avatar_url FROM users WHERE email = ?',
      [email.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const dbUser = rows[0];
    const isMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = {
      id: String(dbUser.id),
      username: dbUser.username,
      email: dbUser.email,
      avatarUrl:
        dbUser.avatar_url ||
        `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(dbUser.username)}`,
    };

    return res.json({ token: signToken(dbUser.id), user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// --- SUBSCRIPTIONS ---
app.get('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, channel_id, channel_title, channel_thumbnail, channel_data, subscribed_at FROM subscriptions WHERE user_id = ? ORDER BY subscribed_at DESC',
      [req.userId]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load subscriptions' });
  }
});

app.post('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const { channelId, channelTitle, channelThumbnail, channelData } = req.body;
    if (!channelId) {
      return res.status(400).json({ message: 'channelId is required' });
    }

    await pool.query(
      `INSERT INTO subscriptions (user_id, channel_id, channel_title, channel_thumbnail, channel_data)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         channel_title = VALUES(channel_title),
         channel_thumbnail = VALUES(channel_thumbnail),
         channel_data = VALUES(channel_data)`,
      [
        req.userId,
        channelId,
        channelTitle || null,
        channelThumbnail || null,
        channelData ? JSON.stringify(channelData) : null,
      ]
    );

    return res.status(201).json({ subscribed: true, channelId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save subscription' });
  }
});

app.delete('/api/subscriptions/:channelId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM subscriptions WHERE user_id = ? AND channel_id = ?',
      [req.userId, req.params.channelId]
    );
    return res.json({ subscribed: false, channelId: req.params.channelId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to remove subscription' });
  }
});

// --- WATCH HISTORY ---
app.get('/api/history', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT video_data FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC',
      [req.userId]
    );
    const videos = rows.map((r) => parseJsonColumn(r.video_data)).filter(Boolean);
    return res.json(videos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load watch history' });
  }
});

app.post('/api/history', authMiddleware, async (req, res) => {
  try {
    const video = req.body.video;
    const videoId = getVideoId(video);
    if (!videoId) return res.status(400).json({ message: 'Invalid video' });

    const title = video?.snippet?.title || video?.title || null;
    const thumbnail =
      video?.snippet?.thumbnails?.medium?.url ||
      video?.snippet?.thumbnails?.default?.url ||
      null;

    await pool.query(
      `INSERT INTO watch_history (user_id, video_id, video_title, thumbnail_url, video_data, watched_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         video_title = VALUES(video_title),
         thumbnail_url = VALUES(thumbnail_url),
         video_data = VALUES(video_data),
         watched_at = CURRENT_TIMESTAMP`,
      [req.userId, String(videoId), title, thumbnail, JSON.stringify(video)]
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save history item' });
  }
});

app.delete('/api/history/:videoId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM watch_history WHERE user_id = ? AND video_id = ?',
      [req.userId, req.params.videoId]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete history item' });
  }
});

app.delete('/api/history', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM watch_history WHERE user_id = ?', [req.userId]);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to clear history' });
  }
});

// --- LIKED VIDEOS ---
app.get('/api/likes', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT video_data FROM liked_videos WHERE user_id = ? ORDER BY liked_at DESC',
      [req.userId]
    );
    return res.json(rows.map((r) => parseJsonColumn(r.video_data)).filter(Boolean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load liked videos' });
  }
});

app.post('/api/likes', authMiddleware, async (req, res) => {
  try {
    const video = req.body.video;
    const videoId = getVideoId(video);
    if (!videoId) return res.status(400).json({ message: 'Invalid video' });

    await pool.query(
      `INSERT INTO liked_videos (user_id, video_id, video_data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE video_data = VALUES(video_data)`,
      [req.userId, String(videoId), JSON.stringify(video)]
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to like video' });
  }
});

app.delete('/api/likes/:videoId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM liked_videos WHERE user_id = ? AND video_id = ?',
      [req.userId, req.params.videoId]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to unlike video' });
  }
});

// --- WATCH LATER (SAVED VIDEOS) ---
app.get('/api/saved', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT video_data FROM saved_videos WHERE user_id = ? ORDER BY saved_at DESC',
      [req.userId]
    );
    return res.json(rows.map((r) => parseJsonColumn(r.video_data)).filter(Boolean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load watch later' });
  }
});

app.post('/api/saved', authMiddleware, async (req, res) => {
  try {
    const video = req.body.video;
    const videoId = getVideoId(video);
    if (!videoId) return res.status(400).json({ message: 'Invalid video' });

    await pool.query(
      `INSERT INTO saved_videos (user_id, video_id, video_data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE video_data = VALUES(video_data)`,
      [req.userId, String(videoId), JSON.stringify(video)]
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save video' });
  }
});

app.delete('/api/saved/:videoId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM saved_videos WHERE user_id = ? AND video_id = ?',
      [req.userId, req.params.videoId]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to remove saved video' });
  }
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`YouNoob API running on http://localhost:${PORT}`);
});