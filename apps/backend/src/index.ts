// apps/backend/src/index.ts
//
// Express server entry point. In this monorepo the backend handles
// heavier jobs that don't belong in Next.js API routes:
//   - CSV export generation
//   - Sending reminder emails (future)
//   - Background jobs
//
// Next.js API routes handle the core CRUD — Express handles extras.

import express from "express";
import cors from "cors";
import { applicationRoutes } from "./routes/applications";
import { healthRoutes } from "./routes/health";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Middleware ───────────────────────────────────────────────────

app.use(cors({
  // Only allow requests from the Next.js frontend
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(rateLimiter);          // Redis-backed rate limiting on all routes

// ── Routes ───────────────────────────────────────────────────────

app.use("/health", healthRoutes);
app.use("/api/applications", applicationRoutes);

// ── Error handler (must be last) ─────────────────────────────────
// Express recognises a 4-argument function as an error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Backend] Running on http://localhost:${PORT}`);
});

export default app;