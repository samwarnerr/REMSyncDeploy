import React, { useState, useEffect } from 'react';
import arrow from '../../assets/icons/rightarrow.svg';
import './sleepstats.css';

const SleepStats = ({ goToTips, userId }) => {
  const [sleepData, setSleepData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);

  useEffect(() => {
    if (!userId) return;
  
    const fetchSleep = async () => {
      try {
        const res = await fetch(`remsyncdeploybackend-production.up.railway.app/api/sleep/${userId}`);
        const data = await res.json();
        setSleepData(data);
  
        // Filter for past 7 days
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
  
        const recent = data.filter(entry => new Date(entry.bedtime) >= weekAgo);
  
        if (recent.length >= 3) {
          let totalDuration = 0;
          let totalQuality = 0;
          let totalEfficiency = 0;
  
          recent.forEach(entry => {
            const bed = new Date(entry.bedtime);
            const wake = new Date(entry.wake_time);
            const duration = (wake - bed) / 3600000;
            totalDuration += duration;
            totalQuality += entry.sleep_quality;
            totalEfficiency += Math.min(100, Math.round((duration / 8) * 100));
          });
  
          setWeeklyStats({
            count: recent.length,
            avgDuration: totalDuration / recent.length,
            avgQuality: totalQuality / recent.length,
            avgEfficiency: totalEfficiency / recent.length
          });
        } else {
          setWeeklyStats(null);
        }
      } catch (err) {
        console.error('Error fetching sleep data:', err);
      }
    };
  
    fetchSleep();
  }, [userId]);

  const formatDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const calculateEfficiency = (start, end) => {
    const hours = (new Date(end) - new Date(start)) / 3600000;
    const ideal = 8;
    return Math.min(100, Math.round((hours / ideal) * 100));
  };

  const renderStatsCard = (entry, title) => (
    <div className="score-block">
      <div className="score-left">
        <div className="score-circle">
        <svg viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet" className="score-ring">
          <circle className="ring-bg" cx="75" cy="75" r="65" />
          <circle
            className="ring-progress"
            cx="75"
            cy="75"
            r="65"
            strokeDasharray="408"
            strokeDashoffset={408 - (entry.sleep_quality * 4.08)}
          />
        </svg>

          <span className="score-number">{entry.sleep_quality}</span>
        </div>
        <div className="score-info">
          <h3>{title}</h3>
          <p>
            Time:{' '}
            {new Date(entry.bedtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
            {new Date(entry.wake_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p>Duration: {formatDuration(entry.bedtime, entry.wake_time)}</p>
          <p>Rating: {entry.sleep_quality}/100</p>
          <p>Efficiency: {calculateEfficiency(entry.bedtime, entry.wake_time)}%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-card modern">
      <div className="score-row row-1">
        {sleepData[0] ? (
          renderStatsCard(sleepData[0], "Last Night's Stats")
        ) : (
          <div className="score-block no-data">
            <p>Please input your sleep data to view statistics.</p>
          </div>
        )}

        {weeklyStats ? (
          <div className="score-block">
            <div className="score-right">
              <div className="score-context">
                <h4>So far this week,</h4>
                <p>
                  You’re averaging {Math.round(weeklyStats.avgEfficiency)}% efficiency.<br />
                  {weeklyStats.avgEfficiency >= 85
                    ? "Keep it up!"
                    : weeklyStats.avgEfficiency >= 70
                    ? "You're doing great, stay consistent!"
                    : "Stick to your schedule for better results!"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="score-block no-data">
            <p>Log at least 3 nights of sleep to view weekly stats.</p>
          </div>
        )}
      </div>

      <div className="score-row">

        {weeklyStats ? (
        <div className="score-block">
            <div className="score-left">
            <div className="score-circle">
            <svg viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet" className="score-ring">
              <circle className="ring-bg" cx="75" cy="75" r="65" />
              <circle
                className="ring-progress"
                cx="75"
                cy="75"
                r="65"
                strokeDasharray="408"
                strokeDashoffset={408 - (weeklyStats.avgQuality * 4.08)}
              />
            </svg>
                <span className="score-number">{Math.round(weeklyStats.avgQuality)}</span>
            </div>
            <div className="score-info">
                <h3>Last Week’s Average</h3>
                <p>Duration: {Math.floor(weeklyStats.avgDuration)}h {Math.round((weeklyStats.avgDuration % 1) * 60)}m</p>
                <p>Rating: {Math.round(weeklyStats.avgQuality)}/100</p>
                <p>Efficiency: {Math.round(weeklyStats.avgEfficiency)}%</p>
            </div>
            </div>
        </div>
        ) : (
        <div className="score-block no-data">
            <p>Log at least 3 nights of sleep to view weekly averages.</p>
        </div>
        )}


        <div className="score-block">
          <div className="score-context">
            <h4>Want to improve even more?</h4>
            <p>Check out our AI-driven tips</p>
            <button className="tips-btn" onClick={goToTips}>
              <img src={arrow} alt="arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStats;
