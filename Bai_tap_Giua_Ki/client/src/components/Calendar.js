import React, { useState, useEffect } from 'react';

function Calendar({ tasks, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Lấy ngày đầu tiên của tháng
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Lấy ngày cuối cùng của tháng
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Tạo mảng các ngày trong tháng
  const getDaysInMonth = () => {
    const days = [];
    const startDay = firstDayOfMonth.getDay();
    
    // Thêm ngày của tháng trước
    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(firstDayOfMonth);
      prevDate.setDate(prevDate.getDate() - (startDay - i));
      days.push({
        date: prevDate,
        isCurrentMonth: false
      });
    }

    // Thêm ngày của tháng hiện tại
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push({
        date: currentDateObj,
        isCurrentMonth: true
      });
    }

    return days;
  };

  // Kiểm tra ngày có task không
  const getTaskCountForDate = (date) => {
    let count = 0;
    const targetDay = date.getDate().toString().padStart(2, '0');
    const targetMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const targetDateStr = `${targetDay}/${targetMonth}`;
  
    // Lấy ngày hiện tại để so sánh với Today và Tomorrow
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getDate().toString().padStart(2, '0')}/${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}`;
  
    tasks.forEach(task => {
      let taskDateStr;
      if (task.date === 'Today') {
        taskDateStr = todayStr;
      } else if (task.date === 'Tomorrow') {
        taskDateStr = tomorrowStr;
      } else if (task.date.includes('/')) {
        const [day, month] = task.date.split('/');
        taskDateStr = `${day}/${month}`;
      } else {
        // Bỏ qua các task có date là thứ trong tuần
        return;
      }
  
      if (targetDateStr === taskDateStr) {
        count++;
      }
    });
  
    return count;
  };

  // Kiểm tra có phải ngày hôm nay không
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="days">
          {getDaysInMonth().map((dayObj, index) => (
            <div
            key={index}
            className={`day 
              ${dayObj.isCurrentMonth ? '' : 'other-month'}
              ${isToday(dayObj.date) ? 'today' : ''}
              ${getTaskCountForDate(dayObj.date) === 1 ? 'one-task' : ''}
              ${getTaskCountForDate(dayObj.date) >= 2 && getTaskCountForDate(dayObj.date) <= 4 ? 'multiple-tasks' : ''}
              ${selectedDate && dayObj.date.getTime() === selectedDate.getTime() ? 'selected' : ''}`
            }
            onClick={() => handleDateClick(dayObj.date)}
          >
            {dayObj.date.getDate()}
            {getTaskCountForDate(dayObj.date) > 0 && (
              <span className="task-count">{getTaskCountForDate(dayObj.date)}</span>
            )}
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;