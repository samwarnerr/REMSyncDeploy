import React, { useEffect, useState } from 'react';

import bronze from '../../assets/icons/badges/bronze.svg';
import silver from '../../assets/icons/badges/silver.svg';
import gold from '../../assets/icons/badges/gold.svg';
import platinum from '../../assets/icons/badges/platinum.svg';
import amethyst from '../../assets/icons/badges/amethyst.svg';
import legendary from '../../assets/icons/badges/legendary.svg';

import './achievements.css';

const Achievements = ({ userId }) => {
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchSleepEntries = async () => {
      try {
        const res = await fetch(`remsyncdeploybackend-production.up.railway.app/api/sleep/${userId}`);
        const data = await res.json();
        const points = data.length * 20;
        setUserPoints(points);
      } catch (err) {
        console.error('Failed to fetch sleep data for achievements', err);
      }
    };

    if (userId) fetchSleepEntries();
  }, [userId]);

  const badgeTiers = [
    { name: 'Bronze', icon: bronze, minPoints: 0 },
    { name: 'Silver', icon: silver, minPoints: 200 },
    { name: 'Gold', icon: gold, minPoints: 400 },
    { name: 'Platinum', icon: platinum, minPoints: 600 },
    { name: 'Amethyst', icon: amethyst, minPoints: 800 },
    { name: 'Legendary', icon: legendary, minPoints: 1000 }
  ];

  const currentBadge = [...badgeTiers].reverse().find(tier => userPoints >= tier.minPoints) || badgeTiers[0];
  const currentIndex = badgeTiers.findIndex(t => t.name === currentBadge.name);
  const nextBadge = badgeTiers[currentIndex + 1];

  let progressToNext = 100;
  if (nextBadge) {
    const currentMin = currentBadge.minPoints;
    const nextMin = nextBadge.minPoints;
    progressToNext = ((userPoints - currentMin) / (nextMin - currentMin)) * 100;
  }

  const badges = [
    {
      title: 'Early Riser',
      unlocked: userPoints >= 60,
      description: 'Logged sleep before 10 PM for 3 nights in a row.',
      icon: '🌅'
    },
    {
      title: 'Consistent Sleeper',
      unlocked: userPoints >= 100,
      description: 'Maintained a consistent sleep schedule for 7 days.',
      icon: '📅'
    },
    {
      title: 'Sleep Master',
      unlocked: userPoints >= 1000,
      description: 'Earn 1,000 total points.',
      icon: '💤'
    },
    {
      title: 'Data Driven',
      unlocked: userPoints >= 600,
      description: 'Log sleep for 30 days straight.',
      icon: '📊'
    }
  ];

  return (
    <div className="dashboard-card modern achievements">
      <div className="rank-section single-rank">
        <h2 className="card-title">Your Rank</h2>
        <div className="rank-badge-icon highlight">
          <img src={currentBadge.icon} alt={currentBadge.name} />
          <span>{currentBadge.name}</span>
        </div>
      </div>

      {nextBadge && (
        <div className="next-rank-progress">
          <p>
            Progress to <strong>{nextBadge.name}</strong>:
          </p>
          <div className="progress-bar-rank">
            <div className="fill" style={{ width: `${progressToNext}%` }} />
          </div>
        </div>
      )}

      <div className="points-progress">
        <h3>Your Sleep Points</h3>
        <div className="points-bar">
          <div className="fill" style={{ width: `${userPoints / 10}%` }} />
        </div>
        <p>{userPoints} / 1000 points</p>
      </div>

      <div className="badges-grid">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`badge ${badge.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="badge-icon">{badge.icon}</div>
            <h4>{badge.title}</h4>
            <p>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
