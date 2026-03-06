import Navbar from "../components/Navbar";
import Hero from "../components/Heros";
import MomentSpirituel from "../components/SectionPrière";
import CallToAction from "../components/CallToAction";
import Galerie from "../components/Galerie";
import Live from "./live";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MomentSpirituel />
      <CallToAction />
      <Live />
      <Galerie />
      <Footer />
    </>
  );
}