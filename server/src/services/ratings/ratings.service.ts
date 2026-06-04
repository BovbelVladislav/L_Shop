import fs from "fs";
import path from "path";
import type { Rating } from "../../types/rating";

const ratingsPath = path.join(process.cwd(), "server", "database", "ratings.json");

export class RatingsService {
  private static loadRatings(): Rating[] {
    if (!fs.existsSync(ratingsPath)) {
      fs.writeFileSync(ratingsPath, "[]");
    }

    const data = fs.readFileSync(ratingsPath, "utf-8");
    try {
      return JSON.parse(data) as Rating[];
    } catch {
      return [];
    }
  }

  private static saveRatings(ratings: Rating[]): void {
    fs.writeFileSync(ratingsPath, JSON.stringify(ratings, null, 2));
  }

  static addRating(productId: number, userId: number, rating: number, comment: string): Rating {
    const ratings = this.loadRatings();
    
    const newRating: Rating = {
      id: Date.now(),
      productId,
      userId,
      rating: Math.max(1, Math.min(5, rating)),
      comment: comment.slice(0, 500),
      createdAt: new Date().toISOString()
    };

    ratings.push(newRating);
    this.saveRatings(ratings);

    return newRating;
  }

  static getRatingsByProduct(productId: number): Rating[] {
    const ratings = this.loadRatings();
    return ratings.filter(r => r.productId === productId);
  }

  static getAverageRating(productId: number): number {
    const ratings = this.getRatingsByProduct(productId);
    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  static updateRating(ratingId: number, rating: number, comment: string): Rating | undefined {
    const ratings = this.loadRatings();
    const index = ratings.findIndex(r => r.id === ratingId);

    if (index === -1) return undefined;

    ratings[index].rating = Math.max(1, Math.min(5, rating));
    ratings[index].comment = comment.slice(0, 500);

    this.saveRatings(ratings);
    return ratings[index];
  }

  static deleteRating(ratingId: number, userId: number): boolean {
    const ratings = this.loadRatings();
    const index = ratings.findIndex(r => r.id === ratingId && r.userId === userId);

    if (index === -1) return false;

    ratings.splice(index, 1);
    this.saveRatings(ratings);
    return true;
  }
}
