import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ParticleBackground from './components/three/ParticleBackground';
import OrbitingIcons from './components/three/OrbitingIcons';
import Home from './pages/Home';
import './App.css';

function Scene() {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Fade orbiting icons as user scrolls past hero (first viewport height)
      setHeroVisible(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#49C8FF" />
      <ParticleBackground />
      {heroVisible && <OrbitingIcons />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Persistent 3D Canvas — renders behind everything */}
        <div className="canvas-background">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene />
          </Canvas>
        </div>

        {/* HTML Content Layer */}
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

