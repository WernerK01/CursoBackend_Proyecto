import express from 'express';
import { Cart } from '../../core/Cart.js';
import { Product } from '../../core/Products.js';
const cartRemoveRoute = express.Router();

cartRemoveRoute.get('/', async (req, res) => {
    const { productID, quantity = 1 } = req.query;

    if ((productID && !parseInt(productID) || !productID) || (quantity && !parseInt(quantity))) {
        res.status(400).render('cart', { title: 'Cart', type: 'ERROR', message: `Missing Arguments` });
        return;
    }

    const productInCart = await Cart.getCartWithProduct(parseInt(productID));
    if (!productInCart) {
        res.status(404).render('cart', { title: 'Cart', type: 'ERROR', message: `Product not found in cart` });
        return;
    }

    const product = await Product.getProductById(parseInt(productID));

    await Cart.remCartItem(product.id, parseInt(quantity));
    await Product.updateProduct(product.id, { stock: product.stock + 1 });

    res.status(200).render('cart', { title: 'Cart', type: 'SUCCESS', message: `Product removed from cart.` });
});

export default cartRemoveRoute;