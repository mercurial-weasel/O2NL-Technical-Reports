import React from 'react';
import { createRoot } from 'react-dom/client';
import App2 from './App2';
import './index.css';
import { logger } from './lib/logger';

logger.info('Application starting up');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>
);