import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { io } from '../app.js'; // Importa el objeto io desde app.js

const router = Router();
let products = [];
const __dirname = path.resolve();

// Función para cargar los productos desde el archivo JSON
async function loadProducts() {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        products = [];
    }
}

loadProducts();

// Función para generar un nuevo ID secuencial para los productos
function generateSequentialId() {
    const maxId = Math.max(...products.map(product => parseInt(product.id)));
    return maxId >= 0 ? (maxId + 1).toString() : '1';
}

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
    let limit = parseInt(req.query.limit);
    let productsToReturn = products;
    if (!isNaN(limit) && limit > 0) {
        productsToReturn = productsToReturn.slice(0, limit);
    }
    res.render('home', { products: productsToReturn });
});

// Ruta para obtener la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products }); // Enviar los productos al renderizar la vista
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }
        const newProduct = {
            id: generateSequentialId(),
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status: true
        };
        products.push(newProduct);
        await fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(products, null, 2), 'utf-8');

        // Emitir evento de actualización a los clientes
        io.emit('productUpdated');

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar el nuevo producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body, id: productId };

        // Emitir evento de actualización a los clientes
        io.emit('productUpdated');

        res.status(200).json(products[index]);
    } else {
        res.status(404).json({ error: 'El producto no existe' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products.splice(index, 1);

        // Emitir evento de actualización a los clientes
        io.emit('productUpdated');

        res.sendStatus(204);
    } else {
        res.status(404).json({ error: 'El producto no existe' });
    }
});

export default router;
