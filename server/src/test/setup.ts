import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbconnect } from "../config/db";

let mongoServer: MongoMemoryServer;
let originalDbUrl: string;

beforeAll(async () => {
  originalDbUrl = process.env.DATABASE_URL || "";
  console.log("Original DATABASE_URL:", originalDbUrl);
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log("Mongo URI:", mongoUri);
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = mongoUri;
  console.log("Using in-memory MongoDB URI:", process.env.DATABASE_URL);
  await dbconnect();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  process.env.DATABASE_URL = originalDbUrl;
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
