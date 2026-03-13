import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await login(form);

    if (res.user) {
      navigate("/profile");
    } else {
      alert(res.message);
    }
  }

  return (
    <form className="auth-form" data-login onSubmit={handleSubmit}>
      <h1>Вход</h1>

      <input
        name="login"
        placeholder="Email или логин"
        value={form.login}
        onChange={handleChange}
      />

      <input
        name="password"
        placeholder="Пароль"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">Войти</button>
    </form>
  );
}
