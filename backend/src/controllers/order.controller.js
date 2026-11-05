import { z } from 'zod';
import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import prisma from '../config/prisma.js';
import { config } from '../config/index.js';

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  image: z.string().optional(),
  variantName: z.string().optional()
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'El nombre es obligatorio'),
  customerEmail: z.string().email('Correo electrónico inválido'),
  customerPhone: z.string().min(8, 'Teléfono debe tener al menos 8 dígitos'),
  shippingMethod: z.enum(['CORREOS_CR', 'EXPRESS_GAM', 'RETIRO_TIENDA']),
  shippingAddress: z
    .object({
      province: z.string().min(1, 'Provincia requerida'),
      canton: z.string().min(1, 'Cantón requerido'),
      district: z.string().min(1, 'Distrito requerido'),
      details: z.string().min(5, 'Dirección detallada requerida')
    })
    .optional(),
  paymentMethod: z.enum(['SINPE_MOVIL', 'TRANSFER']),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'El carrito debe tener al menos un producto')
});

export const orderController = {
  /**
   * Crear un nuevo pedido de la tienda pública (SINPE Móvil o Transferencia)
   * SEC-01: Cálculo infalsificable de precios en el servidor
   * SEC-09: Validación transaccional de stock para prevenir sobreventa
   */
  async createOrder(req, res) {
    try {
      const parsed = createOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: true,
          message: parsed.error.errors[0]?.message || 'Datos del pedido inválidos',
          errors: parsed.error.errors
        });
      }

      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingMethod,
        shippingAddress,
        paymentMethod,
        notes,
        items
      } = parsed.data;

      // Generar número de orden aleatorio no consecutivo (ej. SH-2026-74912)
      const todayYear = new Date().getFullYear();
      let orderNumber = '';
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 20) {
        attempts++;
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        orderNumber = `SH-${todayYear}-${randomDigits}`;
        const existing = await prisma.order.findUnique({
          where: { orderNumber },
          select: { id: true }
        });
        if (!existing) isUnique = true;
      }
      if (!isUnique) {
        orderNumber = `SH-${todayYear}-${Date.now().toString().slice(-5)}`;
      }

      // Formatear dirección para almacenamiento
      const addressString = shippingAddress
        ? `${shippingAddress.province}, ${shippingAddress.canton}, ${shippingAddress.district}. ${shippingAddress.details}`
        : 'Retiro en Tienda Física (Sweet Home CR)';

      // Transacción atómica: validación de productos en BD, stock y persistencia de orden
      const order = await prisma.$transaction(async (tx) => {
        const productIds = items.map((it) => it.id);
        const dbProducts = await tx.product.findMany({
          where: { id: { in: productIds } },
          include: { images: true }
        });

        const productMap = new Map(dbProducts.map((p) => [p.id, p]));
        const orderItemsData = [];
        let calculatedSubtotal = 0;

        for (const it of items) {
          const product = productMap.get(it.id);
          if (!product || !product.isActive) {
            throw new Error(`El producto solicitado ya no está disponible o no existe`);
          }

          // Validación estricta de stock (SEC-09)
          if (product.stock < it.quantity) {
            throw new Error(
              `Stock insuficiente para "${product.name}". Disponibles: ${product.stock}, solicitados: ${it.quantity}`
            );
          }

          // Precios oficiales infalsificables desde la base de datos (SEC-01)
          const officialPrice = product.price;
          const itemSubtotal = officialPrice * it.quantity;
          calculatedSubtotal += itemSubtotal;

          // Descontar inventario de forma segura
          await tx.product.update({
            where: { id: product.id },
            data: {
              stock: product.stock - it.quantity
            }
          });

          const coverImage =
            product.images?.find((img) => img.isCover)?.url ||
            product.images?.[0]?.url ||
            it.image ||
            null;

          orderItemsData.push({
            productId: product.id,
            productName: product.name,
            productSku: product.sku || 'SKU-SH',
            productImage: coverImage,
            variantName: it.variantName || null,
            price: officialPrice,
            quantity: it.quantity,
            subtotal: itemSubtotal
          });
        }

        // Obtener tarifas oficiales de StoreSettings si existen
        const settingsDoc = await tx.siteContent.findUnique({
          where: { key: 'store_settings' }
        });
        let shippingRates = { gamCost: 2500, ruralCost: 3500, freeShippingThreshold: 35000 };
        if (settingsDoc?.value) {
          try {
            const parsedSettings = JSON.parse(settingsDoc.value);
            if (parsedSettings.shippingRates) {
              shippingRates = { ...shippingRates, ...parsedSettings.shippingRates };
            }
          } catch (_) {
            /* usar tarifas por defecto si falla el parseo */
          }
        }

        let shippingCost = 0;
        let shippingMethodLabel = 'Retiro en Tienda Física';

        if (shippingMethod === 'CORREOS_CR') {
          shippingMethodLabel = 'Correos de Costa Rica';
          shippingCost =
            calculatedSubtotal >= (shippingRates.freeShippingThreshold || 35000)
              ? 0
              : shippingRates.ruralCost || 3500;
        } else if (shippingMethod === 'EXPRESS_GAM') {
          shippingMethodLabel = 'Mensajería Express GAM';
          shippingCost = shippingRates.gamCost || 2500;
        } else {
          shippingMethodLabel = 'Retiro en Tienda Física';
          shippingCost = 0;
        }

        const total = calculatedSubtotal + shippingCost;

        // Crear la orden
        return await tx.order.create({
          data: {
            orderNumber,
            status: 'PENDING_PAYMENT',
            paymentMethod,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress: addressString,
            shippingMethod: shippingMethodLabel,
            subtotal: calculatedSubtotal,
            shippingCost,
            total,
            notes: notes || null,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas para enviar comprobante
            items: {
              create: orderItemsData
            }
          },
          include: {
            items: true
          }
        });
      });

      const orderResponse = {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        shippingMethod: order.shippingMethod,
        shippingAddress: order.shippingAddress,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        paymentMethod: order.paymentMethod,
        sinpeNumber: config.store.sinpe,
        status: order.status,
        createdAt: order.createdAt
      };

      return res.status(201).json({
        success: true,
        message: '¡Pedido creado con éxito! Puedes enviar tu comprobante de pago.',
        order: orderResponse,
        data: orderResponse
      });
    } catch (err) {
      console.error('Error al procesar el pedido:', err);
      return res.status(400).json({
        error: true,
        message: err.message || 'Error al generar el pedido. Por favor intenta de nuevo.'
      });
    }
  },

  /**
   * Consulta pública de seguimiento de pedido por su número (ej: SH-2026-1001)
   * SEC-08: Enmascaramiento de datos personales para mitigar IDOR
   */
  async getOrderByNumber(req, res) {
    try {
      const { orderNumber } = req.params;
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true
        }
      });

      if (!order) {
        return res.status(404).json({
          error: true,
          message: 'No encontramos ningún pedido con ese número. Verifica el código ingresado.'
        });
      }

      // Enmascaramiento de privacidad (SEC-08)
      const maskedCustomerName = order.customerName
        ? order.customerName
            .split(' ')
            .map((w) => w.charAt(0) + '*'.repeat(Math.max(1, w.length - 1)))
            .join(' ')
        : 'Cliente';

      let maskedAddress = 'Entrega a domicilio (detalles enmascarados)';
      if (order.shippingAddress) {
        const parts = order.shippingAddress.split(',');
        if (parts.length >= 2) {
          maskedAddress = `${parts[0].trim()}, ${parts[1].trim()}... (enmascarado)`;
        } else {
          maskedAddress = `${order.shippingAddress.slice(0, 16)}... (enmascarado)`;
        }
      }

      return res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          customerName: maskedCustomerName,
          shippingMethod: order.shippingMethod,
          shippingAddress: maskedAddress,
          trackingNumber: order.trackingNumber,
          total: order.total,
          paymentMethod: order.paymentMethod,
          voucherReceivedAt: order.voucherReceivedAt,
          items: order.items.map((it) => ({
            name: it.productName,
            variant: it.variantName,
            price: it.price,
            quantity: it.quantity,
            image: it.productImage
          }))
        }
      });
    } catch (err) {
      console.error('Error al consultar pedido:', err);
      return res.status(500).json({ error: true, message: 'Error al buscar el pedido' });
    }
  },

  /**
   * Subir comprobante de pago de SINPE Móvil o Transferencia para un pedido
   * SEC-02: Almacenamiento en directorio privado y URL protegida
   * SEC-14: Validación de imagen con Sharp
   */
  async uploadVoucher(req, res) {
    try {
      const { orderNumber } = req.params;
      const { voucherNotes } = req.body;

      const order = await prisma.order.findFirst({
        where: {
          OR: [{ orderNumber }, { id: orderNumber }]
        }
      });

      if (!order) {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: true, message: 'Pedido no encontrado' });
      }

      if (!req.file) {
        return res.status(400).json({ error: true, message: 'No se recibió ningún comprobante' });
      }

      // Validar tipo real de imagen con Sharp (SEC-14)
      const metadata = await sharp(req.file.path).metadata();
      if (!metadata.format) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: true,
          message: 'El archivo enviado no es una imagen válida (debe ser JPG, PNG o WebP)'
        });
      }

      // Guardar en directorio PRIVADO no expuesto estáticamente (SEC-02)
      const fileHash = crypto.randomBytes(8).toString('hex');
      const filename = `voucher_${Date.now()}_${fileHash}.webp`;
      const privateFilePath = path.join(config.privateVoucherDir, filename);

      await sharp(req.file.path)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(privateFilePath);

      // Limpiar archivo temporal
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

      // Endpoint protegido exclusivo para administradores
      const protectedVoucherUrl = `/api/admin/orders/${order.id}/voucher`;

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          voucherUrl: protectedVoucherUrl,
          voucherPath: privateFilePath,
          voucherNotes: voucherNotes || order.voucherNotes,
          voucherReceivedAt: new Date(),
          status: 'VOUCHER_RECEIVED'
        }
      });

      return res.json({
        success: true,
        message: '¡Comprobante recibido con éxito! La dueña verificará tu pago a la brevedad.',
        data: {
          orderNumber: updated.orderNumber,
          status: updated.status
        }
      });
    } catch (err) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (_) {
          /* ignorar fallo al eliminar temporal si ya no existe */
        }
      }
      console.error('Error al subir comprobante:', err);
      return res.status(500).json({ error: true, message: 'Error al procesar el comprobante' });
    }
  }
};

export default orderController;
