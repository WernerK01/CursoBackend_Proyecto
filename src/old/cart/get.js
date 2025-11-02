import express from 'express';
import { Cart } from '../../core/CartManager.js';
const cartGetByIDRoute = express.Router();

cartGetByIDRoute.get('/', async (req, res) => {

    const id = req.query.productID;

    if (!id || (id && isNaN(parseInt(id)))) {
        res.status(400).render('cart', { title: 'Cart', type: 'ERROR', message: `Missing Arguments` });
        return;
    }
    const productCart = await Cart.getCartWithProduct(parseInt(id));
    if (!productCart) {
        res.status(404).render('cart', { title: 'Cart', type: 'ERROR', message: `Cart not found` });
        return;
    }

    res.status(200).render('cart', { title: 'Cart', Carts: [productCart] });
});

export default cartGetByIDRoute;