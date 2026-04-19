import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Power, RefreshCw, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react'
import './IoTSimulation.css'

function IoTSimulation() {
  const [soilValue, setSoilValue] = useState(745) // Valeur brute du capteur (0-1023)
  const [pumpActive, setPumpActive] = useState(false)
  const [ledOn, setLedOn] = useState(false)
  const [autoMode, setAutoMode] = useState(true)
  const [logs, setLogs] = useState([])
  const [history, setHistory] = useState([])

  // Conversion valeur brute -> pourcentage
  const humidityPercent = Math.max(0, Math.min(100, Math.round((1023 - soilValue) / 1023 * 100)))

  // Simulation temps réel du capteur
  useEffect(() => {
    const interval = setInterval(() => {
      setSoilValue(prev => {
        const change = Math.floor((Math.random() - 0.5) * 20)
        const newValue = Math.max(200, Math.min(900, prev + change))
        
        setHistory(hist => [...hist.slice(-20), { 
          time: new Date().toLocaleTimeString('fr-FR'), 
          value: newValue,
          percent: Math.round((1023 - newValue) / 1023 * 100)
        }])
        
        return newValue
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Logique Arduino: si soil_sensor < 400 (humidité > 60%) -> pompe ON
  useEffect(() => {
    if (autoMode) {
      const threshold = 400 // Seuil Arduino
      if (soilValue < threshold && !pumpActive) {
        setPumpActive(true)
        setLedOn(true)
        addLog('Pompe activée - Seuil dépassé', 'system')
      } else if (soilValue >= threshold + 50 && pumpActive) {
        setPumpActive(false)
        setLedOn(false)
        addLog('Pompe désactivée - Humidité OK', 'info')
      }
    }
  }, [soilValue, pumpActive, autoMode])

  const addLog = (message, type) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR')
    setLogs(prev => [{ time: timestamp, message, type }, ...prev].slice(0, 10))
  }

  const togglePump = () => {
    setPumpActive(!pumpActive)
    setLedOn(!pumpActive)
    setAutoMode(false)
    addLog(`Pompe ${!pumpActive ? 'activée' : 'désactivée'} manuellement`, 'manual')
  }

  const resetSimulation = () => {
    setSoilValue(745)
    setPumpActive(false)
    setLedOn(false)
    setHistory([])
    setLogs([])
    setAutoMode(true)
    addLog('Simulation réinitialisée', 'info')
  }

  return (
    <div className="iot-simulation">
      <header className="sim-header">
        <Activity className="header-icon" />
        <h1>Simulation IoT - Arduino</h1>
        <p>Capteur d'humidité du sol + Pompe automatique</p>
      </header>

      <div className="arduino-container">
        {/* Carte Arduino */}
        <motion.div 
          className="arduino-board"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="board-header">
            <Cpu className="board-icon" />
            <h2>Arduino UNO</h2>
            <span className="board-status">Connecté</span>
          </div>
          
          <div className="board-pins">
            <div className="pin-row">
              <span className="pin-label">A0</span>
              <div className="pin analog">Capteur Humidité</div>
            </div>
            <div className="pin-row">
              <span className="pin-label">D7</span>
              <div className={`pin digital ${pumpActive ? 'active' : ''}`}>Pompe</div>
            </div>
            <div className="pin-row">
              <span className="pin-label">D8</span>
              <div className={`pin digital ${ledOn ? 'active' : ''}`}>LED</div>
            </div>
            <div className="pin-row">
              <span className="pin-label">D9</span>
              <div className="pin digital">Buzzer</div>
            </div>
          </div>
        </motion.div>

        {/* Capteur d'humidité */}
        <motion.div 
          className="sensor-module"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="module-header">
            <Droplets className="module-icon" />
            <h2>Capteur YL-69</h2>
          </div>
          
          <div className="sensor-visual">
            <div className="soil-probe">
              <div className="probe left"></div>
              <div className="probe right"></div>
              <div className="soil-area" style={{ 
                background: `linear-gradient(to bottom, #8B4513 ${humidityPercent}%, #D2691E ${humidityPercent}%)` 
              }}>
                <span className="soil-label">Sol</span>
              </div>
            </div>
            
            <div className="sensor-readout">
              <div className="readout-value">
                <span className="label">Valeur brute:</span>
                <span className="value">{soilValue}</span>
              </div>
              <div className="readout-percent">
                <span className="label">Humidité:</span>
                <span className={`value ${humidityPercent < 40 ? 'warning' : 'good'}`}>
                  {humidityPercent}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pompe et LED */}
        <motion.div 
          className="actuators"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="actuator-header">
            <Power className="actuator-icon" />
            <h2>Actionneurs</h2>
          </div>
          
          <div className="actuator-grid">
            <div className={`actuator-card ${pumpActive ? 'active' : ''}`}>
              <div className="actuator-visual">
                <div className="pump-body">
                  <div className={`pump-rotor ${pumpActive ? 'spinning' : ''}`}></div>
                </div>
                <div className="water-flow">
                  {pumpActive && <div className="drop falling"></div>}
                </div>
              </div>
              <div className="actuator-info">
                <h3>Pompe 12V</h3>
                <span className={`status ${pumpActive ? 'on' : 'off'}`}>
                  {pumpActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>

            <div className={`actuator-card ${ledOn ? 'active' : ''}`}>
              <div className="actuator-visual">
                <div className={`led ${ledOn ? 'glowing' : ''}`}></div>
              </div>
              <div className="actuator-info">
                <h3>LED Rouge</h3>
                <span className={`status ${ledOn ? 'on' : 'off'}`}>
                  {ledOn ? 'ALLUMÉE' : 'ÉTEINTE'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contrôles */}
      <div className="controls-panel">
        <button 
          onClick={togglePump}
          className="control-btn"
          disabled={autoMode}
        >
          <Power className="btn-icon" />
          {pumpActive ? 'Arrêter' : 'Démarrer'} Pompe
        </button>
        
        <button 
          onClick={() => setAutoMode(!autoMode)}
          className={`control-btn ${autoMode ? 'active' : ''}`}
        >
          <Activity className="btn-icon" />
          Mode: {autoMode ? 'AUTO' : 'MANUEL'}
        </button>
        
        <button onClick={resetSimulation} className="control-btn reset">
          <RefreshCw className="btn-icon" />
          Réinitialiser
        </button>
      </div>

      {/* Moniteur Série */}
      <motion.div 
        className="serial-monitor"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="monitor-header">
          <Activity className="monitor-icon" />
          <h3>Moniteur Série (9600 baud)</h3>
        </div>
        
        <div className="monitor-content">
          <div className="code-preview">
            <pre>{`void loop() {
  soil_sensor = analogRead(A0);
  Serial.println(soil_sensor);
  if (soil_sensor < 400) {
    digitalWrite(7, HIGH);
    digitalWrite(8, HIGH);
  }
}`}</pre>
          </div>
          
          <div className="serial-output">
            <div className="output-header">Sortie:</div>
            {history.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} className="output-line">
                <span className="timestamp">{entry.time}</span>
                <span className="value">{entry.value}</span>
                <span className={`percent ${entry.percent < 40 ? 'warning' : ''}`}>
                  {entry.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Logs Système */}
      <div className="logs-panel">
        <h3><AlertTriangle className="log-icon" /> Journal du Système</h3>
        <div className="logs-list">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`log-entry ${log.type}`}
            >
              <span className="log-time">{log.time}</span>
              <span className="log-message">{log.message}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Icône CPU inline
function Cpu(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )
}

export default IoTSimulation