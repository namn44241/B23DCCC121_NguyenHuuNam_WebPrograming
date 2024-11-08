import React from 'react';
import Task from './Task';

function TaskList({ tasks, onToggleComplete }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <Task 
          key={task.id} 
          task={task} 
          onToggleComplete={onToggleComplete} 
        />
      ))}
    </div>
  );
}

export default TaskList;