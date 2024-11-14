// Hàm helper để tạo task mới với ID tăng dần
const getNextId = (tasks) => {
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(task => task.id)) + 1;
  };
  
  // Hàm helper để format date
  const formatDate = (date) => {
    if (!date) return '';
    // Trả về định dạng YYYY-MM-DD để lưu trữ
    return new Date(date).toISOString().split('T')[0];
  };
  
  export const localStorageService = {
    // Lấy tất cả tasks từ localStorage
    getTasks: () => {
        const tasks = JSON.parse(localStorage.getItem('guest_tasks') || '[]');
        return tasks.map(task => ({
          ...task,
          // Đảm bảo giữ nguyên due_date khi lấy ra
          due_date: task.due_date
        }));
      },
  
    // Thêm task mới
    addTask: (taskData) => {
        const tasks = localStorageService.getTasks();
        const newTask = {
          id: getNextId(tasks),
          title: taskData.title,
          description: taskData.description || '',
          due_date: formatDate(taskData.due_date), // Lưu ngày gốc
          completed: false,
          created_by: 'guest',
          assigned_to: null
        };
    
        tasks.push(newTask);
        localStorage.setItem('guest_tasks', JSON.stringify(tasks));
        return newTask;
      },
  
    // Cập nhật task
    updateTask: (taskId, updatedData) => {
      const tasks = localStorageService.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          ...updatedData,
          assigned_to: null, // Đảm bảo không có assigned_to
          id: taskId // Giữ nguyên ID
        };
        
        if (updatedData.subtasks) {
          tasks[taskIndex].subtasks = updatedData.subtasks.map(st => ({
            ...st,
            assigned_to: null,
            created_by: 'guest'
          }));
        }
  
        localStorage.setItem('guest_tasks', JSON.stringify(tasks));
        return tasks[taskIndex];
      }
      return null;
    },
  
    // Xóa task
    deleteTask: (taskId) => {
      const tasks = localStorageService.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      localStorage.setItem('guest_tasks', JSON.stringify(filteredTasks));
      return true;
    },
  
    // Toggle trạng thái completed của task
    toggleTaskComplete: (taskId) => {
      const tasks = localStorageService.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('guest_tasks', JSON.stringify(tasks));
        return tasks[taskIndex];
      }
      return null;
    },
  
    // Sync tasks lên server khi user đăng nhập
    syncTasksToServer: async (todoService, userId) => {
      const tasks = localStorageService.getTasks();
      const syncedTasks = [];
  
      for (let task of tasks) {
        try {
          // Chuyển đổi format task để phù hợp với API
          const taskForApi = {
            title: task.name,
            description: task.description || '',
            due_date: task.date,
            completed: task.completed ? 1 : 0,
            created_by: userId,
            subtasks: task.subtasks?.map(st => ({
              title: st.name,
              description: st.description || '',
              due_date: st.date,
              completed: st.completed ? 1 : 0,
              created_by: userId
            })) || []
          };
  
          const createdTask = await todoService.createTask(taskForApi);
          syncedTasks.push(createdTask);
        } catch (error) {
          console.error('Error syncing task:', error);
        }
      }
  
      // Xóa tasks khỏi localStorage sau khi sync thành công
      if (syncedTasks.length > 0) {
        localStorage.removeItem('guest_tasks');
      }
  
      return syncedTasks;
    },
  
    // Xóa tất cả data trong localStorage
    clearAll: () => {
      localStorage.removeItem('guest_tasks');
    }
  };