import express from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

// Enable CORS for the frontend
app.use(cors())

// Serve static files from the dist directory (after building)
app.use(express.static(path.join(__dirname, 'dist')))

// API endpoint to serve performance data
app.get('/api/performance-data', async (req, res) => {
  try {
    const filePath = '/Users/omajano/code/goat-force/goat-backend/performance.json'
    const data = await fs.readFile(filePath, 'utf8')
    const jsonData = JSON.parse(data)
    res.json(jsonData)
  } catch (error) {
    console.error('Error reading performance data:', error)
    res.status(500).json({ error: 'Failed to load performance data' })
  }
})

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
}) 