import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './TaskList';
import AddTask from './AddTask';
import TaskModal from './components/TaskModal';
import EditTaskModal from './components/EditTaskModal';
import Login from './components/Login';
import { todoService } from './services/todoService';
import { getColorByDueDate } from './Task';
import { userService } from './services/userService';



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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // State cho danh sách tasks và form input
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [users, setUsers] = useState([]);

  const [sortOrder, setSortOrder] = useState('asc'); 
  const [isColorSorted, setIsColorSorted] = useState(false);
  const [isCompletedSorted, setIsCompletedSorted] = useState(false);
  const [isDateSorted, setIsDateSorted] = useState(false);
  const [dateSortOrder, setDateSortOrder] = useState('asc');
  
  // State cho modal
  const [modalOpen, setModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false,
    assigned_to: null  // Thêm assigned_to
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Sửa hàm setUser để lưu vào localStorage
  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Sửa hàm logout để xóa khỏi localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Có thể thêm reset các state khác nếu cần
    setTasks([]);
    setUsers([]);
  };

  // Fetch tasks từ API khi component mount
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await todoService.getAllTodos();
        console.log('Received tasks:', data); // Thêm log để debug
        if (Array.isArray(data)) {
          const formattedTasks = data
            // Lọc tasks theo quyền ở client
            .filter(task => {
              if (!user) return false;
              if (user.role === 'admin') return true;
              if (user.role === 'manager') return true;
              return task.assigned_to === user.id;
            })
            .map(task => ({
              id: task.id,
              name: task.title,
              description: task.description,
              date: convertDateToDayOfWeek(formatDate(task.due_date)),
              completed: Boolean(task.completed),
              assigned_to: task.assigned_to
            }));
          setTasks(formattedTasks);
          console.log('Fetched tasks:', data);
        } else {
          console.error('Invalid data format:', data);
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };

    const getUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        console.log('Raw users data:', data); // Log để kiểm tra format
        
        // Kiểm tra và xử lý data từ API
        if (data && data.status === 'success' && Array.isArray(data.data)) {
          setUsers(data.data); // Lấy mảng users từ data.data
        } else {
          setUsers([]); // Set empty array nếu không có data hợp lệ
          console.error('Invalid users data format:', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Set empty array khi có lỗi
      }
    };

    if (user) {
      getTasks();
      if (user.role === 'admin' || user.role === 'manager') {
        getUsers(); // Chỉ admin và manager mới cần danh sách users
      }
    }
  }, [user]);

  // Thêm hàm xử lý sort theo ngày
  const handleSortByDate = () => {
    setDateSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setIsDateSorted(true);
    setIsColorSorted(false);
    setIsCompletedSorted(false);
    
    setTasks(prev => [...prev].sort((a, b) => {
      const dateA = new Date(convertDateFormat(a.date));
      const dateB = new Date(convertDateFormat(b.date));
      return dateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }));
  };

  // Thêm hàm hỗ trợ chuyển đổi format ngày
  const convertDateFormat = (dateStr) => {
    // Xử lý các trường hợp đặc biệt
    if (dateStr === 'Today') {
      return new Date().toISOString().split('T')[0];
    }
    if (dateStr === 'Tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    if (dateStr === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }
  
    // Xử lý các ngày trong tuần
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (daysOfWeek.includes(dateStr)) {
      const today = new Date();
      const currentDay = today.getDay();
      const targetDay = daysOfWeek.indexOf(dateStr);
      const diff = targetDay - currentDay;
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + diff);
      return targetDate.toISOString().split('T')[0];
    }
  
    // Xử lý định dạng dd/mm
    if (dateStr.includes('/')) {
      const [day, month] = dateStr.split('/');
      const year = new Date().getFullYear();
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  
    // Trả về ngày hiện tại nếu không match với format nào
    return new Date().toISOString().split('T')[0];
  };

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
  
  // Thêm hàm xử lý sort theo completed
  const handleSortByCompleted = () => {
    setIsCompletedSorted(prev => !prev);
    setIsColorSorted(false); 
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
        completed: false,
        assigned_to: null,  // Thêm assigned_to
        subtasks: [] 
      });
      setModalOpen(true);
    } else {
      alert("Điền đầy đủ thông tin nhiệm vụ và ngày đi má!");
    }
  };

  // Xử lý khi submit form trong modal
  const handleSubmit = async (formData) => { 
    try {
      console.log('Sending task data:', formData);
  
      const taskToCreate = {
        title: formData.title,
        description: formData.description || '',
        due_date: formData.due_date,
        completed: formData.completed ? 1 : 0,
        created_by: user.id,
        assigned_to: formData.assigned_to || null,
        subtasks: formData.subtasks?.map(subtask => ({
          title: subtask.title,
          description: subtask.description || '',
          due_date: subtask.due_date,
          completed: subtask.completed ? 1 : 0,
          created_by: user.id,
          assigned_to: subtask.assigned_to || null
        }))
      };
  
      console.log('Task to create:', taskToCreate);
  
      const response = await todoService.createTodo(taskToCreate);
      console.log('Server response:', response);
  
      const newTask = {
        id: response.id,
        name: response.title,
        description: response.description,
        date: convertDateToDayOfWeek(formatDate(response.due_date)),
        completed: Boolean(response.completed),
        assigned_to: response.assigned_to,  // Thêm assigned_to
        created_by: response.created_by,
        created_by_name: response.created_by_name
      };
      
      setTasks([...tasks, newTask]);
      setModalOpen(false);
      setNewTask('');
      setNewDate('');
      setTaskData({
        title: '',
        description: '',
        due_date: '',
        completed: false,
        assigned_to: null  // Reset assigned_to
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
        
        // Gửi tất cả thông tin của task, thêm created_by
        const updatedTaskData = {
          title: taskDetail.title,
          description: taskDetail.description,
          due_date: isoDate,
          completed: task.completed ? 0 : 1,
          created_by: user.id,  // Thêm created_by
          assigned_to: taskDetail.assigned_to
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
        completed: Boolean(taskDetail.completed),
        assigned_to: taskDetail.assigned_to,  // Thêm assigned_to
        subtasks: taskDetail.subtasks || [] 
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
  const handleUpdateTask = async (formData) => {
    try {
      console.log('Current formData:', formData);

      const date = new Date(formData.due_date);
      const isoDate = date.toISOString().split('T')[0];
  
      const updatedTaskData = {
        title: formData.title,
        description: formData.description || '',
        due_date: isoDate,
        completed: formData.completed ? 1 : 0,
        created_by: user.id,
        assigned_to: formData.assigned_to || null,
        subtasks: formData.subtasks?.map(subtask => ({
          title: subtask.title,
          description: subtask.description || '',
          due_date: subtask.due_date,
          completed: subtask.completed ? 1 : 0,
          created_by: user.id,
          assigned_to: subtask.assigned_to || null
        }))
      };
  
      console.log('Sending to server:', updatedTaskData);
  
      const response = await todoService.updateTodo(editingTask.id, updatedTaskData);
      
      console.log('Server response:', response);
  
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === editingTask.id 
            ? {
                ...t,
                name: response.title,
                description: response.description,
                date: convertDateToDayOfWeek(formatDate(response.due_date)),
                completed: Boolean(response.completed),
                assigned_to: response.assigned_to,  // Thêm assigned_to
                created_by: response.created_by,
                created_by_name: response.created_by_name
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
        completed: false,
        assigned_to: null  // Reset assigned_to
      });
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật nhiệm vụ!');
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Trong phần return của App.js
  return (
    <div className="app">
      <h1>
        My work <span role="img" aria-label="target">🎯</span>
      </h1>

      <div className="user-info">
        <span>{user.username}</span>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </div>
      
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
        <button 
          className={`sort-button ${isCompletedSorted ? 'active' : ''}`} 
          onClick={handleSortByCompleted}
        >
          Đã hoàn thành
        </button>
          <button 
          className={`sort-button ${isDateSorted ? 'active' : ''}`} 
          onClick={handleSortByDate}
        >
          Sắp xếp theo ngày {dateSortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <AddTask
        newTask={newTask}
        newDate={newDate}
        setNewTask={setNewTask}
        setNewDate={setNewDate}
        addTask={addTask}
      />
  
        {isColorSorted ? (
        <div className="color-sorted-list">
          <div className="color-column">
            <h3>Làm gấp!!</h3>
            <TaskList
              tasks={tasks.filter(task => getColorByDueDate(task.date) === 'red')}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
          
          <div className="color-column">
            <h3>Trong tuần</h3>
            <TaskList
              tasks={tasks.filter(task => getColorByDueDate(task.date) === 'orange')}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
          
          <div className="color-column">
            <h3>Còn lâu mới tới hạn..</h3>
            <TaskList
              tasks={tasks.filter(task => getColorByDueDate(task.date) === 'green')}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
        </div>
      ) : isCompletedSorted ? (
        <div className="color-sorted-list">
          <div className="color-column">
            <h3>Đã hoàn thành</h3>
            <TaskList 
              tasks={tasks.filter(task => task.completed)}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
          <div className="color-column">
            <h3>Chưa hoàn thành</h3>
            <TaskList 
              tasks={tasks.filter(task => !task.completed)}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          </div>
        </div>
      ) : isDateSorted ? (
        <TaskList 
          tasks={tasks}
          onToggleComplete={toggleTaskComplete}
          onEdit={handleEditTask}
        />
      ) : (
        <TaskList 
          tasks={tasks}
          onToggleComplete={toggleTaskComplete}
          onEdit={handleEditTask}
        />
      )}
      
      <TaskModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        taskData={taskData}
        setTaskData={setTaskData}
        handleSubmit={handleSubmit}
        user={user}    
        users={users}
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
            completed: false,
            assigned_to: null,  // Reset assigned_to
            subtasks: []
          });
        }}
        taskData={taskData}
        setTaskData={setTaskData}
        handleSubmit={handleUpdateTask}
        currentUser={user}  
        users={users}
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