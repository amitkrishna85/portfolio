import bcrypt from "bcryptjs";
import readline from "readline";

async function main() {
  const password = process.argv[2];

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const escapedHash = hash.replace(/\$/g, "\\$");
    console.log("\n========================================");
    console.log("Raw Hash:", hash);
    console.log("For .env file (with escaped $ for Next.js):");
    console.log(`ADMIN_PASSWORD_HASH="${escapedHash}"`);
    console.log("========================================\n");
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the admin password to hash: ", (input) => {
    if (!input || input.trim().length === 0) {
      console.error("Password cannot be empty.");
      process.exit(1);
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(input.trim(), salt);
    const escapedHash = hash.replace(/\$/g, "\\$");
    console.log("\n========================================");
    console.log("Raw Hash:", hash);
    console.log("For .env file (with escaped $ for Next.js):");
    console.log(`ADMIN_PASSWORD_HASH="${escapedHash}"`);
    console.log("========================================\n");
    rl.close();
  });
}

main().catch((err) => {
  console.error("Error generating password hash:", err);
  process.exit(1);
});
