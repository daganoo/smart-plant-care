import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, CloudRain, AlertTriangle, CheckCircle, TrendingUp, Thermometer } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

function Dashboard() {
  const [humidity, setHumidity] = useState(40)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [weather, setWeather] = useState({ temp: 22, condition: 'Ensoleillé', humidity: 65 })

  const predict = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const prediction = humidity < 40 ? {
      shouldWater: true,
      message: "Arroser la plante",
      confidence: 0.92,
      reason: "Humidité sous le seuil critique (40%)"
    } : {
      shouldWater: false,
      message: "Pas besoin d'arrosage",
      confidence: 0.88,
      reason: "Humidité adéquate"
    }
    
    setResult(prediction)
    setLoading(false)
  }

  const chartData = [
    { time: '00h', humidity: 35 },
    { time: '04h', humidity: 38 },
    { time: '08h', humidity: 45 },
    { time: '12h', humidity: 52 },
    { time: '16h', humidity: 48 },
    { time: '20h', humidity: humidity },
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1><TrendingUp className="header-icon" /> Dashboard de Contrôle</h1>
        <p>Surveillance et prédiction intelligente</p>
      </header>

      <div className="dashboard-grid">
        <motion.div 
          className="control-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="panel-header">
            <Droplets className="panel-icon" />
            <h2>Contrôle Humidité</h2>
          </div>
          
          <div className="humidity-control">
            <label>Humidité du Sol</label>
            <input
              type="range"
              min="0"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="humidity-slider"
            />
            <div className="humidity-value">
              <span className="value">{humidity}%</span>
              <span className={`status ${humidity < 40 ? 'warning' : 'good'}`}>
                {humidity < 40 ? <AlertTriangle /> : <CheckCircle />}
              </span>
            </div>
          </div>

          <button 
            onClick={predict}
            disabled={loading}
            className="predict-btn"
          >
            {loading ? 'Analyse...' : 'Prédire avec ML'}
          </button>

          {result && (
            <motion.div 
              className={`prediction-result ${result.shouldWater ? 'water' : 'no-water'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3>{result.message}</h3>
              <div className="confidence">
                Confiance: {(result.confidence * 100).toFixed(0)}%
              </div>
              <small>{result.reason}</small>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="weather-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="panel-header">
            <CloudRain className="panel-icon" />
            <h2>Conditions Météo</h2>
          </div>
          <div className="weather-info">
            <div className="weather-item">
              <span><Thermometer className="weather-icon" /> Température</span>
              <strong>{weather.temp}°C</strong>
            </div>
            <div className="weather-item">
              <span><Droplets className="weather-icon" /> Humidité air</span>
              <strong>{weather.humidity}%</strong>
            </div>
            <div className="weather-item">
              <span><CloudRain className="weather-icon" /> Condition</span>
              <strong>{weather.condition}</strong>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="chart-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2><TrendingUp className="chart-icon" /> Historique d'Humidité</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  itemStyle={{ color: '#4ade80' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#4ade80" 
                  strokeWidth={3}
                  dot={{ fill: '#4ade80' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard