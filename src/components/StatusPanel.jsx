/**
 * @file StatusPanel.jsx
 * @path ./taxbuddy-chat-demo/src/components/StatusPanel.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Backend status indicators
 */

import React, { useState, useEffect } from 'react'

const StatusPanel = ({ isRecording = false, isSpeaking = false }) => {
  const [stats, setStats] = useState({
    dbConnected: true,
    documentCount: 15432,
    knowledgeBaseActive: true,
    responseConfidence: 98,
    systemLoad: 23,
    uptime: '99.9%',
    speechRecognition: 'Active',
    voiceSynthesis: 'Ready',
    nlpEngine: 'Online',
    languageModel: 'LLM Active',
    taxCalculator: 'Operational',
    complianceEngine: '2024 Rules'
  })

  const [isAnimating, setIsAnimating] = useState(false)

  // Update Speech Recognition status based on recording
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      speechRecognition: isRecording ? 'Processing...' : 'Active'
    }))
  }, [isRecording])

  // Update Voice Synthesis status based on speaking
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      voiceSynthesis: isSpeaking ? 'Speaking...' : 'Ready'
    }))
  }, [isSpeaking])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setStats(prev => ({
        ...prev,
        documentCount: prev.documentCount + Math.floor(Math.random() * 3),
        responseConfidence: Math.max(95, Math.min(99, prev.responseConfidence + (Math.random() - 0.5) * 2)),
        systemLoad: Math.max(15, Math.min(35, prev.systemLoad + (Math.random() - 0.5) * 4))
      }))
      
      setTimeout(() => setIsAnimating(false), 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status) => {
    return status ? '✓' : '⚠️'
  }

  const getStatusColor = (status) => {
    return status ? '#10b981' : '#f59e0b'
  }

  const getLoadColor = (load) => {
    if (load < 25) return '#10b981'
    if (load < 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="status-panel">
      <div className="status-header">
        <h3>System Status</h3>
        <div className="status-indicator">
          <div className="pulse-dot"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="status-grid">
        <div className="status-item">
          <div className="status-icon" style={{ color: getStatusColor(stats.dbConnected) }}>
            {getStatusIcon(stats.dbConnected)}
          </div>
          <div className="status-info">
            <div className="status-label">Tax Database</div>
            <div className="status-value">Connected</div>
          </div>
        </div>

        <div className={`status-item ${isAnimating ? 'animating' : ''}`}>
          <div className="status-icon">📄</div>
          <div className="status-info">
            <div className="status-label">Document Archive</div>
            <div className="status-value">{stats.documentCount.toLocaleString()}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon" style={{ color: getStatusColor(stats.knowledgeBaseActive) }}>
            {getStatusIcon(stats.knowledgeBaseActive)}
          </div>
          <div className="status-info">
            <div className="status-label">Knowledge Base</div>
            <div className="status-value">Active</div>
          </div>
        </div>

        {/* Voice & AI Services */}
        <div className={`status-item ${isRecording ? 'animating' : ''}`}>
          <div className="status-icon">🎤</div>
          <div className="status-info">
            <div className="status-label">Speech Recognition</div>
            <div className="status-value">{stats.speechRecognition}</div>
          </div>
        </div>

        <div className={`status-item ${isSpeaking ? 'animating' : ''}`}>
          <div className="status-icon">🔊</div>
          <div className="status-info">
            <div className="status-label">Voice Synthesis</div>
            <div className="status-value">{stats.voiceSynthesis}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon">🧠</div>
          <div className="status-info">
            <div className="status-label">NLP Engine</div>
            <div className="status-value">{stats.nlpEngine}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon">🌐</div>
          <div className="status-info">
            <div className="status-label">Language Model</div>
            <div className="status-value">{stats.languageModel}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon">📊</div>
          <div className="status-info">
            <div className="status-label">Tax Calculator</div>
            <div className="status-value">{stats.taxCalculator}</div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon">🔒</div>
          <div className="status-info">
            <div className="status-label">Compliance Engine</div>
            <div className="status-value">{stats.complianceEngine}</div>
          </div>
        </div>

        <div className={`status-item ${isAnimating ? 'animating' : ''}`}>
          <div className="status-icon">🎯</div>
          <div className="status-info">
            <div className="status-label">AI Confidence</div>
            <div className="status-value">{stats.responseConfidence.toFixed(1)}%</div>
          </div>
        </div>

        <div className={`status-item ${isAnimating ? 'animating' : ''}`}>
          <div className="status-icon">⚡</div>
          <div className="status-info">
            <div className="status-label">System Load</div>
            <div className="status-value" style={{ color: getLoadColor(stats.systemLoad) }}>
              {stats.systemLoad.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="status-item">
          <div className="status-icon">🔄</div>
          <div className="status-info">
            <div className="status-label">Uptime</div>
            <div className="status-value">{stats.uptime}</div>
          </div>
        </div>
      </div>

      <div className="status-footer">
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default StatusPanel