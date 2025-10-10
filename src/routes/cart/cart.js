import express from 'express';
import { Cart } from '../../core/Cart.js';
const cartRoute = express.Router();

cartRoute.get('/', async (req, res) => {
    try {
        const carts = await Cart.getCarts();
        res.status(200).render('cart', { title: 'Cart', Carts: carts });
    } catch (err) {
        res.status(500).render('cart', { title: 'Cart', type: 'ERROR', message: `${err.message}` })
    }
});

export default cartRoute;