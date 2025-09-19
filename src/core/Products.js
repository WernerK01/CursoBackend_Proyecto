const fs = require('fs');

class Product {
    static #products = [];
    static #path = './src/data/products.json';

    static async getProducts() {
        try {
            if(fs.existsSync(this.#path)) {
                const data = await fs.promises.readFile(this.#path, 'utf-8');
                this.#products = JSON.parse(data) || [];
                return this.#products;
            } else { return []; }
        } catch(err) {
            console.log(`[ERROR]: Reading products data: ${err}`);
            throw new Error('Error reading products data');
        }
    }

    static async getProductById(id) {
        if(!this.#products.length == 0) this.#products = await this.getProducts();
        try {
            return this.#products.find(p => p.id === id) || null;
        } catch(err) {
            console.log(`[ERROR]: Getting product by ID: ${err}`);
            throw new Error('Error getting product by ID');
        }
    }

    static async addProduct(product) {
        if(!this.#products.length == 0) this.#products = await this.getProducts();
        const exist = this.#products.find(p => p.title == product.title);
        if(exist) {
            console.log(`[LOG]: The product ${product.title} is already in the data.`);
            return;
        }

        let id = 1;
        if(this.#products.length > 0) {
            id = Math.max(...this.#products.map(i => i.id)) + 1;
        }
        product["id"] = id;

        try {
            this.#products.push(product);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 5), 'utf-8');
        } catch(err) {
            console.log(`[ERROR]: Writing products data: ${err}`);
            throw new Error('Error writing products data');
        }
    }

    static async updateProduct(id, updatedFields) {
        if(!this.#products.length == 0) this.#products = await this.getProducts();
        try {
            const productIndex = this.#products.findIndex(p => p.id === id);
            if(productIndex === -1) {
                console.log(`[LOG]: Product with ID ${id} not found.`);
                return;
            }
            
            this.#products[productIndex] = { ...this.#products[productIndex], ...updatedFields };
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 5), 'utf-8');
        } catch(err) {
            console.log(`[ERROR]: Updating product data: ${err}`);
            throw new Error('Error updating product data');
        }
    }

    static async remProduct(id) {
        try {
            const user = this.getProductById(id);
            if(!user) return null;

            this.#products = this.#products.filter(i => i.id != id);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 5), 'utf-8');

        } catch(err) {

        }
    }
}

module.exports = Product;