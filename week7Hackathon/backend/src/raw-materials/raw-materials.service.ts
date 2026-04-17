import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schemas/raw-material.schema';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectModel(RawMaterial.name)
    private rawMaterialModel: Model<RawMaterialDocument>,
  ) {}

  async create(dto: CreateRawMaterialDto): Promise<RawMaterial> {
    const created = new this.rawMaterialModel(dto);
    return created.save();
  }

  async findAll(): Promise<RawMaterial[]> {
    return this.rawMaterialModel.find().exec();
  }

  async findOne(id: string): Promise<RawMaterialDocument> {
    const material = await this.rawMaterialModel.findById(id).exec();
    if (!material) {
      throw new NotFoundException(`Raw material ${id} not found`);
    }
    return material;
  }

  async update(id: string, dto: UpdateRawMaterialDto): Promise<RawMaterial> {
    const updated = await this.rawMaterialModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Raw material ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rawMaterialModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Raw material ${id} not found`);
    }
  }

  async restockMany(
    deductions: { materialId: string; quantity: number }[],
  ): Promise<void> {
    for (const { materialId, quantity } of deductions) {
      await this.rawMaterialModel
        .findByIdAndUpdate(materialId, { $inc: { quantity: quantity } })
        .exec();
    }
  }

  async deductMany(
    deductions: { materialId: string; quantity: number }[],
  ): Promise<void> {
    for (const { materialId, quantity } of deductions) {
      await this.rawMaterialModel
        .findByIdAndUpdate(materialId, { $inc: { quantity: -quantity } })
        .exec();
    }
  }

  async getLowStock(): Promise<RawMaterial[]> {
    return this.rawMaterialModel
      .find({ $expr: { $lte: ['$quantity', '$minStockLevel'] } })
      .exec();
  }
}
