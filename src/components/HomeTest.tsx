import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './common/Header';
import { Footer } from './common/Footer';
import { HeroSection } from './home/components/HeroSection';
import { BackgroundGrid } from './home/components/BackgroundGrid';
import { GradientOverlay } from './home/components/GradientOverlay';
import { ContactSection } from './home/components/ContactSection';
import { InfoCards } from './home/components/InfoCards';

function HomeTest() {
  const navigate = useNavigate();

  const handleGeotechnicalClick = () => {
    navigate('/geotechnical');
  };

  const handleEnvironmentalClick = () => {
    navigate('/environmental');
  };

  const handleProjectControlsClick = () => {
    navigate('/project-controls');
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      <div className="pt-24">
        <HeroSection />
        <div className="relative">
          <BackgroundGrid />
          <GradientOverlay />
          <div className="relative z-10">
            <InfoCards 
              onGeotechnicalClick={handleGeotechnicalClick}
              onEnvironmentalClick={handleEnvironmentalClick}
              onProjectControlsClick={handleProjectControlsClick}
            />
          </div>
        </div>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}

export default HomeTest;