import "dotenv/config";

import "./scrapeWorker";
import "./enrichWorker";
import "./dedupWorker";
import "./emailWorker";
import "./campaignWorker";

console.log("🚀 Workers started and listening...");