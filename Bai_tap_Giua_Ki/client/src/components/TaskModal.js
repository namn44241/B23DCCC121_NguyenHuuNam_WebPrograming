import React, { useEffect } from 'react';
import { Checkbox } from '@mui/material';

function TaskModal({ open, handleClose, taskData, setTaskData, handleSubmit }) {
  // Ngăn scroll của body khi modal mở
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmitWithComplete = () => {
    // Đảm bảo trạng thái completed được gửi đi
    handleSubmit({
      ...taskData,
      completed: taskData.completed || false
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thêm nhiệm vụ mới</h2>
        
        <div className="modal-body">
          <div className="form-field">
            <label>Tiêu đề *</label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            />
          </div>

          <div className="form-field">
            <label>Mô tả</label>
            <textarea
              value={taskData.description || ''}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            />
          </div>

          <div className="form-field">
            <label>Ngày đến hạn *</label>
            <input
              type="date"
              value={taskData.due_date}
              onChange={(e) => setTaskData({...taskData, due_date: e.target.value})}
            />
          </div>

          <div className="form-field checkbox">
            <Checkbox
              checked={taskData.completed || false}
              onChange={(e) => setTaskData({...taskData, completed: e.target.checked})}
            />
            <label>Đã hoàn thành</label>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleClose}>Hủy</button>
          <button className="btn-submit" onClick={handleSubmitWithComplete}>Thêm nhiệm vụ</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;