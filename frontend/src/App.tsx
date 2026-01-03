import "./App.css";
import { Navbar04 } from "./components/ui/shadcn-io/navbar-04";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar04 />
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={() => <div>azefa</div>} />
            <Route path="/login" Component={() => <div>test</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
