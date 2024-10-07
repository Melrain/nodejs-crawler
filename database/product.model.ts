import { Document, model, models, Schema } from 'mongoose';

export interface IProduct extends Document {
  url: string;
  currency: string;
  image: string;
  title: string;
  curerntPrice: number;
  originalPrice: number;
  priceHistory: {
    price: number;
    date: Date;
  }[];
  lowerstPrice: number;
  highestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  inStock: boolean;
  users: {
    email: string;
  }[];
}

export const ProductSchema = new Schema({
  url: { type: String, required: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  curerntPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  priceHistory: [
    {
      price: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  lowerstPrice: { type: Number, required: true },
  highestPrice: { type: Number, required: true },
  averagePrice: { type: Number, required: true },
  discountRate: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  reviewsCount: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
  users: [
    {
      email: { type: String, required: true },
    },
  ],
});

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
