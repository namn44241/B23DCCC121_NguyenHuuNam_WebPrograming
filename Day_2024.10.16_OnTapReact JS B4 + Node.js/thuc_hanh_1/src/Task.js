import React from 'react';

function getColorByDueDate(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let diffDays;

  if (dueDate === 'Today') {
    diffDays = 0;
  } else if (dueDate === 'Tomorrow') {
    diffDays = 1;
  } else {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(dueDate);
    
    if (dayIndex !== -1) {
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));
      diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    } else {}
  }

  if (diffDays <= 2) return 'red';
  if (diffDays >= 3 && diffDays <= 5) return 'orange';
  if (diffDays >= 6 && diffDays <= 7) return 'green';
}

function Task({ task, onToggleComplete }) {
  const dueColor = getColorByDueDate(task.date);

  return (
    <div className="task">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className={`custom-checkbox ${dueColor}`}
      />
      <div className="task-content">
        <span className={`task-text ${task.completed ? 'completed' : ''}`}>
          {task.name}
        </span>
        <span className={`task-date ${dueColor}`}>
          📅 {task.date}
        </span>
      </div>
    </div>
  );
}

export default Task;