/**
 * @file UserProfile.jsx
 * @path ./taxbuddy-chat-demo/src/components/UserProfile.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - User profile with tax history
 */

import React, { useState } from 'react'

const UserProfile = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const mockUserData = {
    fullName: user?.isGuest ? 'Guest User' : 'John Doe',
    taxId: user?.isGuest ? 'Guest Session' : 'XXX-XX-1234',
    previousReturns: user?.isGuest ? [] : ['2021', '2022', '2023'],
    filingStatus: user?.isGuest ? 'Unknown' : 'Married Filing Jointly',
    currentStatus: user?.isGuest ? 'Guest Session Active' : 'Ready to File 2024',
    estimatedRefund: user?.isGuest ? null : '$2,847',
    withholdingStatus: user?.isGuest ? null : 'Adequate',
    lastLogin: user?.isGuest ? new Date().toLocaleDateString() : '2025-06-15',
    accountType: user?.isGuest ? 'Guest' : 'Premium',
    documents: user?.isGuest ? 0 : 8
  }

  const getStatusColor = (status) => {
    if (status.includes('Ready')) return '#10b981'
    if (status.includes('Guest')) return '#6b7280'
    if (status.includes('Pending')) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {mockUserData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="profile-info">
          <h3>{mockUserData.fullName}</h3>
          <p className="tax-id">Tax ID: {mockUserData.taxId}</p>
          <div 
            className="status-badge" 
            style={{ backgroundColor: getStatusColor(mockUserData.currentStatus) }}
          >
            {mockUserData.currentStatus}
          </div>
        </div>
        <button 
          className="profile-toggle"
          onClick={() => setShowDetails(!showDetails)}
          title={showDetails ? "Hide Details" : "Show Details"}
        >
          {showDetails ? '▼' : '▶'}
        </button>
      </div>

      {showDetails && (
        <div className="profile-details">
          <div className="detail-section">
            <h4>Tax History</h4>
            {mockUserData.previousReturns.length > 0 ? (
              <div className="returns-list">
                {mockUserData.previousReturns.map((year, index) => (
                  <div key={year} className="return-item">
                    <span className="return-year">{year}</span>
                    <span className="return-status">Filed ✓</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-returns">No previous returns on file</p>
            )}
          </div>

          {!user?.isGuest && (
            <>
              <div className="detail-section">
                <h4>2024 Tax Season</h4>
                <div className="tax-info">
                  <div className="info-item">
                    <span className="info-label">Filing Status:</span>
                    <span className="info-value">{mockUserData.filingStatus}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estimated Refund:</span>
                    <span className="info-value refund">{mockUserData.estimatedRefund}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Withholding:</span>
                    <span className="info-value">{mockUserData.withholdingStatus}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Documents Uploaded:</span>
                    <span className="info-value">{mockUserData.documents}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Account Information</h4>
                <div className="account-info">
                  <div className="info-item">
                    <span className="info-label">Account Type:</span>
                    <span className="info-value premium">{mockUserData.accountType}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Login:</span>
                    <span className="info-value">{mockUserData.lastLogin}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {user?.isGuest && (
            <div className="guest-actions">
              <button className="upgrade-button">
                Create Free Account
              </button>
              <p className="guest-note">
                Sign up to save your progress and access advanced features
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserProfile