import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import type { RegisterData } from "../../api/auth";

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
    <form onSubmit={handleSubmit}>
      <h1>Регистрация</h1>

      <input name="name" placeholder="Имя" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="login" placeholder="Логин" onChange={handleChange} />
      <input name="phone" placeholder="Телефон" onChange={handleChange} />
      <input name="password" placeholder="Пароль" type="password" onChange={handleChange} />

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
