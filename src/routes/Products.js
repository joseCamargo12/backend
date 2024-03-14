import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();


let products = [];


router.get('/', (req, res) => {
    let limit = parseInt(req.query.limit);
    let productsToReturn = products;
    if (!isNaN(limit) && limit > 0) {
        productsToReturn = productsToReturn.slice(0, limit);
    }
    res.status(200).json(productsToReturn);
});


router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const product = products.find(product => product.id === productId);
    if (product) {
        res.status(200).json(product); 
    } else {
        res.status(404).json({ error: 'El producto no existe' }); 
    }
});


router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' }); 
    }
    const id = uuidv4();
    const newProduct = { id, title, description, code, price, stock, category, thumbnails, status: true };
    products.push(newProduct);
    res.status(201).json(newProduct); 
});


router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body, id: productId };
        res.status(200).json(products[index]); 
    } else {
        res.status(404).json({ error: 'El producto no existe' }); 
    }
});


router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        res.sendStatus(204); 
    } else {
        res.status(404).json({ error: 'El producto no existe' }); 
    }
});

export default router;
