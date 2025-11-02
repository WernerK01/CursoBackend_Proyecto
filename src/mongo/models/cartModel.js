import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true });

export const CartModel = model('carts', cartSchema);