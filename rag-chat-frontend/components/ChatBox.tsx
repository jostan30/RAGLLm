'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, MessageSquare, FileText } from 'lucide-react'
import { useTheme } from '../app/page'

interface ChatBoxProps {
  fileId: string | null
}

export default function ChatBox({ fileId }: ChatBoxProps) {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isDark } = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendQuery = async () => {
    if (!fileId || !query.trim()) return

    const userMessage = query.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setQuery('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file_id', fileId)
      formData.append('query', userMessage)

      const res = await fetch('http://localhost:8000/ask/', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'bot', text: data.response }])
    } catch (error) {
      console.error('Query failed:', error)
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuery()
    }
  }

  return (
    <div className={`flex-1 flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`border-b p-4 shadow-sm transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors duration-300 ${
            isDark ? 'bg-blue-900' : 'bg-blue-100'
          }`}>
            <MessageSquare className={`w-5 h-5 transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h2 className={`font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Chat with your PDF</h2>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {fileId ? 'Ready to answer your questions' : 'Upload a PDF to start chatting'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !fileId && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <FileText className={`w-8 h-8 transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>No PDF uploaded</h3>
              <p className={`transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Upload a PDF file to start asking questions about its content.</p>
            </div>
          </div>
        )}

        {messages.length === 0 && fileId && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                isDark ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <MessageSquare className={`w-8 h-8 transition-colors duration-300 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>Ready to chat!</h3>
              <p className={`transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Ask me anything about your PDF content.</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600' : (isDark ? 'bg-gray-600' : 'bg-gray-600')
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-3 transition-colors duration-300 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : (isDark 
                      ? 'bg-gray-700 text-gray-100 border border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200')
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-3xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-gray-600' : 'bg-gray-600'
              }`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`rounded-2xl px-4 py-3 border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDark ? 'bg-gray-400' : 'bg-gray-400'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDark ? 'bg-gray-400' : 'bg-gray-400'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDark ? 'bg-gray-400' : 'bg-gray-400'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-4 transition-colors duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-900/50' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={fileId ? "Ask something about your PDF..." : "Upload a PDF first to start chatting"}
              disabled={!fileId || isLoading}
              rows={1}
              className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:text-gray-400 resize-none overflow-hidden transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 disabled:bg-gray-800' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-100'
              }`}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 120) + 'px'
              }}
            />
          </div>
          <button
            onClick={sendQuery}
            disabled={!fileId || !query.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className={`text-xs mt-2 transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}