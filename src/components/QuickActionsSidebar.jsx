/**
 * @file QuickActionsSidebar.jsx
 * @path ./taxbuddy-chat-demo/src/components/QuickActionsSidebar.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Quick actions sidebar
 */

import React, { useState } from 'react'

const QuickActionsSidebar = () => {
  const [downloadingForm, setDownloadingForm] = useState(null)

  const handleDownload = async (formType) => {
    setDownloadingForm(formType)
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create mock PDF download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${formType}_form.pdf`
    link.click()
    
    setDownloadingForm(null)
  }

  const handleSchedule = () => {
    alert('🗓️ Appointment scheduling feature coming soon!\n\nYou would be redirected to our calendar system to book a consultation with a tax professional.')
  }

  const handleCalculator = () => {
    alert('🧮 Tax Calculator launching...\n\nThis would open our interactive tax calculator to estimate your refund or payment.')
  }

  const handleCalendar = () => {
    alert('📅 Tax Calendar opening...\n\nThis would display important tax deadlines and reminders throughout the year.')
  }

  const taxForms = [
    { id: 'w2', name: 'W-2 Form', description: 'Wage and Tax Statement', popular: true },
    { id: '1099-int', name: '1099-INT', description: 'Interest Income', popular: true },
    { id: '1099-div', name: '1099-DIV', description: 'Dividend Income', popular: false },
    { id: '1040', name: 'Form 1040', description: 'Individual Tax Return', popular: true },
    { id: 'schedule-c', name: 'Schedule C', description: 'Business Income/Loss', popular: false },
    { id: '8283', name: 'Form 8283', description: 'Charitable Deductions', popular: false }
  ]

  const quickTools = [
    {
      id: 'appointment',
      title: 'Schedule Appointment',
      icon: '📅',
      description: 'Book consultation with tax professional',
      action: handleSchedule,
      color: '#3b82f6'
    },
    {
      id: 'calendar',
      title: 'Tax Calendar',
      icon: '🗓️',
      description: 'View important deadlines',
      action: handleCalendar,
      color: '#10b981'
    },
    {
      id: 'calculator',
      title: 'Payment Calculator',
      icon: '🧮',
      description: 'Estimate taxes or refund',
      action: handleCalculator,
      color: '#f59e0b'
    }
  ]

  return (
    <div className="quick-actions-sidebar">
      <div className="sidebar-header">
        <h3>Quick Actions</h3>
        <span className="tools-count">{taxForms.length + quickTools.length} tools</span>
      </div>

      <div className="sidebar-section">
        <h4>📄 Download Forms</h4>
        <p className="section-description">Get the latest tax forms and instructions</p>
        
        <div className="forms-list">
          {taxForms.map((form) => (
            <div key={form.id} className={`form-item ${form.popular ? 'popular' : ''}`}>
              <div className="form-info">
                <div className="form-name">
                  {form.name}
                  {form.popular && <span className="popular-badge">Popular</span>}
                </div>
                <div className="form-description">{form.description}</div>
              </div>
              <button 
                className="download-btn"
                onClick={() => handleDownload(form.id)}
                disabled={downloadingForm === form.id}
              >
                {downloadingForm === form.id ? (
                  <div className="download-spinner">⏳</div>
                ) : (
                  '📥'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>🛠️ Tax Tools</h4>
        <p className="section-description">Professional tools and services</p>
        
        <div className="tools-list">
          {quickTools.map((tool) => (
            <button 
              key={tool.id}
              className="tool-item"
              onClick={tool.action}
              style={{ borderLeftColor: tool.color }}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-info">
                <div className="tool-title">{tool.title}</div>
                <div className="tool-description">{tool.description}</div>
              </div>
              <div className="tool-arrow">→</div>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>📞 Support</h4>
        <div className="support-info">
          <div className="support-item">
            <span className="support-label">Phone:</span>
            <span className="support-value">1-800-TAX-HELP</span>
          </div>
          <div className="support-item">
            <span className="support-label">Hours:</span>
            <span className="support-value">24/7 Available</span>
          </div>
          <div className="support-item">
            <span className="support-label">Email:</span>
            <span className="support-value">help@taxbuddy.gov</span>
          </div>
        </div>
        
        <button className="contact-button">
          💬 Start Live Chat
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="security-badge">
          <span className="shield-icon">🔒</span>
          <div className="security-text">
            <div>IRS Approved</div>
            <div className="security-subtext">Bank-level security</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickActionsSidebar