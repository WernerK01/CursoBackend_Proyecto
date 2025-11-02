import { ProductModel } from "../mongo/models/productModel.js";

export class ProductManager {
    static async getProducts(filter = {}) {
        return await ProductModel.find(filter).lean();
    }

    static async paginateProducts(query = {}, options = {}) {
        return await ProductModel.paginate(query, options);
    }

    static async createProduct(product) {
        return await ProductModel.create(product);
    }

    static async updateProduct(id, updatedFields) {
        return await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
    }

    static async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}