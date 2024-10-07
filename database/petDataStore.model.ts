import mongoose, { Schema, model, Document, Model } from 'mongoose';

export interface IPetDataStore extends Document {
  id: number;
  groupUrl: string;
  name: string;
  image: string;
  element: string;
  subElement: string;
  minHp: number;
  maxHp: number;
  minHpGrowth: number;
  maxHpGrowth: number;
  minAtk: number;
  maxAtk: number;
  minAtkGrowth: number;
  maxAtkGrowth: number;
  minDef: number;
  maxDef: number;
  minDefGrowth: number;
  maxDefGrowth: number;
  minSpeed: number;
  maxSpeed: number;
  minSpeedGrowth: number;
  maxSpeedGrowth: number;
}

// 创建 Mongoose Schema
const PetDataStoreSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  groupUrl: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  element: { type: String, required: true },
  subElement: { type: String, required: true },
  minHp: { type: Number, required: true },
  maxHp: { type: Number, required: true },
  minHpGrowth: { type: Number, required: true },
  maxHpGrowth: { type: Number, required: true },
  minAtk: { type: Number, required: true },
  maxAtk: { type: Number, required: true },
  minAtkGrowth: { type: Number, required: true },
  maxAtkGrowth: { type: Number, required: true },
  minDef: { type: Number, required: true },
  maxDef: { type: Number, required: true },
  minDefGrowth: { type: Number, required: true },
  maxDefGrowth: { type: Number, required: true },
  minSpeed: { type: Number, required: true },
  maxSpeed: { type: Number, required: true },
  minSpeedGrowth: { type: Number, required: true },
  maxSpeedGrowth: { type: Number, required: true },
});

// 创建 Mongoose 模型
const PetDataStore: Model<IPetDataStore> =
  mongoose.models.DataStore ||
  model<IPetDataStore>('PetDataStore', PetDataStoreSchema);

export default PetDataStore;
