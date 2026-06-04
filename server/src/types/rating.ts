export interface Rating {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductRating {
  productId: number;
  ratings: Rating[];
  averageRating?: number;
}
