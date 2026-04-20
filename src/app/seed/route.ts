import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Criar veículo Ninja 400 se não existir
    let vehicle = await prisma.vehicle.findFirst({
      where: { model: 'Ninja 400' }
    })

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          model: 'Ninja 400',
          year: 2020,
          currentKm: 12500,
        }
      })
    }

    // Adicionar specs técnicas de exemplo
    const specsCount = await prisma.technicalSpec.count()
    if (specsCount === 0) {
      await prisma.technicalSpec.createMany({
        data: [
          {
            category: 'Torque',
            component: 'Parafuso do cárter',
            torqueNm: 20,
            notes: 'Usar torque wrench, não apertar com impacto',
            diagramCode: 'F2910G'
          },
          {
            category: 'Torque',
            component: 'Porca do eixo traseiro',
            torqueNm: 108,
            notes: 'Travar com contra-porca',
          },
          {
            category: 'Torque',
            component: 'Parafuso de fixação do guidão',
            torqueNm: 25,
            notes: 'Apertar em X gradualmente',
          },
          {
            category: 'Procedure',
            component: 'Troca de óleo',
            notes: 'Usar óleo 10W-40 semissintético. Torque do filtro: 10 Nm',
            diagramCode: 'F2910G'
          },
          {
            category: 'Diagram',
            component: 'Sistema de freio dianteiro',
            diagramCode: 'F2850A'
          },
        ]
      })
    }

    return NextResponse.json({ 
      success: true, 
      vehicle,
      message: 'Database seeded successfully'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}
