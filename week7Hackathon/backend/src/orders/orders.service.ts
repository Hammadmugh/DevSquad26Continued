import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
    private readonly rawMaterialsService: RawMaterialsService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    // 1. Load all products and validate stock
    const orderItems: any[] = [];
    let totalAmount = 0;

    // Aggregate deductions per raw material
    const deductionMap = new Map<string, number>();

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);
      const availability = await this.productsService.calculateAvailability(product);

      if (availability < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${availability}, requested: ${item.quantity}`,
        );
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });

      // Compute raw material deductions
      for (const ingredient of product.recipe) {
        const matId = (ingredient.materialId as any)._id
          ? String((ingredient.materialId as any)._id)
          : String(ingredient.materialId);
        const needed = ingredient.quantity * item.quantity;
        deductionMap.set(matId, (deductionMap.get(matId) ?? 0) + needed);
      }
    }

    // 2. Deduct raw materials
    const deductions = Array.from(deductionMap.entries()).map(
      ([materialId, quantity]) => ({ materialId, quantity }),
    );
    await this.rawMaterialsService.deductMany(deductions);

    // 3. Save order
    const order = new this.orderModel({
      items: orderItems,
      totalAmount,
      status: 'completed',
      note: dto.note ?? '',
    });
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async getSummary(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    topProducts: { name: string; totalSold: number }[];
  }> {
    const orders = await this.orderModel.find({ status: 'completed' }).exec();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const productSales = new Map<string, { name: string; totalSold: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const key = String(item.productId);
        const existing = productSales.get(key);
        if (existing) {
          existing.totalSold += item.quantity;
        } else {
          productSales.set(key, {
            name: item.productName,
            totalSold: item.quantity,
          });
        }
      }
    }

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    return { totalOrders, totalRevenue, topProducts };
  }
}
