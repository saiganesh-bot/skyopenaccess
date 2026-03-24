import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

const start = async () => {
  let isDbConnected = false;

  try {
    await connectDb(env.mongoUri);
    isDbConnected = true;
  } catch (err) {
    if (process.env.NODE_ENV === "production") throw err;
    // eslint-disable-next-line no-console
    console.warn("Database connection failed in development. API will run in degraded mode.");
    // eslint-disable-next-line no-console
    console.warn(err.message);
  }

  app.locals.isDbConnected = isDbConnected;
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Server running on port ${env.port}${isDbConnected ? "" : " (without database connection)"}`
    );
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", err);
  process.exit(1);
});
