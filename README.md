# Performance Graph Viewer

A modern React application for visualizing performance metrics from JSON data. This tool creates beautiful line graphs to analyze component performance over time.

## Features

- **Interactive Line Charts**: Visualize performance metrics over time
- **Multiple Component Tracking**: Track individual component performance (slack_mcp, gmail_mcp, personality, einstein)
- **Total Performance Overview**: Dedicated chart for overall performance
- **Statistics Dashboard**: View average, min, and max values for each component
- **Responsive Design**: Works on desktop and mobile devices
- **File Upload**: Simple drag-and-drop or click-to-upload JSON files
- **Real-time Data Processing**: Instant visualization of uploaded data

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Click "Choose JSON File" to upload your performance data

## JSON Data Format

The application expects JSON data in the following format:

```json
{
  "runs": [
    {
      "timestamp": "2025-07-14T20:30:02.400879",
      "deal_id": "27",
      "component_times": {
        "slack_mcp": 41.86345100402832,
        "gmail_mcp": 104.59490704536438,
        "personality": 10.025123834609985,
        "einstein": 27.181757926940918,
        "total": 183.6652398109436
      },
      "success": true
    }
  ]
}
```

### Required Fields

- `runs`: Array of performance run data
- `timestamp`: ISO 8601 timestamp string
- `deal_id`: Unique identifier for the run
- `component_times`: Object containing performance metrics in seconds
  - `slack_mcp`: Slack MCP component time
  - `gmail_mcp`: Gmail MCP component time
  - `personality`: Personality component time
  - `einstein`: Einstein component time
  - `total`: Total execution time
- `success`: Boolean indicating if the run was successful

## Usage

1. **Upload Data**: Click the "Choose JSON File" button and select your performance data file
2. **View Overview**: See basic information about your data including number of runs and date range
3. **Analyze Components**: The first chart shows individual component performance over time
4. **Monitor Totals**: The second chart focuses on total performance trends
5. **Review Statistics**: Check the statistics cards for average, minimum, and maximum values

## Features in Detail

### Component Performance Chart
- Shows all individual components (slack_mcp, gmail_mcp, personality, einstein) on the same timeline
- Color-coded lines for easy identification
- Interactive tooltips showing exact values and timestamps
- Legend for component identification

### Total Performance Chart
- Focused view of overall performance trends
- Larger, more prominent display of total execution time
- Useful for identifying performance degradation or improvements

### Statistics Dashboard
- Average performance for each component
- Minimum and maximum values
- Helps identify performance outliers and trends

## Customization

The application is built with React and uses Recharts for visualization. You can customize:

- **Colors**: Modify the `colors` object in `App.jsx` to change chart colors
- **Styling**: Update `App.css` for visual customization
- **Data Processing**: Modify the `processData` function to handle different data formats

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- **React 19**: Modern React with hooks
- **Recharts**: Professional charting library
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with gradients and animations

## Sample Data

A sample JSON file (`sample-performance-data.json`) is included in the repository for testing purposes.

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
