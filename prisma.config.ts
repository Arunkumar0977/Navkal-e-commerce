// import path from "node:path";
// import { defineConfig } from "prisma/config";
// import { config } from "dotenv";

// config({ path: path.join(__dirname, ".env.local") });
// config({ path: path.join(__dirname, ".env") });

// console.log("__dirname =", __dirname);
// console.log("DATABASE_URL =", process.env.DATABASE_URL);

// export default defineConfig({
//   schema: path.join(__dirname, "prisma/schema.prisma"),

//   datasource: {
//     url: process.env.DATABASE_URL,
//   },

//   migrations: {
//     seed: "tsx prisma/seed.ts",
//   },
// });

import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load env vars
config({ path: path.join(__dirname, ".env.local") });
config({ path: path.join(__dirname, ".env") });

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});