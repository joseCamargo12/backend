import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = Router();

// Variable para almacenar los carritos
let carts = [];

// Función para cargar los carritos desde el archivo carts.json
async function loadCarts() {
  try {
    const data = await fs.promises.readFile('./carts.json', 'utf-8');
    carts = JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar el archivo JSON de carritos:', error);
    carts = [];
  }
}

// Cargar los carritos al iniciar la aplicación
loadCarts();

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const newCartId = uuidv4();
  const newCart = { id: newCartId, products: [] };
  carts.push(newCart);
  fs.writeFileSync('./carts.json', JSON.stringify(carts, null, 2), 'utf-8');
  res.status(201).json(newCart); // HTTP 201 Created
});

// Ruta para listar los productos de un carrito por su ID
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find(cart => cart.id === cartId);
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
  const cartIndex = carts.findIndex(cart => cart.id === cartId);
  if (cartIndex !== -1) {
    const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      // Si el producto ya existe en el carrito, se incrementa la cantidad
      carts[cartIndex].products[productIndex].quantity += quantity;
    } else {
      // Si el producto no existe en el carrito, se agrega
      carts[cartIndex].products.push({ id: productId, quantity });
    }
    fs.writeFileSync('./carts.json', JSON.stringify(carts, null, 2), 'utf-8');
    res.status(200).json(carts[cartIndex]); // HTTP 200 OK
  } else {
    res.status(404).json({ error: 'El carrito no existe' }); // HTTP 404 Not Found
  }
});

export default router;
