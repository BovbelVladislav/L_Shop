import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import type { RegisterData } from "../../api/auth";
import "./register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    login: "",
    phone: "",
    password: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await register(form);

    if (res.user) {
      navigate("/profile");
    } else {
      alert(res.message);
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1>Регистрация</h1>

      <input
        name="name"
        placeholder="Имя"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="login"
        placeholder="Логин"
        value={form.login}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        name="password"
        placeholder="Пароль"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
