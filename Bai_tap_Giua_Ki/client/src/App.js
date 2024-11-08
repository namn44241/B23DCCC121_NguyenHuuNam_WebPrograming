import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskList from './TaskList';
import AddTask from './AddTask';
import TaskModal from './components/TaskModal';
import { todoService } from './services/todoService';

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
  
  // Xử lý các ngày
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${day}/${month}`; // Các ngày trong quá khứ
  
  // Các ngày trong tương lai (trong vòng 7 ngày)
  if (diffDays <= 7) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }
  
  // Hơn 7 ngày trong tương lai
  return `${day}/${month}`;
}

function App() {
  // State cho danh sách tasks và form input
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  
  // State cho modal
  const [modalOpen, setModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false
  });

  // Fetch tasks từ API khi component mount
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await todoService.getAllTodos();
        const formattedTasks = data.map(task => ({
          id: task.id,
          name: task.title,
          date: convertDateToDayOfWeek(formatDate(task.due_date)),
          completed: Boolean(task.completed)
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    getTasks();
  }, []);

  // Lấy tasks từ backend
  const fetchTasks = async () => {
    try {
      const data = await todoService.getAllTodos();
      // Chuyển đổi định dạng ngày cho mỗi task
      const formattedTasks = data.map(task => ({
        id: task.id,
        name: task.title,
        date: convertDateToDayOfWeek(formatDate(task.due_date)),
        completed: Boolean(task.completed)
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Format date từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Xử lý khi click nút thêm task
  const addTask = () => {
    if (newTask.trim() !== '' && newDate !== '') {
      setTaskData({
        title: newTask,
        description: '',
        due_date: newDate,
        completed: false
      });
      setModalOpen(true);
    } else {
      alert("Điền đầy đủ thông tin nhiệm vụ và ngày đi má!");
    }
  };

  // Xử lý khi submit form trong modal
  const handleSubmit = async () => {
    try {
      const response = await todoService.createTodo(taskData);
      const newTask = {
        id: response.data.id,
        name: response.data.title,
        date: convertDateToDayOfWeek(formatDate(response.data.due_date)),
        completed: Boolean(response.data.completed)
      };
      
      setTasks([...tasks, newTask]);
      setModalOpen(false);
      setNewTask('');
      setNewDate('');
      setTaskData({
        title: '',
        description: '',
        due_date: '',
        completed: false
      });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Có lỗi xảy ra khi thêm nhiệm vụ!');
    }
  };

  // Xử lý toggle completed
  const toggleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await todoService.updateTodo(taskId, {
          title: task.name,
          completed: !task.completed,
          due_date: task.date // Giữ nguyên date hiện tại
        });
        
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
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
      <TaskModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        taskData={taskData}
        setTaskData={setTaskData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;