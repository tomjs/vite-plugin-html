import { Button, Calendar, DatePicker } from 'antd';
import { useState } from 'react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button type="primary" onClick={() => setCount(count => count + 1)}>
          count is {count}
        </Button>
        <div style={{ marginTop: 16 }}>
          <DatePicker />
        </div>
        <div style={{ marginTop: 16 }}>
          <Calendar />
        </div>
      </div>
    </>
  );
}

export default App;
