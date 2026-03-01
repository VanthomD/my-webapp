import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    // Prisma Migrate gebruikt deze URL
    url: process.env.DATABASE_URL,
  },
  client: {
    // Forceer de klassieke engine (geen adapter/accelerate nodig)
    engineType: "binary",
  },
});