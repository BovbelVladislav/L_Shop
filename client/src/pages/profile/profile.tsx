import { useEffect, useState } from "react";
import { getMe } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getMe();

      if (!res.user) {
        navigate("/login");
        return;
      }

      setUser(res.user);
    }

    void load();
  }, []);

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Привет, {user.name}</h1>

      <h2>Корзина:</h2>
      <pre>{JSON.stringify(user.cart, null, 2)}</pre>

      <h2>Доставки:</h2>
      <pre>{JSON.stringify(user.deliveries, null, 2)}</pre>
    </div>
  );
}
