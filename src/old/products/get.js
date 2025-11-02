import express from 'express';
import { Product } from '../../core/ProductsManager.js';
const productGetByIDRoute = express.Router();

productGetByIDRoute.get('/', async (req, res) => {
    try {
        if (!req.query.id) {
            console.log(`[ERROR]: Missing Arguments`)
            res.status(400).render('products', { title: 'Products', type: 'ERROR', message: `Missing Arguments` })
            return;
        }
        const product = await Product.getProductById(parseInt(req.query.id));

        if (!product) {
            console.log(`[ERROR]: Product not found`)
            res.status(404).render('products', { title: 'Products', type: 'ERROR', message: `Product not found` })
            return;
        }

        res.status(200).render('products', { title: 'Products', Products: [product] });
    } catch (err) {
        res.status(500).render('products', { title: 'Products', type: 'ERROR', message: `${err.message}` })
    }
});

export default productGetByIDRoute;