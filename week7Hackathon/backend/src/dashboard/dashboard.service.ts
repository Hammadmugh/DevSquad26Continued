import { Injectable } from '@nestjs/common';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly rawMaterialsService: RawMaterialsService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  async getDashboardData() {
    const [summary, lowStock, products, orders] = await Promise.all([
      this.ordersService.getSummary(),
      this.rawMaterialsService.getLowStock(),
      this.productsService.findAllWithAvailability(),
      this.ordersService.findAll(),
    ]);

    // Sales last 7 days
    const now = new Date();
    const salesByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      salesByDay[key] = 0;
    }
    for (const order of orders) {
      const key = (order as any).createdAt
        ? new Date((order as any).createdAt).toISOString().split('T')[0]
        : null;
      if (key && salesByDay[key] !== undefined) {
        salesByDay[key] += order.totalAmount;
      }
    }
    const salesChart = Object.entries(salesByDay).map(([date, total]) => ({
      date,
      total,
    }));

    return {
      totalOrders: summary.totalOrders,
      totalRevenue: summary.totalRevenue,
      lowStockCount: lowStock.length,
      lowStockMaterials: lowStock,
      topProducts: summary.topProducts,
      salesChart,
      products,
    };
  }
}
