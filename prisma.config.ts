import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // Dit is wat migrate dev nodig heeft
  datasource: {
    url: process.env.DATABASE_URL,
  },

  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});