export interface IComment {
  username: string;
  text: string;
  rating: number;
  date: string;
}

export interface IProduct {
  id: number; 
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string; // ✨ ВОТ СЮДА ДОБАВЛЯЕМ СТРОКУ КАТЕГОРИИ
  averageRating?: number;
  comments?: IComment[];
}