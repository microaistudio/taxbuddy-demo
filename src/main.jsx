/**
 * @file main.jsx
 * @path ./taxbuddy-chat-demo/src/main.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - React app entry point
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/chat.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)