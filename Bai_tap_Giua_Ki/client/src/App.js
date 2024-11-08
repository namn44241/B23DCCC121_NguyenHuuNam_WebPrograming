import React, { useState } from 'react';
import './App.css';
import TaskList from './TaskList';
import AddTask from './AddTask';

function convertDateToDayOfWeek(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Chuyển đổi dateString thành Date object
  const [day, month, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  
  // Tính số ngày chênh lệch
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Nếu trong vòng 7 ngày
  if (diffDays <= 7) {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }
  
  // Nếu hơn 7 ngày, trả về định dạng DD/MM
  return `${day}/${month}`;
}

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Học lập trình web với React', date: 'Tomorrow', completed: false },
    { id: 2, name: 'Gửi email nộp bài tập về nhà', date: 'Saturday', completed: false },
    { id: 3, name: 'Học từ vựng tiếng anh mỗi ngày', date: 'Monday', completed: false },
    { id: 4, name: 'Viết tiểu luận môn Triết học', date: 'Today', completed: false },
  ]);

  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '' && newDate !== '') {
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const formattedDate = convertDateToDayOfWeek(formatDate(newDate));
      setTasks([...tasks, { 
        id: newId,
        name: newTask, 
        date: formattedDate, 
        completed: false 
      }]);
      setNewTask('');
      setNewDate('');
    } else {
      alert("Điền đầy đủ thông tin nhiệm vụ và ngày đi má!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="app">
      <h1>
        My work <span role="img" aria-label="target">🎯</span>
      </h1>
      <TaskList tasks={tasks} onToggleComplete={toggleTaskComplete} />
      <AddTask
        newTask={newTask}
        newDate={newDate}
        setNewTask={setNewTask}
        setNewDate={setNewDate}
        addTask={addTask}
      />
    </div>
  );
}

export default App;