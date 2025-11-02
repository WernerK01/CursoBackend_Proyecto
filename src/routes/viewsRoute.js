import { Router } from "express";
import { ProductManager } from "../core/ProductsManager.js";

export const router = Router();

router.get('/products', async (req, res) => {
    try {
        const { page } = req.query;
        const { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await ProductManager.paginateProducts({}, { limit: 10, page, lean: true });

        res.status(200).render("products", {
            title: 'Products Views', products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
});

router.get('/realTimeProducts', (req, res) => {
    res.status(200).render('realTimeProducts', { title: 'Real-Time Products' });
});

router.get('/addProduct', (req, res) => {
    res.status(200).render('addProduct', { title: 'Add Product' });
});

router.get('/remProduct', (req, res) => {
    res.status(200).render('remProduct', { title: 'Delete Product' });
});

router.get('/cart', (req, res) => {
    res.status(200).render('cart', { title: 'Cart' });
});