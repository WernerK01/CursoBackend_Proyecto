import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { ProductManager } from '../core/ProductsManager.js';
import _ from 'mongoose-paginate-v2';

export const router = Router();

const verifyProducts = async (id = undefined) => {
    const all = await ProductManager.getProducts();
    if (!all || all.length === 0) {
        const err = new Error('No products available');
        err.status = 404;
        throw err;
    }

    if (id) {
        if (!isValidObjectId(id)) {
            const err = new Error('Invalid product id');
            err.status = 400;
            throw err;
        }
        const found = await ProductManager.getProducts({ _id: id });
        if (!found || found.length === 0) {
            const err = new Error('Product not found');
            err.status = 404;
            throw err;
        }
    }
}

router.get('/', async (req, res) => {

    const { limit, page, query, sort } = req.query;

    try {
        res.setHeader('Content-Type', 'application/json');

        const options = {
            limit: limit ?? 10,
            page: page ?? 1
        }

        let finalQuery;
        if (query) {
            if (query.split(':').length > 2) return res.status(400).json({ error: 'Only one parameter for the query (example: Stock:10)' });

            const [key, value] = query.split(':');
            finalQuery = { [key]: [value] }
        }

        const { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await ProductManager.paginateProducts(finalQuery, options);

        switch (sort) {
            case 'desc':
                products.sort((a, b) => a.price - b.price);
                break;

            default:
                products.sort((a, b) => b.price - a.price);
                break;
        }

        return res.status(200).json({ payload: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage })

    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: await ProductManager.getProducts({ _id: id }) });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
});


router.post('/', async (req, res) => {
    if (!req.body) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Missing product data.` })
    }

    const { title, description, stock, price } = req.body;
    if (!title || !description || !stock || !price) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Missing arguments (title, description, stock and price).` })
    }

    try {
        const products = await ProductManager.getProducts({ title: title });
        if (products.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Product with title '${title}' already exists.` })
        }

        const newProduct = { title, description, stock, price };
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: await ProductManager.createProduct(newProduct) });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${err.message}` })
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (!req.body || !id) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Missing product data.` })
    }

    const updatedFields = req.body;

    if (!Object.keys(updatedFields).every(key => ['title', 'description', 'stock', 'price'].includes(key))) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Missing arguments (title, description, stock and price).` })
    }

    try {
        await verifyProducts(id);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: await ProductManager.updateProduct(id, updatedFields) });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(err.status || 500).json({ error: `${err.message}` })
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Product id is required.` })
    }

    try {
        await verifyProducts(id);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: await ProductManager.deleteProduct(id) });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(err.status || 500).send({ error: `${err.message}` })
    }
});