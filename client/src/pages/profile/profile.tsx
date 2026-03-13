import { useEffect, useState } from "react";
import { getMe } from "../../api/auth";
import { getCart } from "../../api/cart";
import { getDeliveries } from "../../api/delivery";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import type { CartItem } from "../../types/basket";
import type { Delivery } from "../../types/delivery";
import "./profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    async function load() {
      const me = await getMe();

      if (!me.user) {
        navigate("/login");
        return;
      }

      setUser(me.user);

      const cartData = await getCart();
      setCart(cartData);

      const deliveryData = await getDeliveries();
      setDeliveries(deliveryData);
    }

    void load();
  }, []);

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Привет, {user.name}</h1>

      <div className="profile-block">
        <h2>Корзина</h2>
        <pre>{JSON.stringify(cart, null, 2)}</pre>
      </div>

      <div className="profile-block">
        <h2>Доставки</h2>
        <pre>{JSON.stringify(deliveries, null, 2)}</pre>
      </div>
    </div>
  );
}
