import { CartModel } from "../mongo/models/cartModel.js";

export class CartManager {
    static async getCarts(filter = {}) {
        return await CartModel.find(filter).populate('products.product');
    }

    static async createCart(product) {
        return await CartModel.create({ products: [{ product: product.id, quantity: product.quantity }] });
    }

    static async updateCart(id, updatedFields) {
        return await CartModel.findByIdAndUpdate(id, updatedFields, { new: true }).populate('products.product');
    }

    static async deleteCart(id) {
        return await CartModel.findByIdAndDelete(id);
    }
}