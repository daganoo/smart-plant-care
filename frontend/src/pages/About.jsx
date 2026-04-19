import { motion } from 'framer-motion'
import { 
  Sprout, 
  Code2, 
  Layers, 
  Cpu, 
  Cloud, 
  BarChart3, 
  Palette, 
  Zap,
  Target,
  ArrowDown
} from 'lucide-react'
import './About.css'

function About() {
  const technologies = [
    { icon: <Code2 />, name: 'React', desc: 'Frontend moderne avec hooks et composants' },
    { icon: <Zap />, name: 'Vite', desc: 'Build tool ultra-rapide' },
    { icon: <Palette />, name: 'Tailwind CSS', desc: 'Styling utilitaire responsive' },
    { icon: <Cpu />, name: 'FastAPI', desc: 'Backend Python asynchrone' },
    { icon: <Layers />, name: 'Framer Motion', desc: 'Animations fluides et professionnelles' },
    { icon: <BarChart3 />, name: 'Recharts', desc: 'Visualisation de données' },
    { icon: <Cloud />, name: 'Lucide React', desc: 'Icônes modernes et cohérentes' },
  ]

  return (
    <div className="about">
      <motion.header 
        className="about-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sprout className="header-icon" />
        <h1>À Propos du Projet</h1>
        <p>Smart Plant Care System - Technologie au service de la nature</p>
      </motion.header>

      <div className="about-content">
        <motion.section 
          className="mission"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2><Target className="section-icon" /> Mission</h2>
          <p>
            Développer un système intelligent qui optimise l'arrosage des plantes 
            en combinant les technologies IoT et Machine Learning. 
            Notre objectif est de réduire le gaspillage d'eau tout en maintenant 
            la santé des plantes.
          </p>
        </motion.section>

        <motion.section 
          className="technologies"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2><Layers className="section-icon" /> Technologies Utilisées</h2>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <motion.div 
                key={index}
                className="tech-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="tech-icon">{tech.icon}</div>
                <h3>{tech.name}</h3>
                <p>{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="architecture"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h2><Cpu className="section-icon" /> Architecture</h2>
          <div className="arch-diagram">
            <div className="arch-layer">
              <strong>Frontend (React)</strong>
              <span>Interface utilisateur moderne et réactive</span>
            </div>
            <div className="arch-arrow"><ArrowDown /></div>
            <div className="arch-layer">
              <strong>Backend (FastAPI)</strong>
              <span>API REST + Logique ML</span>
            </div>
            <div className="arch-arrow"><ArrowDown /></div>
            <div className="arch-layer">
              <strong>IoT Simulation</strong>
              <span>Capteurs + Pompe automatique</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About