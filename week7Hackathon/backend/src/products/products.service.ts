import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly rawMaterialsService: RawMaterialsService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ isActive: true }).populate('recipe.materialId').exec();
  }

  async findAllWithAvailability(): Promise<any[]> {
    const products = await this.productModel
      .find({ isActive: true })
      .populate('recipe.materialId')
      .exec();

    const results = await Promise.all(
      products.map(async (product) => {
        const availability = await this.calculateAvailability(product);
        return {
          ...product.toObject(),
          availableQuantity: availability,
        };
      }),
    );
    return results;
  }

  async calculateAvailability(product: ProductDocument): Promise<number> {
    if (!product.recipe || product.recipe.length === 0) return 0;

    let minAvailable = Infinity;
    for (const ingredient of product.recipe) {
      const material = ingredient.materialId as any;
      if (!material || !material.quantity) {
        return 0;
      }
      const possible = Math.floor(material.quantity / ingredient.quantity);
      if (possible < minAvailable) {
        minAvailable = possible;
      }
    }
    return minAvailable === Infinity ? 0 : minAvailable;
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('recipe.materialId')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product ${id} not found`);
    }
  }
}
