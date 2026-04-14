import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

/**
 * Profile + Progress API
 * 
 * GET  /api/protocol?token=xxx          → returns profile + progress
 * POST /api/protocol  {token, progress}  → saves progress
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      // GET: Fetch profile + progress
      const token = req.query.token;
      if (!token) return res.status(400).json({ error: 'Token required' });

      const profile = await redis.get(`protocol:${token}`);
      if (!profile) return res.status(404).json({ error: 'Protocol not found' });

      const progress = await redis.get(`progress:${token}`) || {
        completedDays: [],
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        weeklyScores: {},
        startDate: profile.createdAt?.split('T')[0] || null,
      };

      return res.status(200).json({ profile, progress });
    }

    if (req.method === 'POST') {
      // POST: Save progress
      const { token, progress } = req.body;
      if (!token || !progress) return res.status(400).json({ error: 'Token and progress required' });

      // Verify protocol exists
      const profile = await redis.get(`protocol:${token}`);
      if (!profile) return res.status(404).json({ error: 'Protocol not found' });

      // Save progress (1 year TTL)
      await redis.set(`progress:${token}`, progress, { ex: 365 * 24 * 60 * 60 });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Protocol API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
