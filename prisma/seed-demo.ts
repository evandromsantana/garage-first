const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating demo user...')

  // Hash the password
  const hashedPassword = await bcrypt.hash('demo123', 12)

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@garageninja.com' },
    update: {},
    create: {
      email: 'demo@garageninja.com',
      password: hashedPassword,
      name: 'Demo User'
    }
  })

  console.log('Demo user created:', user.email)

  // Create demo vehicle for this user
  const vehicle = await prisma.vehicle.upsert({
    where: { id: 'demo-vehicle' },
    update: {},
    create: {
      id: 'demo-vehicle',
      model: 'Ninja 400',
      year: 2020,
      currentKm: 12500,
      userId: user.id
    }
  })

  console.log('Demo vehicle created:', vehicle.model)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
