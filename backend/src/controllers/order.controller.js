import { z } from 'zod';
import prisma from '../config/prisma.js';
import { config } from '../config/index.js';
import { processAndSaveImage } from '../services/imageService.js';

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
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

      // 1. Calcular subtotal de artículos
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // 2. Calcular costo de envío según política de Costa Rica
      // Envío gratis a partir de ₡35,000 en Correos de Costa Rica o Retiro en Tienda
      let shippingCost = 0;
      let shippingMethodLabel = 'Retiro en Tienda';

      if (shippingMethod === 'CORREOS_CR') {
        shippingMethodLabel = 'Correos de Costa Rica';
        shippingCost = subtotal >= 35000 ? 0 : 3500;
      } else if (shippingMethod === 'EXPRESS_GAM') {
        shippingMethodLabel = 'Mensajería Express GAM';
        shippingCost = 2500;
      } else {
        shippingMethodLabel = 'Retiro en Tienda Física';
        shippingCost = 0;
      }

      const total = subtotal + shippingCost;

      // 3. Generar número de orden aleatorio no consecutivo (ej. SH-2026-74912)
      // Garantiza privacidad para que nadie pueda adivinar pedidos consecutivos
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

      // 4. Formatear dirección para almacenamiento
      const addressString = shippingAddress
        ? `${shippingAddress.province}, ${shippingAddress.canton}, ${shippingAddress.district}. ${shippingAddress.details}`
        : 'Retiro en Tienda Física (Sweet Home CR)';

      // 5. Crear pedido y líneas de pedido dentro de una transacción Prisma
      const order = await prisma.$transaction(async (tx) => {
        const orderItemsData = [];

        // Reducir stock de los productos si está registrado y validar existencia en BD
        for (const it of items) {
          const product = await tx.product.findUnique({
            where: { id: it.id },
            select: { id: true, stock: true }
          });

          if (product && product.stock > 0) {
            await tx.product.update({
              where: { id: it.id },
              data: {
                stock: Math.max(0, product.stock - it.quantity)
              }
            });
          }

          orderItemsData.push({
            productId: product ? product.id : null,
            productName: it.name,
            productSku: it.sku || 'SKU-SH',
            productImage: it.image || null,
            variantName: it.variantName || null,
            price: it.price,
            quantity: it.quantity,
            subtotal: it.price * it.quantity
          });
        }

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
            subtotal,
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
      return res.status(500).json({
        error: true,
        message: 'Error al generar el pedido. Por favor intenta de nuevo.'
      });
    }
  },

  /**
   * Consulta pública de seguimiento de pedido por su número (ej: SH-2026-1001)
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

      return res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          customerName: order.customerName,
          shippingMethod: order.shippingMethod,
          shippingAddress: order.shippingAddress,
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
        return res.status(404).json({ error: true, message: 'Pedido no encontrado' });
      }

      let voucherUrl = order.voucherUrl;

      if (req.file) {
        const processed = await processAndSaveImage(req.file.path);
        voucherUrl = processed.url;
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          voucherUrl,
          voucherNotes: voucherNotes || order.voucherNotes,
          voucherReceivedAt: new Date(),
          status: 'VOUCHER_RECEIVED' // Pasa a cola de verificación manual de la dueña
        }
      });

      return res.json({
        success: true,
        message: '¡Comprobante recibido con éxito! La dueña verificará tu pago a la brevedad.',
        data: {
          orderNumber: updated.orderNumber,
          status: updated.status,
          voucherUrl: updated.voucherUrl
        }
      });
    } catch (err) {
      console.error('Error al subir comprobante:', err);
      return res.status(500).json({ error: true, message: 'Error al subir comprobante' });
    }
  }
};

export default orderController;
