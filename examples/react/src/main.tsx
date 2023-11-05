import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

setTimeout(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}, 1000);
