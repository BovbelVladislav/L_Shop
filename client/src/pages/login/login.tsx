import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: ""
  });

  // Обновленная функция: теперь мы передаем значение напрямую, 
  // так как в универсальном инпуте мы можем сделать удобный пропс onChange
  const handleFieldChange = (fieldName: string, value: string) => {
    setForm(prev => ({ ...prev, [fieldName]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
        const res = await login(form);
        if (res.user) {
          navigate("/profile");
        } else {
          alert(res.message);
        }
    } catch (err) {
        alert("Ошибка при входе");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Вход</h1>

      {/* Используем твой универсальный Input */}
      <Input
        label="Логин"
        type="text"
        placeholder="Email или логин"
        value={form.login}
        onChange={(e) => handleFieldChange("login", e.target.value)}
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="Введите пароль"
        value={form.password}
        onChange={(e) => handleFieldChange("password", e.target.value)}
      />

      {/* Используем твою универсальную Button */}
      <Button 
        type="submit" 
        text="Войти" 
        variant="primary" 
      />
    </form>
  );
}