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
import Register from './components/Register';
import Calendar from './components/Calendar';
import { localStorageService } from './services/localStorage';
import EmailSubscription from './components/EmailSubscription';


function displayDateFormat(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
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
  if (diffDays < -1) return `${day}/${month}`; 
  
  // Các ngày trong tương lai (trong vòng 7 ngày)
  if (diffDays <= 7) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }
  
  // Hơn 7 ngày trong tương lai
  return `${day}/${month}`;
}

// Logic để tính ngày trong lịch (DD/MM)
function calendarDateFormat(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${day}/${month}`;
}

function convertDateToDayOfWeek(dateString) {
  return displayDateFormat(dateString);
}

function App() {


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedGuestMode = localStorage.getItem('isGuestMode') === 'true';
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsGuestMode(false);
    } else if (savedGuestMode) {
      setIsGuestMode(true);
    }
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  const [isRegistering, setIsRegistering] = useState(false);

  const [isGuestMode, setIsGuestMode] = useState(() => {
    return localStorage.getItem('isGuestMode') === 'true';
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

  const handleGuestMode = () => {
    setIsGuestMode(true);
    localStorage.setItem('isGuestMode', 'true');
    setUser(null);
    localStorage.removeItem('user');
    // Load tasks từ localStorage nếu có
    const guestTasks = localStorageService.getTasks();
    setTasks(guestTasks);
  };


  // Trong function App()
  const handleDateSelect = (date) => {
    const tasksOnDate = tasks.filter(task => {
      // Chuyển date được chọn sang định dạng DD/MM
      const selectedDay = date.getDate().toString().padStart(2, '0');
      const selectedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      const selectedDateStr = `${selectedDay}/${selectedMonth}`;
  
      // Lấy ngày hiện tại để so sánh với "Today" và "Tomorrow"
      const today = new Date();
      const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = `${tomorrow.getDate().toString().padStart(2, '0')}/${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}`;
  
      // Chuyển đổi task.date thành định dạng DD/MM để so sánh
      let taskDateStr;
      if (task.date === 'Today') {
        taskDateStr = todayStr;
      } else if (task.date === 'Tomorrow') {
        taskDateStr = tomorrowStr;
      } else if (task.date.includes('/')) {
        const [day, month] = task.date.split('/');
        taskDateStr = `${day}/${month}`;
      } else {
        // Nếu là thứ trong tuần (Wednesday,...), bỏ qua không hiển thị
        return false;
      }
  
      // So sánh ngày được chọn với ngày của task
      return selectedDateStr === taskDateStr;
    });
  
    console.log('Selected date:', date);
    console.log('Tasks on date:', tasksOnDate);
    setSelectedDateTasks(tasksOnDate);
  };

  // Sửa hàm setUser để lưu vào localStorage
  const handleLogin = async (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('isGuestMode'); // Xóa guest mode khi đăng nhập
    setUser(userData);
    setIsGuestMode(false);
    
    // Nếu đang ở guest mode, sync tasks lên server
    if (isGuestMode) {
      try {
        await localStorageService.syncTasksToServer(todoService, userData.id);
      } catch (error) {
        console.error('Error syncing tasks:', error);
      }
    }
  };

  // Sửa hàm logout để xóa khỏi localStorage
  const handleLogout = () => {
    setUser(null);
    setIsGuestMode(false);
    // Xóa hết dữ liệu liên quan đến session
    localStorage.removeItem('user');
    localStorage.removeItem('isGuestMode');
    localStorage.removeItem('guest_tasks'); // Nếu bạn lưu tasks của guest
    setTasks([]);
  };

  // Thêm hàm mới để xử lý chuyển sang form đăng nhập từ guest mode
  const switchToLogin = () => {
    setIsGuestMode(false);
    localStorage.removeItem('isGuestMode');
    // Không xóa guest_tasks để giữ dữ liệu khi user muốn quay lại guest mode
  };

  // Fetch tasks từ API khi component mount
  useEffect(() => {
    // 1. Khai báo các hàm async
    const fetchTasksFromServer = async () => {
      try {
        const data = await todoService.getAllTodos();
        console.log('Raw tasks data:', data);
    
        if (Array.isArray(data)) {
          const formattedTasks = data
            .filter(task => {
              if (user.role === 'admin') return true;
              
              const isCreator = task.created_by === user.id;
              const isAssigned = task.assigned_to === user.id;
              const hasAssignedSubtask = task.subtasks?.some(st => 
                st.assigned_to === user.id
              );
    
              return isCreator || isAssigned || hasAssignedSubtask;
            })
            .map(task => ({
              id: task.id,
              name: task.title,
              description: task.description,
              date: convertDateToDayOfWeek(formatDate(task.due_date)),
              completed: Boolean(task.completed),
              created_by: task.created_by,
              assigned_to: task.assigned_to,
              subtasks: task.subtasks
            }));
    
          console.log('Final filtered tasks:', formattedTasks);
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };
  
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        console.log('Raw users data:', data);
        
        if (data?.status === 'success' && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
          console.error('Invalid users data format:', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
  
    // 2. Logic chính của useEffect
    const loadData = async () => {
      // Nếu đang ở guest mode
      if (isGuestMode) {
        const guestTasks = localStorageService.getTasks();
        // Format lại dữ liệu từ localStorage
        const formattedTasks = guestTasks.map(task => ({
          id: task.id,
          name: task.title,
          description: task.description,
          // Chuyển đổi ngày sang định dạng hiển thị
          date: convertDateToDayOfWeek(formatDate(task.due_date)),
          completed: task.completed,
          assigned_to: null
        }));
        setTasks(formattedTasks);
        return;
      }
  
      // Nếu có user đăng nhập
      if (user) {
        // Fetch tasks cho mọi user
        await fetchTasksFromServer();
  
        // Fetch users chỉ cho admin/manager
        if (user.role === 'admin' || user.role === 'manager') {
          await fetchUsers();
        }
      }
    };
  
    // 3. Gọi hàm loadData
    loadData();
  
  }, [user, isGuestMode]); // Chạy lại khi user hoặc isGuestMode thay đổi

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
      const taskData = {
        title: newTask,
        description: '',
        due_date: newDate,
        completed: false,
        assigned_to: null,
        subtasks: []
      };
  
      if (isGuestMode) {
        // Mở modal để nhập thông tin task
        setTaskData(taskData);
        setModalOpen(true);
      } else {
        // Logic cũ cho user đăng nhập
        setTaskData(taskData);
        setModalOpen(true);
      }
    } else {
      alert("Điền đầy đủ thông tin nhiệm vụ và ngày đi má!");
    }
  };

  // Xử lý khi submit form trong modal
  const handleSubmit = async (formData) => {
    try {
      if (isGuestMode) {
        // Thêm task vào localStorage
        const newTask = localStorageService.addTask({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          subtasks: formData.subtasks || [] 
        });

        // Thêm vào state với đúng format hiển thị
        const formattedTask = {
          id: newTask.id,
          name: formData.title, // Dùng title từ form
          description: formData.description,
          date: convertDateToDayOfWeek(formatDate(formData.due_date)), // Dùng due_date từ form
          completed: false,
          assigned_to: null,
          subtasks: formData.subtasks || [] 
        };
        
        setTasks(prev => [...prev, {
          id: newTask.id,
          name: newTask.title,
          description: newTask.description,
          date: convertDateToDayOfWeek(formatDate(newTask.due_date)),
          completed: false,
          assigned_to: null
        }]);
      } else {
        // Logic cho user đăng nhập
        const response = await todoService.createTodo({
          title: formData.title,
          description: formData.description || '',
          due_date: formData.due_date, // Giữ nguyên ngày được chọn
          completed: false,
          created_by: user.id,
          assigned_to: formData.assigned_to
        });

        // Thêm vào state với đúng format
        const formattedTask = {
          id: response.id,
          name: formData.title, // Dùng title từ form
          description: formData.description,
          date: convertDateToDayOfWeek(formatDate(formData.due_date)), // Dùng due_date từ form
          completed: false,
          created_by: response.created_by,
          assigned_to: response.assigned_to
        };
        
        setTasks(prev => [...prev, formattedTask]);
      }

      // Reset form và đóng modal sau khi đã thêm task thành công
      setModalOpen(false);
      setTaskData({
        title: '',
        description: '',
        due_date: '',
        completed: false,
        assigned_to: null
      });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Có lỗi xảy ra khi tạo nhiệm vụ!');
    }
  };
  
  // Xử lý toggle completed
  const toggleTaskComplete = async (taskId) => {
    if (isGuestMode) {
      // Xử lý trong localStorage
      const updatedTask = localStorageService.toggleTaskComplete(taskId);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId ? {...t, completed: !t.completed} : t
          )
        );
      }
      return;
    }
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
    if (isGuestMode) {
      // Chuyển đổi ngày từ định dạng hiển thị sang YYYY-MM-DD
      const convertedDate = convertDateFormat(task.date);
      
      setEditingTask(task);
      setTaskData({
        id: task.id,
        title: task.name,
        description: task.description || '',
        due_date: convertedDate, // Sử dụng hàm convertDateFormat đã có
        completed: task.completed,
        subtasks: task.subtasks || []
      });
      setEditModalOpen(true);
      return;
    }
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
    if (isGuestMode) {
      // Delete từ localStorage
      localStorageService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      return;
    }
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
  
      if (isGuestMode) {
        // Xử lý update trong localStorage
        const updatedTask = localStorageService.updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date, // Giữ nguyên ngày từ form
          completed: formData.completed,
          assigned_to: null,
          subtasks: formData.subtasks || [] 
        });
  
        // Cập nhật state với format hiển thị
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === editingTask.id 
              ? {
                  ...t,
                  name: formData.title,
                  description: formData.description,
                  date: convertDateToDayOfWeek(formatDate(formData.due_date)),
                  completed: formData.completed,
                  assigned_to: null,
                  subtasks: formData.subtasks || [] 
                }
              : t
          )
        );
      } else {
        // Xử lý update khi đăng nhập
        const updatedTaskData = {
          title: formData.title,
          description: formData.description || '',
          due_date: formData.due_date, // Giữ nguyên ngày từ form
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
  
        // Cập nhật state với dữ liệu từ form
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === editingTask.id 
              ? {
                  ...t,
                  name: formData.title,
                  description: formData.description,
                  date: convertDateToDayOfWeek(formatDate(formData.due_date)),
                  completed: formData.completed,
                  assigned_to: formData.assigned_to,
                  created_by: response.created_by
                }
              : t
          )
        );
      }
  
      // Reset form sau khi update thành công
      setEditModalOpen(false);
      setEditingTask(null);
      setTaskData({
        title: '',
        description: '',
        due_date: '',
        completed: false,
        assigned_to: null
      });
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Có lỗi xảy ra khi cập nhật nhiệm vụ!');
    }
  };

  const handleEmailSubscribe = async (email) => {
    try {
      // Cập nhật user preferences trong database
      await userService.updateEmailPreferences(user.id, {
        email: email,
        notifyDueTasks: true,
        notifyAssignedTasks: true
      });
      
      // Cập nhật state nếu cần
      setUser(prev => ({
        ...prev,
        email: email,
        emailNotifications: true
      }));
    } catch (error) {
      console.error('Error updating email preferences:', error);
    }
  };

  if (!user && !isGuestMode) {
    return (
      isRegistering ? (
        <Register 
          onRegisterSuccess={() => {
            setIsRegistering(false);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
          }} 
        />
      ) : (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => setIsRegistering(true)}
          onGuestMode={handleGuestMode}  // Thêm prop này
        />
      )
    );
  }

  // Trong phần return của App.js
  return (
    <div className="app">
      <h1>
        <div>
          My work <span role="img" aria-label="target">🎯</span>
        </div>
        <div className="user-info">
          <span>{isGuestMode ? 'Khách' : user?.username}</span>
          {isGuestMode ? (
            <button 
              onClick={switchToLogin} 
              className="login-button"
            >
              Đăng nhập
            </button>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          )}
        </div>
      </h1>
      
      <div className="sort-buttons">
      <button 
          className={`sort-button ${showCalendar ? 'active' : ''}`}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          Lịch
        </button>
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
      {showCalendar ? (
      <div className="calendar-view">
        <div className="calendar-section">
          <Calendar tasks={tasks} onSelectDate={handleDateSelect} />
        </div>
        <div className="tasks-section">
          <h3>Công việc trong ngày</h3>
          {selectedDateTasks.length > 0 ? (
            <TaskList 
              tasks={selectedDateTasks}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
            />
          ) : (
            <p>Không có công việc nào trong ngày này</p>
          )}
        </div>
      </div>
    ) : isColorSorted ? (
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
            <h3>Sắp đến hạn..</h3>
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
      
      {user && !isGuestMode && (
        <EmailSubscription 
          user={user}
          onSubscribe={handleEmailSubscribe}
        />
      )}
    </div>
  );
}

export default App;