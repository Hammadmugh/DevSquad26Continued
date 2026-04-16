import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { PaymentType } from '../common/enums/payment-type.enum';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  private async getOrCreate(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!cart) cart = await this.cartModel.create({ userId: new Types.ObjectId(userId), items: [] });
    return cart;
  }

  async getCart(userId: string): Promise<CartDocument> {
    return this.getOrCreate(userId);
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<CartDocument> {
    const product = await this.productsService.findOne(dto.productId);
    const cart = await this.getOrCreate(userId);

    const existing = cart.items.find(
      (i) => i.productId.toString() === dto.productId &&
             i.size === (dto.size ?? '') &&
             i.color === (dto.color ?? ''),
    );

    if (existing) {
      existing.quantity += dto.quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(dto.productId),
        name: product.name,
        image: product.images?.[0] ?? '',
        price: product.onSale && product.salePrice ? product.salePrice : product.price,
        pointsPrice: product.pointsPrice,
        paymentType: product.paymentType,
        size: dto.size ?? '',
        color: dto.color ?? '',
        quantity: dto.quantity,
      } as any);
    }

    return cart.save();
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<CartDocument> {
    const cart = await this.getOrCreate(userId);
    const item = cart.items.find((i) => (i as any)._id.toString() === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    if (dto.quantity === 0) {
      cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId) as any;
    } else {
      item.quantity = dto.quantity;
    }
    return cart.save();
  }

  async removeItem(userId: string, itemId: string): Promise<CartDocument> {
    return this.updateItem(userId, itemId, { quantity: 0 });
  }

  async clearCart(userId: string): Promise<CartDocument> {
    const cart = await this.getOrCreate(userId);
    cart.items = [] as any;
    return cart.save();
  }
}
