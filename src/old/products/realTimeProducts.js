import express from 'express';
import { Product } from '../../core/ProductsManager.js';
const realTimeProductRoute = express.Router();

realTimeProductRoute.get('/', (req, res) => {
    res.status(200).render('realTimeProducts', { title: 'Real Time Products' });
});

export default realTimeProductRoute;