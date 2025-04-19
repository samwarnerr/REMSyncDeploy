import React, { useEffect, useState } from 'react';
import './tips.css';

const tips = ({ userId }) => {
  const [sleepScore, setSleepScore] = useState(null);
  const [mlTips, setMlTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchSleepDataAndTips = async () => {
      try {
        const res = await fetch(`https://remsyncdeploybackend-production.up.railway.app/api/sleep/${userId}`);
        const data = await res.json();

        if (data.length > 0) {
          const latestEntry = data[0];
          setSleepScore(latestEntry.sleep_quality);
          const mlRes = await fetch('https://ample-intuition-production.up.railway.app/ml/tips', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              age: latestEntry.age ?? 20,
              sleep_duration: latestEntry.sleep_duration ?? 7,
              quality: (latestEntry.sleep_quality ?? 70) / 10,
              activity: latestEntry.activity_level ?? 50
            }),
          });

          const mlData = await mlRes.json();
          setMlTips(mlData.tips || []);
        }
      } catch (err) {
        console.error('Failed to fetch ML tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepDataAndTips();
  }, [userId]);

  if (loading) {
    return <div className="dashboard-card modern ai-tips wrapper">Loading tips...</div>;
  }

  if (sleepScore === null) {
    return (
      <div className="dashboard-card modern ai-tips wrapper">
        <p>Please log sleep data to receive AI-generated tips.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card modern ai-tips">
      <h3 className="tips-intro">
        Based on your recent sleep score of <strong>{sleepScore}</strong>, here are some helpful suggestions:
      </h3>
      <ul className="tips-list">
        {mlTips.map((tip, i) => (
          <li key={i} className="tip-item">
            <p>{tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default tips;
