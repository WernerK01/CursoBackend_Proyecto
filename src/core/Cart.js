const fs = require('fs');

class Cart {
    static #carts = [];
    static #path = './src/data/cart.json';

    static async getCarts() {
        try {
            if(fs.existsSync(this.#path)) {
                const data = await fs.promises.readFile(this.#path, 'utf-8');
                this.#carts = JSON.parse(data) || [];
                return this.#carts;
            } else { return []; }
        } catch(err) {
            console.log(`[ERROR]: Reading users cart data: ${err}`);
            throw new Error('Error reading users cart data');
        }
    }

    static async getUserCart(userID, productID = null) {
        if(!this.#carts.length == 0) this.#carts = await this.getCarts();
        try {
            if(productID) {
                return this.#carts.find(c => c.userID === userID && c.productID === productID) || null;
            }
            return this.#carts.find(c => c.userID === userID) || null;
        } catch(err) {
            console.log(`[ERROR]: Getting user cart by ID: ${err}`);
            throw new Error('Error getting user cart by ID');
        }
    }
    

    static async addCartItem(userID, productID, quantity) {
        if(!this.#carts.length == 0) this.#carts = await this.getCarts();
        const exist = this.#carts.find(c => c.userID == userID && c.productID == productID);

        let item = {
            userID: userID,
            productID: productID,
            quantity: quantity
        };

        if(exist) item['quantity'] = parseInt(exist.quantity) + parseInt(quantity);
        
        try {
            this.#carts.push(item);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, 5), 'utf-8');
        } catch(err) {
            console.log(`[ERROR]: Writing user cart data: ${err}`);
            throw new Error('Error writing user cart data');
        }
    }

    static async remCartItem(userID, productID) {
        try {
            const cart = this.getUserCart(userID, productID);
            if(!cart) return null;

            this.#carts = this.#carts.filter(i => i.userID != userID && i.productID != productID);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, 5), 'utf-8');

        } catch(err) {
            console.log(`[ERROR]: Removing user cart item: ${err}`);
            throw new Error('Error removing user cart item');
        }
    }
}

module.exports = Cart;