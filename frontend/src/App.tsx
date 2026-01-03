import "./App.css";
import { Navbar04 } from "./components/ui/shadcn-io/navbar-04/navbar";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./hooks/AuthHook";
import Login from "./pages/login/login";
import HomePage from "./pages/homePage/homePage";
import CarsPage from "./pages/cars/carsPage";
import CarDetailed from "./pages/carDetailed/carDetailed";
import ReservationsPage from "./pages/reservations/reservations";

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleReservationsClick = () => {
    navigate("/reservations");
  };

  return (
    <>
      <Navbar04
        className="w-full"
        user={user}
        onLogout={logout}
        onSignInClick={handleSignInClick}
        onReservationsClick={handleReservationsClick}
        navigationLinks={[{ href: "/cars", label: "Voitures" }]}
      />
      <main className="h-full w-full flex justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/car/:id" element={<CarDetailed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservations" element={<ReservationsPage />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
