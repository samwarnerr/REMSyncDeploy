import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components';
import { LogSleepForm, Tips, Achievements, SleepStats, Recap } from '..';
import icon1 from '../../assets/icons/scores.svg';
import icon2 from '../../assets/icons/stats.svg';
import icon3 from '../../assets/icons/progress.svg';
import icon4 from '../../assets/icons/tips.svg';
import icon5 from '../../assets/icons/achievements.svg';
import hamburger from '../../assets/icons/hamburger.svg';

import './dashboard.css';

const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // Sunday (or use +1 for Monday start)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const options = { month: 'short', day: 'numeric' };

  return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
};

const Dashboard = ({ user, onLogout }) => {

  const userName = user?.name || 'User';

  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    'Recent sleep scores',
    'Weekly progress',
    'Log sleep',
    'AI tips',
    'Achievements'
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);


  const icons = [icon1, icon2, icon3, icon4, icon5];
  const weekRange = getWeekRange();

  const renderContent = () => {
    switch (activeSection) {
      case 0:
        return (
          <div className="dashboard-card modern">
          <SleepStats userId={user?.id} goToTips={() => setActiveSection(3)} />
        </div>
        );
      case 1:
        return (
          <div className="dashboard-card modern">
            <Recap userId={user?.id}/>
          </div>
        );
        case 2:
          return (
            <div className="dashboard-card modern">
              <LogSleepForm userId={user?.id}/>
            </div>
          );
      case 3:
        return (
          <div className="dashboard-card modern">
            <Tips userId={user?.id}/>
          </div>
        );
      case 4:
        return (
          <div className="dashboard-card modern">
            <Achievements userId={user?.id}/>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <button className='sidebar-toggle' onClick={toggleSidebar}>
        <img src={hamburger} alt="menu" width={24} />
      </button>
      <Navbar onLogout={onLogout} />

      <aside className={`dashboard-sidebar-icons ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          {sections.map((_, index) => (
            <li key={index} className={activeSection === index ? 'active' : ''} onClick={() => {setActiveSection(index); setSidebarOpen(false);}}>
              <img src={icons[index]} alt={`icon ${index + 1}`} />
            </li>
          ))}
        </ul>
      </aside>

      <div className="dashboard-main redesigned">
      
      {activeSection === 0 && (
        <div className="dashboard-header">
          <h1>Hi {userName},</h1>
          <p>Here's some of your recent sleep stats:</p>
        </div>
      )}

      {activeSection === 1 && (
              <div className="dashboard-header">
                <h1>Your weekly recap</h1>
                <p>For the week of {weekRange}</p>
              </div>
            )}

      {activeSection === 2 && (
              <div className="dashboard-header">
                <h1>Log your sleep</h1>
                <p>Your profile will automatically update!</p>
              </div>
            )}
      
      {activeSection === 3 && (
              <div className="dashboard-header">
                <h1>Your curated tips</h1>
                <p>Learn how to improve your sleep hygiene</p>
              </div>
            )}

      {activeSection === 4 && (
              <div className="dashboard-header">
                <h1>Achievements and goals</h1>
                <p>Complete challenges for badges and points</p>
              </div>
            )}

        {renderContent()}

      </div>
    </div>
  );
};

export default Dashboard;
