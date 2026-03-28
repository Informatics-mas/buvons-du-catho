import Navbar from "../components/Navbar";
import Hero from "../components/Heros";
import MomentSpirituel from "../components/SectionPrière";
import CallToAction from "../components/CallToAction";
import Galerie from "../components/Galerie";
import Live from "./live"; // Assure-toi que le chemin est correct (souvent ../pages/Live ou ../components/Live)
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-[#0B1A3B] min-h-screen">
      <Navbar />
      
      <main>
        {/* 1. Accueil & Identité */}
        <Hero />
        
        {/* 2. Message Spirituel */}
        <MomentSpirituel />
        
        {/* 3. Actions directes (Réservation/Don) */}
        <CallToAction />
        
        {/* 4. L'expérience en direct */}
        <section id="live-section" className="bg-[#081229]">
           <Live />
        </section>
        
      </main>

      <Footer />
    </div>
  );
}