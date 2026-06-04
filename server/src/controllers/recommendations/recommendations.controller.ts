import { Request, Response } from "express";
import type { Product } from "../../services/products/products.service";
import { RecommendationsService } from "../../services/recommendations/recommendations.service";
import { ProductsService } from "../../services/products/products.service";

export class RecommendationsController {
  static async likeProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const productIdStr = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const productId = parseInt(productIdStr, 10);

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!productId || isNaN(productId)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const products = ProductsService.getAllProducts();
      const product = products.find((p: Product) => p.id === productId);
      
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const tags = product.tags || [];
      if (tags.length > 0) {
        RecommendationsService.addTagToRecommendations(userId, tags);
      }

      res.json({ success: true });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error });
    }
  }

  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const tags = RecommendationsService.getRecommendations(userId);
      const products = ProductsService.getAllProducts();

      const recommended = products
        .filter((p: Product) => p.tags && p.tags.some((tag: string) => tags.includes(tag)))
        .sort((a: Product, b: Product) => {
          const aScore = a.tags?.filter((tag: string) => tags.includes(tag)).length || 0;
          const bScore = b.tags?.filter((tag: string) => tags.includes(tag)).length || 0;
          return bScore - aScore;
        })
        .slice(0, 5);

      res.json(recommended);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error });
    }
  }
}

