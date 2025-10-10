import express from 'express';
import { Cart } from '../../core/Cart.js';
import { Product } from '../../core/Products.js';
const cartAddRoute = express.Router();

cartAddRoute.get('/', async (req, res) => {
    const { productID, quantity = 1 } = req.query;

    if (!productID || !parseInt(productID)) {
        console.log(`[ERROR]: Missing Arguments`)
        res.status(400).render('cart', { title: 'Cart', type: 'ERROR', message: `Missing Arguments` })
        return;
    }

    const product = await Product.getProductById(parseInt(productID));

    if (!product) {
        console.log(`[ERROR]: Product not found`)
        res.status(404).render('cart', { title: 'Cart', type: 'ERROR', message: `Product not found` })
        return;
    }

    if (product.stock < quantity) {
        console.log(`[ERROR]: Not enough stock available`)
        res.status(404).render('cart', { title: 'Cart', type: 'ERROR', message: `Not enough stock available` })
        return;
    }

    product.stock = product.stock - quantity;
    await Product.updateProduct(product.id, { stock: product.stock });

    await Cart.addCartItem(product.id, quantity);
    res.status(200).render('cart', { title: 'Cart', type: 'SUCCESS', message: `Product added to cart.` })
});

export default cartAddRoute;