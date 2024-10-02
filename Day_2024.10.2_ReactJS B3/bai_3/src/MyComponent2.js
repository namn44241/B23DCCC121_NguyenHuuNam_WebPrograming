import React, { useState } from 'react';

function Counter() {
  // Sử dụng useState để khai báo state count, với giá trị khởi tạo là 3
  const [count, setCount] = useState(3);

  return (
    <div>
      <p>You clicked {count} times</p>
      {/* Hàm onClick sẽ tăng giá trị count lên 1 mỗi khi bấm */}
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;
