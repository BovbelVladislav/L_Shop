import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/register/register";
import LoginPage from "../pages/login/login";
import ProfilePage from "../pages/profile/profile";
import HomePage from "../pages/home/home";
import DeliveryPage from "../pages/delivery/delivery";



export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />   {/* ← главная страница */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/delivery" element={<DeliveryPage />} />

      </Routes>
    </BrowserRouter>
  );
}
