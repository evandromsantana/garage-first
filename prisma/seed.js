const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Technical Specs for Ninja 400...')

  const specs = [
    {
      category: 'ENGINE',
      component: 'Bujão de Óleo (Oil Drain Bolt)',
      torqueNm: 30,
      notes: 'Limpar rosca, trocar arruela de vedação (12mm) a cada troca.',
      diagramCode: 'O-12'
    },
    {
      category: 'ENGINE',
      component: 'Filtro de Óleo (Oil Filter)',
      torqueNm: 17.5,
      notes: 'Passar óleo novo na junta de borracha antes de rosquear.',
      diagramCode: 'O-14'
    },
    {
      category: 'CHASSIS',
      component: 'Eixo Dianteiro (Front Axle Nut)',
      torqueNm: 98,
      notes: 'Apertar com a roda no chão e suspensão bombada.',
      diagramCode: 'W-01'
    },
    {
      category: 'CHASSIS',
      component: 'Parafusos da Pinça de Freio (Front Caliper)',
      torqueNm: 34,
      notes: 'Aplicar trava-rosca médio (Loctite azul) nas pontas.',
      diagramCode: 'B-04'
    },
    {
      category: 'CHASSIS',
      component: 'Eixo Traseiro (Rear Axle Nut)',
      torqueNm: 98,
      notes: 'Ajustar a folga da corrente (20-30mm) antes de dar o aperto final.',
      diagramCode: 'W-02'
    },
    {
      category: 'ENGINE',
      component: 'Velas de Ignição (Spark Plugs)',
      torqueNm: 13,
      notes: 'NGK LMAR9G. Cuidado ao rosquear a seco (cabeçote de alumínio).',
      diagramCode: 'I-01'
    }
  ]

  for (const spec of specs) {
    await prisma.technicalSpec.create({
      data: spec
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
