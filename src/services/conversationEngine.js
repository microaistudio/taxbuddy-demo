/**
 * @file conversationEngine.js
 * @path ./taxbuddy-chat-demo/src/services/conversationEngine.js
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Mock conversation engine for tax assistance
 */

import { mockTaxData } from '@data/mockData'
import config from '@config'

class ConversationEngine {
  constructor() {
    this.sessions = new Map()
    this.responseTemplates = this.initializeTemplates()
    this.intentPatterns = this.initializeIntentPatterns()
  }

  initializeTemplates() {
    return {
      greeting: [
        "Hello! I'm here to help with your tax questions.",
        "Hi there! How can I assist you with your taxes today?",
        "Welcome! I'm ready to help you navigate tax matters."
      ],
      
      deductions: [
        "Great question about deductions! Here are some common ones you might be eligible for:",
        "Let me help you understand tax deductions that could save you money:",
        "Tax deductions can significantly reduce your taxable income. Here's what you should know:"
      ],
      
      filing: [
        "Filing your taxes doesn't have to be complicated. Here's a step-by-step guide:",
        "Let me walk you through the tax filing process:",
        "I'll help you understand how to file your taxes properly:"
      ],
      
      business: [
        "Business taxes have special considerations. Here's what you need to know:",
        "As a business owner, you have unique tax obligations and opportunities:",
        "Let me explain the key aspects of business taxation:"
      ],
      
      deadline: [
        "Tax deadlines are crucial to remember. Here are the important dates:",
        "Missing tax deadlines can be costly. Let me give you the key dates:",
        "Here's your tax calendar with all the important deadlines:"
      ],
      
      refund: [
        "Wondering about your tax refund? Here's what affects timing:",
        "Tax refunds depend on several factors. Let me explain:",
        "Here's what you need to know about tax refund processing:"
      ],
      
      fallback: [
        "That's an interesting tax question. Let me provide some general guidance:",
        "I'll do my best to help with that tax matter:",
        "Tax situations can be complex. Here's what I can tell you:"
      ]
    }
  }

  initializeIntentPatterns() {
    return {
      deductions: [
        /deduction/i, /write off/i, /claim/i, /tax break/i, /expense/i,
        /charitable/i, /donation/i, /medical/i, /mortgage/i, /student loan/i
      ],
      
      filing: [
        /file/i, /filing/i, /return/i, /form/i, /1040/i, /w-2/i, /w2/i,
        /how to/i, /submit/i, /electronic/i, /efile/i, /paper/i
      ],
      
      business: [
        /business/i, /self.employed/i, /freelance/i, /contractor/i, /llc/i,
        /corporation/i, /schedule c/i, /quarterly/i, /estimated/i
      ],
      
      deadline: [
        /deadline/i, /due date/i, /when/i, /april/i, /extension/i,
        /late/i, /penalty/i, /calendar/i
      ],
      
      refund: [
        /refund/i, /money back/i, /return/i, /irs/i, /deposit/i,
        /check/i, /delayed/i, /processing/i, /status/i
      ],
      
      greeting: [
        /hello/i, /hi/i, /hey/i, /start/i, /help/i, /assist/i
      ]
    }
  }

  async initializeSession(userId) {
    const sessionId = `session_${userId}_${Date.now()}`
    const session = {
      id: sessionId,
      userId,
      startTime: new Date().toISOString(),
      messageHistory: [],
      currentContext: 'general',
      userPreferences: {},
      conversationState: {
        lastIntent: null,
        followUpContext: null,
        askedQuestions: []
      }
    }

    this.sessions.set(sessionId, session)
    return session
  }

  async processMessage(sessionId, message, currentScenario = 'general') {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Add message to history
    session.messageHistory.push({
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    })

    // Detect intent
    const intent = this.detectIntent(message)
    const scenario = intent || currentScenario

    // Generate response
    const response = await this.generateResponse(message, scenario, session)

    // Update session
    session.conversationState.lastIntent = intent
    session.currentContext = scenario
    session.messageHistory.push({
      type: 'ai',
      content: response.message,
      timestamp: new Date().toISOString(),
      scenario
    })

    return {
      message: response.message,
      scenario,
      suggestions: response.suggestions,
      actions: response.actions,
      confidence: response.confidence
    }
  }

  detectIntent(message) {
    const lowercaseMessage = message.toLowerCase()
    
    // Check each intent pattern
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowercaseMessage)) {
          return intent
        }
      }
    }

    return null
  }

  async generateResponse(message, scenario, session) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const responseData = this.getScenarioResponse(scenario, message, session)
    
    return {
      message: responseData.message,
      suggestions: responseData.suggestions || [],
      actions: responseData.actions || [],
      confidence: responseData.confidence || 0.8
    }
  }

  getScenarioResponse(scenario, message, session) {
    const templates = this.responseTemplates[scenario] || this.responseTemplates.fallback
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    switch (scenario) {
      case 'deductions':
        return this.generateDeductionsResponse(template, message)
      
      case 'filing':
        return this.generateFilingResponse(template, message)
      
      case 'business':
        return this.generateBusinessResponse(template, message)
      
      case 'deadline':
        return this.generateDeadlineResponse(template, message)
      
      case 'refund':
        return this.generateRefundResponse(template, message)
      
      default:
        return this.generateGeneralResponse(template, message)
    }
  }

  generateDeductionsResponse(template, message) {
    const deductions = mockTaxData.commonDeductions
    const deductionList = deductions.slice(0, 5).map(d => 
      `• **${d.name}**: ${d.description} (up to $${d.maxAmount?.toLocaleString() || 'varies'})`
    ).join('\n')

    return {
      message: `${template}\n\n${deductionList}\n\n💡 **Remember**: Keep all receipts and documentation for any deductions you claim. The eligibility and limits may vary based on your specific situation.`,
      suggestions: [
        "Tell me more about business deductions",
        "What about charitable donation limits?",
        "How do I track medical expenses?",
        "Can I deduct home office expenses?"
      ],
      actions: [
        { text: "View deduction calculator", icon: "🧮" },
        { text: "Download receipt tracking template", icon: "📄" }
      ],
      confidence: 0.9
    }
  }

  generateFilingResponse(template, message) {
    const filingSteps = mockTaxData.filingProcess.steps
    const stepsList = filingSteps.map((step, index) => 
      `${index + 1}. **${step.title}**: ${step.description}`
    ).join('\n')

    return {
      message: `${template}\n\n${stepsList}\n\n📋 **Important**: Choose between paper filing (6-8 weeks processing) or e-filing (faster, usually 21 days for refunds).`,
      suggestions: [
        "What forms do I need?",
        "How do I e-file my taxes?",
        "What if I made a mistake on my return?",
        "Can I file an extension?"
      ],
      actions: [
        { text: "Find my local tax office", icon: "📍" },
        { text: "IRS e-file options", icon: "💻" }
      ],
      confidence: 0.95
    }
  }

  generateBusinessResponse(template, message) {
    const businessInfo = mockTaxData.businessTaxInfo
    const considerations = businessInfo.considerations.slice(0, 4).map(c => 
      `• **${c.category}**: ${c.description}`
    ).join('\n')

    return {
      message: `${template}\n\n${considerations}\n\n🏢 **Key Reminder**: Business owners often need to make quarterly estimated tax payments. Keep detailed records of all business income and expenses.`,
      suggestions: [
        "How do quarterly payments work?",
        "What business expenses can I deduct?",
        "Do I need an EIN?",
        "LLC vs Corporation tax differences?"
      ],
      actions: [
        { text: "Quarterly payment calculator", icon: "📊" },
        { text: "Business expense tracker", icon: "💼" }
      ],
      confidence: 0.85
    }
  }

  generateDeadlineResponse(template, message) {
    const deadlines = mockTaxData.taxDeadlines
    const upcomingDeadlines = Object.entries(deadlines).map(([key, deadline]) => 
      `• **${deadline.name}**: ${deadline.date} - ${deadline.description}`
    ).join('\n')

    return {
      message: `${template}\n\n${upcomingDeadlines}\n\n⚠️ **Important**: Missing deadlines can result in penalties and interest charges. Mark these dates in your calendar!`,
      suggestions: [
        "Can I file an extension?",
        "What are the penalty rates?",
        "How do I make estimated payments?",
        "What if I can't pay on time?"
      ],
      actions: [
        { text: "Set deadline reminders", icon: "🔔" },
        { text: "Extension request form", icon: "📋" }
      ],
      confidence: 0.95
    }
  }

  generateRefundResponse(template, message) {
    const refundInfo = mockTaxData.refundInformation
    const factorsList = refundInfo.factors.map(factor => 
      `• ${factor}`
    ).join('\n')

    return {
      message: `${template}\n\n**Factors affecting refund timing:**\n${factorsList}\n\n💰 **Typical Timeline**: E-filed returns with direct deposit usually process within 21 days. Paper returns take 6-8 weeks.`,
      suggestions: [
        "How can I track my refund?",
        "Why is my refund delayed?",
        "Can I change my direct deposit info?",
        "What if my refund is wrong?"
      ],
      actions: [
        { text: "IRS refund tracker", icon: "🔍" },
        { text: "Set up direct deposit", icon: "🏦" }
      ],
      confidence: 0.9
    }
  }

  generateGeneralResponse(template, message) {
    // Extract key tax-related keywords from the message
    const taxKeywords = message.match(/\b(tax|irs|deduction|refund|filing|business|income|1040)\b/gi) || []
    
    let response = template
    
    if (taxKeywords.length > 0) {
      response += `\n\nI noticed you mentioned: ${taxKeywords.join(', ')}. `
    }
    
    response += `\n\nI'm here to help with all aspects of taxation including:
• Personal income tax filing
• Business tax obligations  
• Deductions and credits
• Tax planning strategies
• IRS procedures and deadlines

Could you be more specific about what you'd like to know?`

    return {
      message: response,
      suggestions: [
        "What deductions can I claim?",
        "How do I file my taxes?",
        "Business tax questions",
        "When are tax deadlines?"
      ],
      actions: [
        { text: "Browse tax topics", icon: "📚" },
        { text: "Tax calculator tools", icon: "🧮" }
      ],
      confidence: 0.7
    }
  }

  getSessionHistory(sessionId) {
    const session = this.sessions.get(sessionId)
    return session ? session.messageHistory : []
  }

  clearSession(sessionId) {
    return this.sessions.delete(sessionId)
  }

  getActiveSessionsCount() {
    return this.sessions.size
  }
}

export const conversationEngine = new ConversationEngine()