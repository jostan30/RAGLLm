'use client'
import { useState, createContext, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

export default function Home() {
  const [fileId, setFileId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <main className={`flex h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-blue-900' 
          : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        <Sidebar setFileId={setFileId} />
        <ChatBox fileId={fileId} />
      </main>
    </ThemeContext.Provider>
  )
}