function EditTaskModal({ open, handleClose, taskData, setTaskData, handleSubmit, handleDelete }) {
    if (!open) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Sửa nhiệm vụ #{taskData.id}</h2>
          
          <div className="modal-body">
            <div className="form-field">
              <label>Tiêu đề *</label>
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                required
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
                required
              />
            </div>
  
            <div className="form-field">
              <label>
                <input
                  type="checkbox"
                  checked={taskData.completed}
                  onChange={(e) => setTaskData({...taskData, completed: e.target.checked})}
                />
                Đã hoàn thành
              </label>
            </div>
          </div>
  
          <div className="modal-footer">
            <button onClick={handleClose} className="btn-cancel">
                Hủy
            </button>
            <button onClick={handleDelete} className="btn-delete">
                Xóa
            </button>
            <button onClick={handleSubmit} className="btn-submit">
                Lưu thay đổi
            </button>
            </div>
          </div>
        </div>
    );
  }
  
  export default EditTaskModal;