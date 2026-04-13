import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto, StartSaleDto } from './dto/product.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.productModel.create(dto);
  }

  async findAll(query: {
    category?: string;
    paymentType?: string;
    onSale?: string;
    search?: string;
  }): Promise<ProductDocument[]> {
    const filter: Record<string, any> = {};
    if (query.category) filter.category = query.category;
    if (query.paymentType) filter.paymentType = query.paymentType;
    if (query.onSale === 'true') filter.onSale = true;
    if (query.search) filter.name = { $regex: query.search, $options: 'i' };
    return this.productModel.find(filter).exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Product not found');
    return { deleted: true };
  }

  async startSale(id: string, dto: StartSaleDto): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { onSale: true, salePrice: dto.salePrice, saleEndsAt: new Date(dto.saleEndsAt) },
        { new: true },
      )
      .exec();
    if (!product) throw new NotFoundException('Product not found');

    this.notificationsGateway.notifySaleStarted(product);

    return product;
  }

  async endSale(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { onSale: false, salePrice: null, saleEndsAt: null },
        { new: true },
      )
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async decrementStock(id: string, qty: number): Promise<void> {
    await this.productModel.findByIdAndUpdate(id, { $inc: { stock: -qty } }).exec();
  }
}
