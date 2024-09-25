import React, { useState } from 'react';
import './App.css';

function Task({ task }) {
  return (
    <div className="task">
      <input type="checkbox" checked={task.completed} onChange={() => {}} />
      <span className={`task-text ${task.color}`}>{task.name}</span>
      <span className="task-date">{task.date}</span>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([
    { name: 'Học lập trình web với React', date: 'Tomorrow', color: 'blue', completed: false },
    { name: 'Gửi email nộp bài tập về nhà', date: 'Saturday', color: 'red', completed: false },
    { name: 'Học từ vựng tiếng anh mỗi ngày', date: 'Monday', color: 'orange', completed: false },
    { name: 'Viết tiểu luận môn Triết học', date: 'Today', color: 'green', completed: false },
  ]);

  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newColor, setNewColor] = useState('');

  // Hàm thêm task
  const addTask = () => {
    if (newTask.trim() !== '' && newDate !== '' && newColor !== '') {
      setTasks([...tasks, { name: newTask, date: formatDate(newDate), color: newColor, completed: false }]);
      setNewTask('');
      setNewDate('');
      setNewColor('');
    } else {
      alert("Please fill all fields");
    }
  };

  // Hàm format lại ngày
  const formatDate = (dateString) => {
    const today = new Date();
    const selectedDate = new Date(dateString);
  
    const differenceInTime = selectedDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday'; // Không cần nếu không muốn hiển thị
    } else {
      const options = { weekday: 'long' };
      return selectedDate.toLocaleDateString('en-US', options); // Hiển thị thứ
    }
  };
  

  return (
    <div className="app">
      <h1>
        My work <span role="img" aria-label="target">🎯</span>
      </h1>
      <div className="task-list">
        {tasks.map((task, index) => (
          <Task key={index} task={task} />
        ))}
      </div>

      <div className="add-task">
        <button className="add-button" onClick={addTask}>+</button>
        <input
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <select value={newColor} onChange={(e) => setNewColor(e.target.value)}>
          <option value="">Select color</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="green">Green</option>
        </select>
      </div>
    </div>
  );
}

export default App;
