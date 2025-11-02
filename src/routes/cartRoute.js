import express from 'express';
import { isValidObjectId } from 'mongoose';
import { CartManager } from '../core/CartManager.js';
import { ProductManager } from '../core/ProductsManager.js';

export const router = express.Router();

const verifyCart = async (id = undefined) => {
    const all = await CartManager.getCarts();

    if (!all || all.length === 0) {
        const err = new Error('No carts available.');
        err.status = 404;
        throw err;
    }

    if (id) {
        if (!isValidObjectId(id)) {
            const err = new Error('Invalid cart id.');
            err.status = 400;
            throw err;
        }

        const found = await CartManager.getCarts({ _id: id });
        if (!found || found.length === 0) {
            const err = new Error('Cart not found.');
            err.status = 404;
            throw err;
        }
    }
}

const existProduct = async (id) => {
    if (!isValidObjectId(id)) {
        const err = new Error('Invalid product id.');
        err.status = 400;
        throw err;
    }

    const product = await ProductManager.getProducts({ _id: id });

    if (product.length === 0) {
        const err = new Error('Product not found');
        err.status = 404;
        throw err;
    }
}

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        return res.status(200).json({ payload: await CartManager.getCarts() });
    } catch (err) {
        return res.status(500).send({ error: `${err.message}` })
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    res.setHeader('Content-Type', 'application/json');
    try {
        await verifyCart(id);
        return res.status(200).json({ payload: await CartManager.getCarts({ _id: id }) });
    } catch (err) {
        return res.status(err.status || 500).send({ error: `${err.message}` })
    }
});

router.post('/', async (req, res) => {
    const { productId, qty } = req.query;
    res.setHeader('Content-Type', 'application/json');

    if (!productId || !isValidObjectId(productId)) {
        return res.status(400).send({ error: `Invalid or missing product id.` });
    }

    try {
        await existProduct(productId);

        const product = { id: productId, quantity: qty ? Number(qty) : 1 };
        return res.status(200).json({ payload: await CartManager.createCart(product) });
    } catch (err) {
        return res.status(500).send({ error: `${err.message}` })
    }
});

router.post('/:id/products/:pid', async (req, res) => {
    const { id, pid } = req.params;

    let qty;
    if (req.body?.quantity) qty = req.body.quantity;

    res.setHeader('Content-Type', 'application/json');

    if (!isValidObjectId(id)) return res.status(400).send({ error: `Invalid cart id.` });

    try {
        await existProduct(pid);
        const cart = await CartManager.getCarts({ _id: id });

        const item = cart[0].products.find(p => p.product.toString() === pid);
        if (item) item.quantity += (qty ?? 1);
        else cart[0].products.push({
            product: pid,
            quantity: (qty ?? 1)
        });

        await cart[0].save();

        return res.status(200).json({ payload: cart });
    } catch (err) {
        return res.status(err.status || 500).send({ error: `${err.message}` });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    res.setHeader('Content-Type', 'application/json');


    try {
        await verifyCart(id);
        return res.status(200).json({ payload: await CartManager.deleteCart({ _id: id }) });
    } catch (err) {
        return res.status(err.status || 500).send({ error: `${err.message}` })
    }
});

router.delete('/:id/products/:pid', async (req, res) => {
    const { id, pid } = req.params;
    res.setHeader('Content-Type', 'application/json');

    try {
        await verifyCart(id);
        await existProduct(pid);
        const cart = await CartManager.getCarts({ _id: id });
        cart[0].products = cart[0].products.filter(p => p.product.toString() !== pid);
        await cart[0].save();
        return res.status(200).json({ payload: cart });
    } catch (err) {
        return res.status(err.status || 500).send({ error: `${err.message}` })
    }
});