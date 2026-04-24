import "dotenv/config";
import "./scrapeWorker";
import "./enrichWorker";
import "./dedupWorker";
import "./emailWorker";
import "./campaignWorker";
import "./scheduler";

// ✅ ADD THIS
import { seedQueries } from "./seedWorker";

(async () => {
  await seedQueries(); // runs once on startup
})();