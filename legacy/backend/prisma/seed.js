const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const roles = [
    { name: 'Super Admin' },
    { name: 'Admin' },
    { name: 'Franchise Manager' },
    { name: 'Staff' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Create Super Admin
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      passwordHash: hashedPassword,
      roleId: superAdminRole.id,
      status: 'active',
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
