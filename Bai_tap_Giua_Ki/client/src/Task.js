import React from 'react';

function getColorByDueDate(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Nếu dueDate là ngày cụ thể (DD/MM), kiểm tra xem có phải ngày trong quá khứ
  if (dueDate.match(/^\d{2}\/\d{2}$/)) {
    const [day, month] = dueDate.split('/');
    const date = new Date(today.getFullYear(), month - 1, day);
    if (date < today) {
      return 'red';  // Ngày trong quá khứ -> đỏ
    }
  }
  
  // Các trường hợp đặc biệt
  if (dueDate === 'Yesterday') return 'red';
  if (dueDate === 'Today') return 'red';
  if (dueDate === 'Tomorrow') return 'red';
  
  // Nếu dueDate là thứ trong tuần
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (daysOfWeek.includes(dueDate)) {
    const dayIndex = daysOfWeek.indexOf(dueDate);
    const dueDateTime = new Date(today);
    dueDateTime.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));
    
    const diffDays = Math.ceil((dueDateTime - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) return 'red';
    if (diffDays <= 5) return 'orange';
    return 'green';
  }
  
  // Kiểm tra nếu là ngày trong quá khứ
  if (dueDate.match(/^\d{2}\/\d{2}$/)) {
    const [day, month] = dueDate.split('/');
    const date = new Date(today.getFullYear(), month - 1, day);
    if (date < today) {
      return 'red';
    }
  }
  
  // Mặc định cho các ngày tương lai xa
  return 'green';
}

function Task({ task, onToggleComplete }) {
  const dueColor = getColorByDueDate(task.date);

  return (
    <div className="task">
      <span className="task-id">#{task.id}</span>
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