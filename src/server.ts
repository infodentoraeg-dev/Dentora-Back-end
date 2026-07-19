import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app";
import mongoose from "mongoose";

const DB = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || "",
);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(DB || "");
    console.log("DB connection successful");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

startServer();
