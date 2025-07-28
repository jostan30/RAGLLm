'use client'
import { useState } from 'react'
import { Upload, Trash2, FileText, CheckCircle, Moon, Sun } from 'lucide-react'
import { useTheme } from '../app/page'

interface SidebarProps {
  setFileId: (id: string | null) => void
}

export default function Sidebar({ setFileId }: SidebarProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('http://localhost:8000/upload_pdf/', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      setFileId(data.file_id)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = async () => {
    try {
      await fetch('http://localhost:8000/reset_all_db/', {
        method: 'POST'
      })
      setFileId(null)
      setSelectedFile(null)
      setUploadSuccess(false)
    } catch (error) {
      console.error('Clear failed:', error)
    }
  }

  return (
    <div className={`w-80 shadow-xl border-r flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b flex flex-col transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-blue-900' : 'bg-blue-100'
            }`}>
              <FileText className={`w-6 h-6 transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h1 className={`text-xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>PDF Chat</h1>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <p className={`text-sm transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>Upload a PDF and start chatting with it</p>
      </div>

      {/* Upload Section */}
      <div className="p-6 flex-1">
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Select PDF File
            </label>
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                isDark 
                  ? 'border-gray-600 hover:border-blue-500 bg-gray-700/30' 
                  : 'border-gray-300 hover:border-blue-400 bg-white'
              }`}>
                <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {selectedFile ? selectedFile.name : 'Choose a PDF file'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Uploaded!
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload PDF
              </>
            )}
          </button>

          {uploadSuccess && (
            <div className={`border rounded-lg p-3 transition-colors duration-300 ${
              isDark 
                ? 'bg-green-900/50 border-green-700' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm font-medium transition-colors duration-300 ${
                isDark ? 'text-green-300' : 'text-green-800'
              }`}>
                ✅ PDF uploaded successfully! You can now start chatting.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clear Memory Button */}
      <div className={`p-6 border-t transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <button
          onClick={handleClear}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border ${
            isDark 
              ? 'bg-red-900/50 hover:bg-red-900/70 text-red-300 border-red-700 hover:border-red-600' 
              : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Clear Memory
        </button>
      </div>
    </div>
  )
}