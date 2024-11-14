import React from 'react';

function AddTask({ newTask, newDate, setNewTask, setNewDate, addTask }) {
  return (
    <div className="add-task">
      <button className="add-button" onClick={addTask}>+</button>
      <input
        type="text"
        placeholder="Nhiệm vụ cần thực hiện"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
    </div>
  );
}

export default AddTask;