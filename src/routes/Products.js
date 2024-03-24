import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = Router();
let products = []; // Aquí almacenaremos los productos cargados

async function loadProducts() {
  try {
    const data = await fs.promises.readFile('./data.json', 'utf-8');
    products = JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
    products = [];
  }
}

// Cargar los productos al iniciar la aplicación
loadProducts();

// Función para generar un nuevo ID secuencial
function generateSequentialId() {
  const maxId = Math.max(...products.map(product => parseInt(product.id)));
  return maxId >= 0 ? (maxId + 1).toString() : '1';
}

// Definir las rutas
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

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' }); 
    }
    const newProduct = {
      id: generateSequentialId(), // Generar un nuevo ID secuencial
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
    await fs.promises.writeFile('./data.json', JSON.stringify(products, null, 2), 'utf-8');
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al agregar el nuevo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
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
