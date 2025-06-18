/**
 * @file LiveStatistics.jsx
 * @path ./taxbuddy-chat-demo/src/components/LiveStatistics.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Live statistics footer
 */

import React, { useState, useEffect } from 'react'

const LiveStatistics = () => {
  const [stats, setStats] = useState({
    citizensAssistedToday: 2341,
    avgResponseTime: 1.2,
    satisfaction: 4.8,
    activeUsers: 89,
    formsDownloaded: 156,
    questionsAnswered: 1847
  })

  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true)
      
      setStats(prev => ({
        ...prev,
        citizensAssistedToday: prev.citizensAssistedToday + Math.floor(Math.random() * 5) + 1,
        avgResponseTime: Math.max(0.8, Math.min(2.5, prev.avgResponseTime + (Math.random() - 0.5) * 0.1)),
        satisfaction: Math.max(4.5, Math.min(5.0, prev.satisfaction + (Math.random() - 0.5) * 0.05)),
        activeUsers: Math.max(75, Math.min(120, prev.activeUsers + Math.floor((Math.random() - 0.5) * 8))),
        formsDownloaded: prev.formsDownloaded + Math.floor(Math.random() * 3),
        questionsAnswered: prev.questionsAnswered + Math.floor(Math.random() * 7) + 1
      }))

      setTimeout(() => setIsUpdating(false), 300)
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  const formatDecimal = (num, decimals = 1) => {
    return num.toFixed(decimals)
  }

  const getStatusIcon = (value, threshold) => {
    return value >= threshold ? '📈' : '📊'
  }

  return (
    <div className="live-statistics">
      <div className="stats-header">
        <div className="stats-title">
          <span className="live-indicator">🔴</span>
          <h3>Live Statistics</h3>
        </div>
        <div className="last-update">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="stats-grid">
        <div className={`stat-item ${isUpdating ? 'updating' : ''}`}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{formatNumber(stats.citizensAssistedToday)}</div>
            <div className="stat-label">Citizens Assisted Today</div>
          </div>
        </div>

        <div className={`stat-item ${isUpdating ? 'updating' : ''}`}>
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{formatDecimal(stats.avgResponseTime)}s</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>

        <div className={`stat-item ${isUpdating ? 'updating' : ''}`}>
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{formatDecimal(stats.satisfaction)}/5</div>
            <div className="stat-label">User Satisfaction</div>
          </div>
        </div>

        <div className={`stat-item ${isUpdating ? 'updating' : ''}`}>
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <div className="stat-value">{formatNumber(stats.activeUsers)}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        <div className={`stat-item ${isUpdating ? 'updating' : ''}`}>
          <div className="stat-icon">📥</div>
          <div className="stat-info">
            <div className="stat-value">{formatNumber(stats.formsDownloaded)}</div>
            <div className="stat-label">Forms Downloaded</div>
          </div>
        </div>

        <div className={`stat-item ${isUpdating ? 'updating' : ''}`}>
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <div className="stat-value">{formatNumber(stats.questionsAnswered)}</div>
            <div className="stat-label">Questions Answered</div>
          </div>
        </div>
      </div>

      <div className="stats-footer">
        <div className="performance-indicators">
          <div className="indicator">
            <span className="indicator-dot green"></span>
            <span>System Healthy</span>
          </div>
          <div className="indicator">
            <span className="indicator-dot green"></span>
            <span>All Services Online</span>
          </div>
          <div className="indicator">
            <span className="indicator-dot yellow"></span>
            <span>High Demand Period</span>
          </div>
        </div>
        
        <div className="compliance-info">
          <span>SOC 2 Compliant</span> • <span>IRS Certified</span> • <span>Privacy Protected</span>
        </div>
      </div>
    </div>
  )
}

export default LiveStatistics