import React, { useEffect, useState } from 'react';
import './recap.css';

const Recap = ({ userId }) => {
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const res = await fetch(`remsyncdeploybackend-production.up.railway.app/api/sleep/${userId}`);
        const data = await res.json();

        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 6); // 7 days including today

        // Create an object for each day of the past week
        const pastWeek = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(weekAgo);
          date.setDate(date.getDate() + i);
          return {
            dateKey: date.toISOString().split('T')[0],
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            duration: 0
          };
        });

        data.forEach(entry => {
          const dateKey = new Date(entry.bedtime).toISOString().split('T')[0];
          const match = pastWeek.find(d => d.dateKey === dateKey);
          if (match) {
            const bed = new Date(entry.bedtime);
            const wake = new Date(entry.wake_time);
            const duration = (wake - bed) / 3600000;
            match.duration = duration;
          }
        });

        setWeekData(pastWeek);
      } catch (err) {
        console.error('Failed to load weekly sleep data', err);
      }
    };

    fetchWeekData();
  }, [userId]);

  return (
    <div className="dashboard-card modern">
      <h2 className="card-title">Weekly Sleep Duration</h2>
      {weekData.every(day => day.duration === 0) && (
        <p className="no-data">No sleep data available for the past week.</p>
      )}

      <div className="bar-graph">
        <div className="goal-line" />
        <div></div>
        {weekData.map((day, idx) => (
            <div key={day.label} className="bar-item">
            <span className="bar-value">{day.duration.toFixed(1)}h</span>
            <div
                className="bar"
                style={{
                height: `${day.duration * 25}px`,
                backgroundColor: day.duration > 0 ? '#A5D7E8' : '#4b5563'
                }}
            ></div>
            <span className="bar-label">{day.label}</span>
            </div>
            ))}
            </div>

    </div>
  );
};

export default Recap;
