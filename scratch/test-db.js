const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Basic env loader
const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
env.split('\n').forEach(line => {
  const index = line.indexOf('=');
  if (index !== -1) {
    const key = line.substring(0, index).trim();
    const value = line.substring(index + 1).trim();
    process.env[key] = value.replace(/"/g, '').trim();
  }
});

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing connection...');
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    const users = await prisma.user.findMany({ include: { role: true } });
    console.log('Users:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
