import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "./context/LocaleContext";
import { LocaleModal } from "./components/locale/LocaleModal";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Profile from "./pages/profile/profile";
import Delivery from "./pages/delivery/delivery";
import AdminPage from "./pages/admin/admin";
import Header from "./components/header/header";

function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <LocaleModal />
        <Header />

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LocaleProvider>
  );
}

export default App;
