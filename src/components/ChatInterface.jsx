/**
 * @file ChatInterface.jsx
 * @path ./taxbuddy-chat-demo/src/components/ChatInterface.jsx
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Complete TaxBuddy chat interface
 */

import React, { useState, useEffect, useRef } from 'react'
import { conversationEngine } from '@services/conversationEngine'
import config from '@config'

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [currentScenario, setCurrentScenario] = useState('general')
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [messageCount, setMessageCount] = useState(0)
  const [error, setError] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [voiceSessionTime, setVoiceSessionTime] = useState(0)
  const [voiceSessionActive, setVoiceSessionActive] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState('en-US')
  const [voiceError, setVoiceError] = useState('')
  const [voiceTimer, setVoiceTimer] = useState(null)
  
  const recognitionRef = useRef(null)
  const voiceTimerRef = useRef(null)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    initializeChat()
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Voice session timer
  useEffect(() => {
    let interval = null
    if (voiceSessionActive) {
      interval = setInterval(() => {
        setVoiceSessionTime(prev => prev + 1)
      }, 1000)
      setVoiceTimer(interval)
      voiceTimerRef.current = interval
    } else {
      if (interval) clearInterval(interval)
      if (voiceTimer) clearInterval(voiceTimer)
      if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current)
        voiceTimerRef.current = null
      }
      setVoiceSessionTime(0)
      setVoiceTimer(null)
    }
    return () => {
      if (interval) clearInterval(interval)
      if (voiceTimer) clearInterval(voiceTimer)
      if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current)
        voiceTimerRef.current = null
      }
    }
  }, [voiceSessionActive])

  // Update language when changed
  useEffect(() => {
    if (recognitionRef.current && voiceLanguage) {
      recognitionRef.current.lang = voiceLanguage
      console.log('Voice language updated to:', voiceLanguage)
    }
  }, [voiceLanguage])

  const initializeChat = async () => {
    try {
      setIsLoading(true)
      const session = await conversationEngine.initializeSession(user.id)
      setSessionId(session.id)
      
      // Don't add welcome message initially - let mode selection show first
      setMessages([])
      setMessageCount(0)
      setShowQuickActions(false)
      
    } catch (err) {
      console.error('Chat initialization failed:', err)
      setError('Failed to initialize chat. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    if (value.length <= config.chat.maxMessageLength) {
      setInputValue(value)
      setError(null)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Create a function to setup recognition with all handlers
  const setupRecognition = () => {
    if (!recognitionRef.current) return
    
    const recognition = recognitionRef.current
    
    recognition.onstart = () => {
      console.log('Recognition started')
      setIsRecording(true)
    }
    
    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }
      
      // Always update interim transcript for display
      setInterimTranscript(interimTranscript || finalTranscript)
      
      if (finalTranscript) {
        const command = finalTranscript.toLowerCase().trim()
        
        // Show what was spoken
        console.log('Voice command detected:', command)
        console.log('Current selectedMode:', selectedMode)
        console.log('Current voiceSessionActive:', voiceSessionActive)
        
        // Check for end session BEFORE adding to messages
        if ((command.includes('end session') || 
             command.includes('stop session') ||
             command.includes('end voice')) && 
            selectedMode === 'voice') {
          
          console.log('End session command detected! Calling endVoiceSession()')
          
          // Do EXACTLY what the button does
          endVoiceSession() // This already works when button is clicked
          return // Don't process further
        }
        
        // For "Talk to Buddy" when not in voice mode
        if (command.includes('talk to buddy') && selectedMode !== 'voice') {
          console.log('Talk to buddy command detected! Calling startVoiceMode()')
          startVoiceMode() // Use the same function that button uses
          return
        }
        
        // Only add messages if not a command and in voice mode
        if (selectedMode === 'voice') {
          console.log('Processing regular voice message in voice mode')
          
          // 1. Add user message to chat display
          const userMessage = {
            id: `msg_${Date.now()}_user`,
            type: 'user',
            content: finalTranscript,
            timestamp: new Date().toISOString()
          }
          
          setMessages(prev => {
            console.log('Adding user message:', userMessage)
            return [...prev, userMessage]
          })
          setMessageCount(prev => prev + 1)
          
          // Clear interim transcript
          setInterimTranscript('')
          
          // 2. Generate and add TaxBuddy response
          setIsTyping(true)
          
          setTimeout(async () => {
            try {
              // Simulate typing delay for realism
              await new Promise(resolve => setTimeout(resolve, 1500))
              
              const response = await conversationEngine.processMessage(
                sessionId,
                finalTranscript,
                currentScenario
              )

              const aiMessage = {
                id: `msg_${Date.now() + 1}_ai`,
                type: 'ai',
                content: response.message,
                timestamp: new Date().toISOString(),
                scenario: response.scenario,
                suggestions: response.suggestions,
                actions: response.actions,
                confidence: response.confidence || 0.95,
                sources: response.sources || [
                  'IRS Publication 17',
                  'Tax Code Section 62', 
                  'Form 1040 Instructions'
                ]
              }

              setMessages(prev => {
                console.log('Adding AI message:', aiMessage)
                return [...prev, aiMessage]
              })
              setMessageCount(prev => prev + 1)
              setCurrentScenario(response.scenario)

              // 3. Speak the response in voice mode
              if (selectedMode === 'voice') {
                setTimeout(() => {
                  speakMessage(aiMessage.content)
                }, 500)
              }
              
            } catch (err) {
              console.error('Message processing failed:', err)
              const errorMessage = {
                id: `msg_${Date.now() + 2}_error`,
                type: 'ai',
                content: 'I apologize, but I encountered an error processing your message. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true
              }
              setMessages(prev => [...prev, errorMessage])
              setMessageCount(prev => prev + 1)
            } finally {
              setIsTyping(false)
            }
          }, 300)
        } else {
          // In chat mode, ignore non-wake-word speech
          console.log('Ignoring speech in chat mode (not a wake word):', command)
          setInterimTranscript('')
        }
      }
    }
    
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error)
      setIsRecording(false)
      
      if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try again.')
        setTimeout(() => setVoiceError(''), 5000)
      } else if (event.error === 'not-allowed') {
        setVoiceError('Microphone access denied. Please allow microphone access and try again.')
        setTimeout(() => setVoiceError(''), 8000)
      } else if (event.error === 'network') {
        setVoiceError('Network error. Please check your internet connection.')
        setTimeout(() => setVoiceError(''), 5000)
      } else {
        setVoiceError(`Voice recognition error: ${event.error}`)
        setTimeout(() => setVoiceError(''), 5000)
      }
    }
    
    recognition.onend = () => {
      console.log('Recognition ended')
      setIsRecording(false)
      setInterimTranscript('')
      
      // Auto-restart if still in voice mode
      if (voiceSessionActive && selectedMode === 'voice' && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start()
          } catch (e) {
            console.log('Auto-restart failed:', e)
            setVoiceError('Voice recognition stopped. Click the microphone to restart.')
            setTimeout(() => setVoiceError(''), 5000)
          }
        }, 100)
      }
    }
  }

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceError('Speech recognition not supported in this browser. Please use Chrome or Edge.')
      setTimeout(() => setVoiceError(''), 5000)
      return
    }
    
    // Create recognition if it doesn't exist
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = selectedMode === 'voice'
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = voiceLanguage
    }
    
    setVoiceError('') // Clear any previous errors
    
    // Setup handlers every time before starting
    setupRecognition()
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      setVoiceError('Failed to start recording. Please check microphone permissions.')
      setTimeout(() => setVoiceError(''), 5000)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
    if (recognition) {
      recognition.stop()
      setIsRecording(false)
    }
  }


  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser')
      return
    }

    // Stop any current speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async (voiceTranscript = null) => {
    const messageText = voiceTranscript || inputValue.trim()
    if (!messageText || isTyping || isLoading) return

    const userMessage = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setShowQuickActions(false)
    setMessageCount(prev => prev + 1)

    try {
      // Show calculating indicator for complex questions
      const isComplexQuery = messageText.toLowerCase().includes('calculate') || 
                            messageText.toLowerCase().includes('estimate') ||
                            messageText.toLowerCase().includes('how much')
      
      if (isComplexQuery) {
        setIsCalculating(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsCalculating(false)
      }

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, config.chat.typingIndicatorDelay))

      const response = await conversationEngine.processMessage(
        sessionId,
        messageText,
        currentScenario
      )

      const aiMessage = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        content: response.message,
        timestamp: new Date().toISOString(),
        scenario: response.scenario,
        suggestions: response.suggestions,
        actions: response.actions,
        confidence: response.confidence || 0.95,
        sources: response.sources || [
          'IRS Publication 17',
          'Tax Code Section 62',
          'Form 1040 Instructions'
        ]
      }

      setMessages(prev => [...prev, aiMessage])
      setCurrentScenario(response.scenario)
      setMessageCount(prev => prev + 1)

      // Auto-speak AI response in voice mode
      if (selectedMode === 'voice') {
        setTimeout(() => {
          speakMessage(aiMessage.content)
        }, 500)
      }

      // Update chat history
      setChatHistory(prev => [...prev, userMessage, aiMessage])

    } catch (err) {
      console.error('Message processing failed:', err)
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const startChatMode = () => {
    setSelectedMode('chat')
    setShowQuickActions(true)
    
    // Add welcome message for chat mode
    const welcomeMessage = {
      id: `msg_${Date.now()}`,
      type: 'ai',
      content: `Hello ${user.name}! I'm TaxBuddy, your AI tax assistant. I'm here to help you with tax questions, deductions, filing guidance, and more. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      scenario: 'welcome'
    }
    
    setMessages([welcomeMessage])
    setMessageCount(1)
    
    console.log('Chat mode activated')
  }

  const startVoiceMode = () => {
    setSelectedMode('voice')
    setShowQuickActions(false)
    setVoiceSessionActive(true)
    
    // Initialize speech recognition if it doesn't exist
    if (!recognitionRef.current && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = voiceLanguage
    }
    
    // Add welcome message for voice mode
    const welcomeMessage = {
      id: `msg_${Date.now()}_welcome`,
      type: 'ai',
      content: `Hello ${user.name}! I'm TaxBuddy, your AI tax assistant. You can speak to me naturally, and I'll respond with voice. Say "end session" to stop. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      scenario: 'welcome'
    }
    
    setMessages([welcomeMessage])
    setMessageCount(1)
    
    // Speak the welcome message
    setTimeout(() => {
      speakMessage(welcomeMessage.content)
    }, 500)
    
    // Start voice recognition after welcome message
    setTimeout(() => {
      if (recognitionRef.current) {
        setupRecognition()
        try {
          recognitionRef.current.start()
          console.log('Voice recognition started - ready for commands and conversation')
        } catch (e) {
          console.error('Failed to start recognition:', e)
          setVoiceError('Failed to start voice recognition. Please check microphone permissions.')
          setTimeout(() => setVoiceError(''), 5000)
        }
      }
    }, 3000)
    
    console.log('Voice mode activated')
  }

  const handleQuickAction = async (topic) => {
    const topicQuestions = {
      'deductions': 'What deductions can I claim?',
      'filing': 'How do I file my taxes?',
      'deadlines': 'When are tax deadlines?',
      'business': 'Business tax questions',
      'refund': 'When will I get my refund?',
      'general': 'General tax help'
    }
    
    const question = topicQuestions[topic] || topicQuestions['general']
    setInputValue(question)
    setActiveCategory(topic)
    await new Promise(resolve => setTimeout(resolve, 100))
    handleSendMessage()
  }

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat? This action cannot be undone.')) {
      setMessages([])
      setCurrentScenario('general')
      setMessageCount(0)
      setShowQuickActions(true)
      initializeChat()
    }
  }

  const endVoiceSession = () => {
    console.log('Ending voice session completely - going to mode selection')
    
    // Stop recognition completely for mode selection
    if (recognitionRef.current) {
      try {
        recognitionRef.current.continuous = false
        recognitionRef.current.stop()
      } catch (e) {
        console.log('Recognition already stopped:', e)
      }
    }
    
    // Stop speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    
    // Clear timer
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current)
      voiceTimerRef.current = null
    }
    if (voiceTimer) {
      clearInterval(voiceTimer)
      setVoiceTimer(null)
    }
    
    // Reset states
    setIsRecording(false)
    setVoiceSessionActive(false)
    setIsSpeaking(false)
    setInterimTranscript('')
    setVoiceError('')
    setVoiceSessionTime(0)
    setRecognition(null)
    
    // Go back to mode selection
    setSelectedMode(null)
    
    console.log('Voice session ended - returning to mode selection')
  }

  const formatVoiceTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleHomeClick = () => {
    // End voice session if active
    if (voiceSessionActive) {
      endVoiceSession()
      return // endVoiceSession already sets selectedMode to null
    }
    
    setMessages([])
    setCurrentScenario('general')
    setMessageCount(0)
    setShowQuickActions(false)
    setActiveCategory(null)
    setSelectedMode(null)
    setVoiceSessionTime(0)
    initializeChat()
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setIsUploading(true)
    
    // Simulate file upload processing
    for (const file of files) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const uploadedFile = {
        id: `file_${Date.now()}_${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toISOString(),
        status: 'processed'
      }
      
      setUploadedFiles(prev => [...prev, uploadedFile])
      
      // Add a system message about the upload
      const systemMessage = {
        id: `msg_${Date.now()}_system`,
        type: 'system',
        content: `📄 Document uploaded: ${file.name} (${(file.size / 1024).toFixed(1)}KB)\n✅ Document processed and analyzed`,
        timestamp: new Date().toISOString(),
        fileInfo: uploadedFile
      }
      
      setMessages(prev => [...prev, systemMessage])
      setMessageCount(prev => prev + 1)
    }
    
    setIsUploading(false)
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleExportChat = () => {
    const chatData = {
      sessionId,
      user: user.name,
      timestamp: new Date().toISOString(),
      messageCount,
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `taxbuddy-chat-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const startConversation = (topic) => {
    const topicQuestions = {
      'deductions': 'What deductions can I claim?',
      'filing': 'How do I file my taxes?',
      'deadlines': 'When are tax deadlines?',
      'business': 'Business tax questions',
      'refund': 'When will I get my refund?',
      'general': 'General tax help'
    }
    
    setInputValue(topicQuestions[topic] || topicQuestions['general'])
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const quickActions = [
    { id: 'deductions', text: 'What deductions can I claim?', icon: '💰' },
    { id: 'filing', text: 'How do I file my taxes?', icon: '📄' },
    { id: 'deadline', text: 'When are tax deadlines?', icon: '📅' },
    { id: 'business', text: 'Business tax questions', icon: '🏢' },
    { id: 'refund', text: 'When will I get my refund?', icon: '💵' },
    { id: 'help', text: 'General tax help', icon: '❓' }
  ]

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  }

  const getMessageIcon = (type, scenario) => {
    if (type === 'user') return '👤'
    if (type === 'system') return '⚙️'
    if (scenario === 'welcome') return '🤖'
    if (scenario === 'deductions') return '💰'
    if (scenario === 'filing') return '📋'
    if (scenario === 'business') return '🏢'
    return '🤖'
  }

  if (isLoading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        <p>Initializing your tax consultation...</p>
      </div>
    )
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-title">
            {(!showQuickActions || currentScenario !== 'general') && (
              <button 
                onClick={handleHomeClick}
                className="home-button"
                title="Return to Quick Start"
              >
                🏠 Home
              </button>
            )}
            <h2 
              onClick={handleHomeClick}
              className="clickable-logo"
              title="Return to Mode Selection"
            >
              Tax Consultation
            </h2>
            <span className="chat-subtitle">AI-Powered Tax Assistance</span>
          </div>
          <div className="chat-stats">
            <span className="message-count">{messageCount} messages</span>
            <span className="scenario-badge">{currentScenario}</span>
          </div>
        </div>
        
        <div className="chat-header-actions">
          <button 
            onClick={handleExportChat}
            className="export-button"
            title="Export Chat"
            disabled={messages.length === 0}
          >
            📥 Export
          </button>
          <button 
            onClick={handleClearChat}
            className="clear-button"
            title="Clear Chat"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="chat-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}

      <div className="chat-container" ref={chatContainerRef}>
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.type} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {getMessageIcon(message.type, message.scenario)}
              </div>
              
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {message.type === 'user' ? user.name : 'TaxBuddy'}
                  </span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="message-text">
                  {formatMessage(message.content)}
                </div>

                {message.type === 'ai' && selectedMode === 'voice' && (
                  <div className="voice-controls">
                    <button
                      onClick={() => speakMessage(message.content)}
                      disabled={isSpeaking}
                      className="speak-button"
                      title="Click to hear this response spoken aloud"
                    >
                      {isSpeaking ? '🔊' : '🔈'} {isSpeaking ? 'Speaking...' : 'Listen'}
                    </button>
                  </div>
                )}

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="message-suggestions">
                    <p className="suggestions-title">Suggested follow-ups:</p>
                    <div className="suggestions-list">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction({ text: suggestion })}
                          className="suggestion-button"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {message.actions && message.actions.length > 0 && (
                  <div className="message-actions">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="action-button"
                      >
                        {action.icon} {action.text}
                      </button>
                    ))}
                  </div>
                )}

                {message.type === 'ai' && message.confidence && (
                  <div className="message-metadata">
                    <div className="confidence-score">
                      <span className="confidence-label">Confidence:</span>
                      <span className={`confidence-value ${message.confidence >= 0.9 ? 'high' : message.confidence >= 0.7 ? 'medium' : 'low'}`}>
                        {(message.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <div className="sources">
                        <span className="sources-label">Sources:</span>
                        <div className="sources-list">
                          {message.sources.map((source, index) => (
                            <span key={index} className="source-tag">
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isCalculating && (
            <div className="message ai calculating">
              <div className="message-avatar">🧮</div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">TaxBuddy</span>
                  <span className="message-time">calculating...</span>
                </div>
                <div className="calculating-indicator">
                  <span>🔢</span>
                  <span>📊</span>
                  <span>💰</span>
                </div>
              </div>
            </div>
          )}

          {isTyping && (
            <div className="message ai typing">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">TaxBuddy</span>
                  <span className="message-time">typing...</span>
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          {/* Mode Selection - Shows when no mode selected and no messages */}
          {!selectedMode && messages.length === 0 && (
            <div className="mode-selection">
              <h2>How would you like to interact with TaxBuddy?</h2>
              
              <div className="mode-buttons">
                <button 
                  className="mode-button chat-mode" 
                  onClick={startChatMode}
                  title="Start text-based chat conversation"
                >
                  <span className="icon">💬</span>
                  <h3>Chat with TaxBuddy</h3>
                  <p>Type your tax questions and get instant answers</p>
                </button>
                <button 
                  className="mode-button voice-mode" 
                  onClick={startVoiceMode}
                  title="Start voice conversation with speech recognition"
                >
                  <span className="icon">🎤</span>
                  <h3>Talk to TaxBuddy</h3>
                  <p>Speak naturally and get voice responses</p>
                </button>
              </div>
              
              <div className="quick-links">
                <h3>Popular Topics:</h3>
                <div className="topic-chips">
                  <button onClick={() => { startChatMode(); handleQuickAction('deductions'); }}>🔥 Deductions</button>
                  <button onClick={() => { startChatMode(); handleQuickAction('filing'); }}>📄 Filing Taxes</button>
                  <button onClick={() => { startChatMode(); handleQuickAction('deadlines'); }}>📅 Deadlines</button>
                  <button onClick={() => { startChatMode(); handleQuickAction('refund'); }}>💵 Refund Status</button>
                </div>
                
                <div className="voice-activate-section">
                  <p>💡 <strong>Voice Command:</strong> In voice mode, say "end session" to stop</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Welcome Message and Quick Actions - Shows after mode selected */}
        {selectedMode && (messageCount <= 1 || showQuickActions) && (
          <>
            <div className="welcome-message">
              <div className="taxbuddy-avatar">{selectedMode === 'voice' ? '🎤' : '💬'}</div>
              <div className="message">
                <strong>TaxBuddy</strong>
                <p>Hello {user.name}! I'm TaxBuddy, your AI tax assistant. {selectedMode === 'voice' ? 'You can speak to me naturally, and I\'ll respond with voice.' : 'I\'m here to help you with tax questions, deductions, filing guidance, and more.'} How can I assist you today?</p>
              </div>
            </div>
            
            {!activeCategory && showQuickActions && (
              <div className="quick-start-section">
                <h3>Quick Start</h3>
                <p>Choose a topic to get started:</p>
                <div className="quick-start-grid">
                  <button className="quick-start-button" onClick={() => handleQuickAction('deductions')}>
                    <span>🔥</span>
                    <span>What deductions can I claim?</span>
                  </button>
                  <button className="quick-start-button" onClick={() => handleQuickAction('filing')}>
                    <span>📄</span>
                    <span>How do I file my taxes?</span>
                  </button>
                  <button className="quick-start-button" onClick={() => handleQuickAction('deadlines')}>
                    <span>📅</span>
                    <span>When are tax deadlines?</span>
                  </button>
                  <button className="quick-start-button" onClick={() => handleQuickAction('business')}>
                    <span>🏢</span>
                    <span>Business tax questions</span>
                  </button>
                  <button className="quick-start-button" onClick={() => handleQuickAction('refund')}>
                    <span>💵</span>
                    <span>When will I get my refund?</span>
                  </button>
                  <button className="quick-start-button" onClick={() => handleQuickAction('general')}>
                    <span>❓</span>
                    <span>General tax help</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!showQuickActions && messageCount > 1 && (
          <div className="back-to-quick-start">
            <button
              onClick={handleHomeClick}
              className="back-to-quick-start-button"
            >
              ← Back to Quick Start
            </button>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about taxes... (Press Enter to send, Shift+Enter for new line)"
            className="chat-input"
            rows="1"
            disabled={isTyping || isLoading}
          />
          
          <div className="input-actions">
            {selectedMode === 'voice' && (
              <button
                className={`voice-input-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTyping || isLoading}
                title={isRecording ? 'Stop voice recording' : 'Click to start voice recording'}
                style={{
                  background: isRecording ? '#ef4444' : '#6366f1',
                  color: 'white',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  marginRight: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                }}
              >
                {isRecording ? '🔴' : '🎤'}
              </button>
            )}
            <button
              onClick={triggerFileUpload}
              disabled={isUploading}
              className="upload-button"
              title="Upload tax documents (PDF, DOC, images)"
            >
              {isUploading ? '⏳' : '📎'}
            </button>
            <span className="char-count">
              {inputValue.length}/{config.chat.maxMessageLength}
            </span>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping || isLoading}
              className="send-button"
              title="Send message (or press Enter)"
            >
              {isLoading ? '⏳' : '📤'} Send
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
        
        {/* Voice Session Controls */}
        {selectedMode === 'voice' && voiceSessionActive && (
          <div className="voice-session-controls">
            <div className="voice-session-header">
              <div className="voice-session-info">
                <span className="voice-timer">🎤 {formatVoiceTime(voiceSessionTime)}</span>
                <span className={`voice-status ${isRecording ? 'recording pulse' : ''}`}>
                  {isRecording ? '🔴 Recording...' : '✅ Voice session active'}
                </span>
              </div>
              <div className="current-language">
                🌐 {voiceLanguage === 'hi-IN' ? 'हिंदी' : 'English'}
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="language-selector">
              <span className="language-label">Language:</span>
              <button 
                onClick={() => setVoiceLanguage('en-US')}
                className={`language-btn ${voiceLanguage === 'en-US' ? 'active' : ''}`}
                title="Switch to English"
              >
                🇺🇸 English
              </button>
              <button 
                onClick={() => setVoiceLanguage('hi-IN')}
                className={`language-btn ${voiceLanguage === 'hi-IN' ? 'active' : ''}`}
                title="Switch to Hindi"
              >
                🇮🇳 हिंदी
              </button>
            </div>
            
            {interimTranscript && (
              <div className="interim-transcript">
                <span className="interim-label">You're saying:</span>
                <span className="interim-text">"{interimTranscript}"</span>
              </div>
            )}
            
            {voiceError && (
              <div className="voice-error">
                ⚠️ {voiceError}
              </div>
            )}
            
            <button 
              onClick={endVoiceSession}
              className="end-voice-session-btn"
              title="Stop voice session and return to chat mode"
            >
              📞 End Voice Session
            </button>
          </div>
        )}

        <div className="input-help">
          <span className="help-text">
            {selectedMode === 'voice' ? 
              (voiceSessionActive ? 
                (isRecording ? '🎤 Listening... Speak your tax question' : '🎤 Voice session active - just start speaking') :
                '💡 Click the microphone to speak your tax question'
              ) :
              '💡 Pro tip: Be specific about your tax situation for better assistance'
            }
          </span>
          {isRecording && selectedMode !== 'voice' && (
            <div className="recording-indicator">
              <div className="recording-pulse"></div>
              Recording...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInterface