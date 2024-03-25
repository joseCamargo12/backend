import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = Router();


let carts = [];

async function loadCarts() {
  try {
    const data = await fs.promises.readFile('./carts.json', 'utf-8');
    carts = JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar el archivo JSON de carritos:', error);
    carts = [];
  }
}


loadCarts();

router.post('/', (req, res) => {
  const newCartId = uuidv4();
  const newCart = { id: newCartId, products: [] };
  carts.push(newCart);
  fs.writeFileSync('./carts.json', JSON.stringify(carts, null, 2), 'utf-8');
  res.status(201).json(newCart); 
});


router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find(cart => cart.id === cartId);
  if (cart) {
    res.status(200).json(cart.products); 
  } else {
    res.status(404).json({ error: 'El carrito no existe' }); 
  }
});


router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; 
  const cartIndex = carts.findIndex(cart => cart.id === cartId);
  if (cartIndex !== -1) {
    const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      
      carts[cartIndex].products[productIndex].quantity += quantity;
    } else {
      
      carts[cartIndex].products.push({ id: productId, quantity });
    }
    fs.writeFileSync('./carts.json', JSON.stringify(carts, null, 2), 'utf-8');
    res.status(200).json(carts[cartIndex]);
  } else {
    res.status(404).json({ error: 'El carrito no existe' }); 
  }
});

export default router;
