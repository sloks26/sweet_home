import prisma from '../backend/src/config/prisma.js';
import { config } from '../backend/src/config/index.js';

async function seedSettings() {
  const defaultSettings = {
    phone: config.store.phone,
    whatsapp: config.store.whatsapp,
    sinpePhone: config.store.sinpe.phone,
    sinpeHolder: config.store.sinpe.holder,
    bankName: config.store.banks.bac.name,
    bankHolder: config.store.banks.holder,
    bankIban: config.store.banks.bac.iban,
    popularBankName: config.store.banks.popular.name,
    popularBankIban: config.store.banks.popular.iban,
    storeAddress: config.store.address,
    pickupNote: 'Previa coordinación por WhatsApp',
    contactEmail: config.store.email,
    freeShippingThreshold: 35000,
    shippingExpressGamCost: 2500,
    shippingCorreosCost: 3500,
    social: config.store.social
  };

  await prisma.siteContent.upsert({
    where: { key: 'store_settings' },
    update: { data: JSON.stringify(defaultSettings) },
    create: { key: 'store_settings', data: JSON.stringify(defaultSettings) }
  });

  console.log('✅ store_settings creado/actualizado en siteContent con datos oficiales de .env.');
  process.exit(0);
}

seedSettings().catch(console.error);
