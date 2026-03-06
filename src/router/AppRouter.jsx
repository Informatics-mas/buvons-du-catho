import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Reservation from "../pages/Reservation";
import Don from "../pages/Don";
import Live from "../pages/live";
import Galerie from "../components/Galerie";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/don" element={<Don />} />
        <Route path="/live" element={<Live />} />
        <Route path="/galerie" element={<Galerie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;