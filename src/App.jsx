import { useState, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [performanceData, setPerformanceData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedComponents, setSelectedComponents] = useState({
    slack_mcp: true,
    gmail_mcp: true,
    gmail_api: true,
    personality: true,
    einstein: true
  })

  const loadPerformanceData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the full server URL since we're running in dev mode
      const response = await fetch('http://localhost:3001/performance-data')
      if (!response.ok) {
        throw new Error('Failed to load performance data')
      }
      const jsonData = await response.json()
      setPerformanceData(jsonData)
    } catch (err) {
      setError('Error loading performance data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFileInput = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        setPerformanceData(jsonData)
        setLoading(false)
      } catch (err) {
        setError('Invalid JSON file. Please check the file format.')
        setLoading(false)
      }
    }
    reader.onerror = () => {
      setError('Error reading file. Please try again.')
      setLoading(false)
    }
    reader.readAsText(file)
  }, [])

  const handleComponentToggle = useCallback((component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }))
  }, [])

  const processData = (data) => {
    if (!data?.runs) return []
    
    return data.runs.map((run, index) => {
      const timestamp = new Date(run.timestamp)
      const formattedTime = timestamp.toLocaleTimeString()
      
      return {
        name: `Run ${index + 1}`,
        timestamp: formattedTime,
        dealId: run.deal_id,
        slack_mcp: run.component_times.slack_mcp,
        gmail_mcp: run.component_times.gmail_mcp,
        gmail_api: run.component_times.gmail_api,
        personality: run.component_times.personality,
        einstein: run.component_times.einstein,
        total: run.component_times.total,
        success: run.success
      }
    })
  }

  const chartData = processData(performanceData)

  const colors = {
    slack_mcp: '#4a9eff',
    gmail_mcp: '#50c878',
    gmail_api: '#8a2be2',
    personality: '#ffd700',
    einstein: '#ff6b35',
    total: '#ff4757'
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Performance Graph Viewer</h1>
        <p>Upload a JSON file to visualize performance metrics</p>
      </header>

      <main className="app-main">
        <div className="file-input-section">
          <input
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            Choose JSON File
          </label>
          
          <button 
            onClick={loadPerformanceData}
            className="refresh-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {loading && (
          <div className="loading">
            <p>Loading data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {performanceData && (
          <div className="data-info">
            <h2>Oliver's Performance Data Overview</h2>
            <p>Total runs: {performanceData.runs?.length || 0}</p>
            <p>Date range: {performanceData.runs?.[0]?.timestamp ? new Date(performanceData.runs[0].timestamp).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : ''} to {performanceData.runs?.[performanceData.runs.length - 1]?.timestamp ? new Date(performanceData.runs[performanceData.runs.length - 1].timestamp).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}</p>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="charts-container">
            <div className="chart-section">
              <h3>Component Performance Over Time</h3>
              <div className="component-controls">
                <h4>Select Components to Display:</h4>
                <div className="checkbox-grid">
                  {Object.keys(selectedComponents).map(component => (
                    <label key={component} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedComponents[component]}
                        onChange={() => handleComponentToggle(component)}
                        className="component-checkbox"
                      />
                      <span className="checkbox-text">{component.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={700}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value.toFixed(2)}s`, name]}
                    labelFormatter={(label) => `${label} (${chartData.find(d => d.name === label)?.timestamp})`}
                  />
                  <Legend />
                  {selectedComponents.slack_mcp && (
                    <Line 
                      type="monotone" 
                      dataKey="slack_mcp" 
                      stroke={colors.slack_mcp} 
                      strokeWidth={2}
                      dot={{ fill: colors.slack_mcp, strokeWidth: 2, r: 4 }}
                    />
                  )}
                  {selectedComponents.gmail_mcp && (
                    <Line 
                      type="monotone" 
                      dataKey="gmail_mcp" 
                      stroke={colors.gmail_mcp} 
                      strokeWidth={2}
                      dot={{ fill: colors.gmail_mcp, strokeWidth: 2, r: 4 }}
                    />
                  )}
                  {selectedComponents.gmail_api && (
                    <Line 
                      type="monotone" 
                      dataKey="gmail_api" 
                      stroke={colors.gmail_api} 
                      strokeWidth={2}
                      dot={{ fill: colors.gmail_api, strokeWidth: 2, r: 4 }}
                    />
                  )}
                  {selectedComponents.personality && (
                    <Line 
                      type="monotone" 
                      dataKey="personality" 
                      stroke={colors.personality} 
                      strokeWidth={2}
                      dot={{ fill: colors.personality, strokeWidth: 2, r: 4 }}
                    />
                  )}
                  {selectedComponents.einstein && (
                    <Line 
                      type="monotone" 
                      dataKey="einstein" 
                      stroke={colors.einstein} 
                      strokeWidth={2}
                      dot={{ fill: colors.einstein, strokeWidth: 2, r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h3>Total Performance Over Time</h3>
              <ResponsiveContainer width="100%" height={700}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toFixed(2)}s`, 'Total Time']}
                    labelFormatter={(label) => `${label} (${chartData.find(d => d.name === label)?.timestamp})`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={colors.total} 
                    strokeWidth={3}
                    dot={{ fill: colors.total, strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="stats-section">
              <h3>Performance Statistics</h3>
              <div className="stats-grid">
                {Object.keys(colors).map(component => {
                  const values = chartData.map(d => d[component]).filter(v => v !== undefined)
                  const avg = values.reduce((a, b) => a + b, 0) / values.length
                  const min = Math.min(...values)
                  const max = Math.max(...values)
                  
                  return (
                    <div key={component} className="stat-card">
                      <h4>{component.replace('_', ' ').toUpperCase()}</h4>
                      <p>Average: {avg.toFixed(2)}s</p>
                      <p>Min: {min.toFixed(2)}s</p>
                      <p>Max: {max.toFixed(2)}s</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
