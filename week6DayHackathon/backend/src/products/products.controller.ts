import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, StartSaleDto } from './dto/product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** GET /api/products?category=&paymentType=&onSale=true&search= */
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('paymentType') paymentType?: string,
    @Query('onSale') onSale?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({ category, paymentType, onSale, search });
  }

  /** GET /api/products/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  /** POST /api/products — Admin+ */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  /** PATCH /api/products/:id — Admin+ */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  /** DELETE /api/products/:id — Admin+ */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  /** POST /api/products/:id/sale/start — Admin+ */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post(':id/sale/start')
  startSale(@Param('id') id: string, @Body() dto: StartSaleDto) {
    return this.productsService.startSale(id, dto);
  }

  /** Post /api/products/:id/sale/end — Admin+ */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post(':id/sale/end')
  endSale(@Param('id') id: string) {
    return this.productsService.endSale(id);
  }
}
