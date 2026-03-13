import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">CoffeeShop</Link>
        </div>

        <nav className="nav">
          <Link to="/">Главная</Link>
          <Link to="/delivery">Доставка</Link>
          <Link to="/profile">Профиль</Link>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </nav>
      </div>
    </header>
  );
}
