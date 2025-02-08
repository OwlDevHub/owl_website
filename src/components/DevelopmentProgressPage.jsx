import React, { useState } from 'react';

const TimelineItem = ({ text, status }) => {
  let statusColor;
  let statusText;

  switch (status) {
    case 'completed':
      statusColor = 'var(--green)';
      statusText = 'DONE';
      break;
    case 'not_completed':
      statusColor = 'var(--red)';
      statusText = 'NS';
      break;
    case 'in_progress':
      statusColor = 'var(--purple)';
      statusText = 'IN DEV';
      break;
    default:
      statusColor = 'var(--color1)';
      statusText = '';
  }

  return (
    <div className="timeline-content" style={{ borderLeft: `15px solid ${statusColor}` }}>
      {text}
      <span className="status-text">{statusText}</span>
    </div>
  );
};

const Timeline = () => {
  const tasks = [
    { text: "Basic UI/UX", status: "completed" },
    { text: "The func of working with tasks", status: "completed" },
    { text: "The func of working with projects", status: "completed" },
    { text: "Statistics Window", status: "completed" },
    { text: "The backend", status: "in_progress" },
    { text: "Databases", status: "in_progress" },
    { text: "User  Registration", status: "in_progress" },
    { text: "Create registration form", status: "in_progress" },
    { text: "Validate user data", status: "in_progress" },
    { text: "Implement email confirmation", status: "not_completed" },
    { text: "API Implementation", status: "not_completed" },
    { text: "The Frontend + Backend bundle", status: "not_completed" },
    { text: "Subscription functionality", status: "not_completed" },
    { text: "Testing", status: "not_completed" },
    { text: "Unit testing", status: "not_completed" },
    { text: "Integration testing", status: "not_completed" },
    { text: "UI testing", status: "not_completed" },
    { text: "Placement on the server", status: "not_completed" },
    { text: "Setup CI/CD", status: "not_completed" },
    { text: "Configure server environment", status: "not_completed" },
    { text: "Attracting an audience", status: "not_completed" }
  ];

  const [showAll, setShowAll] = useState(false);

  const handleToggleTasks = () => {
    setShowAll(prev => !prev);
  };

  return (
    <div className="timeline hide-line">
      {tasks.slice(0, showAll ? tasks.length : 5).map((task, index) => (
        <TimelineItem key={index} text={task.text} status={task.status} />
      ))}
      <button onClick={handleToggleTasks} className="show-more-button">
        {showAll ? 'HIDE' : 'SHOW ALL'}
      </button>
    </div>
  );
};

export const DevelopmentProgressPage = () => {
  return (
    <div className='content'>
        <h1>DEVELOPMENT<br />PROGRESS</h1>
      <Timeline />
    </div>
  );
};
