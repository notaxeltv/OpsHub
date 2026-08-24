import * as bcrypt from 'bcrypt';
import { PrismaClient, MembershipRole, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@opshub.local';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Seed already applied, skipping.');
    return;
  }

  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  const org = await prisma.organization.create({
    data: {
      name: 'Demo SRL',
      slug: 'demo-srl',
      inventoryEnabled: true,
      defaultHourlyRate: 40,
    },
  });

  await prisma.membership.create({
    data: { userId: user.id, organizationId: org.id, role: MembershipRole.OWNER },
  });

  const customer = await prisma.customer.create({
    data: {
      organizationId: org.id,
      name: 'Cliente Demo',
      email: 'cliente@demo.it',
      phone: '+39 02 1234567',
      contacts: {
        create: {
          name: 'Mario Contatto',
          email: 'mario@cliente.it',
          role: 'Responsabile acquisti',
          isPrimary: true,
        },
      },
    },
  });

  const order = await prisma.order.create({
    data: {
      organizationId: org.id,
      customerId: customer.id,
      reference: 'COMM-2024-001',
      title: 'Installazione impianto',
      status: OrderStatus.IN_PROGRESS,
      hourlyRate: 45,
      items: {
        create: [
          { description: 'Installazione base', quantity: 1, unitPrice: 2500 },
          { description: 'Materiali inclusi', quantity: 1, unitPrice: 800 },
        ],
      },
    },
  });

  await prisma.productionEntry.create({
    data: {
      organizationId: org.id,
      orderId: order.id,
      hours: 12,
      materialCost: 150,
    },
  });

  await prisma.product.create({
    data: {
      organizationId: org.id,
      name: 'Cavo elettrico 2.5mm',
      sku: 'CAV-25',
      unit: 'm',
      unitCost: 1.5,
      currentStock: 500,
      minStock: 100,
    },
  });

  console.log('Seed completed: demo@opshub.local / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
