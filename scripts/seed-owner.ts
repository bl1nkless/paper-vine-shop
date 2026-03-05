import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { hashPassword } from "../src/lib/password";

const ownerEmail = process.env.OWNER_EMAIL || "owner@example.com";
const ownerPassword =
  process.env.OWNER_INITIAL_PASSWORD || "change-me-before-production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed the owner account.");
  }

  const existingOwner = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });

  if (existingOwner) {
    const passwordHash = await hashPassword(ownerPassword);
    const owner = await prisma.user.update({
      where: { email: ownerEmail },
      data: {
        name: "Shop Owner",
        role: "owner",
        passwordHash,
      },
    });

    console.log(`Owner account is ready: ${owner.email}`);
    return;
  }

  const passwordHash = await hashPassword(ownerPassword);

  const owner = await prisma.user.create({
    data: {
      email: ownerEmail,
      name: "Shop Owner",
      role: "owner",
      passwordHash,
    },
  });

  console.log(`Owner account is ready: ${owner.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
