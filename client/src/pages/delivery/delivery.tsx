import { useState } from "react";
import { createDelivery } from "../../api/delivery";
import { useNavigate } from "react-router-dom";
import "./delivery.css";

export default function DeliveryPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    payment: "card",
    comment: ""
  });

  const [captchaInput, setCaptchaInput] = useState("");
  const captchaCorrect = "10"; // 7 + 3

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (captchaInput !== captchaCorrect) {
      alert("Капча введена неверно");
      return;
    }

    const res = await createDelivery(form);

    if (res.id) {
      alert("Доставка успешно оформлена!");
      navigate("/profile");
    } else {
      alert("Ошибка при оформлении доставки");
    }
  }

  return (
    <form className="delivery-form" onSubmit={handleSubmit}>
      <h1>Оформление доставки</h1>

      <input
        name="address"
        placeholder="Адрес"
        value={form.address}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        placeholder="Почта"
        value={form.email}
        onChange={handleChange}
        required
      />

      <select
        name="payment"
        value={form.payment}
        onChange={handleChange}
      >
        <option value="card">Карта</option>
        <option value="cash">Наличные</option>
        <option value="online">Онлайн-оплата</option>
      </select>

      <textarea
        name="comment"
        placeholder="Комментарий (необязательно)"
        value={form.comment}
        onChange={handleChange}
      />

      <div>
        <p>Введите результат: 7 + 3 =</p>
        <input
          value={captchaInput}
          onChange={e => setCaptchaInput(e.target.value)}
          required
        />
      </div>

      <button type="submit">Оформить доставку</button>
    </form>
  );
}
