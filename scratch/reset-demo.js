const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@garageninja.com' },
    update: { password: hashedPassword },
    create: {
      email: 'demo@garageninja.com',
      password: hashedPassword,
      name: 'Ninja Demo'
    }
  })
  console.log('User demo@garageninja.com updated/created with password demo123')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
