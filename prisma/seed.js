const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create Super Admin Role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin' },
  });

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {
      passwordHash: hashedPassword,
      roleId: superAdminRole.id,
      status: 'active'
    },
    create: {
      username: 'superadmin',
      passwordHash: hashedPassword,
      roleId: superAdminRole.id,
      status: 'active'
    },
  });

  console.log('Seed completed: User superadmin created with password admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
