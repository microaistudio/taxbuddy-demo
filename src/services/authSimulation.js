/**
 * @file authSimulation.js
 * @path ./taxbuddy-chat-demo/src/services/authSimulation.js
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Mock authentication service for demo
 */

import config from '@config'

class AuthSimulationService {
  constructor() {
    this.users = new Map()
    this.sessions = new Map()
    this.currentUser = null
    this.initializeMockUsers()
  }

  initializeMockUsers() {
    const mockUsers = [
      {
        id: 'user_001',
        name: 'John Taxpayer',
        email: 'john.taxpayer@example.com',
        filingStatus: 'single',
        hasW2: true,
        isBusinessOwner: false,
        lastLogin: new Date('2025-01-15').toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      },
      {
        id: 'user_002',
        name: 'Sarah Business',
        email: 'sarah.business@example.com',
        filingStatus: 'married_jointly',
        hasW2: false,
        isBusinessOwner: true,
        lastLogin: new Date('2025-01-10').toISOString(),
        preferences: {
          theme: 'dark',
          notifications: true,
          autoSave: false
        }
      },
      {
        id: 'user_003',
        name: 'Demo User',
        email: 'demo@taxbuddy.com',
        filingStatus: 'single',
        hasW2: true,
        isBusinessOwner: false,
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: false,
          autoSave: true
        }
      }
    ]

    mockUsers.forEach(user => {
      this.users.set(user.id, user)
    })
  }

  async loginAsGuest() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const guestUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest User',
      email: 'guest@demo.com',
      filingStatus: 'unknown',
      hasW2: null,
      isBusinessOwner: null,
      isGuest: true,
      sessionStartTime: new Date().toISOString(),
      preferences: {
        theme: config.ui.theme,
        notifications: false,
        autoSave: true
      }
    }

    // Create session
    const sessionId = this.createSession(guestUser)
    guestUser.sessionId = sessionId

    this.currentUser = guestUser
    this.users.set(guestUser.id, guestUser)

    // Store in localStorage for demo persistence
    this.saveToStorage('currentUser', guestUser)

    return guestUser
  }

  async login(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Find user by email (mock authentication)
    const user = Array.from(this.users.values()).find(u => u.email === email)
    
    if (!user) {
      throw new Error('User not found')
    }

    // In a real app, you'd verify the password here
    // For demo purposes, we'll accept any password for existing users

    // Update last login
    user.lastLogin = new Date().toISOString()
    
    // Create session
    const sessionId = this.createSession(user)
    user.sessionId = sessionId

    this.currentUser = user
    this.saveToStorage('currentUser', user)

    return user
  }

  async logout() {
    if (this.currentUser?.sessionId) {
      this.sessions.delete(this.currentUser.sessionId)
    }

    this.currentUser = null
    this.removeFromStorage('currentUser')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return true
  }

  createSession(user) {
    const sessionId = `session_${user.id}_${Date.now()}`
    const session = {
      id: sessionId,
      userId: user.id,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ipAddress: '127.0.0.1', // Mock IP for demo
      userAgent: navigator.userAgent,
      isActive: true
    }

    this.sessions.set(sessionId, session)
    return sessionId
  }

  async validateSession(sessionId) {
    const session = this.sessions.get(sessionId)
    
    if (!session || !session.isActive) {
      return null
    }

    // Check if session has expired (demo: 24 hours)
    const sessionAge = Date.now() - new Date(session.startTime).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (sessionAge > maxAge) {
      session.isActive = false
      return null
    }

    // Update last activity
    session.lastActivity = new Date().toISOString()
    
    return session
  }

  getCurrentUser() {
    // Try to restore from localStorage first
    if (!this.currentUser) {
      const stored = this.getFromStorage('currentUser')
      if (stored) {
        this.currentUser = stored
      }
    }

    return this.currentUser
  }

  async updateUserPreferences(userId, preferences) {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error('User not found')
    }

    user.preferences = { ...user.preferences, ...preferences }
    this.users.set(userId, user)

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = user
      this.saveToStorage('currentUser', user)
    }

    return user
  }

  async getUserProfile(userId) {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Return user without sensitive data
    const { password, ...safeUser } = user
    return safeUser
  }

  async registerUser(userData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Check if email already exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      filingStatus: userData.filingStatus || 'single',
      hasW2: userData.hasW2 || false,
      isBusinessOwner: userData.isBusinessOwner || false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true,
        autoSave: true
      }
    }

    this.users.set(newUser.id, newUser)
    return newUser
  }

  // Helper methods for localStorage (demo persistence)
  saveToStorage(key, data) {
    try {
      const storageKey = `${config.storage.prefix}${key}`
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  getFromStorage(key) {
    try {
      const storageKey = `${config.storage.prefix}${key}`
      const data = localStorage.getItem(storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }

  removeFromStorage(key) {
    try {
      const storageKey = `${config.storage.prefix}${key}`
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }

  // Demo helper methods
  getSessionStats() {
    return {
      totalUsers: this.users.size,
      activeSessions: Array.from(this.sessions.values()).filter(s => s.isActive).length,
      totalSessions: this.sessions.size
    }
  }

  clearAllSessions() {
    this.sessions.clear()
    this.currentUser = null
    this.removeFromStorage('currentUser')
  }

  // Mock method to simulate different user types for testing
  async loginAsUserType(userType) {
    const userTypeMap = {
      'first_timer': 'user_001',
      'business_owner': 'user_002',
      'demo': 'user_003'
    }

    const userId = userTypeMap[userType]
    if (!userId) {
      throw new Error('Invalid user type')
    }

    const user = this.users.get(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Create session
    const sessionId = this.createSession(user)
    user.sessionId = sessionId

    this.currentUser = user
    this.saveToStorage('currentUser', user)

    return user
  }
}

export const authService = new AuthSimulationService()