/**
 * @file App.jsx
 * @path ./taxbuddy-chat-demo/src/App.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Main TaxBuddy app component
 */

import React, { useState, useEffect } from 'react'
import ChatInterface from '@components/ChatInterface'
import StatusPanel from '@components/StatusPanel'
import UserProfile from '@components/UserProfile'
import QuickActionsSidebar from '@components/QuickActionsSidebar'
import LiveStatistics from '@components/LiveStatistics'
import { authService } from '@services/authSimulation'
import config from '@config'

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLaptop, setIsLaptop] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    initializeApp()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const newIsMobile = width < 768
      const newIsTablet = width >= 768 && width < 1024
      const newIsLaptop = width >= 1024 && width < 1400
      const newIsDesktop = width >= 1400
      
      setIsMobile(newIsMobile)
      setIsTablet(newIsTablet)
      setIsLaptop(newIsLaptop)
      setIsDesktop(newIsDesktop)
      
      // Auto-adjust sidebars based on screen size
      if (newIsMobile) {
        // Mobile: Hide both sidebars
        setLeftSidebarOpen(false)
        setRightSidebarOpen(false)
      } else if (newIsTablet) {
        // Tablet: Hide both sidebars by default
        setLeftSidebarOpen(false)
        setRightSidebarOpen(false)
      } else if (newIsLaptop) {
        // Laptop: Show left, hide right
        setLeftSidebarOpen(true)
        setRightSidebarOpen(false)
      } else {
        // Desktop: Show both sidebars
        setLeftSidebarOpen(true)
        setRightSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const initializeApp = async () => {
    try {
      setIsLoading(true)
      
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Auto-login for demo purposes
      const mockUser = await authService.loginAsGuest()
      setUser(mockUser)
      
    } catch (err) {
      console.error('App initialization failed:', err)
      setError('Failed to initialize TaxBuddy. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen)
  }

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen)
  }

  const closeSidebars = () => {
    setLeftSidebarOpen(false)
    setRightSidebarOpen(false)
  }

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading TaxBuddy...</h2>
          <p>Your AI Tax Assistant is starting up</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={initializeApp} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="content-container">
          <div className="header-content">
          <div className="header-left">
            {(isMobile || isTablet) && (
              <button 
                onClick={toggleLeftSidebar}
                className="sidebar-toggle left"
                title="Toggle Status Panel"
              >
                ☰
              </button>
            )}
            <div className="logo-section">
              <h1 className="app-title">TaxBuddy</h1>
              <span className="app-subtitle">Your AI Tax Assistant</span>
            </div>
          </div>
          
          <div className="header-actions">
            <span className="version-badge">v{config.app.version}</span>
            {(isMobile || isTablet) && (
              <button 
                onClick={toggleRightSidebar}
                className="sidebar-toggle right"
                title="Toggle Quick Actions"
              >
                🛠️
              </button>
            )}
            {user && (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="logout-button"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      <div className="content-container">
        <div className={`main-layout ${leftSidebarOpen ? 'left-open' : ''} ${rightSidebarOpen ? 'right-open' : ''}`}>
        {/* Overlay for mobile */}
        {(leftSidebarOpen || rightSidebarOpen) && (isMobile || isTablet) && (
          <div className="sidebar-overlay" onClick={closeSidebars}></div>
        )}

        {/* Left Sidebar */}
        <div className={`left-sidebar ${leftSidebarOpen ? 'open' : 'closed'}`}>
          {!isMobile && !isTablet && (
            <button 
              onClick={toggleLeftSidebar}
              className="sidebar-collapse-btn"
              title={leftSidebarOpen ? "Collapse" : "Expand"}
            >
              {leftSidebarOpen ? '◀' : '▶'}
            </button>
          )}
          {(isMobile || isTablet) && (
            <button 
              onClick={toggleLeftSidebar}
              className="sidebar-close-btn"
              title="Close"
            >
              ✕
            </button>
          )}
          <StatusPanel />
          {user && <UserProfile user={user} />}
        </div>

        {/* Main Chat Area */}
        <main className="chat-area">
          {user ? (
            <ChatInterface user={user} />
          ) : (
            <div className="login-required">
              <h2>Please log in to continue</h2>
              <button 
                onClick={() => authService.loginAsGuest().then(setUser)}
                className="login-button"
              >
                Continue as Guest
              </button>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <div className={`right-sidebar ${rightSidebarOpen ? 'open' : 'closed'}`}>
          <button 
            onClick={toggleRightSidebar}
            className="sidebar-close-btn"
            title="Close"
          >
            ✕
          </button>
          <QuickActionsSidebar />
        </div>
        </div>
      </div>

      <footer className="app-footer">
        <div className="content-container">
          <LiveStatistics />
          <div className="footer-content">
            <p>&copy; 2025 TaxBuddy - Production System v{config.app.version}</p>
            <div className="footer-links">
              <span className="demo-badge">LIVE SYSTEM</span>
              <span className="env-badge">{config.app.environment}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App