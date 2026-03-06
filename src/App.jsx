import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Don from "./pages/Don";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Galerie from "./components/Galerie";
import Reservation from "./pages/Reservation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/don" element={<Don />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/reservation" element={<Reservation />} />
        {/* Ces deux-là étaient en dehors du groupe Routes ! */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;