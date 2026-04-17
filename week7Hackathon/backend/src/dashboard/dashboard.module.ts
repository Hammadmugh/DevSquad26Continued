import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [RawMaterialsModule, OrdersModule, ProductsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
