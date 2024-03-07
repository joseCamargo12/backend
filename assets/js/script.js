import express from "express";
import fs from "fs"; 

const app = express();
const PORT = 8080;

class ProductManager {
  constructor(filename) {
    this.filename = filename;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filename, 'utf8');
      this.products = JSON.parse(data);
      console.log("Productos cargados desde el archivo:", this.products);
    } catch (error) {
      this.products = [];
      console.log("No se encontraron productos en el archivo. Inicializando un nuevo array de productos.");
    }
    this.initializeProducts(); 
  }

  initializeProducts() {

    const predefinedProducts = [
      {
        id: "1",
        title: "iPhone 8",
        description: "iPhone 8, 64GB, Color Gris Espacial",
        price: 699,
        thumbnail: "iphone8.jpg",
        code: "IPH8-64-GRIS",
        stock: 10
      },
      {
        id: "2",
        title: "iPhone 8 Plus",
        description: "iPhone 8 Plus, 128GB, Color Plata",
        price: 799,
        thumbnail: "iphone8plus.jpg",
        code: "IPH8P-128-PLATA",
        stock: 8
      },
      {
        id: "3",
        title: "iPhone X",
        description: "iPhone X, 256GB, Color Plateado",
        price: 999,
        thumbnail: "iphonex.jpg",
        code: "IPH-X-256-PLATA",
        stock: 6
      },
      {
        id: "4",
        title: "iPhone XS",
        description: "iPhone XS, 256GB, Color Oro",
        price: 1099,
        thumbnail: "iphonexs.jpg",
        code: "IPH-XS-256-ORO",
        stock: 5
      },
      {
        id: "5",
        title: "iPhone XS Max",
        description: "iPhone XS Max, 512GB, Color Gris Espacial",
        price: 1249,
        thumbnail: "iphonexsmax.jpg",
        code: "IPH-XSMAX-512-GRIS",
        stock: 3
      },
      {
        id: "6",
        title: "iPhone 11",
        description: "iPhone 11, 128GB, Color Verde",
        price: 699,
        thumbnail: "iphone11.jpg",
        code: "IPH11-128-VERDE",
        stock: 10
      },
      {
        id: "7",
        title: "iPhone 11 Pro",
        description: "iPhone 11 Pro, 256GB, Color Plata",
        price: 999,
        thumbnail: "iphone11pro.jpg",
        code: "IPH11P-256-PLATA",
        stock: 7
      },
      {
        id: "8",
        title: "iPhone 11 Pro Max",
        description: "iPhone 11 Pro Max, 512GB, Color Gris Espacial",
        price: 1199,
        thumbnail: "iphone11promax.jpg",
        code: "IPH11PM-512-GRIS",
        stock: 5
      },
      {
        id: "9",
        title: "iPhone 12",
        description: "iPhone 12, 128GB, Color Azul",
        price: 799,
        thumbnail: "iphone12.jpg",
        code: "IPH12-128-AZUL",
        stock: 8
      },
      {
        id: "10",
        title: "iPhone 12 Pro",
        description: "iPhone 12 Pro, 256GB, Color Oro",
        price: 999,
        thumbnail: "iphone12pro.jpg",
        code: "IPH12P-256-ORO",
        stock: 6
      }
    ];

    this.products.push(...predefinedProducts);
  }

  getProducts() {
    return this.products;
  }

  getAllProducts() {
    return this.products;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    const id = this.generateUniqueId();
    const product = { id, title, description, price, thumbnail, code, stock };
    this.products.push(product);
    return product;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    return product ? product : null;
  }

  generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

const productManager = new ProductManager('products.json');


app.get("/", (req, res) => {
  res.send("¡Bienvenido a la página de inicio!");
});

// Ruta para obtener todos los productos
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
