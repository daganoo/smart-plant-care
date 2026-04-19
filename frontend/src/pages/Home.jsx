import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sprout, Droplets, Brain, CloudRain, ArrowRight } from 'lucide-react'
import './Home.css'

function Home() {
  const features = [
    {
      icon: <Droplets className="feature-icon" />,
      title: 'Surveillance IoT',
      desc: 'Capteurs d\'humidité en temps réel pour un suivi précis'
    },
    {
      icon: <Brain className="feature-icon" />,
      title: 'Intelligence ML',
      desc: 'Prédiction intelligente des besoins en eau grâce au Machine Learning'
    },
    {
      icon: <CloudRain className="feature-icon" />,
      title: 'Météo Intégrée',
      desc: 'Données météorologiques pour optimiser l\'arrosage selon les conditions'
    }
  ]

  return (
    <div className="home">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Sprout className="hero-icon" />
          <h1>Smart Plant Care System</h1>
          <p className="hero-subtitle">
            La technologie au service de vos plantes
          </p>
          <p className="hero-description">
            Système intelligent d'arrosage combinant IoT et Machine Learning 
            pour optimiser la croissance de vos plantes et économiser l'eau.
          </p>
          <Link to="/dashboard" className="cta-button">
            Accéder au Dashboard
            <ArrowRight className="cta-icon" />
          </Link>
        </motion.div>
      </section>

      <section className="features">
        <h2>Nos Technologies</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home