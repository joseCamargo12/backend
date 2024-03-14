import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Variable para almacenar los carritos
let seleccion = [];

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const newCartId = uuidv4();
    const newCart = { id: newCartId, products: [] };
    seleccion.push(newCart);
    res.status(201).json(newCart); // HTTP 201 Created
});

// Ruta para listar los productos de un carrito por su ID
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = seleccion.find(cart => cart.id === cartId);
    if (cart) {
        res.status(200).json(cart.products); // HTTP 200 OK
    } else {
        res.status(404).json({ error: 'El carrito no existe' }); // HTTP 404 Not Found
    }
});

// Ruta para agregar un producto a un carrito por su ID
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; // Si no se especifica la cantidad, se agrega un producto
    const cartIndex = seleccion.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
        const productIndex = seleccion[cartIndex].products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Si el producto ya existe en el carrito, se incrementa la cantidad
            seleccion[cartIndex].products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe en el carrito, se agrega
            seleccion[cartIndex].products.push({ id: productId, quantity });
        }
        res.status(200).json(seleccion[cartIndex]); // HTTP 200 OK
    } else {
        res.status(404).json({ error: 'El carrito no existe' }); // HTTP 404 Not Found
    }
});

export default router;
