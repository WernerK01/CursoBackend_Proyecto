import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    products: {
        type: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
                quantity: { type: Number, default: 1 }
            }
        ]
    }
}, { timestamps: true });

cartSchema.pre('find', function () {
    this.populate('products.product');
});

cartSchema.pre('findOne', function () {
    this.populate('products.product');
});


export const CartModel = model('carts', cartSchema);