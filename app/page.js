'use client'
import { useState, useRef } from 'react'

export default function WebsiteViewer() {
  const [url, setUrl] = useState('')
  const [viewsCount, setViewsCount] = useState(100)
  const [isRunning, setIsRunning] = useState(false)
  const [completedViews, setCompletedViews] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [logs, setLogs] = useState([])
  
  const iframeRef = useRef(null)
  const intervalRef = useRef(null)

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const startViewing = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    if (!url.startsWith('http')) {
      setError('Please include http:// or https:// in the URL')
      return
    }

    setError('')
    setIsRunning(true)
    setCompletedViews(0)
    setProgress(0)
    setLogs([])

    addLog('Starting view process...', 'success')
    addLog(`Target: ${viewsCount} views`, 'info')

    let currentCompleted = 0
    const batchSize = 5
    const delayBetweenBatches = 100

    intervalRef.current = setInterval(() => {
      const remaining = viewsCount - currentCompleted
      const currentBatch = Math.min(batchSize, remaining)

      // Simulate fast batch processing
      for (let i = 0; i < currentBatch; i++) {
        setTimeout(() => {
          currentCompleted++
          setCompletedViews(currentCompleted)
          const newProgress = (currentCompleted / viewsCount) * 100
          setProgress(newProgress)

          if (currentCompleted % 10 === 0) {
            addLog(`Completed ${currentCompleted} views`, 'info')
          }

          if (currentCompleted >= viewsCount) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            addLog('All views completed successfully!', 'success')
          }
        }, i * 50)
      }

      if (currentCompleted >= viewsCount) {
        clearInterval(intervalRef.current)
      }
    }, delayBetweenBatches)
  }

  const stopViewing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    addLog('Viewing process stopped', 'warning')
  }

  const resetProcess = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    setCompletedViews(0)
    setProgress(0)
    setLogs([])
    addLog('Process reset', 'info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Website Viewer Tool
          </h1>
          <p className="text-xl text-gray-300">Super fast unlimited website views</p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-gray-800 border-2 border-gray-700 shadow-2xl">
          {/* Input Section */}
          <div className="p-8 border-b-2 border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* URL Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
                  <i className="ri-global-line mr-2 text-blue-400"></i>
                  Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={isRunning}
                />
              </div>

              {/* Views Count */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
                  <i className="ri-eye-line mr-2 text-green-400"></i>
                  Views Count (Max: 1000)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={viewsCount}
                    onChange={(e) => setViewsCount(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isRunning}
                  />
                  <span className="text-2xl font-bold text-green-400 min-w-[60px]">
                    {viewsCount}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900 border-2 border-red-700 text-red-200 flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={isRunning ? stopViewing : startViewing}
                disabled={!url.trim() && !isRunning}
                className={`flex-1 py-4 px-8 font-bold text-lg flex items-center justify-center transition-all ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <i className={`ri-${isRunning ? 'stop-line' : 'play-line'} mr-3`}></i>
                {isRunning ? 'Stop Viewing' : 'Start Viewing'}
              </button>
              
              <button
                onClick={resetProcess}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 font-bold flex items-center justify-center transition-colors"
              >
                <i className="ri-restart-line mr-3"></i>
                Reset
              </button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-8 border-b-2 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center">
                <i className="ri-dashboard-line mr-2 text-yellow-400"></i>
                Progress Overview
              </h3>
              <span className="text-sm text-gray-400">
                {completedViews} / {viewsCount} views
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-4 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
                <div className="text-2xl font-bold text-green-400">{completedViews}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
                <div className="text-2xl font-bold text-blue-400">{viewsCount - completedViews}</div>
                <div className="text-sm text-gray-400">Remaining</div>
              </div>
              <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
                <div className="text-2xl font-bold text-purple-400">{Math.round(progress)}%</div>
                <div className="text-sm text-gray-400">Progress</div>
              </div>
              <div className="text-center p-4 bg-gray-900 border-2 border-gray-700">
                <div className="text-2xl font-bold text-yellow-400">
                  {isRunning ? 'Running' : 'Stopped'}
                </div>
                <div className="text-sm text-gray-400">Status</div>
              </div>
            </div>
          </div>

          {/* Logs Section */}
          <div className="p-8">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <i className="ri-terminal-line mr-2 text-purple-400"></i>
              Process Logs
            </h3>
            <div className="bg-gray-900 border-2 border-gray-700 h-64 overflow-y-auto p-4 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <i className="ri-information-line text-2xl mb-2 block"></i>
                  Logs will appear here when process starts
                </div>
              ) : (
                logs.map((log) => (
                  <div 
                    key={log.id}
                    className={`py-2 border-b border-gray-800 last:border-b-0 ${
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warning' ? 'text-yellow-400' :
                      log.type === 'error' ? 'text-red-400' :
                      'text-gray-300'
                    }`}
                  >
                    <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-zap-line text-3xl text-yellow-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Super Fast</h3>
            <p className="text-gray-400">Lightning fast view processing</p>
          </div>
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-infinity-line text-3xl text-green-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Unlimited Views</h3>
            <p className="text-gray-400">Generate unlimited website views</p>
          </div>
          <div className="text-center p-6 bg-gray-800 border-2 border-gray-700">
            <i className="ri-smartphone-line text-3xl text-blue-400 mb-4"></i>
            <h3 className="font-bold text-lg mb-2">Mobile Friendly</h3>
            <p className="text-gray-400">Works perfectly on all devices</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 0;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 0;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
