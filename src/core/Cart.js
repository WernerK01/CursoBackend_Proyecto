import fs from 'fs';

export class Cart {
    static #carts = [];
    static #path = './src/data/cart.json';

    static async getCarts() {
        try {
            if (fs.existsSync(this.#path)) {
                const data = await fs.promises.readFile(this.#path, 'utf-8');
                this.#carts = JSON.parse(data) || [];
                return this.#carts;
            } else { return []; }
        } catch (err) {
            console.log(`[ERROR]: Reading users cart data: ${err}`);
            throw new Error('Error reading users cart data');
        }
    }

    static async getCartWithProduct(productID) {
        if (this.#carts.length === 0) this.#carts = await this.getCarts();
        try {
            return this.#carts.find(c => c.productID === productID) || null;
        } catch (err) {
            console.log(`[ERROR]: Getting user cart by ID: ${err}`);
            throw new Error('Error getting user cart by ID');
        }
    }


    static async addCartItem(productID, quantity) {
        if (!this.#carts.length == 0) this.#carts = await this.getCarts();
        const exist = this.#carts.find(c => c.productID == productID);

        let item = {
            productID: productID,
            quantity: quantity
        };

        if (exist) item['quantity'] = parseInt(exist.quantity) + parseInt(quantity);

        try {
            this.#carts.push(item);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, 5), 'utf-8');
        } catch (err) {
            console.log(`[ERROR]: Writing user cart data: ${err}`);
            throw new Error('Error writing user cart data');
        }
    }

    static async updateCartItem(productID, updatedFields) {
        if (!this.#carts.length == 0) this.#carts = await this.getCarts();
        try {
            const cartIndex = this.#carts.findIndex(c => c.productID === productID);
            if (cartIndex === -1) {
                console.log(`[LOG]: Cart item with ProductID ${productID} not found.`);
                return;
            }
            this.#carts[cartIndex] = { ...this.#carts[cartIndex], ...updatedFields };
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, 5), 'utf-8');
        } catch (err) {
            console.log(`[ERROR]: Updating user cart data: ${err}`);
            throw new Error('Error updating user cart data');
        }
    }

    static async remCartItem(productID, quantity) {
        try {
            const cart = await this.getCartWithProduct(productID);
            if (!cart) return;

            const newQuantity = cart.quantity - quantity;
            console.log(newQuantity)
            if (newQuantity > 0) {
                await this.updateCartItem(productID, { quantity: newQuantity });
                return;
            }

            this.#carts = this.#carts.filter(i => i.productID != productID);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, 5), 'utf-8');

        } catch (err) {
            console.log(`[ERROR]: Removing user cart item: ${err}`);
            throw new Error('Error removing user cart item');
        }
    }
}