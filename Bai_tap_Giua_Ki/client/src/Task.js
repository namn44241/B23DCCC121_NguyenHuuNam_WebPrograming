import React from 'react';

// Thêm export cho hàm này
export function getColorByDueDate(dueDate) {

  if (!dueDate) return 'green';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Nếu dueDate là ngày cụ thể (DD/MM)
  if (dueDate.match(/^\d{2}\/\d{2}$/)) {
    const [day, month] = dueDate.split('/');
    const date = new Date(today.getFullYear(), month - 1, day);
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'red';      // Quá hạn
    if (diffDays <= 2) return 'orange';  // Còn 2 ngày hoặc ít hơn
    return 'green';                      // Còn nhiều hơn 2 ngày
  }
  
  // Các trường hợp đặc biệt
  if (dueDate === 'Yesterday') return 'red';
  if (dueDate === 'Today') return 'red';
  if (dueDate === 'Tomorrow') return 'orange';
  
  // Nếu dueDate là thứ trong tuần
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (daysOfWeek.includes(dueDate)) {
    const dayIndex = daysOfWeek.indexOf(dueDate);
    const todayIndex = today.getDay();
    let diffDays;
    
    if (dayIndex < todayIndex) {
      // Thứ trong tuần sau
      diffDays = 7 - todayIndex + dayIndex;
    } else {
      // Thứ trong tuần này hoặc tuần sau
      const diff = dayIndex - todayIndex;
      diffDays = diff === 0 ? 7 : diff; // Nếu cùng thứ, tính cho tuần sau
    }
    
    if (diffDays < 0) return 'red';      // Quá hạn
    if (diffDays <= 2) return 'orange';  // Còn 2 ngày hoặc ít hơn
    return 'green';                      // Còn nhiều hơn 2 ngày
  }
  
  return 'green'; // Mặc định cho các trường hợp khác
}

// Component Task vẫn giữ nguyên
function Task({ task, onToggleComplete, onEdit }) {
  const dueColor = getColorByDueDate(task.date);

  const handleClick = (e) => {
    if (!e.target.classList.contains('custom-checkbox')) {
      onEdit(task);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  return (
    <div className="task" onClick={handleClick}>
      <span className="task-id">#{task.id}</span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleCheckboxClick}
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