import express from 'express';
import { Product } from '../../core/ProductsManager.js';
const productAddRoute = express.Router();

productAddRoute.post('/', async (req, res) => {
    try {
        const { id, name, stock, price } = req.query;

        const product = {
            id,
            name,
            stock,
            price,
        }

        if (!product.name || !product.stock || !product.price) {
            console.log(`[ERROR]: Missing Arguments`)
            res.status(400).render('products', { title: 'Products', type: 'ERROR', message: `Missing Arguments` })
            return;
        }

        Product.addProduct(product);
        res.status(200).render('products', { title: 'Products', type: 'SUCCESS', message: `Product added.` })

    } catch (err) {
        res.status(500).render('products', { title: 'Products', type: 'ERROR', message: `${err.message}` })
    }
});

export default productAddRoute;