import React from 'react';
import Task from './Task';

function TaskList({ tasks, onToggleComplete }) {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          <Task task={task} onToggleComplete={onToggleComplete} />
          {index < tasks.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default TaskList;