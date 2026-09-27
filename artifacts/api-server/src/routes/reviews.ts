import { desc } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, insertReviewSchema, reviewsTable } from "@workspace/db";
import {
  CreateReviewBody,
  CreateReviewResponse,
  GetReviewsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .orderBy(desc(reviewsTable.createdAt));

    res.json(GetReviewsResponse.parse(reviews));
  } catch (error) {
    req.log.error({ err: error }, "Failed to fetch reviews");
    res.status(500).json({ error: "Unable to load reviews right now." });
  }
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid review submission");
    res.status(400).json({ error: "Please check the review details and try again." });
    return;
  }

  try {
    const values = insertReviewSchema.parse(parsed.data);
    const [review] = await db.insert(reviewsTable).values(values).returning();

    res.status(201).json(CreateReviewResponse.parse(review));
  } catch (error) {
    req.log.error({ err: error }, "Failed to create review");
    res.status(500).json({ error: "Unable to submit your review right now." });
  }
});

export default router;