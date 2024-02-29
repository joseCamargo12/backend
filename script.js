const fs = require('fs');

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
  }

  saveProducts() {
    fs.writeFileSync(this.filename, JSON.stringify(this.products, null, 2));
    console.log("Productos guardados en el archivo:", this.products);
  }

  getProducts() {
    return this.products;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    const repeated = this.products.some(product => product.code === code);
    if (repeated) {
      console.error("Error al agregar producto: El código del producto ya existe");
      return;
    }
    const id = this.generateUniqueId();

    const product = { id, title, description, price, thumbnail, code, stock };
    this.products.push(product);
    this.saveProducts();

    return product;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      console.error("Error al obtener producto por ID: Producto no encontrado");
      return;
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      console.error("Error al actualizar producto: Producto no encontrado");
      return;
    }

    
    this.products[index] = { ...this.products[index], ...updatedFields };
    this.saveProducts();

    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      console.error("Error al eliminar producto: Producto no encontrado");
      return;
    }

    this.products.splice(index, 1);
    this.saveProducts();
  }

  generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

const productManager = new ProductManager('products.json');

const newProduct = productManager.addProduct({
  title: "iphone",
  description: "Iphone 15 pro max 512gb",
  price: 1200,
  thumbnail: "iphone.jpg",
  code: "001",
  stock: 4
});
if (newProduct) {
  console.log("Producto agregado:", newProduct);
}

console.log("Productos:", productManager.getProducts());

const duplicateProduct = productManager.addProduct({
  title: "iphone",
  description: "Iphone 15 pro max 512gb",
  price: 1200,
  thumbnail: "iphone.jpg",
  code: "001",
  stock: 4
});
if (!duplicateProduct) {
  console.error("Error al agregar producto duplicado: El código del producto ya existe");
}

const product = productManager.getProductById(productManager.getProducts()[0].id);
if (product) {
  console.log("Producto encontrado por ID: ", product);
}

productManager.updateProduct(product.id, { price: 1300 });
console.log("Producto actualizado:", productManager.getProductById(product.id));

productManager.deleteProduct(product.id);
console.log("Producto eliminado. Productos restantes:", productManager.getProducts());
