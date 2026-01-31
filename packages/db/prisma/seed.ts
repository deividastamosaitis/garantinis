import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const STORE_NAME = "GPS Meistras";
const STORE_SUBDOMAIN = "gpsmeistras";
const ADMIN_EMAIL = "admin@gpsmeistras.lt";
const ADMIN_PASSWORD = "ChangeMe123!";

async function main() {
  const apiKeyPlaintext = crypto.randomBytes(24).toString("hex");
  const apiKeyHash = crypto
    .createHash("sha256")
    .update(apiKeyPlaintext)
    .digest("hex");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const store = await prisma.store.upsert({
    where: { subdomain: STORE_SUBDOMAIN },
    update: {
      name: STORE_NAME,
      defaultWarrantyMonths: 24,
      apiKeyHash
    },
    create: {
      name: STORE_NAME,
      subdomain: STORE_SUBDOMAIN,
      defaultWarrantyMonths: 24,
      apiKeyHash
    }
  });

  await prisma.storeUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      storeId: store.id,
      passwordHash,
      role: "admin"
    },
    create: {
      storeId: store.id,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin"
    }
  });

  console.log("Seed complete.");
  console.log("Admin email:", ADMIN_EMAIL);
  console.log("Admin password:", ADMIN_PASSWORD);
  console.log("Store API key (plaintext):", apiKeyPlaintext);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
