import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();
const PORT = 8080;

const productManager = new ProductManager('./products.json');

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la página de inicio!");
});

app.get("/products", (req, res) => {
  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) {
      const products = productManager.getAllProducts().slice(0, limit);
      res.json(products);
    } else {
      res.status(400).json({ error: "El parámetro 'limit' debe ser un número válido mayor que cero" });
    }
  } else {
    const products = productManager.getAllProducts();
    res.json(products);
  }
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "El producto no existe" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
