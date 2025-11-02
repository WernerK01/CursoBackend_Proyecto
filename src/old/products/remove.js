import express from 'express';
import { Product } from '../../core/ProductsManager.js';
const productsRemoveRoute = express.Router();

productsRemoveRoute.delete('/', async (req, res) => {
    try {

        if (!req.query.id) {
            console.log(`[ERROR]: Missing Arguments`)
            res.status(400).render('products', { title: 'Products', type: 'ERROR', message: `Missing Arguments` })
            return;
        }

        await Product.remProduct(req.query.id);
        res.status(200).render('products', { title: 'Products', type: 'SUCCESS', message: `Product deleted.` })
    } catch (err) {
        res.status(500).render('products', { title: 'Products', type: 'ERROR', message: `${err.message}` })
    }
});

export default productsRemoveRoute;