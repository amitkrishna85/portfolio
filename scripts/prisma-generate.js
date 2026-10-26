const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
let dbUrl = process.env.DATABASE_URL;

// On Vercel, default to postgresql unless specified otherwise
if (isVercel && (!dbUrl || dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
  if (schema.includes('provider = "sqlite"')) {
    console.log('🔄 Vercel environment detected. Updating schema.prisma provider to "postgresql"...');
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema, "utf8");
  }
} else if (dbUrl && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
  if (schema.includes('provider = "sqlite"')) {
    console.log('🔄 Detected PostgreSQL DATABASE_URL. Updating schema.prisma provider to "postgresql"...');
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema, "utf8");
  }
} else if (dbUrl && dbUrl.startsWith("file:")) {
  if (schema.includes('provider = "postgresql"')) {
    console.log('🔄 Detected SQLite DATABASE_URL. Updating schema.prisma provider to "sqlite"...');
    schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, schema, "utf8");
  }
}

// Ensure DATABASE_URL is set so `prisma generate` doesn't fail during npm install / postinstall
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL environment variable is not set.");
  console.warn("⚠️  Providing temporary placeholder for Prisma client code generation.");
  console.warn("⚠️  Make sure to add DATABASE_URL in Vercel Settings -> Environment Variables.");

  // Read updated schema to check provider
  const currentSchema = fs.readFileSync(schemaPath, "utf8");
  if (currentSchema.includes('provider = "postgresql"')) {
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
  } else {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

try {
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });
} catch (error) {
  console.error("Prisma client generation error:", error.message);
  process.exit(1);
}
