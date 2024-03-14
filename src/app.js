import express from 'express';
import productsRouter from './routes/Products.js';
import cartsRouter from './routes/Carts.js'; 

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); // Usa el enrutador de carritos en la ruta /api/carts

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
