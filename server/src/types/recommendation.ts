export interface UserRecommendation {
  userId: number;
  tags: string[];
  lastUpdated: number;
  viewCount: Record<number, number>;
}

export interface TagRecommendation {
  tag: string;
  weight: number;
  addedAt: number;
}
