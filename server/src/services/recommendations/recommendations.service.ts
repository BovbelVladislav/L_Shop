import fs from "fs";
import path from "path";
import type { UserRecommendation, TagRecommendation } from "../../types/recommendation";

const recommendationsPath = path.join(
  process.cwd(),
  "server",
  "database",
  "recommendations.json"
);

interface RecommendationsDB {
  [userId: string]: TagRecommendation[];
}

export class RecommendationsService {
  private static loadRecommendations(): RecommendationsDB {
    if (!fs.existsSync(recommendationsPath)) {
      fs.writeFileSync(recommendationsPath, "{}");
    }

    const data = fs.readFileSync(recommendationsPath, "utf-8");
    try {
      return JSON.parse(data) as RecommendationsDB;
    } catch {
      return {};
    }
  }

  private static saveRecommendations(recs: RecommendationsDB): void {
    fs.writeFileSync(recommendationsPath, JSON.stringify(recs, null, 2));
  }

  static addTagToRecommendations(userId: number, tags: string[]): void {
    const recs = this.loadRecommendations();
    const userKey = String(userId);
    
    if (!recs[userKey]) {
      recs[userKey] = [];
    }

    const now = Date.now();
    for (const tag of tags) {
      const existing = recs[userKey].find(t => t.tag === tag);
      if (existing) {
        existing.weight = Math.min(10, existing.weight + 1);
        existing.addedAt = now;
      } else {
        recs[userKey].push({ tag, weight: 1, addedAt: now });
      }
    }

    this.saveRecommendations(recs);
  }

  static getRecommendations(userId: number): string[] {
    const recs = this.loadRecommendations();
    const userKey = String(userId);
    
    if (!recs[userKey]) {
      return [];
    }

    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    
    return recs[userKey]
      .filter(r => now - r.addedAt < threeDaysMs)
      .sort((a, b) => b.weight - a.weight)
      .map(r => r.tag);
  }

  static clearOldRecommendations(): void {
    const recs = this.loadRecommendations();
    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    for (const userId in recs) {
      recs[userId] = recs[userId].filter(r => now - r.addedAt < threeDaysMs);
      if (recs[userId].length === 0) {
        delete recs[userId];
      }
    }

    this.saveRecommendations(recs);
  }
}
