import express from 'express';
import { Product } from '../../core/ProductsManager.js';
const productsRoute = express.Router();


productsRoute.get('/', async (req, res) => {
    try {
        const products = await Product.getProducts();
        res.status(200).render('products', { title: 'Products', Products: products });
    } catch (err) {
        res.status(500).render('products', { title: 'Products', type: 'ERROR', message: `${err.message}` })
    }
});

export default productsRoute;