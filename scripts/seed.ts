import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Criar usuário demo
  const demoEmail = 'demo@garageninja.com'
  const demoPassword = 'demo123'
  const hashedPassword = await bcrypt.hash(demoPassword, 12)

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail }
  })

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashedPassword,
        name: 'Demo User'
      }
    })
    console.log('Usuário demo criado:', user.email)
  } else {
    console.log('Usuário demo já existe')
  }

  // Criar veículo demo para o usuário
  const user = await prisma.user.findUnique({
    where: { email: demoEmail }
  })

  if (user) {
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { userId: user.id }
    })

    if (!existingVehicle) {
      const vehicle = await prisma.vehicle.create({
        data: {
          model: 'Kawasaki Ninja 400',
          year: 2023,
          currentKm: 15000,
          userId: user.id
        }
      })
      console.log('Veículo demo criado:', vehicle.model)

      // Criar algumas manutenções de exemplo
      await prisma.maintenanceLog.createMany({
        data: [
          {
            vehicleId: vehicle.id,
            type: 'PREVENTIVE',
            description: 'Troca de óleo e filtro',
            kmAtService: 10000,
            cost: 150.00,
            status: 'COMPLETED'
          },
          {
            vehicleId: vehicle.id,
            type: 'PREVENTIVE',
            description: 'Revisão geral',
            kmAtService: 12000,
            cost: 300.00,
            status: 'COMPLETED'
          },
          {
            vehicleId: vehicle.id,
            type: 'CORRECTIVE',
            description: 'Substituição de pastilhas de freio',
            kmAtService: 14000,
            cost: 200.00,
            status: 'COMPLETED'
          }
        ]
      })
      console.log('Manutenções de exemplo criadas')

      // Criar algumas despesas de exemplo
      const maintenances = await prisma.maintenanceLog.findMany({
        where: { vehicleId: vehicle.id }
      })

      for (const maintenance of maintenances) {
        await prisma.projectExpense.createMany({
          data: [
            {
              maintenanceId: maintenance.id,
              itemName: 'Óleo Motul 7100',
              itemCost: 50.00,
              isOriginalPart: false
            },
            {
              maintenanceId: maintenance.id,
              itemName: 'Filtro de óleo',
              itemCost: 25.00,
              isOriginalPart: true
            }
          ]
        })
      }
      console.log('Despesas de exemplo criadas')
    } else {
      console.log('Veículo demo já existe')
    }
  }

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
