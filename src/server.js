import mongoose from "mongoose";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
let local;
try {
  let uri = process.env.MONGODB_URI;
  if (process.argv.includes("--local")) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    local = await MongoMemoryServer.create();
    uri = local.getUri();
    console.info("Temporary local MongoDB: data resets when stopped.");
  }
  await connectDatabase(uri);
  const { default: Model } = await import("./models/Product.js");
  await Model.init();
  if (local) {
    const { default: Product } = await import("./models/Product.js");
    const { sampleData } = await import("./utils/sampleData.js");
    await Product.insertMany(sampleData);
  }
  const server = app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
    console.info(`StockTrack: http://localhost:${process.env.PORT || 3000}`),
  );
  let stopping = false;
  function shutdown() {
    if (stopping) return;
    stopping = true;
    server.close(async () => {
      await mongoose.disconnect();
      await local?.stop();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  }
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
} catch (err) {
  console.error(
    err.message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/g, "[database URI]"),
  );
  await mongoose.disconnect();
  await local?.stop();
  process.exit(1);
}
