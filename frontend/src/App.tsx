import "./App.css";
import { Navbar04 } from "./components/ui/shadcn-io/navbar-04/navbar";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./hooks/AuthHook";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import HomePage from "./pages/homePage/homePage";
import CarsPage from "./pages/cars/carsPage";
import CarDetailed from "./pages/carDetailed/carDetailed";
import ReservationsPage from "./pages/reservations/reservations";
import Dashboard from "./pages/admin/dashboard/dashboard";

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleReservationsClick = () => {
    navigate("/reservations");
  };

  const baseNavigationLinks = [{ href: "/cars", label: "Voitures" }];
  const navigationLinks = user && (user.role ?? "").toUpperCase() === "ADMIN"
    ? [...baseNavigationLinks, { href: "/dashboard", label: "Dashboard" }]
    : baseNavigationLinks;

  return (
    <>
      <Navbar04
        className="w-full"
        user={user}
        onLogout={logout}
        onSignInClick={handleSignInClick}
        onReservationsClick={handleReservationsClick}
        navigationLinks={navigationLinks}
      />
      <main className="h-full w-full flex justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/car/:id" element={<CarDetailed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
