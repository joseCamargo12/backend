import express from 'express';
import productsRouter from './routes/products.js'; // Cambiado a minúsculas para coincidir con el nombre del archivo
import cartsRouter from './routes/carts.js'; // Cambiado a minúsculas para coincidir con el nombre del archivo

const PORT = 8080;
const app = express(); // Definir app aquí

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
