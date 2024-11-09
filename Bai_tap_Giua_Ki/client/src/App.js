import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './TaskList';
import AddTask from './AddTask';
import TaskModal from './components/TaskModal';
import EditTaskModal from './components/EditTaskModal';
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

  const [sortOrder, setSortOrder] = useState('asc'); 
  const [isColorSorted, setIsColorSorted] = useState(false);
  
  // State cho modal
  const [modalOpen, setModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks từ API khi component mount
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await todoService.getAllTodos();
        const formattedTasks = data.map(task => ({
          id: task.id,
          name: task.title,
          description: task.description, // Thêm description vào state
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


  // Hàm sắp xếp theo ID
  const handleSortById = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setTasks(prev => [...prev].sort((a, b) => {
      return sortOrder === 'asc' ? b.id - a.id : a.id - b.id;
    }));
  };

  // Hàm sắp xếp theo màu
  const handleSortByColor = () => {
    setIsColorSorted(prev => !prev);
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
      // Log để kiểm tra dữ liệu gửi đi
      console.log('Sending task data:', taskData);
  
      const taskToCreate = {
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.due_date,
        completed: taskData.completed ? 1 : 0  // Chuyển boolean thành 0/1 cho MySQL
      };
  
      const response = await todoService.createTodo(taskToCreate);
      
      // Log để kiểm tra response
      console.log('Server response:', response);
  
      // Tạo task mới với trạng thái completed đúng
      const newTask = {
        id: response.data.id,
        name: response.data.title,
        description: response.data.description, 
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
        // Lấy task detail từ server
        const taskDetail = await todoService.getTodoById(taskId);
        
        // Xử lý ngày tháng - thêm 1 ngày để bù trừ múi giờ
        const date = new Date(taskDetail.due_date);
        date.setDate(date.getDate() + 1);
        const isoDate = date.toISOString().split('T')[0];
        
        // Gửi tất cả thông tin của task, chỉ đổi completed
        const updatedTaskData = {
          title: taskDetail.title,
          description: taskDetail.description,
          due_date: isoDate, // Sử dụng ngày đã được xử lý
          completed: task.completed ? 0 : 1
        };
  
        console.log('Sending toggle data:', updatedTaskData);
  
        await todoService.updateTodo(taskId, updatedTaskData);
        
        // Cập nhật UI
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId 
              ? {...t, completed: !t.completed}
              : t
          )
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

   // Thêm hàm xử lý edit task
   const handleEditTask = async (task) => {
    try {
      const taskDetail = await todoService.getTodoById(task.id);
      
      console.log('Task detail from server:', taskDetail);
      
      // Xử lý ngày tháng
      const date = new Date(taskDetail.due_date);
      date.setDate(date.getDate() + 1); // Thêm 1 ngày để bù trừ
      const formattedDate = date.toISOString().split('T')[0];
      
      console.log('Original date:', taskDetail.due_date);
      console.log('Formatted date:', formattedDate);
      
      setEditingTask(task);
      setTaskData({
        id: task.id,
        title: taskDetail.title,
        description: taskDetail.description || '',
        due_date: formattedDate,
        completed: Boolean(taskDetail.completed)
      });
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error getting task detail:', error);
      alert('Có lỗi xảy ra khi lấy thông tin nhiệm vụ!');
    }
  };

  // Thêm hàm xử lý delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await todoService.deleteTodo(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Có lỗi xảy ra khi xóa nhiệm vụ!');
    }
  };

  // Thêm hàm xử lý update task
  const handleUpdateTask = async () => {
    try {
      // Log để kiểm tra dữ liệu đầu vào
      console.log('Current taskData:', taskData);
      console.log('Current editingTask:', editingTask);
  
      // Xử lý ngày tháng
      const date = new Date(taskData.due_date);
      const isoDate = date.toISOString().split('T')[0];
      
      console.log('Original due_date:', taskData.due_date);
      console.log('Processed date:', isoDate);
  
      const updatedTaskData = {
        title: taskData.title,
        description: taskData.description || '',
        due_date: isoDate,
        completed: taskData.completed ? 1 : 0
      };
  
      console.log('Sending to server:', updatedTaskData);
  
      // Gọi API update
      const response = await todoService.updateTodo(editingTask.id, updatedTaskData);
      
      console.log('Server response:', response);
  
      if (!response || !response.due_date) {
        throw new Error('Invalid server response');
      }
  
      // Cập nhật UI
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === editingTask.id 
            ? {
                ...t,
                name: response.title,
                description: response.description,
                date: convertDateToDayOfWeek(formatDate(response.due_date)),
                completed: Boolean(response.completed)
              }
            : t
        )
      );
      
      setEditModalOpen(false);
      setEditingTask(null);
      setTaskData({
        title: '',
        description: '',
        due_date: '',
        completed: false
      });
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật nhiệm vụ!');
    }
  };

  // Trong phần return của App.js
  return (
    <div className="app">
      <h1>
        My work <span role="img" aria-label="target">🎯</span>
      </h1>
      
      <div className="sort-buttons">
        <button 
          className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`} 
          onClick={handleSortById}
        >
          Sắp xếp theo ID {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
        <button 
          className={`sort-button ${isColorSorted ? 'active' : ''}`} 
          onClick={handleSortByColor}
        >
          Sắp xếp theo màu
        </button>
      </div>
  
      {!isColorSorted ? (
        <TaskList 
          tasks={tasks} 
          onToggleComplete={toggleTaskComplete}
          onEdit={handleEditTask}
        />
      ) : (
        <div className="color-sorted-list">
          <div className="color-column">
            <h3>Gấp</h3>
            <TaskList
              tasks={tasks.filter(task => task.date === 'Today' || task.date.includes('Yesterday'))}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
          
          <div className="color-column">
            <h3>Trong tuần</h3>
            <TaskList
              tasks={tasks.filter(task => 
                task.date === 'Tomorrow' || 
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(task.date)
              )}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
          
          <div className="color-column">
            <h3>Lâu hơn</h3>
            <TaskList
              tasks={tasks.filter(task => {
                if (!task.date.includes('/')) return false;
                const [day, month] = task.date.split('/');
                const taskDate = new Date(new Date().getFullYear(), month - 1, day);
                const diffTime = taskDate.getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays > 7;
              })}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
        </div>
      )}
  
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
      
      <EditTaskModal
        open={editModalOpen}
        handleClose={() => {
          setEditModalOpen(false);
          setEditingTask(null);
          setTaskData({
            title: '',
            description: '',
            due_date: '',
            completed: false
          });
        }}
        taskData={taskData}
        setTaskData={setTaskData}
        handleSubmit={handleUpdateTask}
        handleDelete={() => {
          if (window.confirm('Bạn có chắc muốn xóa nhiệm vụ này?')) {
            handleDeleteTask(editingTask.id);
            setEditModalOpen(false);
          }
        }}
      />
    </div>
  );
}

export default App;