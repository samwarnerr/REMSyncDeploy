import React, { useEffect, useState } from 'react';
import './tips.css';

const tips = ({ userId }) => {
  const [sleepScore, setSleepScore] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchSleepData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/sleep/${userId}`);
        const data = await res.json();
        if (data.length > 0) {
          setSleepScore(data[0].sleep_quality);
        }
      } catch (err) {
        console.error('Failed to fetch sleep score:', err);
      }
    };

    fetchSleepData();
  }, [userId]);

  if (sleepScore === null) {
    return (
      <div className="dashboard-card modern ai-tips">
        <p>Please log sleep data to receive AI-generated tips.</p>
      </div>
    );
  }

  const generalTips = [
    {
      title: "Keep a Consistent Sleep Schedule",
      detail: "Try to go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's natural sleep rhythm."
    },
    {
      title: "Limit Screen Time Before Bed",
      detail: "Blue light from screens can disrupt melatonin production. Try to avoid screens for 1 hour before bed."
    },
    {
      title: "Cool and Dark Room = Better Sleep",
      detail: "Keep your room cool (60-67°F) and minimize light. Use blackout curtains or a sleep mask."
    }
  ];

  const extraTip = sleepScore < 85
    ? {
        title: "Consider Relaxation Techniques",
        detail: "If you have trouble falling asleep, try deep breathing, progressive muscle relaxation, or light stretching before bed."
      }
    : {
        title: "Great Job!",
        detail: "Your sleep score looks solid. Keep up the good habits — your body and mind thank you!"
      };

  return (
    <div className="dashboard-card modern ai-tips">
      <h4 className="tips-intro">
        Based on your recent sleep score of <strong>{sleepScore}</strong>, here are some helpful suggestions:
      </h4>
      <ul className="tips-list">
        {generalTips.map((tip, i) => (
          <li key={i} className="tip-item">
            <h4>{tip.title}</h4>
            <p>{tip.detail}</p>
          </li>
        ))}
        <li className="tip-item special">
          <h4>{extraTip.title}</h4>
          <p>{extraTip.detail}</p>
        </li>
      </ul>
    </div>
  );
};

export default tips;
