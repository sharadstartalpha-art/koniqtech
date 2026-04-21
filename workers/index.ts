import "dotenv/config";

// 👉 Import workers (this starts them)
import "./scrapeWorker";
import "./enrichWorker";
import "./dedupWorker";
import "./emailWorker"; // (if you have it)

console.log("🚀 Workers started...");