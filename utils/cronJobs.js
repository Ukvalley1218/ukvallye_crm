import Lead from "../models/Lead.js";
import cron from "node-cron";
export const setupCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      const result = await Lead.deleteMany({ isDeleted: true, deletedAt: { $lte: fifteenDaysAgo } });
      console.log(`${result.deletedCount} old deleted leads purged`);
    } catch (err) {
      console.error("Error in cron job:", err);
    }
  });
};