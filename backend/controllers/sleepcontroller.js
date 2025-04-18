import pool from '../db/index.js'; 

export const submitSleepEntry = async (req, res) => {
  const { userId, bedtime, wakeTime, sleepQuality, notes } = req.body;

  if (!userId || !bedtime || !wakeTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO sleep_entries (user_id, bedtime, wake_time, sleep_quality, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, bedtime, wakeTime, sleepQuality, notes]
    );
    res.status(201).json({ message: 'Sleep entry saved', entry: result.rows[0] });
  } catch (err) {
    console.error('Error saving sleep entry:', err);
    res.status(500).json({ error: 'Failed to save sleep entry' });
  }
};

export const getSleepEntries = async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching sleep entries for user ${userId}`);
  try {
    const result = await pool.query(
      'SELECT * FROM sleep_entries WHERE user_id = $1 ORDER BY bedtime DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sleep entries:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


