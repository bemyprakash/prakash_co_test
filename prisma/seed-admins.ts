import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Super Admin
  const superAdmin = await prisma.admin.upsert({
    where: { email: "super@prakash.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "super@prakash.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  // Regular Admin
  const admin = await prisma.admin.upsert({
    where: { email: "admin@prakash.com" },
    update: {},
    create: {
      name: "Store Manager",
      email: "admin@prakash.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ superAdmin, admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
