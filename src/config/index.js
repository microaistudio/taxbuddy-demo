/**
 * @file index.js
 * @path ./taxbuddy-chat-demo/src/config/index.js
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation
 */

const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'TaxBuddy',
    version: import.meta.env.VITE_APP_VERSION || '0.1.0',
    environment: import.meta.env.VITE_NODE_ENV || 'development',
  },
  chat: {
    maxMessageLength: parseInt(import.meta.env.VITE_MAX_MESSAGE_LENGTH) || 10000,
    maxHistorySize: parseInt(import.meta.env.VITE_MAX_HISTORY_SIZE) || 100,
    typingIndicatorDelay: parseInt(import.meta.env.VITE_TYPING_INDICATOR_DELAY) || 1000,
  },
  ui: {
    theme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    animationDuration: parseInt(import.meta.env.VITE_ANIMATION_DURATION) || 300,
  },
  storage: {
    prefix: import.meta.env.VITE_STORAGE_PREFIX || 'taxbuddy_',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
  },
};

export default config;