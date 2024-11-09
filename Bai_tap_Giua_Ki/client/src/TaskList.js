import React from 'react';
import Task from './Task';

function TaskList({ tasks, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <Task 
          key={task.id} 
          task={task} 
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;